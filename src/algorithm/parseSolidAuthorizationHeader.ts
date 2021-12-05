import { SolidAuthorizationHeaderParsingError } from "../error";
import type { SolidJwt } from "../type";
import { verifyAuthenticationScheme } from "./verifyAuthenticationScheme";
import { verifyJwtSegments } from "./verifyJwtSegments";

/**
 * Parse an authorization header used in Solid
 *
 * @param authorizationHeader The authorization header used for the request.
 * @return {SolidJwt} A representation of the authorization header.
 */
export function parseSolidAuthorizationHeader(
  authorizationHeader: string
): SolidJwt {
  const [match, joseHeader, jwsPayload, jwsSignature] =
    /^(?:DPoP|Bearer) +(\w+)\.(\w+)\.(\w+)$/i.exec(authorizationHeader) ?? [];

  if (!match) {
    // Verify the authentication scheme is supported
    verifyAuthenticationScheme(authorizationHeader);

    // Verify the token is composed of the right number of segments
    verifyJwtSegments(authorizationHeader);

    throw new SolidAuthorizationHeaderParsingError(authorizationHeader);
  }

  return {
    authenticationScheme: /^DPoP/i.test(authorizationHeader)
      ? "DPoP"
      : "Bearer",
    joseHeader,
    jwsPayload,
    jwsSignature,
  };
}
