import type { JTICheckFunction } from "./JTICheckFunction";
import type { RequestMethod } from "./RequestMethod";
import type { SolidAccessTokenPayload } from "./SolidAccessToken";

/**
 * Solid Access Token verification function
 */
export interface DPoPOptions {
  header: string;
  method: RequestMethod;
  url: string;
  isDuplicateJTI?: JTICheckFunction;
}

export interface SolidTokenVerifierFunction {
  (
    authorizationHeader: string,
    dpop?: DPoPOptions
  ): Promise<SolidAccessTokenPayload>;
}
