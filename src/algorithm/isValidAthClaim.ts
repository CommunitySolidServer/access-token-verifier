import { createHash } from "crypto";
import { encode as base64UrlEncode } from "jose/util/base64url";

/**
 * Verifies the DPoP Proof ath claim
 * The base64url encoded SHA-256 hash of the ASCII encoding of the associated access token's value.
 * See also: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-4.2
 */
export function isValidAthClaim(
  accessToken: string,
  athClaim: string
): boolean {
  return (
    base64UrlEncode(
      createHash("sha256").update(Buffer.from(accessToken, "ascii")).digest()
    ) === athClaim
  );
}
