import { asserts } from "ts-guards";
import { RequestMethod } from "../type/RequestMethod";
import { WebIDBearer } from "../type/WebIDBearer";
import { verify as verifyAuthorization } from "./AccessToken";
import { verify as verifyDPoP } from "./DPoP";

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
): Promise<WebIDBearer> {
  const authorization = await verifyAuthorization(authorizationHeader);
  const dpop = await verifyDPoP(dpopHeader);

  // Check DPoP claims
  asserts.isLiteral(dpop.payload.htm, method);
  asserts.isLiteral(dpop.payload.htu, url);
  asserts.isLiteral(
    jtis.filter((jti) => jti === dpop.payload.jti).length === 0,
    true
  );

  // Check DPoP bound
  asserts.isLiteral(dpop.header.jwk.kid, authorization.payload.cnf.jkt);

  return { webid: authorization.payload.webid };
}
