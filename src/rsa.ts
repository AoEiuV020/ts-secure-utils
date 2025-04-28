import { Base64 } from "./base64";

/**
 * 私钥是pkcs1, 公钥是pkcs8,
 * 加密是RSA/ECB/PKCS1Padding，
 * 签名是Sha1withRSA,
 */
export class RSA {
  private static readonly _signAlgorithm = "SHA-256/RSA";

  private constructor() {}

  static async genKeyPair(keySize: number = 2048): Promise<RsaKeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
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
      RSA._convertPkcs8ToPkcs1(new Uint8Array(privateKey)),
    );
  }

  static extractPublicKey(privateKey: Uint8Array): Uint8Array {
    throw new Error("Not implemented");
  }

  static encryptBase64(data: Uint8Array, publicKey: Uint8Array): string {
    throw new Error("Not implemented");
  }

  static encrypt(data: Uint8Array, publicKey: Uint8Array): Uint8Array {
    throw new Error("Not implemented");
  }

  static decryptFromBase64(
    encrypted: string,
    privateKey: Uint8Array
  ): Uint8Array {
    throw new Error("Not implemented");
  }

  static decrypt(
    encryptedData: Uint8Array,
    privateKey: Uint8Array
  ): Uint8Array {
    throw new Error("Not implemented");
  }

  static signBase64(data: string, privateKey: Uint8Array): string {
    throw new Error("Not implemented");
  }

  static sign(
    data: Uint8Array,
    privateKey: Uint8Array,
    options?: { algorithm?: string }
  ): Uint8Array {
    throw new Error("Not implemented");
  }

  static verifyFromBase64(
    data: string,
    publicKey: Uint8Array,
    signature: string
  ): boolean {
    throw new Error("Not implemented");
  }

  static verify(
    data: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array,
    options?: { algorithm?: string }
  ): boolean {
    throw new Error("Not implemented");
  }

  // 私有辅助方法 - 在 TypeScript 中通常不暴露这些方法
  private static _getRsaPublicKey(publicKey: Uint8Array): any {
    throw new Error("Not implemented");
  }

  private static _getRsaPrivateKey(privateKey: Uint8Array): any {
    throw new Error("Not implemented");
  }

  private static _processRSA(
    data: Uint8Array,
    isEncrypt: boolean,
    key: any
  ): Uint8Array {
    throw new Error("Not implemented");
  }

  private static _convertPkcs8ToPkcs1(pkcs8Bytes: Uint8Array): Uint8Array {
    return pkcs8Bytes.slice(26, pkcs8Bytes.length);
  }

  private static _convertPkcs1ToPkcs8(pkcs1Bytes: Uint8Array): Uint8Array {
    const pkcs1Length = pkcs1Bytes.length;
    const totalLength = pkcs1Length + 22;

    const pkcs8Header = new Uint8Array([
      0x30,
      (totalLength >> 8) & 0xff,
      totalLength & 0xff, // Sequence + total length
      0x02, 0x01, 0x00, // Integer (0)
      0x30,
      0x0D,
      0x06,
      0x09,
      0x2A,
      0x86,
      0x48,
      0x86,
      0xF7,
      0x0D,
      0x01,
      0x01,
      0x01,
      0x05,
      0x00, // Sequence: 1.2.840.113549.1.1.1, NULL
      0x04,
      (pkcs1Length >> 8) & 0xff,
      pkcs1Length & 0xff, // Octet string + length
    ]);

    const result = new Uint8Array(pkcs8Header.length + pkcs1Bytes.length);
    result.set(pkcs8Header);
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
