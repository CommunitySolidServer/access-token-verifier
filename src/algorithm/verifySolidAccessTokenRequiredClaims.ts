import { RequiredClaimVerificationError } from "../error/RequiredClaimVerificationError";
import { isNotNullObject } from "../guard/isNotNullObject";
import { isObjectPropertyOf } from "../guard/isObjectPropertyOf";
import type { SolidAccessTokenPayload } from "../type";

/**
 * Verifies the Solid access token required claims are present
 *
 * > The DPoP-bound Access Token payload MUST contain these claims:
 * > - webid — The WebID claim MUST be the user’s WebID.
 * > - iss — The issuer claim MUST be a valid URL of the IdP instantiating this token.
 * > - aud — The audience claim MUST either be the string solid or be an array of values, one of which is the string solid. In the decentralized world of Solid OIDC, the principal of an access token is not a specific endpoint, but rather the Solid API; that is, any Solid server at any accessible address on the world wide web. See also: JSON Web Token (JWT) §section-4.1.3.
 * > - iat — The issued-at claim is the time at which the DPoP-bound Access Token was issued.
 * > - exp — The expiration claim is the time at which the DPoP-bound Access Token becomes invalid.
 * > - cnf — The confirmation claim is used to identify the DPoP Public Key bound to the Access Token. See also: OAuth 2.0 Demonstration of Proof-of-Possession at the Application Layer (DPoP) §section-7.
 * > - client_id - The ClientID claim is used to identify the client. See also: section 5. Client Identifiers.
 * > -- https://solid.github.io/solid-oidc/#tokens-access
 *
 * @param payload The JWT payload to verify
 */
export function verifySolidAccessTokenRequiredClaims(
  payload: unknown,
): asserts payload is SolidAccessTokenPayload {
  if (!isNotNullObject(payload)) {
    throw new RequiredClaimVerificationError(
      JSON.stringify(payload),
      "Non null object",
    );
  }
  if (!isObjectPropertyOf(payload, "webid")) {
    throw new RequiredClaimVerificationError(JSON.stringify(payload), "webid");
  }
  if (!isObjectPropertyOf(payload, "iss")) {
    throw new RequiredClaimVerificationError(JSON.stringify(payload), "iss");
  }
  if (!isObjectPropertyOf(payload, "aud")) {
    throw new RequiredClaimVerificationError(JSON.stringify(payload), "aud");
  }
  if (!isObjectPropertyOf(payload, "iat")) {
    throw new RequiredClaimVerificationError(JSON.stringify(payload), "iat");
  }
  if (!isObjectPropertyOf(payload, "exp")) {
    throw new RequiredClaimVerificationError(JSON.stringify(payload), "exp");
  }
  // TODO: Enforce client_id and cnf claims when widespread enough
  /*
   * if (!("cnf" in payload) || !("jkt" in (payload as any)?.cnf)) {
   *   throw new RequiredClaimVerificationError(
   *     JSON.stringify(payload),
   *     "cnf > jkt"
   *   );
   * }
   * if (!("client_id" in payload)) {
   *   throw new RequiredClaimVerificationError(JSON.stringify(payload), "exp");
   * }
   */
}
