import forge from "node-forge";
import { BinString } from "./bin";
import { Base64 } from "./base64";
import { UTF8 } from "./utf8";

/**
 * 提供AES加密解密功能
 */
export class AES {
  /**
   * 固定的初始化向量，与Go实现保持一致
   */
  private static readonly IV: Uint8Array = new Uint8Array([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ]);

  /**
   * 确保密钥长度为16字节，过长则截断，过短则填充
   * @param key 原始密钥
   * @returns 调整后的16字节密钥
   */
  static adjustKeyLength(key: Uint8Array): Uint8Array {
    if (key.length === 16) {
      return key;
    } else if (key.length > 16) {
      // 截断到16字节
      return key.slice(0, 16);
    } else {
      // 填充到16字节
      const result = new Uint8Array(16);
      result.set(key);
      return result;
    }
  }

  /**
   * 使用AES-CBC模式和固定IV加密数据
   * @param content 要加密的数据
   * @param key 加密密钥
   * @returns 加密后的字节数组
   */
  static encrypt(content: Uint8Array, key: Uint8Array): Uint8Array {
    // 确保密钥长度正确
    const adjustedKey = AES.adjustKeyLength(key);

    // 转换为forge格式
    const keyString = BinString.toString(adjustedKey);
    const contentString = BinString.toString(content);
    const ivString = BinString.toString(AES.IV);

    // 创建加密器
    const cipher = forge.cipher.createCipher('AES-CBC', keyString);
    
    // 初始化加密器
    cipher.start({ iv: ivString });
    
    // 添加数据并完成加密
    cipher.update(forge.util.createBuffer(contentString));
    cipher.finish();

    // 返回加密结果
    return BinString.toByteArray(cipher.output.data);
  }

  /**
   * 加密内容并返回Base64编码的字符串
   * @param content 要加密的数据
   * @param key 加密密钥
   * @returns Base64编码的加密字符串
   */
  static encryptBase64(content: Uint8Array, key: Uint8Array): string {
    const encrypted = AES.encrypt(content, key);
    return Base64.encode(encrypted);
  }

  /**
   * 加密字符串并返回字节数组
   * @param content 要加密的字符串
   * @param key 加密密钥
   * @returns 加密后的字节数组
   */
  static encryptString(content: string, key: Uint8Array): Uint8Array {
    return AES.encrypt(UTF8.encode(content), key);
  }

  /**
   * 加密字符串并返回Base64编码的字符串
   * @param content 要加密的字符串
   * @param key 加密密钥
   * @returns Base64编码的加密字符串
   */
  static encryptBase64String(content: string, key: Uint8Array): string {
    return AES.encryptBase64(UTF8.encode(content), key);
  }

  /**
   * 使用AES-CBC模式和固定IV解密数据
   * @param content 要解密的数据
   * @param key 解密密钥
   * @returns 解密后的字节数组
   */
  static decrypt(content: Uint8Array, key: Uint8Array): Uint8Array {
    // 确保密钥长度正确
    const adjustedKey = AES.adjustKeyLength(key);

    // 转换为forge格式
    const keyString = BinString.toString(adjustedKey);
    const contentString = BinString.toString(content);
    const ivString = BinString.toString(AES.IV);

    // 创建解密器
    const decipher = forge.cipher.createDecipher('AES-CBC', keyString);
    
    // 初始化解密器
    decipher.start({ iv: ivString });
    
    // 添加数据并完成解密
    decipher.update(forge.util.createBuffer(contentString));
    
    try {
      if (!decipher.finish()) {
        throw new Error("解密失败，可能是密文或密钥不正确");
      }
    } catch (error) {
      throw new Error(`解密错误: ${error}`);
    }

    // 返回解密结果
    return BinString.toByteArray(decipher.output.data);
  }

  /**
   * 从Base64编码的字符串解密并返回字节数组
   * @param content Base64编码的加密内容
   * @param key 解密密钥
   * @returns 解密后的字节数组
   */
  static decryptFromBase64(content: string, key: Uint8Array): Uint8Array {
    const decoded = Base64.decode(content);
    return AES.decrypt(decoded, key);
  }

  /**
   * 从Base64编码的字符串解密并返回UTF-8字符串
   * @param content Base64编码的加密内容
   * @param key 解密密钥
   * @returns 解密后的UTF-8字符串
   */
  static decryptStringFromBase64(content: string, key: Uint8Array): string {
    const decrypted = AES.decryptFromBase64(content, key);
    return UTF8.decode(decrypted);
  }
}
