import { encode } from "jose/util/base64url";

export function encodeToken(token: {
  header: unknown;
  payload: unknown;
  signature: string;
}): string {
  return `${encode(JSON.stringify(token.header))}.${encode(
    JSON.stringify(token.payload)
  )}.${token.signature}`;
}
