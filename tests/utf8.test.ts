import { UTF8 } from "../src";

describe("UTF8 Tests", () => {
  // 基本编解码测试
  test("encode and decode should handle basic strings", () => {
    const testString = "Hello, World!";
    const encoded = UTF8.encode(testString);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(testString);
  });
  
  // 空字符串测试
  test("encode and decode should handle empty strings", () => {
    const testString = "";
    const encoded = UTF8.encode(testString);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(testString);
  });
  
  // 特殊字符测试
  test("encode and decode should handle special characters", () => {
    const testString = "!@#$%^&*()_+{}|:<>?~`-=[]\\;',./";
    const encoded = UTF8.encode(testString);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(testString);
  });
  
  // 中文字符测试
  test("encode and decode should handle Chinese characters", () => {
    const testString = "你好，世界";
    const encoded = UTF8.encode(testString);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(testString);
  });
  
  // 日文字符测试
  test("encode and decode should handle Japanese characters", () => {
    const testString = "こんにちは、世界";
    const encoded = UTF8.encode(testString);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(testString);
  });
  
  // emoji测试
  test("encode and decode should handle emoji characters", () => {
    const testString = "👋🌍👨‍👩‍👧‍👦🚀";
    const encoded = UTF8.encode(testString);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(testString);
  });

  // 长文本测试
  test("encode and decode should handle long text", () => {
    // 创建一个较长的文本
    let longText = "";
    for (let i = 0; i < 1000; i++) {
      longText += `Line ${i}: Some random text with special chars !@#$ and numbers 123456.\n`;
    }
    
    const encoded = UTF8.encode(longText);
    const decoded = UTF8.decode(encoded);
    expect(decoded).toBe(longText);
  });
  
  // 随机字符串测试
  test("encode and decode should maintain consistency with random strings", () => {
    // 测试10个随机生成的字符串
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    
    for (let i = 0; i < 10; i++) {
      let randomString = '';
      const length = Math.floor(Math.random() * 100) + 1; // 1-100的随机长度
      
      for (let j = 0; j < length; j++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      const encoded = UTF8.encode(randomString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).toBe(randomString);
    }
  });
});
