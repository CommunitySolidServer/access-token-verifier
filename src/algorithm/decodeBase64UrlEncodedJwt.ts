import { decode as base64Decode } from "jose/util/base64url";
import { AccessTokenDecodingError } from "../error/AccessTokenDecodingError";

/**
 * Decodes Base64url encoded JWTs
 *
 * See also: https://datatracker.ietf.org/doc/html/rfc7519#section-7.2
 *
 * @param jwt The base64 URL encoded JWT
 * @returns The access token as a JWT
 */
export function decodeBase64UrlEncodedJwt(jwt: string): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(base64Decode(jwt)));
  } catch {
    throw new AccessTokenDecodingError(jwt);
  }
}
