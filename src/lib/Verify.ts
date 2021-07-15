import { asserts } from "ts-guards";
import { isNotNullOrUndefined } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import type {
  SolidAccessTokenPayload,
  AuthenticationOptions,
  DPoPOptions,
  GetIssuersFunction,
  GetKeySetFunction,
  JTICheckFunction,
} from "../type";
import { verify as verifyAccessToken } from "./AccessToken";
import { verify as verifyDPoPToken } from "./DPoP";
import { keySet as getKeySet } from "./Issuer";
import { isDuplicate } from "./JTI";
import { SolidTokenVerifierError } from "./SolidTokenVerifierError";
import { issuers as getIssuers } from "./WebID";

/**
 * Verify the validity of Solid Identity Access Tokens
 * Validation based on the WebID in the access token payload
 * @param authorizationHeader
 * @param issuers
 * @param keySet
 * @param dpop
 */
export async function verify(
  authorization: AuthenticationOptions,
  dpop?: DPoPOptions
): Promise<SolidAccessTokenPayload> {
  let getIssuersFunction: GetIssuersFunction;
  if (isNotNullOrUndefined(authorization.issuers)) {
    getIssuersFunction = authorization.issuers;
  } else {
    getIssuersFunction = getIssuers;
  }

  let getKeySetFunction: GetKeySetFunction;
  if (isNotNullOrUndefined(authorization.keySet)) {
    getKeySetFunction = authorization.keySet;
  } else {
    getKeySetFunction = getKeySet;
  }

  const accessToken = await verifyAccessToken(
    authorization.header,
    getIssuersFunction,
    getKeySetFunction
  );

  if (
    authorization.header.startsWith("DPoP ") ||
    isObjectPropertyOf(accessToken.payload, "cnf")
  ) {
    try {
      asserts.isNotNullOrUndefined(dpop);
    } catch (_) {
      throw new SolidTokenVerifierError(
        "SolidIdentityDPoPError",
        "DPoP options missing for DPoP bound access token verification"
      );
    }
    let isDuplicateJTIFunction: JTICheckFunction;
    if (!isNotNullOrUndefined(dpop.isDuplicateJTI)) {
      isDuplicateJTIFunction = isDuplicate;
    } else {
      isDuplicateJTIFunction = dpop.isDuplicateJTI;
    }
    await verifyDPoPToken(
      dpop.header,
      accessToken,
      dpop.method,
      dpop.url,
      isDuplicateJTIFunction
    );
  }

  return accessToken.payload;
}
