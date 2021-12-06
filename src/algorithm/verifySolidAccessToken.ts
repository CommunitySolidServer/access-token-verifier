import { jwtVerify } from "jose";
import { asserts } from "ts-guards";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { clockToleranceInSeconds, maxAccessTokenAgeInSeconds } from "../config";
import { ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM } from "../constant/ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM";
import { isSolidAccessToken } from "../guard/isSolidAccessToken";
import type {
  SolidAccessTokenPayload,
  AuthenticationOptions,
  DPoPOptions,
} from "../type";
import { decodeBase64UrlEncodedJson } from "./decodeBase64UrlEncodedJson";
import { parseSolidAuthorizationHeader } from "./parseSolidAuthorizationHeader";
import { retrieveAccessTokenIssuerKeySet } from "./retrieveAccessTokenIssuerKeySet";
import { retrieveWebidTrustedOidcIssuers } from "./retrieveWebidTrustedOidcIssuers";
import { verifyDpopProof } from "./verifyDpopProof";
import { verifySecureUriClaim } from "./verifySecureUriClaim";
import { verifySolidAccessTokenIssuer } from "./verifySolidAccessTokenIssuer";
import { verifySolidAccessTokenRequiredClaims } from "./verifySolidAccessTokenRequiredClaims";

/**
 * Verify Solid access token
 *
 * @param authorization The authorization header and optional key and trusted issuer retrieval functions
 * @param dpopOptions The DPoP proof header and associated verifiable claims
 * @returns Access token payload
 */
export async function verifySolidAccessToken(
  authorization: AuthenticationOptions,
  dpopOptions?: DPoPOptions
): Promise<SolidAccessTokenPayload> {
  const solidJwt = parseSolidAuthorizationHeader(authorization.header);

  // Decode Solid access token payload
  const accessTokenPayload: unknown = decodeBase64UrlEncodedJson(
    solidJwt.jwsPayload
  );

  // Verify the Solid access token includes all required claims
  verifySolidAccessTokenRequiredClaims(accessTokenPayload);

  // Check WebID claim is a secure URI
  verifySecureUriClaim(accessTokenPayload.webid, "webid");

  // Check Issuer claim is a secure URI
  verifySecureUriClaim(accessTokenPayload.iss, "iss");

  // Retrieve the issuers listed in the WebID
  const issuers = await retrieveWebidTrustedOidcIssuers(
    accessTokenPayload.webid,
    authorization.issuers
  );

  // Check the issuer claim matches one of the WebID's trusted issuers
  verifySolidAccessTokenIssuer(issuers, accessTokenPayload.iss);

  /**
   * Verify Access Token
   * - Signature of Access Token JWT/JWS matches a key in the remote jwks
   * - Access Token max age 1 day
   * - Claims:
   *    - audience 'aud' is solid
   *    - algorithm 'alg' is an asymetric cryptographic algorithm
   *    - expiration 'exp' is not in the past
   *    - 'iat' is not in the future
   */
  const { payload, protectedHeader } = await jwtVerify(
    solidJwt.value,
    await retrieveAccessTokenIssuerKeySet(
      accessTokenPayload.iss,
      authorization.keySet
    ),
    {
      audience: "solid",
      algorithms: Array.from(ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM),
      maxTokenAge: `${maxAccessTokenAgeInSeconds}s`,
      clockTolerance: `${clockToleranceInSeconds}s`,
    }
  );

  // Get JWT value for either DPoP or Bearer tokens
  const accessToken = {
    header: protectedHeader,
    payload,
    signature: solidJwt.jwsSignature,
  };

  isSolidAccessToken(accessToken);

  if (
    solidJwt.authenticationScheme === "DPoP" ||
    isObjectPropertyOf(accessToken.payload, "cnf")
  ) {
    try {
      asserts.isNotNullOrUndefined(dpopOptions);
    } catch (_) {
      throw new Error(
        "SolidIdentityDPoPError DPoP options missing for DPoP bound access token verification"
      );
    }

    await verifyDpopProof(
      dpopOptions.header,
      accessToken,
      solidJwt.value,
      dpopOptions.method,
      dpopOptions.url,
      dpopOptions.isDuplicateJTI
    );
  }

  return accessToken.payload;
}
