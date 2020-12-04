import type { AccessTokenPayload, RequestMethod } from "../type";
import { verify as verifyAuthorizationToken } from "./AccessToken";
import { verify as verifyDPoPToken } from "./DPoP";

/**
 * Verifies the validity of a DPoP bound access token
 * Validation based on the webid in the access token payload
 * @param authorizationHeader
 * @param dpopHeader
 * @param method
 * @param url
 * @param jtis
 */
export async function verify(
  authorizationHeader: string,
  dpopHeader: string,
  method: RequestMethod,
  url: string,
  jtis: Array<string> = []
): Promise<AccessTokenPayload> {
  const accessToken = await verifyAuthorizationToken(authorizationHeader);

  if (authorizationHeader.startsWith("DPoP ")) {
    await verifyDPoPToken(dpopHeader, accessToken, method, url, jtis);
  }

  return accessToken.payload;
}
