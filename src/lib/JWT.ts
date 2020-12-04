import { decode as base64Decode } from "jose/util/base64url";

export function decode(x: string): string {
  return new TextDecoder().decode(base64Decode(x));
}
