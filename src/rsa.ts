import { Base64 } from "./base64";
import forge from "node-forge";
import { BinString } from "./bin";
import { UTF8 } from "./utf8";

/**
 * 私钥是pkcs1, 公钥是pkcs8,
 * 加密是RSA/ECB/PKCS1Padding，
 * 签名是Sha1withRSA,
 */
export class RSA {
  private static readonly _signAlgorithmHash = "SHA-256";
  private static readonly _signAlgorithmHashSha1 = "SHA-1";
  private static readonly _encryptAlgorithm = "RSAES-PKCS1-V1_5";

  private constructor() {}

  static async genKeyPair(keySize: number = 2048): Promise<RsaKeyPair> {
    return new Promise((resolve, reject) => {
      forge.pki.rsa.generateKeyPair({ bits: keySize }, (err, keypair) => {
        if (err) {
          reject(err);
          return;
        }
        
        // 导出公钥为ASN.1 DER格式
        const publicKeyAsn1 = forge.pki.publicKeyToAsn1(keypair.publicKey);
        const publicKeyDer = forge.asn1.toDer(publicKeyAsn1).getBytes();
        const publicKeyBytes = BinString.toByteArray(publicKeyDer);
        
        // 导出私钥为PKCS#1 DER格式
        const privateKeyAsn1 = forge.pki.privateKeyToAsn1(keypair.privateKey);
        const privateKeyDer = forge.asn1.toDer(privateKeyAsn1).getBytes();
        const privateKeyBytes = BinString.toByteArray(privateKeyDer);
        
        resolve(new RsaKeyPair(publicKeyBytes, privateKeyBytes));
      });
    });
  }

  static extractPublicKey(privateKey: Uint8Array): Uint8Array {
    const key = forge.pki.privateKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(privateKey))
    );
    const publicKey = forge.pki.rsa.setPublicKey(key.n, key.e);
    return BinString.toByteArray(
      forge.asn1.toDer(forge.pki.publicKeyToAsn1(publicKey)).getBytes()
    );
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
      UTF8.encode(data),
      privateKey
    );
    return Base64.encode(signature);
  }
  static async sign(
    data: Uint8Array,
    privateKey: Uint8Array
  ): Promise<Uint8Array> {
    const key = forge.pki.privateKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(privateKey))
    );
    
    // 创建数据的消息摘要
    const md = forge.md.sha256.create();
    md.update(BinString.toString(data));
    
    // 使用私钥签名消息摘要
    const signature = key.sign(md);
    
    // 转换为 Uint8Array
    return BinString.toByteArray(signature);
  }

  static async signSha1(
    data: Uint8Array,
    privateKey: Uint8Array
  ): Promise<Uint8Array> {
    const key = forge.pki.privateKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(privateKey))
    );
    
    // 创建数据的SHA-1消息摘要
    const md = forge.md.sha1.create();
    md.update(BinString.toString(data));
    
    // 使用私钥签名消息摘要
    const signature = key.sign(md);
    
    // 转换为 Uint8Array
    return BinString.toByteArray(signature);
  }

  static async verifyFromBase64(
    data: string,
    publicKey: Uint8Array,
    signature: string
  ): Promise<boolean> {
    return RSA.verify(
      UTF8.encode(data),
      publicKey,
      Base64.decode(signature)
    );
  }
  static async verify(
    data: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    const key = forge.pki.publicKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(publicKey))
    );
    
    // 创建数据的消息摘要
    const md = forge.md.sha256.create();
    md.update(BinString.toString(data));
    
    // 验证签名
    return key.verify(md.digest().getBytes(), BinString.toString(signature));
  }

  static async verifySha1(
    data: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array
  ): Promise<boolean> {
    const key = forge.pki.publicKeyFromAsn1(
      forge.asn1.fromDer(BinString.toString(publicKey))
    );
    
    // 创建数据的SHA-1消息摘要
    const md = forge.md.sha1.create();
    md.update(BinString.toString(data));
    
    // 验证签名
    return key.verify(md.digest().getBytes(), BinString.toString(signature));
  }
  // 私有辅助方法

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
