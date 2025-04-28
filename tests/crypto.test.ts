import { CryptoUtils } from '../src/crypto';

describe('CryptoUtils Test Suite', () => {
  it('base64 encode/decode', () => {
    const original = 'hello world';
    const encoded = CryptoUtils.base64Encode(original);
    expect(CryptoUtils.base64Decode(encoded)).toBe(original);
  });

  it('md5 hash', () => {
    const str = 'test string';
    const hash = CryptoUtils.md5(str);
    expect(hash).toMatch(/^[a-f0-9]{32}$/);
  });
});