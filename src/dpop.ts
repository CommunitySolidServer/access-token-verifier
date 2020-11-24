import EmbeddedJWK from 'jose/jwk/embedded'
import jwtVerify from 'jose/jwt/verify'

import type { DPoP } from './type'
import { digitalSignatureAsymetricCryptographicAlgorithm } from './type'
import { isDPoPBody, isDPoPHeader } from './type-guard'

/**
 * Verify DPoP
 * - Signature of DPoP JWT/JWS matches the key embedded in its header
 * - DPoP max age 60 seconds
 * - Claims:
 *    - algorithm 'alg' is an asymetric cryptographic algorithm
 *    - 'iat' is not too far in the future (clockTolerance) or in the past (maxTokenAge)
 *    - 'typ' is 'dpop+jwt'
 * Note:
 * - The maxTokenAge option makes the iat claim mandatory
 * - DPoP tokens can rely on iat+maxTokenAge to be invalidated since they are specific to a request
 *   (so the exp claim which is not required in DPoP tokens' bodys is also redundant)
 */
export async function verify(jwt: string): Promise<DPoP> {
  const { payload, protectedHeader } = await jwtVerify(jwt, EmbeddedJWK, {
    typ: 'dpop+jwt',
    algorithms: Array.from(digitalSignatureAsymetricCryptographicAlgorithm),
    maxTokenAge: `6000s`,
    clockTolerance: `5s`
  })

  isDPoPBody(payload);
  isDPoPHeader(protectedHeader);

  return { header: protectedHeader, payload: payload, signature: jwt.split('.')[2] };
}
