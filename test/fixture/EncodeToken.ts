import { encode } from "jose/util/base64url";

export function encodeToken(token: {
  header: any;
  payload: any;
  signature: string;
}): string {
  return `${encode(JSON.stringify(token.header))}.${encode(
    JSON.stringify(token.payload)
  )}.`;
}
