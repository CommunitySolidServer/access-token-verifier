import { asserts } from "ts-guards";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { verifyDpopProof } from "../algorithm";
import { verifySolidAccessToken } from "../algorithm/verifySolidAccessToken";
import type {
  SolidAccessTokenPayload,
  AuthenticationOptions,
  DPoPOptions,
} from "../type";

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
  // Get JWT value for either DPoP or Bearer tokens
  const accessToken = await verifySolidAccessToken(
    authorization.header.replace(/^(DPoP|Bearer) /, ""),
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

    await verifyDpopProof(
      dpopOptions.header,
      accessToken,
      dpopOptions.method,
      dpopOptions.url,
      dpopOptions.isDuplicateJTI
    );
  }

  return accessToken.payload;
}
