import { createHash } from "crypto";
import { encode as base64UrlEncode } from "jose/util/base64url";
import { AccessTokenHashVerificationError } from "../error";

/**
 * Verifies the DPoP proof ath claim
 *
 * > "ath": hash of the access token (REQUIRED). The value MUST be the result of a base64url encoding (with no padding) the SHA-256 hash of the ASCII encoding of the associated access token's value.
 * > -- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-4.2
 *
 * @param accessToken The access token associated with the DPoP proof
 * @param ath The access token hash to match against
 */
export function verifyAccessTokenHash(accessToken: string, ath: string): void {
  if (
    base64UrlEncode(
      createHash("sha256").update(Buffer.from(accessToken, "ascii")).digest()
    ) !== ath
  ) {
    throw AccessTokenHashVerificationError;
  }
}
