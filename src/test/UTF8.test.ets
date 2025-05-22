import { describe, expect, it } from '@ohos/hypium';
import { UTF8 } from '../utf8';

export default function utf8Test() {
  describe('UTF8Tests', () => {
    // 基本编解码测试
    it('encodeAndDecodeShouldHandleBasicStrings', 0, () => {
      const testString = "Hello, World!";
      const encoded = UTF8.encode(testString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).assertEqual(testString);
    });
    
    // 空字符串测试
    it('encodeAndDecodeShouldHandleEmptyStrings', 0, () => {
      const testString = "";
      const encoded = UTF8.encode(testString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).assertEqual(testString);
    });
    
    // 特殊字符测试
    it('encodeAndDecodeShouldHandleSpecialCharacters', 0, () => {
      const testString = "!@#$%^&*()_+{}|:<>?~`-=[]\\;',./";
      const encoded = UTF8.encode(testString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).assertEqual(testString);
    });
    
    // 中文字符测试
    it('encodeAndDecodeShouldHandleChineseCharacters', 0, () => {
      const testString = "你好，世界";
      const encoded = UTF8.encode(testString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).assertEqual(testString);
    });
    
    // 多字节字符测试
    it('encodeAndDecodeShouldHandleMultiByteCharacters', 0, () => {
      const testStrings = [
        "こんにちは、世界", // 日文
        "안녕하세요, 세계", // 韩文
        "Привет, мир",   // 俄文
        "你好，世界",      // 中文
        "مرحبا بالعالم"   // 阿拉伯文
      ];
      
      for (let i = 0; i < testStrings.length; i++) {
        const testString = testStrings[i];
        const encoded = UTF8.encode(testString);
        const decoded = UTF8.decode(encoded);
        expect(decoded).assertEqual(testString);
      }
    });
    
    // emoji测试
    it('encodeAndDecodeShouldHandleEmojiCharacters', 0, () => {
      const testString = "👋🌍👨‍👩‍👧‍👦🚀";
      const encoded = UTF8.encode(testString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).assertEqual(testString);
    });
    
    // 大型字符串测试
    it('encodeAndDecodeShouldHandleLargeStrings', 0, () => {
      // 创建一个较长的重复字符串
      let largeString = "";
      for (let i = 0; i < 1000; i++) {
        largeString += "测试字符串-" + i + " ";
      }
      
      const encoded = UTF8.encode(largeString);
      const decoded = UTF8.decode(encoded);
      expect(decoded).assertEqual(largeString);
    });
  });
}
