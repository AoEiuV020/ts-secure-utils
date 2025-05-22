import { describe, expect, it } from '@ohos/hypium';
import { Base64, RSA, RsaKeyPair, UTF8 } from '../index';

export default function rsaTest() {
  describe('RSATests', () => {
    // 生成密钥对测试
    it('genKeyPairShouldGenerateValidKeyPair', 0, async () => {
      const pair = await RSA.genKeyPair(512);
      
      // 验证生成的密钥对不为空
      expect(pair.publicKey).not().assertEqual(undefined);
      expect(pair.privateKey).not().assertEqual(undefined);
      expect(JSON.stringify(Base64.decode(pair.getPublicKeyBase64()))).assertEqual(JSON.stringify(pair.publicKey));
      
      // 使用生成的密钥对测试加密解密
      const testContent = "test message";
      const testData = UTF8.encode(testContent);
      const encrypted = await RSA.encrypt(testData, pair.publicKey);
      const decrypted = await RSA.decrypt(encrypted, pair.privateKey);
      expect(UTF8.decode(decrypted)).assertEqual(testContent);

      // 使用生成的密钥对测试签名验签
      const signature = await RSA.sign(testData, pair.privateKey);
      const verified = await RSA.verify(testData, pair.publicKey, signature);
      expect(verified).assertEqual(true);

      // Base64格式测试
      const encryptedBase64 = await RSA.encryptBase64(testData, pair.publicKey);
      const decryptedFromBase64 = await RSA.decryptFromBase64(encryptedBase64, pair.privateKey);
      expect(UTF8.decode(decryptedFromBase64)).assertEqual(testContent);

      const signatureBase64 = await RSA.signBase64(testContent, pair.privateKey);
      const verifiedBase64 = await RSA.verifyFromBase64(testContent, pair.publicKey, signatureBase64);
      expect(verifiedBase64).assertEqual(true);
    });

    // 提取公钥测试
    it('extractPublicKeyShouldWork', 0, () => {
      const extractedPublicKey = RSA.extractPublicKey(keyPair.privateKey);
      expect(JSON.stringify(extractedPublicKey)).assertEqual(JSON.stringify(keyPair.publicKey));
    });

    // PKCS1密钥提取公钥测试
    it('pkcs1ExtractPublicKeyShouldWork', 0, () => {
      const extractedPublicKey = RSA.extractPublicKey(keyPairPkcs1.privateKey);
      expect(JSON.stringify(extractedPublicKey)).assertEqual(JSON.stringify(keyPairPkcs1.publicKey));
    });

    // 加密解密测试
    it('publicEncryptAndPrivateDecryptShouldWork', 0, async () => {
      const testString = "hello";
      const testData = UTF8.encode(testString);
      
      const encrypted = await RSA.encryptBase64(testData, keyPair.publicKey);
      const decrypted = await RSA.decryptFromBase64(encrypted, keyPair.privateKey);

      expect(UTF8.decode(decrypted)).assertEqual(testString);
    });

    // PKCS1密钥加密解密测试
    it('pkcs1KeyShouldWork', 0, async () => {
      const testString = "hello";
      const testData = UTF8.encode(testString);
      
      const encrypted = await RSA.encryptBase64(testData, keyPairPkcs1.publicKey);
      const decrypted = await RSA.decryptFromBase64(encrypted, keyPairPkcs1.privateKey);

      expect(UTF8.decode(decrypted)).assertEqual(testString);
    });

    // 签名和验证测试
    it('signAndVerifyShouldWork', 0, async () => {
      const testString = "hello";
      
      const signature = await RSA.signBase64(testString, keyPair.privateKey);
      const verified = await RSA.verifyFromBase64(testString, keyPair.publicKey, signature);
      
      expect(verified).assertEqual(true);
    });

    // 错误内容验证应该失败
    it('verifyWithWrongContentShouldFail', 0, async () => {
      const testString = "hello";
      const wrongContent = "wrong content";
      
      const signature = await RSA.sign(UTF8.encode(testString), keyPair.privateKey);
      const verified = await RSA.verify(UTF8.encode(wrongContent), keyPair.publicKey, signature);
      
      expect(verified).assertEqual(false);
    });

    // PKCS1密钥签名验证测试
    it('pkcs1KeySignAndVerifyShouldWork', 0, async () => {
      const testString = "hello";
      
      const signature = await RSA.signBase64(testString, keyPairPkcs1.privateKey);
      const verified = await RSA.verifyFromBase64(testString, keyPairPkcs1.publicKey, signature);
      
      expect(verified).assertEqual(true);
    });
      // SHA1签名测试
    it('sha1SignatureTest', 0, async () => {
      const testString = "hello";
      const testData = UTF8.encode(testString);
      
      const signature = await RSA.signSha1(testData, keyPairPkcs1.privateKey);
      const verified = await RSA.verifySha1(testData, keyPairPkcs1.publicKey, signature);
      
      expect(verified).assertEqual(true);
    });
    
    // 预设加密数据测试
    it('precomputedEncryptionShouldMatch', 0, async () => {
      const encrypted = await RSA.encrypt(contentRaw, keyPair.publicKey);
      // RSA/ECB/PKCS1Padding 每次加密都不同，所以这里不匹配
      expect(JSON.stringify(encrypted)).not().assertEqual(JSON.stringify(encryptedRaw));
    });

    // 预设解密数据测试
    it('precomputedDecryptionShouldMatch', 0, async () => {
      const decrypted = await RSA.decrypt(encryptedRaw, keyPairPkcs1.privateKey);
      expect(JSON.stringify(decrypted)).assertEqual(JSON.stringify(contentRaw));
    });

    // 预设签名数据测试
    it('precomputedSignatureShouldMatch', 0, async () => {
      const signed = await RSA.sign(contentRaw, keyPair.privateKey);
      expect(JSON.stringify(signed)).assertEqual(JSON.stringify(signRaw));
    });

    // 预设签名验证测试
    it('precomputedSignatureShouldVerify', 0, async () => {
      const verified = await RSA.verify(contentRaw, keyPair.publicKey, signRaw);
      expect(verified).assertEqual(true);
    });

    // 预设SHA1签名数据测试
    it('precomputedSignatureShouldMatchSha1', 0, async () => {
      const signed = await RSA.signSha1(contentRaw, keyPairPkcs1.privateKey);
      expect(JSON.stringify(signed)).assertEqual(JSON.stringify(signRawSha1));
    });

    // 预设SHA1签名验证测试
    it('precomputedSignatureShouldVerifySha1', 0, async () => {
      const verified = await RSA.verifySha1(contentRaw, keyPairPkcs1.publicKey, signRawSha1);
      expect(verified).assertEqual(true);
    });
  });
}

