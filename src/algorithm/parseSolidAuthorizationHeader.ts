import { JwtStructureError } from "../error";
import type { SolidJwt } from "../type";
import { verifyAuthenticationScheme } from "./verifyAuthenticationScheme";

/**
 * Parse an authorization header used in Solid
 *
 * Verify the authorization header uses a known authentication scheme;
 * verify the token's structure and return an object representing the JWT
 * structure and the authentication scheme.
 *
 * @param authorizationHeader The authorization header used for the request.
 * @return {SolidJwt} A representation of the authorization header.
 */
export function parseSolidAuthorizationHeader(
  authorizationHeader: string
): SolidJwt {
  // Verify the authentication scheme is supported
  verifyAuthenticationScheme(authorizationHeader);

  const structure = authorizationHeader
    .replace(/^(DPoP|Bearer) +/i, "")
    .split(".");

  // Verify the JWT consists of three concatenated strings separated by dots
  if (structure.length !== 3) {
    throw new JwtStructureError(`${structure.length}`);
  }

  return {
    authenticationScheme: /^DPoP/i.test(authorizationHeader)
      ? "DPoP"
      : "Bearer",
    joseHeader: structure[0],
    jwsPayload: structure[1],
    jwsSignature: structure[2],
  };
}
