import type { AsymetricCryptographicAlgorithm, DPoPPublicJWK } from "./Crypto";
import type { RequestMethod } from "./RequestMethod";

/**
 * DPoP as defined in https://tools.ietf.org/html/draft-fett-oauth-dpop-04
 */
/* eslint-disable no-use-before-define */
export interface DPoPToken {
  header: DPoPTokenHeader;
  payload: DPoPTokenPayload;
  signature: string;
}

export interface DPoPTokenHeader {
  alg: AsymetricCryptographicAlgorithm;
  jwk: DPoPPublicJWK;
  typ: "dpop+jwt";
}

export interface DPoPTokenPayload {
  htm: RequestMethod;
  htu: string;
  iat: number;
  jti: string;
}
