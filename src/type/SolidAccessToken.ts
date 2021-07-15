import type { AsymetricCryptographicAlgorithm } from "./Crypto";

/**
 * Solid Access Token
 *
 * See also: https://solid.github.io/authentication-panel/solid-oidc/#tokens-access
 */
/* eslint-disable no-use-before-define, camelcase */
export interface SolidAccessToken {
  header: SolidAccessTokenHeader;
  payload: SolidAccessTokenPayload;
  signature: string;
}

export interface SolidAccessTokenHeader {
  kid: string;
  alg: AsymetricCryptographicAlgorithm;
}

export interface SolidAccessTokenPayload {
  aud: "solid" | string[];
  client_id?: string;
  exp: number;
  iat: number;
  iss: string;
  webid: string;
}

export interface SolidDpopBoundAccessToken {
  header: SolidAccessTokenHeader;
  payload: SolidDpopBoundAccessTokenPayload;
  signature: string;
}

export interface SolidDpopBoundAccessTokenPayload
  extends SolidAccessTokenPayload {
  cnf: { jkt: string };
}
