import { describe, expect, it } from '@ohos/hypium';
import { AES, Base64, MD5 } from '../index';

export default function aesTest() {
  describe('AESTests', () => {
    // 特定真实数据测试 - 与Go版本兼容性测试
    it("realTest", 0, () => {
      const content = "10005154";
      const expectedEncrypted = "v8dUhK9k1+uBnFJjlNtcGg==";

      // 使用MD5生成密钥
      const password = "123456";
      const key = MD5.encryptString(password);

      // 测试加密
      const encrypted = AES.encryptBase64String(content, key);
      expect(encrypted).assertEqual(expectedEncrypted);

      // 测试解密
      const decrypted = AES.decryptStringFromBase64(encrypted, key);
      expect(decrypted).assertEqual(content);

      // 测试MD5计算
      const decoded = Base64.decode(encrypted);
      const md5sum = MD5.encryptHex(decoded);
      const expectedMD5 = "7b0ec6dfb48e8c79e53e5a3f55df62cb";
      expect(md5sum).assertEqual(expectedMD5);
    });

    // 基本加密解密测试
    it('encryptAndDecryptShouldWorkCorrectly', 0, () => {
      const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
      const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      const encrypted = AES.encrypt(testData, key);
      const decrypted = AES.decrypt(encrypted, key);
      
      expect(JSON.stringify(decrypted)).assertEqual(JSON.stringify(testData));
    });
    
    // 密钥长度调整测试
    it('adjustKeyLengthShouldAdjustKeyTo16Bytes', 0, () => {
      // 测试短密钥 (< 16字节)
      const shortKey = new Uint8Array([1, 2, 3, 4, 5]);
      const adjustedShortKey = AES.adjustKeyLength(shortKey);
      expect(adjustedShortKey.length).assertEqual(16);
      
      // 验证前5个字节保持不变
      for (let i = 0; i < 5; i++) {
        expect(adjustedShortKey[i]).assertEqual(shortKey[i]);
      }
      
      // 验证剩余字节为0填充
      expect(adjustedShortKey[5]).assertEqual(0);
      
      // 测试等长密钥 (= 16字节)
      const exactKey = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        exactKey[i] = i;
      }
      const adjustedExactKey = AES.adjustKeyLength(exactKey);
      expect(JSON.stringify(adjustedExactKey)).assertEqual(JSON.stringify(exactKey));
      
      // 测试长密钥 (> 16字节)
      const longKey = new Uint8Array(20);
      for (let i = 0; i < 20; i++) {
        longKey[i] = i;
      }
      const adjustedLongKey = AES.adjustKeyLength(longKey);
      expect(adjustedLongKey.length).assertEqual(16);
      
      // 验证取了前16个字节
      const expectedLongKey = longKey.slice(0, 16);
      expect(JSON.stringify(adjustedLongKey)).assertEqual(JSON.stringify(expectedLongKey));
    });
    
    // Base64编码解码测试
    it('encryptBase64AndDecryptFromBase64ShouldWorkCorrectly', 0, () => {
      const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
      const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      const encrypted = AES.encryptBase64(testData, key);
      const decrypted = AES.decryptFromBase64(encrypted, key);
      
      expect(JSON.stringify(decrypted)).assertEqual(JSON.stringify(testData));
    });
    
    // 字符串加密解密测试
    it('encryptStringAndDecryptStringFromBase64ShouldWorkCorrectly', 0, () => {
      const testString = "Hello, World!";
      const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      const encrypted = AES.encryptBase64String(testString, key);
      const decrypted = AES.decryptStringFromBase64(encrypted, key);
      
      expect(decrypted).assertEqual(testString);
    });
    
    // 空数据测试
    it('encryptAndDecryptShouldHandleEmptyData', 0, () => {
      const emptyData = new Uint8Array(0);
      const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      
      const encrypted = AES.encrypt(emptyData, key);
      const decrypted = AES.decrypt(encrypted, key);
      
      expect(JSON.stringify(decrypted)).assertEqual(JSON.stringify(emptyData));
    });
    
    // 大型数据测试
    it('encryptAndDecryptShouldHandleLargeData', 0, () => {
      // 创建一个较大的数据块
      const largeData = new Uint8Array(10000);
      for (let i = 0; i < largeData.length; i++) {
        largeData[i] = i % 256;
      }
      
      const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
      const encrypted = AES.encrypt(largeData, key);
      const decrypted = AES.decrypt(encrypted, key);
      
      expect(JSON.stringify(decrypted)).assertEqual(JSON.stringify(largeData));
    });
    
    // 随机数据测试
    it('encryptAndDecryptShouldWorkWithRandomData', 0, () => {
      // 测试10个随机生成的数据和密钥
      for (let i = 0; i < 10; i++) {
        const dataSize = Math.floor(Math.random() * 1000) + 1; // 1-1000的随机大小
        const randomData = new Uint8Array(dataSize);
        const randomKey = new Uint8Array(16);
        
        // 填充随机值
        for (let j = 0; j < dataSize; j++) {
          randomData[j] = Math.floor(Math.random() * 256);
        }
        
        for (let j = 0; j < 16; j++) {
          randomKey[j] = Math.floor(Math.random() * 256);
        }
        
        const encrypted = AES.encrypt(randomData, randomKey);
        const decrypted = AES.decrypt(encrypted, randomKey);
        
        expect(JSON.stringify(decrypted)).assertEqual(JSON.stringify(randomData));
      }
    });
  });
}
