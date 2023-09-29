import { calculateJwkThumbprint } from "jose";
import { JwkThumbprintVerificationError } from "../error/JwkThumbprintVerificationError";
import type { DPoPPublicJWK } from "../type";

/**
 * Verifies the access token is bound to the DPoP public key
 *
 * > "jkt": JWK SHA-256 Thumbprint Confirmation Method.  The value of the "jkt" member MUST be the base64url encoding (as defined in [RFC7515]) of the JWK SHA-256 Thumbprint (according to [RFC7638]) of the DPoP public key (in JWK format) to which the access token is bound.
 * > -- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-6.1
 *
 * @param jwk The DPoP proof header jwk parameter
 * @param jkt The access token cnf jkt parameter
 */
export async function verifyDpopProofJwkThumbprint(
  jwk: DPoPPublicJWK,
  jkt: string,
): Promise<void> {
  // TODO find out what the unsafe assignment is about
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const actual = await calculateJwkThumbprint(jwk);
  if (actual !== jkt) {
    throw new JwkThumbprintVerificationError(actual, jkt);
  }
}
