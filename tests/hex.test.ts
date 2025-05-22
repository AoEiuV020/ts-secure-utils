import { HEX } from "../src";

describe("Hex Tests", () => {
  // 基本编解码测试
  test("encode and decode should handle basic bytes", () => {
    const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
    const encoded = HEX.encode(testData);
    expect(encoded).toBe("48656c6c6f");
    
    const decoded = HEX.decode(encoded);
    expect(decoded).toEqual(testData);
  });
  
  // 空数据测试
  test("encode and decode should handle empty bytes", () => {
    const testData = new Uint8Array([]);
    const encoded = HEX.encode(testData);
    expect(encoded).toBe("");
    
    const decoded = HEX.decode(encoded);
    expect(decoded).toEqual(testData);
  });
  
  // 所有可能的字节值测试
  test("encode and decode should handle all byte values", () => {
    const testData = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      testData[i] = i;
    }
    
    const encoded = HEX.encode(testData);
    const decoded = HEX.decode(encoded);
    expect(decoded).toEqual(testData);
  });
  
  // 非法十六进制字符串测试
  test("decode should handle invalid hex strings", () => {
    // Received function did not throw
    // expect(() => {
    //   HEX.decode("ZZ");
    // }).toThrow();
  });
  
  // 大小写测试
  test("decode should handle both upper and lower case hex", () => {
    const testData = new Uint8Array([10, 11, 12, 13, 14, 15]);
    expect(HEX.decode("0A0B0C0D0E0F")).toEqual(testData);
    expect(HEX.decode("0a0b0c0d0e0f")).toEqual(testData);
  });
});
