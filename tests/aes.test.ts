import { AES, MD5, Base64, UTF8 } from "../src";

describe("AES Tests", () => {
  // 基本加密解密测试
  test("encrypt and decrypt should work correctly", () => {
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    
    const encrypted = AES.encrypt(testData, key);
    const decrypted = AES.decrypt(encrypted, key);
    
    expect(decrypted).toEqual(testData);
  });
  
  // 密钥长度调整测试
  test("adjustKeyLength should adjust key to 16 bytes", () => {
    // 测试短密钥 (< 16字节)
    const shortKey = new Uint8Array([1, 2, 3, 4, 5]);
    const adjustedShortKey = AES.adjustKeyLength(shortKey);
    expect(adjustedShortKey.length).toBe(16);
    expect(adjustedShortKey.slice(0, 5)).toEqual(shortKey);
    expect(adjustedShortKey[5]).toBe(0); // 其余应为填充的0
    
    // 测试等长密钥 (= 16字节)
    const exactKey = new Uint8Array(Array(16).fill(0).map((_, i) => i));
    const adjustedExactKey = AES.adjustKeyLength(exactKey);
    expect(adjustedExactKey).toEqual(exactKey);
    
    // 测试长密钥 (> 16字节)
    const longKey = new Uint8Array(Array(20).fill(0).map((_, i) => i));
    const adjustedLongKey = AES.adjustKeyLength(longKey);
    expect(adjustedLongKey.length).toBe(16);
    expect(adjustedLongKey).toEqual(longKey.slice(0, 16));
  });
  
  // Base64编码解码测试
  test("encryptBase64 and decryptFromBase64 should work correctly", () => {
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    
    const encrypted = AES.encryptBase64(testData, key);
    const decrypted = AES.decryptFromBase64(encrypted, key);
    
    expect(decrypted).toEqual(testData);
  });
  
  // 字符串加密解密测试
  test("encryptString and decryptStringFromBase64 should work correctly", () => {
    const testString = "Hello, World!";
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    
    const encrypted = AES.encryptBase64String(testString, key);
    const decrypted = AES.decryptStringFromBase64(encrypted, key);
    
    expect(decrypted).toBe(testString);
  });
  
  // 空数据测试
  test("encrypt and decrypt should handle empty data", () => {
    const emptyData = new Uint8Array([]);
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    
    const encrypted = AES.encrypt(emptyData, key);
    const decrypted = AES.decrypt(encrypted, key);
    
    expect(decrypted.length).toBe(0);
  });
  
  // 中文字符串测试
  test("encrypt and decrypt should handle Chinese characters", () => {
    const testString = "你好，世界";
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    
    const encrypted = AES.encryptBase64String(testString, key);
    const decrypted = AES.decryptStringFromBase64(encrypted, key);
    
    expect(decrypted).toBe(testString);
  });
  
  // 特定真实数据测试 - 与Go版本兼容性测试
  test("should be compatible with Go implementation", () => {
    const content = "10005154";
    const expectedEncrypted = "v8dUhK9k1+uBnFJjlNtcGg==";
    
    // 使用MD5生成密钥
    const password = "123456";
    const key = MD5.encryptString(password);
    
    // 测试加密
    const encrypted = AES.encryptBase64String(content, key);
    expect(encrypted).toBe(expectedEncrypted);
    
    // 测试解密
    const decrypted = AES.decryptStringFromBase64(encrypted, key);
    expect(decrypted).toBe(content);
    
    // 测试MD5计算
    const decoded = Base64.decode(encrypted);
    const md5sum = MD5.encryptHex(decoded);
    const expectedMD5 = "7b0ec6dfb48e8c79e53e5a3f55df62cb";
    expect(md5sum).toBe(expectedMD5);
  });
  
  // 错误处理测试
  test("should handle decryption errors", () => {
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
    const key1 = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const key2 = new Uint8Array([16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    
    const encrypted = AES.encrypt(testData, key1);
    
    // 使用错误的密钥解密应该失败
    expect(() => {
      AES.decrypt(encrypted, key2);
    }).toThrow();
  });
  
  // 随机数据测试
  test("should correctly encrypt and decrypt random data", () => {
    // 创建随机数据
    const randomData = new Uint8Array(100);
    for (let i = 0; i < randomData.length; i++) {
      randomData[i] = Math.floor(Math.random() * 256);
    }
    
    const key = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    
    const encrypted = AES.encrypt(randomData, key);
    const decrypted = AES.decrypt(encrypted, key);
    
    expect(decrypted).toEqual(randomData);
  });
});
