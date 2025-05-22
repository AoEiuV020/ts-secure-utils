import { describe, it, expect } from '@ohos/hypium';

export default function textEncoderTest() {
  describe('stringToBytes', () => {
    it('should_encode_a_simple_string_to_utf8', 0, () => {
      const str = 'Hello, World!';
      const encoded = stringToBytes(str);
      expect(encoded.length).assertLarger(0);
    });

    it('should_encode_a_string_with_special_characters', 0, () => {
      const str = '你好，世界！';
      const encoded = stringToBytes(str);
      expect(encoded.length).assertLarger(0);
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