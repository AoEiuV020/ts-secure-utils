import forge from "node-forge";
import { BinString } from "./bin";
import { UTF8 } from "./utf8";

export class Base64 {
  static encode(content: Uint8Array): string {
    return forge.util.encode64(BinString.toString(content));
  }

  static decode(content: string): Uint8Array {
    return BinString.toByteArray(forge.util.decode64(content));
  }

  /**
   * 将字符串编码为Base64字符串
   * @param content 要编码的字符串
   * @returns Base64编码的字符串
   */
  static encodeString(content: string): string {
    return Base64.encode(UTF8.encode(content));
  }

  /**
   * 将Base64字符串解码为原始字符串
   * @param content Base64编码的字符串
   * @returns 解码后的原始字符串
   */
  static decodeToString(content: string): string {
    return UTF8.decode(Base64.decode(content));
  }
}
