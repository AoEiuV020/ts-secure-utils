import { MD5, HEX, UTF8 } from "../src";

describe("MD5 Tests", () => {
  // 基本MD5哈希测试
  test("encrypt should calculate correct MD5 hash", () => {
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
    const hash = MD5.encrypt(testData);
    
    // "Hello"的MD5值是8b1a9953c4611296a827abf8c47804d7
    const expectedHash = HEX.decode("8b1a9953c4611296a827abf8c47804d7");
    expect(hash).toEqual(expectedHash);
  });
  
  // 十六进制编码的MD5测试
  test("encryptHex should return correct hex-encoded MD5", () => {
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
    const hexHash = MD5.encryptHex(testData);
    
    expect(hexHash).toBe("8b1a9953c4611296a827abf8c47804d7");
  });
  
  // 字符串MD5测试
  test("encryptString should calculate correct MD5 hash for strings", () => {
    const testString = "Hello";
    const hash = MD5.encryptString(testString);
    
    // "Hello"的MD5值是8b1a9953c4611296a827abf8c47804d7
    const expectedHash = HEX.decode("8b1a9953c4611296a827abf8c47804d7");
    expect(hash).toEqual(expectedHash);
  });
  
  // 字符串到十六进制编码的MD5测试
  test("encryptStringToHex should return correct hex-encoded MD5 for strings", () => {
    const testString = "Hello";
    const hexHash = MD5.encryptStringToHex(testString);
    
    expect(hexHash).toBe("8b1a9953c4611296a827abf8c47804d7");
  });
  
  // 空数据测试
  test("MD5 of empty data", () => {
    const emptyData = new Uint8Array([]);
    const hexHash = MD5.encryptHex(emptyData);
    
    // 空数据的MD5值是d41d8cd98f00b204e9800998ecf8427e
    expect(hexHash).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });
  
  // 空字符串测试
  test("MD5 of empty string", () => {
    const hexHash = MD5.encryptStringToHex("");
    
    // 空字符串的MD5值是d41d8cd98f00b204e9800998ecf8427e
    expect(hexHash).toBe("d41d8cd98f00b204e9800998ecf8427e");
  });
  
  // 各种常见字符串的MD5测试
  test("MD5 of common strings", () => {
    // 测试案例：字符串及其对应的MD5哈希值
    const testCases = [
      { input: "abc", expected: "900150983cd24fb0d6963f7d28e17f72" },
      { input: "123456", expected: "e10adc3949ba59abbe56e057f20f883e" },
      { input: "The quick brown fox jumps over the lazy dog", expected: "9e107d9d372bb6826bd81d3542a419d6" }
    ];
    
    for (const testCase of testCases) {
      const hexHash = MD5.encryptStringToHex(testCase.input);
      expect(hexHash).toBe(testCase.expected);
    }
  });
  
  // 中文字符串MD5测试
  test("MD5 of Chinese strings", () => {
    const testString = "你好，世界";
    const hexHash = MD5.encryptStringToHex(testString);
    
    // 确保UTF-8编码后的MD5值正确
    expect(hexHash).toBe("dbefd3ada018615b35588a01e216ae6e");
  });
});
