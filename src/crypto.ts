/**
 * 加密工具类
 */
export class CryptoUtils {
  /**
   * Base64编码
   * @param str 原始字符串
   * @returns Base64编码结果
   */
  static base64Encode(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  /**
   * Base64解码
   * @param str Base64字符串
   * @returns 解码结果
   */
  static base64Decode(str: string): string {
    return Buffer.from(str, 'base64').toString('utf8');
  }

  /**
   * MD5哈希
   * @param str 原始字符串
   * @returns MD5哈希值
   */
  static md5(str: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(str).digest('hex');
  }
}