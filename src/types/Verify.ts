import type { AccessTokenPayload, DPoPOptions } from ".";

export interface SolidTokenVerifierFunction {
  (
    authorizationHeader: string,
    dpop?: DPoPOptions
  ): Promise<AccessTokenPayload>;
}
