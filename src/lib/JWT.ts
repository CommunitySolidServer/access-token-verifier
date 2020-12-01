import { decode as base64Decode } from "jose/util/base64url";
import { AccessTokenPayload } from "../type/AccessToken";

function decode(x: string): string {
  return new TextDecoder().decode(base64Decode(x));
}

export function issuer(jwt: string): string {
  return (JSON.parse(decode(jwt.split(".")[1])) as AccessTokenPayload).iss;
}

export function webID(jwt: string): string {
  return (JSON.parse(decode(jwt.split(".")[1])) as AccessTokenPayload).webid;
}
