import type { RequestMethod } from "./RequestMethod";
import type { SolidAccessTokenPayload } from "./SolidAccessToken";

/**
 * Solid Access Token verification function
 */
export interface JTICheckFunction {
  (jti: string): boolean;
}

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

/**
 * Solid Access Token verification errors
 */
export const solidTokenVerifierErrorCode = new Set([
  "SolidIdentityInvalidAcccessToken",
  "SolidIdentityInvalidDPoPToken",
  "SolidIdentityDPoPError",
  "SolidIdentityInvalidIssuerClaim",
  "SolidIdentityHTTPError",
  "SolidIdentityIssuerConfigError",
] as const);
export type SolidTokenVerifierErrorCode =
  typeof solidTokenVerifierErrorCode extends Set<infer T> ? T : never;
