import EmbeddedJWK from "jose/jwk/embedded";
import calculateThumbprint from "jose/jwk/thumbprint";
import jwtVerify from "jose/jwt/verify";
import { asserts } from "ts-guards";
import { isValidAthClaim } from "../algorithm";
import { isSolidDPoPBoundAccessTokenPayload, isDPoPToken } from "../guard";
import type {
  SolidAccessToken,
  DPoPToken,
  JTICheckFunction,
  RequestMethod,
} from "../type";
import { asymetricCryptographicAlgorithm } from "../type";
import { clockToleranceInSeconds, maxAgeInMilliseconds } from "./Defaults";

async function isValidProof(
  accessToken: SolidAccessToken,
  dpop: DPoPToken,
  method: RequestMethod,
  url: string,
  isDuplicateJTI: JTICheckFunction
): Promise<void> {
  asserts.isObjectPropertyOf(accessToken.payload, "cnf");
  isSolidDPoPBoundAccessTokenPayload(accessToken.payload);

  /*
   * Check DPoP is bound to the access token
   * The value in "jkt" MUST be the base64url encoding [RFC7515] of the
   * JWK SHA-256 Thumbprint (according to [RFC7638]) of the public key to
   * which the access token is bound.
   * https://tools.ietf.org/html/draft-fett-oauth-dpop-04#section-7
   */
  asserts.isLiteral(
    await calculateThumbprint(dpop.header.jwk),
    accessToken.payload.cnf.jkt
  );

  // Check DPoP Token claims method, url and unique token id
  asserts.isLiteral(dpop.payload.htm, method);
  asserts.isLiteral(dpop.payload.htu, url);
  asserts.isLiteral(isDuplicateJTI(dpop.payload.jti), false);

  // TODO: Phased-in ath becomes enforced
  if (typeof dpop.payload.ath === "string" && dpop.payload.ath) {
    asserts.isLiteral(
      isValidAthClaim(JSON.stringify(accessToken), dpop.payload.ath),
      true
    );
  }
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
  accessToken: SolidAccessToken,
  method: RequestMethod,
  url: string,
  isDuplicateJTI: JTICheckFunction
): Promise<DPoPToken> {
  const { payload, protectedHeader } = await jwtVerify(
    dpopHeader,
    EmbeddedJWK,
    {
      typ: "dpop+jwt",
      algorithms: Array.from(asymetricCryptographicAlgorithm),
      maxTokenAge: `${maxAgeInMilliseconds / 1000}s`,
      clockTolerance: `${clockToleranceInSeconds}s`,
    }
  );

  const dpop = {
    header: protectedHeader,
    payload,
    signature: dpopHeader.split(".")[2],
  };

  isDPoPToken(dpop);

  await isValidProof(accessToken, dpop, method, url, isDuplicateJTI);

  return dpop;
}
