import forge from "node-forge";
import { BinString } from "./bin";

/**
 * 字符串转字节数组，
 * 
 */
export class UTF8 {
    static decode(content: Uint8Array): string {
        return forge.util.decodeUtf8(BinString.toString(content));
    }
    
    static encode(content: string): Uint8Array {
        return BinString.toByteArray(forge.util.encodeUtf8(content));
    }
}