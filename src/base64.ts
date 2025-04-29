import forge from "node-forge";
import { BinString } from "./bin";

export class Base64 {
  static encode(content: Uint8Array): string {
    return forge.util.encode64(BinString.toString(content));
  }

  static decode(content: string): Uint8Array {
    return BinString.toByteArray(forge.util.decode64(content));
  }
}
