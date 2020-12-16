import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import type {
  AccessTokenPayload,
  GetIssuersFunction,
  GetKeySetFunction,
  JTICheckFunction,
  RequestMethod,
} from "../types";
import { verify as verifyAuthorizationToken } from "./AccessToken";
import { verify as verifyDPoPToken } from "./DPoP";
import { keySet as getKeySet } from "./Issuer";
import { issuers as getIssuers } from "./WebID";

/**
 * Verify the validity of Solid Identity Access Tokens
 * Validation based on the WebID in the access token payload
 * @param authorizationHeader
 * @param dpopHeader
 * @param method
 * @param url
 * @param issuers
 * @param keySet
 * @param isDuplicateJTI
 */
export async function verify(
  authorizationHeader: string,
  dpopHeader: string,
  method: RequestMethod,
  url: string,
  issuers: GetIssuersFunction = getIssuers,
  keySet: GetKeySetFunction = getKeySet,
  isDuplicateJTI: JTICheckFunction = () => false
): Promise<AccessTokenPayload> {
  const accessToken = await verifyAuthorizationToken(
    authorizationHeader,
    issuers,
    keySet
  );

  if (
    isObjectPropertyOf(accessToken.payload, "cnf") ||
    authorizationHeader.startsWith("DPoP ")
  ) {
    await verifyDPoPToken(dpopHeader, accessToken, method, url, isDuplicateJTI);
  }

  return accessToken.payload;
}
