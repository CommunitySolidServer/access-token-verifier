import jwtVerify from "jose/jwt/verify";
import { isAccessToken, isAccessTokenPayload } from "../guards";
import type {
  AccessToken,
  GetIssuersFunction,
  GetKeySetFunction,
} from "../types";
import { asymetricCryptographicAlgorithm } from "../types";
import {
  clockToleranceInSeconds,
  maxAccessTokenAgeInSeconds,
} from "./Defaults";
import { decode } from "./JWT";
import { SolidTokenVerifierError } from "./SolidTokenVerifierError";

/**
 * Remove the Bearer and DPoP prefixes from the authorization header
 * @param token
 */
function value(token: string): string {
  return token.replace(/^(DPoP|Bearer) /, "");
}

/**
 * URL Claims
 * Restricts to HTTPS, TODO: Check if we can restrict to HTTP over TLS if/when in the future
 */
function urlClaim(type: string, claim: string): URL {
  const url = new URL(claim);

  if (
    url.protocol !== "https:" &&
    !url.toString().startsWith("http://localhost:")
  ) {
    throw new TypeError(
      `Verifiable URL claim ${type} needs to use the https protocol.`
    );
  }

  return url;
}

/**
 * Checks the access token structure and its WebID and Issuer claims
 */
function verifiableClaims(token: string): { iss: URL; webid: URL } {
  const tokenPayload: unknown = JSON.parse(decode(token.split(".")[1]));

  isAccessTokenPayload(tokenPayload);

  return {
    iss: urlClaim("issuer", tokenPayload.iss),
    webid: urlClaim("web_id", tokenPayload.webid),
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
export async function verify(
  authorizationHeader: string,
  issuers: GetIssuersFunction,
  keySet: GetKeySetFunction,
  maxAccessTokenAge = maxAccessTokenAgeInSeconds
): Promise<AccessToken> {
  // Get JWT value for either DPoP or Bearer tokens
  const token = value(authorizationHeader);

  // Extract webid and issuer claims as URLs from valid Access token payload
  const { iss, webid } = verifiableClaims(token);

  // Check issuer claim against WebID issuers
  if (!(await issuers(webid)).includes(iss.toString())) {
    throw new SolidTokenVerifierError(
      "SolidIdentityInvalidIssuerClaim",
      `Incorrect issuer ${iss.toString()} for WebID ${webid.toString()}`
    );
  }

  // Check token against issuer's key set
  const { payload, protectedHeader } = await jwtVerify(
    token,
    await keySet(iss),
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
    signature: token.split(".")[2],
  };

  isAccessToken(accessToken);

  return accessToken;
}
