export class Base64 {
  static encode(content: Uint8Array): string {
    return Buffer.from(content).toString("base64");
  }

  static decode(content: string): Uint8Array {
    return new Uint8Array(Buffer.from(content, "base64"));
  }
}
