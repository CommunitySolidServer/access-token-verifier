import type { AccessTokenPayload, RequestMethod } from ".";

export interface SolidTokenVerifierFunction {
  (
    authorizationHeader: string,
    dpopHeader: string,
    method: RequestMethod,
    url: string
  ): Promise<AccessTokenPayload>;
}
