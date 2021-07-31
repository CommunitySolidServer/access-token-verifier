import { JwtTokenIdentifierVerificationError } from "../error";
import type { JTICheckFunction } from "../type";

/**
 * Verifies the DPoP proof identifier is unique
 *
 * > "jti": Unique identifier for the DPoP proof JWT (REQUIRED). The value MUST be assigned such that there is a negligible probability that the same value will be assigned to any other DPoP proof used in the same context during the time window of validity. Such uniqueness can be accomplished by encoding (base64url or any other suitable encoding) at least 96 bits of pseudorandom data or by using a version 4 UUID string according to [RFC4122]. The "jti" can be used by the server for replay detection and prevention, see Section 8.1.
 * > -- https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-4.2
 *
 * Storing JTIs is not the purpose of this library, hence it requires a function to match previously used identifiers.
 *
 * @param isDuplicateJTI The function used to match previously used identifiers
 * @param jti The DPoP proof jti parameter
 */
export function verifyJwtTokenIdentifier(
  isDuplicateJTI: JTICheckFunction,
  jti: string
): void {
  if (isDuplicateJTI(jti)) {
    throw new JwtTokenIdentifierVerificationError(jti);
  }
}
