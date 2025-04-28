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
      new Uint8Array(privateKey)
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
    throw new Error("Not implemented");
  }

  private static _convertPkcs1ToPkcs8(pkcs1Bytes: Uint8Array): Uint8Array {
    throw new Error("Not implemented");
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
