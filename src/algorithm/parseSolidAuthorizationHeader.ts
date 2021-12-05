import { JwtStructureError } from "../error";
import type { SolidJwt } from "../type";
import { verifyAuthenticationScheme } from "./verifyAuthenticationScheme";

/**
 * Parse an authorization header used in Solid
 *
 * Verify that the authorization header uses a known authentication scheme and
 * verify that the token is composed of three segments as we currently only
 * support JWSs.
 *
 * > If the object is using the JWS Compact Serialization or the JWE Compact Serialization, the number of base64url-encoded segments separated by period ('.') characters differs for JWSs and JWEs. JWSs have three segments separated by two period ('.') characters. JWEs have five segments separated by four period ('.') characters.
 * > -- https://datatracker.ietf.org/doc/html/rfc7516#section-9
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
