import { TextDecoder } from 'util';
import { decode as base64Decode } from 'jose/util/base64url';

export function webID(jwt: string): string {
    return JSON.parse(new TextDecoder().decode(base64Decode(jwt.split('.')[1]))).webid;
}
