import { IssuerVerificationError } from "../error";
import type { SolidAccessTokenPayload } from "../type";

/**
 * Verifies the Solid access token required claims are present
 *
 * https://solid.github.io/solid-oidc/#tokens-access
 *
 * @param payload The JWT payload to verify
 */
export function verifySolidAccessTokenRequiredClaims(
  payload: unknown
): asserts payload is SolidAccessTokenPayload {
  if (!issuers.includes(iss)) {
    throw new IssuerVerificationError(issuers.toString(), iss);
  }
}
