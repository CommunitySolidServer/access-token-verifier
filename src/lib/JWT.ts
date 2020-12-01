import { decode as base64Decode } from "jose/util/base64url";
import type { AccessTokenPayload } from "../type/AccessToken";

export function decode(x: string): string {
  return new TextDecoder().decode(base64Decode(x));
}

export function issuer(jwt: string): string {
  return (JSON.parse(decode(jwt.split(".")[1])) as AccessTokenPayload).iss;
}

export function webID(jwt: string): string {
  const accessTokenBody = JSON.parse(decode(jwt.split(".")[1]));

  // TODO: Remove legacy token support
  if (accessTokenBody.webid === undefined) {
    return accessTokenBody.sub;
  }

  return accessTokenBody.webid;
}
