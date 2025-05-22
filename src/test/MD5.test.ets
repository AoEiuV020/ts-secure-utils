import { describe, expect, it } from '@ohos/hypium';
import { HEX, MD5 } from '../index';

export default function md5Test() {
  describe('MD5Tests', () => {
    // 基本MD5哈希测试
    it('encryptShouldCalculateCorrectMD5Hash', 0, () => {
      const testData = stringToBytes("Hello");
      const hash = MD5.encrypt(testData);
      
      // "Hello"的MD5值是8b1a9953c4611296a827abf8c47804d7
      const expectedHash = HEX.decode("8b1a9953c4611296a827abf8c47804d7");
      expect(JSON.stringify(hash)).assertEqual(JSON.stringify(expectedHash));
    });
    
    // 十六进制编码的MD5测试
    it('encryptHexShouldReturnCorrectHexEncodedMD5', 0, () => {
      const testData = stringToBytes("Hello");
      const hexHash = MD5.encryptHex(testData);
      
      expect(hexHash).assertEqual("8b1a9953c4611296a827abf8c47804d7");
    });
    
    // 字符串MD5测试
    it('encryptStringShouldCalculateCorrectMD5HashForStrings', 0, () => {
      const testString = "Hello";
      const hash = MD5.encryptString(testString);
      
      // "Hello"的MD5值是8b1a9953c4611296a827abf8c47804d7
      const expectedHash = HEX.decode("8b1a9953c4611296a827abf8c47804d7");
      expect(JSON.stringify(hash)).assertEqual(JSON.stringify(expectedHash));
    });
    
    // 字符串到十六进制编码的MD5测试
    it('encryptStringToHexShouldReturnCorrectHexEncodedMD5ForStrings', 0, () => {
      const testString = "Hello";
      const hexHash = MD5.encryptStringToHex(testString);
      
      expect(hexHash).assertEqual("8b1a9953c4611296a827abf8c47804d7");
    });
    
    // 空数据测试
    it('md5OfEmptyData', 0, () => {
      const emptyData = new Uint8Array([]);
      const hexHash = MD5.encryptHex(emptyData);
      
      // 空数据的MD5值是d41d8cd98f00b204e9800998ecf8427e
      expect(hexHash).assertEqual("d41d8cd98f00b204e9800998ecf8427e");
    });
    
    // 空字符串测试
    it('md5OfEmptyString', 0, () => {
      const hexHash = MD5.encryptStringToHex("");
      
      // 空字符串的MD5值是d41d8cd98f00b204e9800998ecf8427e
      expect(hexHash).assertEqual("d41d8cd98f00b204e9800998ecf8427e");
    });
    
    // 中文字符测试
    it('md5OfChineseCharacters', 0, () => {
      const testString = "你好，世界";
      const hexHash = MD5.encryptStringToHex(testString);
      
      // 验证生成的哈希值长度正确
      expect(hexHash.length).assertEqual(32);
    });
  });
}

function stringToBytes(str: string): Uint8Array {
  const encodedString = encodeURIComponent(str);
  const binaryString = unescape(encodedString);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}
