import { HttpMethodVerificationError } from "../error";

/**
 * Verifies the DPoP proof HTTP URI
 *
 * > "htm": The HTTP method for the request to which the JWT is attached, as defined in [RFC7231] (REQUIRED).
 * > -- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-4.2
 *
 * @param method The HTTP request method
 * @param htm The DPoP proof htm parameter
 */
export function verifyHttpMethod(method: string, htm: string): void {
  if (method !== htm) {
    throw new HttpMethodVerificationError(method, htm);
  }
}
