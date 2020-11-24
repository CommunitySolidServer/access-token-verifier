import jwtVerify from 'jose/jwt/verify'
import createRemoteJWKSet from 'jose/jwks/remote'

import type { AccessToken } from './type'
import { jwks_uri } from './issuer'
import { webID } from './jwt'
import { digitalSignatureAsymetricCryptographicAlgorithm } from './type'
import { isAccessTokenBody, isAccessTokenHeader } from './type-guard'
import { oidcIssuer } from './webid'

function value(jwt: string): string {
  return jwt.replace(/^DPoP\ /, "");
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
    // TODO: Support multi oidc issuers
    const issuerJwksUri = await jwks_uri((await oidcIssuer(webID(jwt)))[0]);
    const JWKS = createRemoteJWKSet(new URL(issuerJwksUri));

    const { payload, protectedHeader } = await jwtVerify(value(jwt), JWKS, {
      audience: 'solid',
      algorithms: Array.from(digitalSignatureAsymetricCryptographicAlgorithm),
      maxTokenAge: '86400s',
      clockTolerance: '5s'
    });

    isAccessTokenBody(payload);
    isAccessTokenHeader(protectedHeader);
  
    return { header: protectedHeader, payload: payload, signature: jwt.split('.')[2] };
}
