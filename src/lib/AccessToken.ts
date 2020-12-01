import createRemoteJWKSet from "jose/jwks/remote";
import jwtVerify from "jose/jwt/verify";
import { InvalidSolidDPoPAcccessToken } from '../error/InvalidSolidDPoPAcccessToken'

import {
  isAccessTokenHeader,
  isAccessTokenPayload,
  isLegacyAccessTokenPayload,
} from "../guard/AccessTokenGuard";
import type { AccessToken, AccessTokenPayload } from "../type/AccessToken";
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

  // TODO: Remove legacy non-compliant token support
  try {
    isAccessTokenHeader(protectedHeader);
    try {
      isAccessTokenPayload(payload);
    }
    catch (e: unknown) {
      isLegacyAccessTokenPayload(payload);
    }
  } catch (e: unknown) {
    throw new InvalidSolidDPoPAcccessToken();
  }

  return {
    header: protectedHeader,
    payload: (payload as AccessTokenPayload),
    signature: jwt.split(".")[2],
  };
}
