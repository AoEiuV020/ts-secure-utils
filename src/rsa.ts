import { Base64 } from "./base64";
import forge from "node-forge";
import { BinString } from "./bin";

/**
 * 私钥是pkcs1, 公钥是pkcs8,
 * 加密是RSA/ECB/PKCS1Padding，
 * 签名是Sha1withRSA,
 */
export class RSA {
  private static readonly _signAlgorithmName = "RSASSA-PKCS1-v1_5";
  private static readonly _signAlgorithmHash = "SHA-256";
  private static readonly _signAlgorithmHashSha1 = "SHA-1";
  private static readonly _encryptAlgorithm = "RSAES-PKCS1-V1_5";

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

  static extractPublicKey(privateKey: Uint8Array): Uint8Array {
    throw new Error("Not implemented");
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
    const key = forge.pki.publicKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(publicKey))
    );
    const encrypted = key.encrypt(
      BinString.toString(data),
      RSA._encryptAlgorithm
    );
    return BinString.toByteArray(encrypted);
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
    privateKey: Uint8Array
  ): Promise<Uint8Array> {
    const key = forge.pki.privateKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(privateKey))
    );
    const decrypted = key.decrypt(
      BinString.toString(encryptedData),
      RSA._encryptAlgorithm
    );
    return BinString.toByteArray(decrypted);
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
