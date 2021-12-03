import { base64url } from "jose";

export function encodeToken(token: {
  header: unknown;
  payload: unknown;
  signature: string;
}): string {
  const encodedHeader = base64url.encode(JSON.stringify(token.header));
  const encodedPayload = base64url.encode(JSON.stringify(token.payload));
  return `${encodedHeader}.${encodedPayload}.${token.signature}`;
}
