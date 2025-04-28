import forge from "node-forge";
export class BinString {
  static toString(data: Uint8Array): string {
    return forge.util.binary.raw.encode(data);
  }
  static toByteArray(data: string): Uint8Array {
    return forge.util.binary.raw.decode(data);
  }
}
