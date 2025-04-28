import forge from "node-forge";

export class Base64 {
  static encode(content: Uint8Array): string {
    return forge.util.encode64(forge.util.binary.raw.encode(content));
  }

  static decode(content: string): Uint8Array {
    return forge.util.binary.raw.decode(forge.util.decode64(content));
  }
}
