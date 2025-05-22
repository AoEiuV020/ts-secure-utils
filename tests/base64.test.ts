import { Base64 } from "../src";
import { UTF8 } from "../src/utf8";

describe("Base64 Tests", () => {
  // 基本编解码测试
  test("encode and decode should handle basic strings", () => {
    const testData = UTF8.encode("Hello, World!");
    const encoded = Base64.encode(testData);
    expect(encoded).toBe("SGVsbG8sIFdvcmxkIQ==");
    
    const decoded = Base64.decode(encoded);
    expect(UTF8.decode(decoded)).toBe("Hello, World!");
  });
  
  // 空字符串测试
  test("encode and decode should handle empty strings", () => {
    const testData = UTF8.encode("");
    const encoded = Base64.encode(testData);
    expect(encoded).toBe("");
    
    const decoded = Base64.decode(encoded);
    expect(UTF8.decode(decoded)).toBe("");
  });
  
  // 特殊字符测试
  test("encode and decode should handle special characters", () => {
    const testData = UTF8.encode("!@#$%^&*()_+{}|:<>?~`-=[]\\;',./");
    const encoded = Base64.encode(testData);
    
    const decoded = Base64.decode(encoded);
    expect(UTF8.decode(decoded)).toBe("!@#$%^&*()_+{}|:<>?~`-=[]\\;',./");
  });
  
  // 中文字符测试
  test("encode and decode should handle Chinese characters", () => {
    const testData = UTF8.encode("你好，世界");
    const encoded = Base64.encode(testData);
    
    const decoded = Base64.decode(encoded);
    expect(UTF8.decode(decoded)).toBe("你好，世界");
  });
  
  // 二进制数据测试
  test("encode and decode should handle binary data", () => {
    // 创建一个包含各种值的二进制数组
    const binaryData = new Uint8Array([0, 1, 127, 128, 255]);
    const encoded = Base64.encode(binaryData);
    
    const decoded = Base64.decode(encoded);
    // 验证解码后的数据与原始数据相同
    expect(decoded).toEqual(binaryData);
  });
  
  // 大型数据测试
  test("encode and decode should handle large data", () => {
    // 创建一个较大的数据块
    const largeData = new Uint8Array(10000);
    for (let i = 0; i < largeData.length; i++) {
      largeData[i] = i % 256;
    }
    
    const encoded = Base64.encode(largeData);
    const decoded = Base64.decode(encoded);
    
    // 验证解码后的数据与原始数据相同
    expect(decoded).toEqual(largeData);
  });
  
  // 编码后解码的一致性测试
  test("decode should reverse encode operation", () => {
    // 测试100个随机生成的数组
    for (let i = 0; i < 100; i++) {
      const size = Math.floor(Math.random() * 100) + 1;  // 1-100的随机大小
      const randomData = new Uint8Array(size);
      
      // 填充随机值
      for (let j = 0; j < size; j++) {
        randomData[j] = Math.floor(Math.random() * 256);
      }
      
      const encoded = Base64.encode(randomData);
      const decoded = Base64.decode(encoded);
      
      // 验证解码后的数据与原始数据相同
      expect(decoded).toEqual(randomData);
    }
  });
});
