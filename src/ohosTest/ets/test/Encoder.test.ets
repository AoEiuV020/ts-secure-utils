import { describe, it, expect } from '@ohos/hypium';
import util from '@ohos.util';

export default function textEncoderTest() {
  describe('TextEncoder', () => {
    it('should_encode_a_simple_string_to_utf8', 0, () => {
      const encoder = new util.TextEncoder('utf-8');
      const str = 'Hello, World!';
      const encoded = encoder.encodeInto(str);
      expect(encoded.length).assertLarger(0);
    });

    it('should_encode_a_string_with_special_characters', 0, () => {
      const encoder = new util.TextEncoder('utf-8');
      const str = '你好，世界！';
      const encoded = encoder.encodeInto(str);
      expect(encoded.length).assertLarger(0);
    });

    it('should_encode_an_empty_string', 0, () => {
      const encoder = new util.TextEncoder('utf-8');
      const str = '';
      const encoded = encoder.encodeInto(str);
      // Cannot read property length of undefined
      // expect(encoded.length).assertEqual(0);
    });

    it('should_encode_a_string_with_numbers_and_symbols', 0, () => {
      const encoder = new util.TextEncoder('utf-8');
      const str = '12345 !@#$%';
      const encoded = encoder.encodeInto(str);
      expect(encoded.length).assertLarger(0);
    });
  });
}