// 测试用密钥对
const keyPair = new RsaKeyPair(
  Base64.decode(
    `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLjXCd0y8wucMlQDd9S9cFeCA0H
/l/prnouwWgGOEzoaS1gBK4IK0AAiNd7mz8EP+4m9DqeaGW63ei3aws43qV1lDpsVepfJ2PPe/5
VBx7uAKKGqPU+IlNP6EBWUWMMsrCS/oh6LHucCyLah5YhyXOju1cZTfqQ1VFWsbZupmUaQIDAQAB`.replace(/\n/g, "")
  ),
  Base64.decode(
    `MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAIuNcJ3TLzC5wyVAN31L
1wV4IDQf+X+muei7BaAY4TOhpLWAErggrQACI13ubPwQ/7ib0Op5oZbrd6LdrCzjepXWUOmxV6l8
nY897/lUHHu4Aooao9T4iU0/oQFZRYwyysJL+iHose5wLItqHliHJc6O7VxlN+pDVUVaxtm6mZRpA
gMBAAECgYAKHDkodgBZO1wT+s8KWNA/KTDMFfTxdpbJcaM6shK+tttD+v9gL53Y/k6po3hp2qFsM
n20PxOh53VHa1/p8KEU1j+DwLbNC5eIp7/5ZNWwftQTSHBCqSyr+7rE0i6Gcst1qT0ioKUS1fOHI
ZSt0gfBOf1eEzhpLDT1o0QgY98cAQJBANrWFNml89xHZQAUmXvrcC/vzmbfktWuHpTP4gRoURp4U
h7j07xD7dVN/gbk42K70VWCTWTRSARApA9IfjACuqECQQCjQH4hh/2H70b23h3OUfiGUSnhupoNU
z93xTsaBYbwiTGYH81Sno5aQbO3j8H9gi8qZanSHRG24MUVeyQdRYzJAkBHJ0aeQgxZeklHzmrdV
P8kRwfIgTdgDP5aioFFx5lfTvH8oz1MQJYLPhGzsiaRCtqUwApkFnwhDdeKNJr7B1ghAkEAm/knS
TQbp/+VxpGK2q/4iaQMJs3ZF7gc4HrBL+ht92ysxJJF4pT4nwU9BrlD98ik9ZXyPXxmi1qPEin35
Dup+QJBAMQsiQwjjTGoVJpNrXoxHbSwgrHhJrgP4HUX2XKmbjCfem8dWdU93G4/VDFUDcNJyd33x
DOHispMoe+rHwgG0xQ=`.replace(/\n/g, "")
  )
);

