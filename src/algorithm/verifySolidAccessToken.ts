import jwtVerify from "jose/jwt/verify";
import { isSolidAccessToken } from "../guard";
import {
  clockToleranceInSeconds,
  maxAccessTokenAgeInSeconds,
} from "../config";
import type {
  SolidAccessToken,
  RetrieveIssuerKeySetFunction,
  RetrieveOidcIssuersFunction,
} from "../type";
import { asymetricCryptographicAlgorithm } from "../type";
import { decodeBase64UrlEncodedJson } from "./decodeBase64UrlEncodedJson";
import { retrieveAccessTokenIssuerKeySet } from "./retrieveAccessTokenIssuerKeySet";
import { retrieveWebidTrustedOidcIssuers } from "./retrieveWebidTrustedOidcIssuers";
import { verifySecureUriClaim } from "./verifySecureUriClaim";
import { verifySolidAccessTokenIssuer } from "./verifySolidAccessTokenIssuer";
import { verifySolidAccessTokenRequiredClaims } from "./verifySolidAccessTokenRequiredClaims";

/**
 * Verify Access Token
 * - Retrieves identity issuers jwk sets using the webID claim
 * - Signature of Access Token JWT/JWS matches a key in the remote jwks
 * - Access Token max age 1 day
 * - Claims:
 *    - audience 'aud' is solid
 *    - algorithm 'alg' is an asymetric cryptographic algorithm
 *    - expiration 'exp' is not in the past
 *    - 'iat' is not in the future
 */
export async function verifySolidAccessToken(
  accessTokenValue: string,
  getIssuers?: RetrieveOidcIssuersFunction,
  getKeySet?: RetrieveIssuerKeySetFunction,
  maxAccessTokenAge = maxAccessTokenAgeInSeconds
): Promise<SolidAccessToken> {
  // Decode Solid access token payload
  const accessTokenPayload: unknown = decodeBase64UrlEncodedJson(
    accessTokenValue.split(".")[1]
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
    getIssuers
  );

  // Check the issuer claim matches one of the WebID's trusted issuers
  verifySolidAccessTokenIssuer(issuers, accessTokenPayload.iss);

  // Check token against issuer's key set TODO: get key set
  const { payload, protectedHeader } = await jwtVerify(
    accessTokenValue,
    await retrieveAccessTokenIssuerKeySet(accessTokenPayload.iss),
    {
      audience: "solid",
      algorithms: Array.from(asymetricCryptographicAlgorithm),
      maxTokenAge: `${maxAccessTokenAge}s`,
      clockTolerance: `${clockToleranceInSeconds}s`,
    }
  );

  const accessToken = {
    header: protectedHeader,
    payload,
    signature: accessTokenValue.split(".")[2],
  };

  isSolidAccessToken(accessToken);

  return accessToken;
}
