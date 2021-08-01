import { asserts } from "ts-guards";
import { isNotNullOrUndefined } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { verifyDpopProof } from "../algorithm";
import { verifySolidAccessToken } from "../algorithm/verifySolidAccessToken";
import type {
  SolidAccessTokenPayload,
  AuthenticationOptions,
  DPoPOptions,
  JTICheckFunction,
} from "../type";
import { isDuplicate } from "./JTI";

/**
 * Verify the validity of Solid Identity Access Tokens
 * Validation based on the WebID in the access token payload
 * @param authorizationHeader
 * @param issuers
 * @param keySet
 * @param dpopOptions
 */
export async function verify(
  authorization: AuthenticationOptions,
  dpopOptions?: DPoPOptions
): Promise<SolidAccessTokenPayload> {
  const accessToken = await verifySolidAccessToken(
    authorization.header,
    authorization.issuers,
    authorization.keySet
  );

  if (
    authorization.header.startsWith("DPoP ") ||
    isObjectPropertyOf(accessToken.payload, "cnf")
  ) {
    try {
      asserts.isNotNullOrUndefined(dpopOptions);
    } catch (_) {
      throw new Error(
        "SolidIdentityDPoPError DPoP options missing for DPoP bound access token verification"
      );
    }
    let isDuplicateJTIFunction: JTICheckFunction;
    if (!isNotNullOrUndefined(dpopOptions.isDuplicateJTI)) {
      isDuplicateJTIFunction = isDuplicate;
    } else {
      isDuplicateJTIFunction = dpopOptions.isDuplicateJTI;
    }
    await verifyDpopProof(
      dpopOptions.header,
      accessToken,
      dpopOptions.method,
      dpopOptions.url,
      isDuplicateJTIFunction
    );
  }

  return accessToken.payload;
}
