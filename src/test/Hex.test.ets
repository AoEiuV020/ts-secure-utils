import { describe, expect, it } from '@ohos/hypium';
import { HEX } from '../hex';

export default function hexTest() {
  describe('HEXTests', () => {
    // 基本编解码测试
    it('encodeAndDecodeBasicBytes', 0, () => {
      const testData = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
      const encoded = HEX.encode(testData);
      expect(encoded).assertEqual("48656c6c6f");
      
      const decoded = HEX.decode(encoded);
      expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(testData));
    });
    
    // 空数据测试
    it('encodeAndDecodeEmptyBytes', 0, () => {
      const testData = new Uint8Array([]);
      const encoded = HEX.encode(testData);
      expect(encoded).assertEqual("");
      
      const decoded = HEX.decode(encoded);
      expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(testData));
    });
    
    // 所有可能的字节值测试
    it('encodeAndDecodeAllByteValues', 0, () => {
      const testData = new Uint8Array(256);
      for (let i = 0; i < 256; i++) {
        testData[i] = i;
      }
      
      const encoded = HEX.encode(testData);
      const decoded = HEX.decode(encoded);
      expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(testData));
    });
    
    // 大小写测试
    it('decodeShouldHandleBothUpperAndLowerCaseHex', 0, () => {
      const testData = new Uint8Array([10, 11, 12, 13, 14, 15]);
      const decodedUpper = HEX.decode("0A0B0C0D0E0F");
      const decodedLower = HEX.decode("0a0b0c0d0e0f");
      
      expect(JSON.stringify(decodedUpper)).assertEqual(JSON.stringify(testData));
      expect(JSON.stringify(decodedLower)).assertEqual(JSON.stringify(testData));
    });
    
    // 随机数据测试
    it('encodeAndDecodeRandomBytes', 0, () => {
      // 创建一个随机数据块
      const randomData = new Uint8Array(100);
      for (let i = 0; i < randomData.length; i++) {
        randomData[i] = Math.floor(Math.random() * 256);
      }
      
      const encoded = HEX.encode(randomData);
      const decoded = HEX.decode(encoded);
      expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(randomData));
    });
  });
}
