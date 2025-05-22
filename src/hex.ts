import forge from "node-forge";
import { BinString } from "./bin";

/**
 * 提供十六进制字符串编解码功能
 */
export class HEX {
  /**
   * 将字节数组编码为十六进制字符串
   * @param bytes 要编码的字节数组
   * @returns 十六进制字符串
   */
  static encode(bytes: Uint8Array): string {
    return forge.util.bytesToHex(BinString.toString(bytes));
  }

  /**
   * 将十六进制字符串解码为字节数组
   * @param hexString 十六进制字符串
   * @returns 解码后的字节数组，如果输入无效则抛出错误
   */
  static decode(hexString: string): Uint8Array {
    return BinString.toByteArray(forge.util.hexToBytes(hexString));
  }
}
