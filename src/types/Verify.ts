import type { AccessTokenPayload, RequestMethod } from ".";

export interface VerifySolidIdentityFunction {
  (
    authorizationHeader: string,
    dpopHeader: string,
    method: RequestMethod,
    url: string
  ): Promise<AccessTokenPayload>;
}
