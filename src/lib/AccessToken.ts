import createRemoteJWKSet from "jose/jwks/remote";
import jwtVerify from "jose/jwt/verify";
import {
  isAccessTokenHeader,
  isAccessTokenPayload,
} from "../guard/AccessTokenGuard";
import type { AccessToken } from "../type";
import { digitalSignatureAsymetricCryptographicAlgorithm } from "../type";
import { jwksUri } from "./Issuer";

/**
 * Remove the Bearer and DPoP prefixes from the authorization header
 * @param token
 */
function tokenValue(token: string): string {
  return token.replace(/^(DPoP|Bearer) /, "");
}

/**
 * Verify Access Token
 * - Retrieves oidc issuers jwk sets using the webID claim
 * - Signature of Access Token JWT/JWS matches a key in the remote jwks
 * - Access Token max age 1 day
 * - Claims:
 *    - audience 'aud' is solid
 *    - algorithm 'alg' is an asymetric cryptographic algorithm
 *    - expiration 'exp' is not in the past
 *    - 'iat' is not in the future
 */
export async function verify(
  authorizationHeader: string
): Promise<AccessToken> {
  const accessToken = tokenValue(authorizationHeader);
  const issuerJwksUri = await jwksUri(accessToken);
  const JWKS = createRemoteJWKSet(new URL(issuerJwksUri));

  const { payload, protectedHeader } = await jwtVerify(accessToken, JWKS, {
    audience: "solid",
    algorithms: Array.from(digitalSignatureAsymetricCryptographicAlgorithm),
    maxTokenAge: "86400s",
    clockTolerance: "5s",
  });

  isAccessTokenHeader(protectedHeader);
  isAccessTokenPayload(payload);

  return {
    header: protectedHeader,
    payload,
    signature: accessToken.split(".")[2],
  };
}
