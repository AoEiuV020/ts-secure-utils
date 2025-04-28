
export class BinString {
    static toString(data: Uint8Array): string {
        return String.fromCharCode(...data);
    }
    static toByteArray(data: string): Uint8Array {
        const arr = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
          arr[i] = data.charCodeAt(i) & 0xff; // 确保值在 0-255 范围内
        }
        return arr;
    }
}