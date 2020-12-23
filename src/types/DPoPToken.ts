import type { AsymetricCryptographicAlgorithm, DPoPPublicJWK } from "./DPoPJWK";
import type { RequestMethod } from "./RequestMethod";

/**
 * DPoP as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 */
export interface DPoPTokenHeader {
  alg: AsymetricCryptographicAlgorithm;
  jwk: DPoPPublicJWK;
  typ: "dpop+jwt";
}

export type DPoPTokenPayload = {
  htm: RequestMethod;
  htu: string;
  iat: number;
  jti: string;
};

export interface DPoPToken {
  header: DPoPTokenHeader;
  payload: DPoPTokenPayload;
  signature: string;
}

export interface JTICheckFunction {
  (jti: string): boolean;
}
