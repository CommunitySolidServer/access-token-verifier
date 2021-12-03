import { createHash } from "crypto";
import { base64url } from "jose";
import { AccessTokenHashVerificationError } from "../error/AccessTokenHashVerificationError";

/**
 * Verifies the DPoP proof access token hash
 *
 * > "ath": hash of the access token (REQUIRED). The value MUST be the result of a base64url encoding (with no padding) the SHA-256 hash of the ASCII encoding of the associated access token's value.
 * > -- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-4.2
 *
 * @param accessToken The value of the access token associated with the DPoP proof
 * @param ath The DPoP proof ath parameter
 */
export function verifyDpopProofAccessTokenHash(
  accessToken: string,
  ath: string
): void {
  const actual = base64url.encode(
    createHash("sha256").update(Buffer.from(accessToken, "ascii")).digest()
  );
  if (actual !== ath) {
    throw new AccessTokenHashVerificationError(actual, ath);
  }
}
