import jwtVerify from "jose/jwt/verify";
import { decode as base64Decode } from "jose/util/base64url";
import { isSolidAccessToken, isSolidAccessTokenPayload } from "../guard";
import {
  clockToleranceInSeconds,
  maxAccessTokenAgeInSeconds,
} from "../lib/Defaults";
import type {
  SolidAccessToken,
  GetKeySetFunction,
  RetrieveOidcIssuersFunction,
} from "../type";
import { asymetricCryptographicAlgorithm } from "../type";
import { decodeBase64UrlEncodedJwt } from "./decodeBase64UrlEncodedJwt";
import { retrieveOidcIssuers } from "./retrieveOidcIssuers";
import { verifySecureUriClaim } from "./verifySecureUriClaim";
import { verifySolidAccessTokenIssuer } from "./verifySolidAccessTokenIssuer";

/**
 * Checks the access token structure and its WebID and Issuer claims
 */
function verifiableClaims(token: string): { iss: string; webid: string } {
  const tokenPayload: unknown = decodeBase64UrlEncodedJwt(token.split(".")[1]);

  isSolidAccessTokenPayload(tokenPayload);

  return {
    iss: tokenPayload.iss,
    webid: tokenPayload.webid,
  };
}

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
  getKeySet?: GetKeySetFunction,
  maxAccessTokenAge = maxAccessTokenAgeInSeconds
): Promise<SolidAccessToken> {
  // Decode Solid access token payload
  const jwt: unknown = decodeBase64UrlEncodedJwt(
    accessTokenValue.split(".")[1]
  );

  // Verify the Solid access token includes all required claims
  verifySolidAccessTokenClaims(jwt);

  // Extract webid and issuer claims as URLs from valid Access token payload
  const { iss, webid } = verifiableClaims(accessTokenValue);

  // Check WebID claim is a secure URI
  verifySecureUriClaim(webid, "webid");

  // Retrieve the issuers listed in the WebID
  const issuers = await retrieveOidcIssuers(webid, getIssuers);

  // Check the issuer claim matches one of the WebID's trusted issuers
  verifySolidAccessTokenIssuer(issuers, iss);

  // Check Issuer claim is a secure URI
  verifySecureUriClaim(iss, "iss");

  // Check token against issuer's key set TODO: get key set
  const { payload, protectedHeader } = await jwtVerify(
    accessTokenValue,
    await getKeySet(iss),
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
