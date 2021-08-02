import { decode as base64Decode } from "jose/util/base64url";
import { Base64UrlEncodedJsonDecodingError } from "../error/Base64UrlEncodedJsonDecodingError";

/**
 * Decodes Base64url encoded JSON objects
 *
 * See also: https://datatracker.ietf.org/doc/html/rfc7519#section-7.2
 *
 * @param encodedJson The base64 URL encoded JSON
 * @returns The access token as a JSON
 */
export function decodeBase64UrlEncodedJson(encodedJson: string): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(base64Decode(encodedJson)));
  } catch {
    throw new Base64UrlEncodedJsonDecodingError(encodedJson);
  }
}
