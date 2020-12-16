import type { AccessTokenPayload, RequestMethod } from ".";

export interface VerifyIdentityFunction {
  (
    authorizationHeader: string,
    dpopHeader: string,
    method: RequestMethod,
    url: string
  ): Promise<AccessTokenPayload>;
}
