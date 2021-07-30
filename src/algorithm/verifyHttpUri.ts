import { HttpUriVerificationError } from "../error";

/**
 * Verifies the DPoP proof HTTP URI
 *
 * > "htu": The HTTP URI used for the request, without query and fragment parts (REQUIRED).
 * > -- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-4.2
 *
 * @param uri The requested resource URI
 * @param htu The HTTP URI to match against
 */
export function verifyHttpUri(uri: string, htu: string): void {
  if (uri.split("?")[0].split("#")[0] !== htu) {
    throw HttpUriVerificationError;
  }
}
