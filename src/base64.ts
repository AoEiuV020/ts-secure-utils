import { fromByteArray, toByteArray } from "base64-js";

export class Base64 {
  static encode(content: Uint8Array): string {
    return fromByteArray(content);
  }

  static decode(content: string): Uint8Array {
    return toByteArray(content);
  }
}
