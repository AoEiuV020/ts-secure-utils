import forge from "node-forge";
import { BinString } from "./bin";
import { HEX } from "./hex";
import { UTF8 } from "./utf8";

/**
 * 提供MD5哈希计算功能
 */
export class MD5 {
  /**
   * 生成输入数据的MD5哈希值，返回字节数组
   * @param bytes 要计算哈希的字节数组
   * @returns MD5哈希值的字节数组
   */
  static encrypt(bytes: Uint8Array): Uint8Array {
    const md5 = forge.md.md5.create();
    md5.update(BinString.toString(bytes));
    return BinString.toByteArray(md5.digest().data);
  }

  /**
   * 生成输入数据的MD5哈希值，并返回十六进制字符串
   * @param bytes 要计算哈希的字节数组
   * @returns MD5哈希值的十六进制字符串
   */
  static encryptHex(bytes: Uint8Array): string {
    const digest = MD5.encrypt(bytes);
    return HEX.encode(digest);
  }

  /**
   * 生成字符串的MD5哈希值，返回字节数组
   * @param data 要计算哈希的字符串
   * @returns MD5哈希值的字节数组
   */
  static encryptString(data: string): Uint8Array {
    return MD5.encrypt(UTF8.encode(data));
  }

  /**
   * 生成字符串的MD5哈希值，并返回十六进制字符串
   * @param data 要计算哈希的字符串
   * @returns MD5哈希值的十六进制字符串
   */
  static encryptStringToHex(data: string): string {
    return MD5.encryptHex(UTF8.encode(data));
  }
}
