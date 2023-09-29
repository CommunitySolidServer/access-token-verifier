import { EmbeddedJWK, jwtVerify } from "jose";
import { asserts } from "ts-guards";
import { clockToleranceInSeconds, maxAgeInMilliseconds } from "../config";
import { ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM } from "../constant/ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM";
import { isDPoPToken } from "../guard/isDPoPToken";
import { isSolidDPoPBoundAccessTokenPayload } from "../guard/isSolidDPoPBoundAccessTokenPayload";
import type {
  SolidAccessToken,
  JTICheckFunction,
  RequestMethod,
} from "../type";
import { verifyDpopProofAccessTokenHash } from "./verifyDpopProofAccessTokenHash";
import { verifyDpopProofHttpMethod } from "./verifyDpopProofHttpMethod";
import { verifyDpopProofHttpUri } from "./verifyDpopProofHttpUri";
import { verifyDpopProofJwkThumbprint } from "./verifyDpopProofJwkThumbprint";
import { verifyDpopProofJwtIdentifier } from "./verifyDpopProofJwtIdentifier";

/**
 * Verify DPoP Proof
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
export async function verifyDpopProof(
  dpopHeader: string,
  accessToken: SolidAccessToken,
  accessTokenValue: string,
  httpMethod: RequestMethod,
  uri: string,
  isDuplicateJTI?: JTICheckFunction,
): Promise<void> {
  const { payload, protectedHeader } = await jwtVerify(
    dpopHeader,
    EmbeddedJWK,
    {
      typ: "dpop+jwt",
      algorithms: Array.from(ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM),
      maxTokenAge: `${maxAgeInMilliseconds / 1000}s`,
      clockTolerance: `${clockToleranceInSeconds}s`,
    },
  );

  const dpop = {
    header: protectedHeader,
    payload,
    signature: dpopHeader.split(".")[2],
  };

  isDPoPToken(dpop);

  asserts.isObjectPropertyOf(accessToken.payload, "cnf");
  isSolidDPoPBoundAccessTokenPayload(accessToken.payload);

  await verifyDpopProofJwkThumbprint(
    dpop.header.jwk,
    accessToken.payload.cnf.jkt,
  );

  verifyDpopProofHttpMethod(httpMethod, dpop.payload.htm);

  verifyDpopProofHttpUri(uri, dpop.payload.htu);

  verifyDpopProofJwtIdentifier(dpop.payload.jti, isDuplicateJTI);

  // TODO: Phased-in ath becomes enforced
  if (typeof dpop.payload.ath === "string" && dpop.payload.ath) {
    verifyDpopProofAccessTokenHash(accessTokenValue, dpop.payload.ath);
  }
}
