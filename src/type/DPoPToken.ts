import type { AsymetricCryptographicAlgorithm, DPoPPublicJWK } from "./Crypto";
import type { RequestMethod } from "./RequestMethod";

/**
 * DPoP as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 */
export interface DPoPTokenHeader {
  alg: AsymetricCryptographicAlgorithm;
  jwk: DPoPPublicJWK;
  typ: "dpop+jwt";
}

// TODO: Phased-in ath becomes enforced
export interface DPoPTokenPayload {
  htm: RequestMethod;
  htu: string;
  iat: number;
  jti: string;
  ath?: string;
}

export interface DPoPToken {
  header: DPoPTokenHeader;
  payload: DPoPTokenPayload;
  signature: string;
}