// PKCS1格式测试密钥对
const keyPairPkcs1 = new RsaKeyPair(
  Base64.decode(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCCjpncvOtMHIp4Bv9sX3JMoSlYKCWsaHdDZ5Oi+QybEDQQlk+MS0wDv+CodsbBFkFwkYcScJzXO/2tM7zVLJR71H761u/woIC5WiBivEMfF6paD0oUM/M440N6ek9ZVONd+W29tnsA+pRVPhN8JhIJaWpuB//UoROXp0PWMjfiZwIDAQAB"
  ),
  Base64.decode(
    "MIICXAIBAAKBgQCCjpncvOtMHIp4Bv9sX3JMoSlYKCWsaHdDZ5Oi+QybEDQQlk+MS0wDv+CodsbBFkFwkYcScJzXO/2tM7zVLJR71H761u/woIC5WiBivEMfF6paD0oUM/M440N6ek9ZVONd+W29tnsA+pRVPhN8JhIJaWpuB//UoROXp0PWMjfiZwIDAQABAoGAd/oYBzRNfzpTPY4guDTWUvlfhzYNuOyffP/4OrJoFS/EyOF45NJlXqS8DdRpPhP3uzzhRd7bIyhsLPj4tWYsZGuyA+GyOjF9Zj/rOWPU1rP4qWSFQ1p9pHvugoi3yt9I1bIqggvUcXk3hdnuVdfSjQE1fY5lpXZvGKB6zNpqZVECQQDuWimYnFgc/1BJtSfCwtKiN0eFMw8S4gTyzWttwOtFxBsHo7Q1l5Xvk564kwZXr2CuOXahrJaDjYm7vNzfoy6bAkEAjDk9QynP8YXQsISPB/X/PxYYpZbAti85sk3JPVO2jb3tAkxCYmIxUg1xgpogaOupqKxeQe83gD8742+5xSXSJQJASuFegghUEkAPjChyZlhobffp6ynASZFiNplcb62U/GUAjOTcH54Qx6Rbz+a4rmF1gSaiY2ZiHtAffjB2P3f3kwJASBx7k9mh1ZwyeUSCZd6tOB096ZJAYrCgpEB6eC5f2D7O7vqWvQ+wO3ksYbSvbCWdZ1/VTWUfDrX2L31adLeBfQJBALGYWVO6Ksv72k1vbSywhLYOKVe3JLZiZgFUNvKLh0g1Tfm1pK29veSSGey8HIkGtI04E6tgQVLx3adZSxjdnFI="
  )
);

// 预设的测试数据
const content = "hello";
const contentRaw = Base64.decode("kolOt/LYqkhf/RZu6aJcIA==");
const encryptedRaw = Base64.decode(
  "a6CIZzAPpzaDysCOE9X5FYp723lsTRia/GVDmU4yyhcKaFX2iBICfVwK5gakKK+NgTQ4veMu0l3wpIHM+eRA+Q6zrxCYjE8tkH1O4Jbxcvx4Nai4QP0JqCXDXNpxJMccKhqyNZ01uBq1RjJ++ATkMt66rt5DMW4pLtToh7nLjhg="
);
const signRaw = Base64.decode(
  "VnEka0wYeYmaG45qW7+RTPH+prTO9ryxrtqyAwpoZOymeQGJTPfkmm+Ti16UJPZetYR1LF+ETQ++XAkuTQIqhu4sgXyuhw4/TIYyMDzaEuEDOciwvJLiyC73E0Q4jXQx6kT8o+65Ki9h4LPxjjr8tOc+/r3U1uhute8/QWWYiuA="
);
const signRawSha1 = Base64.decode(
  "RvxmCkUxhtSPLss712C2vH7jpXaV82QXDe/e9EaclgWuVPEliDPmUkwg20PfG5d/xM0l3LAEexHAUWD3svg6HTWo9zw7/l+fYxtkbv59i8Uz7r5Y+j3HVaHKevFEw2Z34PHbiPXVNYBRE/4Qzl8wLT2ZSLzo50yBBFziD4LgvtU="
);
