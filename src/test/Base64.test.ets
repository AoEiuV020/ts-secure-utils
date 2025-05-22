import { describe, expect, it } from '@ohos/hypium';
import { Base64 } from '../base64';

export default function base64Test() {
  describe('Base64Tests', () => {
    // 基本编解码测试
    it('encodeAndDecodeBasicStrings', 0, () => {
      const testData = stringToBytes("Hello, World!");
      const encoded = Base64.encode(testData);
      expect(encoded).assertEqual("SGVsbG8sIFdvcmxkIQ==");

    });
    // 中文字符测试
    it('encodeAndDecodeChineseCharacters', 0, () => {

      const testData = stringToBytes("你好，世界");
      const encoded = Base64.encode(testData);
      expect(encoded).assertEqual("5L2g5aW977yM5LiW55WM");

    });
    // 空字符串测试
    it('encodeAndDecodeEmptyStrings', 0, () => {

      const testData = new Uint8Array();
      const encoded = Base64.encode(testData);
      expect(encoded).assertEqual("");

      const decoded = Base64.decode(encoded);
      expect(testData).assertDeepEquals(decoded);
    });
    // 二进制数据测试
    it('encodeAndDecodeBinaryData', 0, () => {
      // 创建一个包含各种值的二进制数组
      const binaryData = new Uint8Array([0, 1, 127, 128, 255]);
      const encoded = Base64.encode(binaryData);

      const decoded = Base64.decode(encoded);
      // 验证解码后的数据与原始数据相同
      expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(binaryData));
    });
    // 大型数据测试
    it('encodeAndDecodeLargeData', 0, () => {
      // 创建一个较大的数据块
      const largeData = new Uint8Array(10000);
      for (let i = 0; i < largeData.length; i++) {
        largeData[i] = i % 256;
      }

      const encoded = Base64.encode(largeData);
      const decoded = Base64.decode(encoded);

      // 验证解码后的数据与原始数据相同
      expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(largeData));
    });
    // 编码后解码的一致性测试
    it('decodeShouldReverseEncodeOperation', 0, () => {
      // 测试100个随机生成的数组
      for (let i = 0; i < 100; i++) {
        const size = Math.floor(Math.random() * 100) + 1; // 1-100的随机大小
        const randomData = new Uint8Array(size);

        // 填充随机值
        for (let j = 0; j < size; j++) {
          randomData[j] = Math.floor(Math.random() * 256);
        }

        const encoded = Base64.encode(randomData);
        const decoded = Base64.decode(encoded);

        // 验证解码后的数据与原始数据相同
        expect(JSON.stringify(decoded)).assertEqual(JSON.stringify(randomData));
      }
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
