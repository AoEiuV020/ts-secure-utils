import { Base64 } from "./base64";
// import forge from "node-forge"; // Removed
// import { BinString } from "./bin"; // Removed

/**
 * 私钥是pkcs1, 公钥是pkcs8,
 * 加密是RSA/ECB/PKCS1Padding，
 * 签名是Sha1withRSA,
 */
export class RSA {
  private static readonly _signAlgorithmName = "RSASSA-PKCS1-v1_5";
  private static readonly _signAlgorithmHash = "SHA-256";
  private static readonly _signAlgorithmHashSha1 = "SHA-1";
  private static readonly _encryptAlgorithm = "RSAES-PKCS1-v1_5"; // Reverted

  private constructor() {}

  static async genKeyPair(keySize: number = 2048): Promise<RsaKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: RSA._signAlgorithmName,
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: RSA._signAlgorithmHash,
      },
      true,
      ["sign", "verify"]
    );

    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey(
      "pkcs8",
      keyPair.privateKey
    );

    return new RsaKeyPair(
      new Uint8Array(publicKey),
      RSA._convertPkcs8ToPkcs1(new Uint8Array(privateKey))
    );
  }

  static async extractPublicKey(privateKey: Uint8Array): Promise<Uint8Array> { // privateKey is PKCS#1
    // Convert PKCS#1 private key to PKCS#8 for Web Crypto API
    const privateKeyPkcs8 = RSA._convertPkcs1ToPkcs8(privateKey);

    // Import the PKCS#8 private key.
    // Use RSASSA-PKCS1-v1_5 as it's a common algorithm for RSA private keys.
    // The private key itself doesn't need to be extractable for this operation.
    // Usage 'sign' implies it's part of a key pair from which a public key can be derived.
    // However, to export the public key, the private key must be imported.
    // The Web Crypto API derives the public key from the private key, so the private key's
    // usages are not directly relevant to *what* public key is derived, but rather
    // that a private key is available to derive *a* public key from.
    // For the purpose of deriving a public key, no specific key usage is strictly needed for the private key
    // beyond being a valid key from which a public key can be derived.
    // However, "sign" is a common usage for private keys and is accepted.
    // The important part is that `importKey` for a private key allows `exportKey` to get its public part.
    const cryptoPrivateKey = await crypto.subtle.importKey(
      "pkcs8",
      privateKeyPkcs8,
      {
        name: "RSASSA-PKCS1-v1_5", // Reverted to RSASSA-PKCS1-v1_5 for public key export
        hash: { name: "SHA-256" },   // Hash algorithm associated with the key
      },
      true, // extractable: true
      ["sign"] // keyUsages: "sign" for RSASSA-PKCS1-v1_5
    );

    // Export the corresponding public key in SPKI format.
    // This works because the CryptoKey object for the private key contains enough information
    // for the Web Crypto API to derive and then export the public key.
    const publicKeySpkiBuffer = await crypto.subtle.exportKey(
      "spki",
      cryptoPrivateKey // Pass the imported *private* key object
    );

    return new Uint8Array(publicKeySpkiBuffer);
  }

  static async encryptBase64(
    data: Uint8Array,
    publicKey: Uint8Array
  ): Promise<string> {
    const encrypted = await RSA.encrypt(data, publicKey);
    return Base64.encode(encrypted);
  }

  static async encrypt(
    data: Uint8Array,
    publicKey: Uint8Array
  ): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey(
      "spki", // SubjectPublicKeyInfo format
      publicKey,
      {
        name: "RSASSA-PKCS1-v1_5", // Use RSASSA-PKCS1-v1_5 for import
        hash: { name: "SHA-256" }, // Standard hash
      },
      true, // extractable
      ["encrypt"] // key usages
    );

    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: RSA._encryptAlgorithm, // Now RSA-OAEP
      },
      cryptoKey,
      data // data as Uint8Array
    );
    return new Uint8Array(encryptedBuffer);
  }

  static async decryptFromBase64(
    encrypted: string,
    privateKey: Uint8Array
  ): Promise<Uint8Array> {
    const encryptedData = Base64.decode(encrypted);
    return RSA.decrypt(encryptedData, privateKey);
  }

  static async decrypt(
    encryptedData: Uint8Array,
    privateKeyInput: Uint8Array // This can be PKCS#1 or PKCS#8
  ): Promise<Uint8Array> {
    let cryptoKey: CryptoKey;

    try {
      // Attempt 1: Assume privateKeyInput is already a valid PKCS#8 key
      cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        privateKeyInput, // Use directly
        {
          name: "RSASSA-PKCS1-v1_5", // Use RSASSA-PKCS1-v1_5 for import
          hash: { name: "SHA-256" }, // Standard hash
        },
        true, // extractable
        ["decrypt"]
      );
    } catch (error1) {
      // Attempt 2: If import failed, assume privateKeyInput was PKCS#1. Convert it to PKCS#8 and try importing again.
      try {
        const privateKeyPkcs8Converted = RSA._convertPkcs1ToPkcs8(privateKeyInput);
        cryptoKey = await crypto.subtle.importKey(
          "pkcs8",
          privateKeyPkcs8Converted,
          {
            name: "RSASSA-PKCS1-v1_5", // Use RSASSA-PKCS1-v1_5 for import
            hash: { name: "SHA-256" }, // Standard hash
          },
          true, // extractable
          ["decrypt"]
        );
      } catch (error2) {
        const e1message = (error1 instanceof Error) ? error1.message : String(error1);
        const e2message = (error2 instanceof Error) ? error2.message : String(error2);
        // It's good to log the actual error objects for better debugging if needed,
        // though the problem was accessing .message directly for the new Error string.
        // console.error("Original import error object:", error1);
        console.error("Error during PKCS#1 conversion/import: ", error2); // Keep existing console.error for error2
        throw new Error(`Failed to import private key as PKCS#8 or as converted PKCS#1. Original import error: ${e1message}; Conversion import error: ${e2message}`);
      }
    }

    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "RSAES-PKCS1-v1_5",
      },
      cryptoKey,
      encryptedData
    );
    return new Uint8Array(decryptedBuffer);
  }

  static async signBase64(
    data: string,
    privateKey: Uint8Array
  ): Promise<string> {
    const signature = await RSA.sign(
      new TextEncoder().encode(data),
      privateKey
    );
    return Base64.encode(signature);
  }

  static async sign(
    data: Uint8Array,
    privateKey: Uint8Array
  ): Promise<Uint8Array> {
    const key = await RSA._getRsaPrivateKeyForSign(privateKey);
    const signature = await crypto.subtle.sign(
      {
        name: RSA._signAlgorithmName,
        saltLength: 0,
      },
      key,
      data
    );
    return new Uint8Array(signature);
  }

  static async signSha1(
    data: Uint8Array,
    privateKey: Uint8Array
  ): Promise<Uint8Array> {
    const key = await RSA._getRsaPrivateKeyForSign(
      privateKey,
      RSA._signAlgorithmHashSha1
    );
    const signature = await crypto.subtle.sign(
      {
        name: RSA._signAlgorithmName,
        saltLength: 0,
      },
      key,
      data
    );
    return new Uint8Array(signature);
  }

  static async verifyFromBase64(
    data: string,
    publicKey: Uint8Array,
    signature: string
  ): Promise<boolean> {
    return RSA.verify(
      new TextEncoder().encode(data),
      publicKey,
      Base64.decode(signature)
    );
  }

  static async verify(
    data: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    const key = await RSA._getRsaPublicKeyForVerify(publicKey);
    return crypto.subtle.verify(
      {
        name: RSA._signAlgorithmName,
        saltLength: 0,
      },
      key,
      signature,
      data
    );
  }

  static async verifySha1(
    data: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    const key = await RSA._getRsaPublicKeyForVerify(
      publicKey,
      RSA._signAlgorithmHashSha1
    );
    return crypto.subtle.verify(
      {
        name: RSA._signAlgorithmName,
        saltLength: 0,
      },
      key,
      signature,
      data
    );
  }

  // 私有辅助方法 - 在 TypeScript 中通常不暴露这些方法
  private static _getRsaPublicKeyForVerify(
    publicKey: Uint8Array,
    algorithmHash: string = RSA._signAlgorithmHash
  ): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      "spki",
      publicKey,
      {
        name: RSA._signAlgorithmName,
        hash: algorithmHash,
      },
      true,
      ["verify"]
    );
  }

  private static _getRsaPublicKeyForEncrypt(
    publicKey: Uint8Array
  ): Promise<CryptoKey> {
    return crypto.subtle.importKey(
      "spki",
      publicKey,
      {
        name: "RSA-OAEP",
        hash: RSA._signAlgorithmHash,
      },
      true,
      ["encrypt"]
    );
  }

  private static async _getRsaPrivateKeyForSign(
    privateKey: Uint8Array,
    algorithmHash: string = RSA._signAlgorithmHash
  ): Promise<CryptoKey> {
    try {
      const convertedKey = RSA._convertPkcs1ToPkcs8(privateKey);
      return await crypto.subtle.importKey(
        "pkcs8",
        convertedKey,
        {
          name: RSA._signAlgorithmName,
          hash: algorithmHash,
        },
        true,
        ["sign"]
      );
    } catch (error) {
      const convertedKey = privateKey;
      return await crypto.subtle.importKey(
        "pkcs8",
        convertedKey,
        {
          name: RSA._signAlgorithmName,
          hash: algorithmHash,
        },
        true,
        ["sign"]
      );
    }
  }

  private static async _getRsaPrivateKeyForDecrypt(
    privateKey: Uint8Array
  ): Promise<CryptoKey> {
    try {
      const convertedKey = RSA._convertPkcs1ToPkcs8(privateKey);
      return await crypto.subtle.importKey(
        "pkcs8",
        convertedKey,
        {
          name: "RSA-OAEP",
          hash: RSA._signAlgorithmHash,
        },
        true,
        ["decrypt"]
      );
    } catch (error) {
      const convertedKey = privateKey;
      return await crypto.subtle.importKey(
        "pkcs8",
        convertedKey,
        {
          name: "RSA-OAEP",
          hash: RSA._signAlgorithmHash,
        },
        true,
        ["decrypt"]
      );
    }
  }

  private static async _processRSA(
    data: Uint8Array,
    isEncrypt: boolean,
    key: CryptoKey
  ): Promise<Uint8Array> {
    const algorithm = {
      name: "RSA-OAEP",
    };

    const result = await (isEncrypt
      ? crypto.subtle.encrypt(algorithm, key, data)
      : crypto.subtle.decrypt(algorithm, key, data));

    return new Uint8Array(result);
  }

  private static _convertPkcs8ToPkcs1(pkcs8Bytes: Uint8Array): Uint8Array {
    return pkcs8Bytes.slice(26, pkcs8Bytes.length);
  }
  static _convertPkcs1ToPkcs8(pkcs1Bytes: Uint8Array): Uint8Array {
    const pkcs1Length = pkcs1Bytes.length;
    const totalLength = pkcs1Length + 22;

    // 构造 PKCS#8 Header
    const pkcs8Header = new Uint8Array([
      0x30,
      0x82,
      (totalLength >> 8) & 0xff,
      totalLength & 0xff, // SEQUENCE + totalLength
      0x02,
      0x01,
      0x00, // INTEGER (0)
      0x30,
      0x0d,
      0x06,
      0x09, // SEQUENCE (OID 的容器)
      0x2a,
      0x86,
      0x48,
      0x86, // OID: 1.2.840.113549.1.1.1
      0xf7,
      0x0d,
      0x01,
      0x01,
      0x01,
      0x05,
      0x00, // NULL
      0x04, // OCTET STRING
      0x82,
      (pkcs1Length >> 8) & 0xff, // OCTET STRING 长度高位
      pkcs1Length & 0xff, // OCTET STRING 长度低位
    ]);

    // 合并 Header 和 PKCS#1 数据
    const result = new Uint8Array(pkcs8Header.length + pkcs1Bytes.length);
    result.set(pkcs8Header, 0);
    result.set(pkcs1Bytes, pkcs8Header.length);
    return result;
  }
}
export class RsaKeyPair {
  constructor(
    public readonly publicKey: Uint8Array,
    public readonly privateKey: Uint8Array
  ) {}

  getPublicKeyBase64(): string {
    return Base64.encode(this.publicKey);
  }

  getPrivateKeyBase64(): string {
    return Base64.encode(this.privateKey);
  }
}
