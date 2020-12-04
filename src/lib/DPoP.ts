import EmbeddedJWK from "jose/jwk/embedded";
import jwtVerify from "jose/jwt/verify";
import { asserts } from "ts-guards";
import { isDPoPBoundAccessTokenPayload } from "../guard/AccessTokenGuard";
import { isDPoPTokenHeader, isDPoPTokenBody } from "../guard/DPoPTokenGuard";
import type { AccessToken, DPoPToken, RequestMethod } from "../type";
import { digitalSignatureAsymetricCryptographicAlgorithm } from "../type";

function isValidProof(
  accessToken: AccessToken,
  dpop: DPoPToken,
  method: RequestMethod,
  url: string,
  jtis: Array<string>
) {
  asserts.isObjectPropertyOf(accessToken.payload, "cnf");
  isDPoPBoundAccessTokenPayload(accessToken.payload);

  // Check DPoP is bound to the access token
  asserts.isLiteral(dpop.header.jwk.kid, accessToken.payload.cnf.jkt);

  // Check DPoP Token claims method, url and unique token id
  asserts.isLiteral(dpop.payload.htm, method);
  asserts.isLiteral(dpop.payload.htu, url);
  asserts.isLiteral(
    jtis.filter((jti) => jti === dpop.payload.jti).length === 0,
    true
  );
}

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
export async function verify(
  dpopHeader: string,
  accessToken: AccessToken,
  method: RequestMethod,
  url: string,
  jtis: Array<string>
): Promise<DPoPToken> {
  const { payload, protectedHeader } = await jwtVerify(
    dpopHeader,
    EmbeddedJWK,
    {
      typ: "dpop+jwt",
      algorithms: Array.from(digitalSignatureAsymetricCryptographicAlgorithm),
      maxTokenAge: `60s`,
      clockTolerance: `5s`,
    }
  );

  isDPoPTokenBody(payload);
  isDPoPTokenHeader(protectedHeader);

  const dpop = {
    header: protectedHeader,
    payload,
    signature: dpopHeader.split(".")[2],
  };

  isValidProof(accessToken, dpop, method, url, jtis);

  return dpop;
}
