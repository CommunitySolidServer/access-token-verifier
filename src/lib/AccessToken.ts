import createRemoteJWKSet from "jose/jwks/remote";
import jwtVerify from "jose/jwt/verify";
import {
  isAccessTokenHeader,
  isAccessTokenBody,
} from "../guard/AccessTokenGuard";
import { AccessToken } from "../type/AccessToken";
import { digitalSignatureAsymetricCryptographicAlgorithm } from "../type/DPoPJWK";
import { jwksUri } from "./Issuer";
import { issuer, webID } from "./JWT";
import { oidcIssuer } from "./WebID";

function value(jwt: string): string {
  return jwt.replace(/^DPoP /, "");
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
export async function verify(jwt: string): Promise<AccessToken> {
  const issuerJwksUri = await jwksUri(
    await oidcIssuer(webID(jwt), issuer(jwt))
  );
  const JWKS = createRemoteJWKSet(new URL(issuerJwksUri));

  const { payload, protectedHeader } = await jwtVerify(value(jwt), JWKS, {
    audience: "solid",
    algorithms: Array.from(digitalSignatureAsymetricCryptographicAlgorithm),
    maxTokenAge: "86400s",
    clockTolerance: "5s",
  });

  isAccessTokenBody(payload);
  isAccessTokenHeader(protectedHeader);

  return {
    header: protectedHeader,
    payload,
    signature: jwt.split(".")[2],
  };
}
