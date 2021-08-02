import type { AsymetricCryptographicAlgorithm } from "./Crypto";

/**
 * Solid Access Token
 *
 * See also: https://solid.github.io/authentication-panel/solid-oidc/#tokens-access
 */
export interface SolidAccessTokenHeader {
  kid: string;
  alg: AsymetricCryptographicAlgorithm;
}

// TODO: Phased-in client_id becomes enforced
export interface SolidAccessTokenPayload {
  aud: "solid" | string[];
  // eslint-disable-next-line camelcase
  client_id?: string;
  exp: number;
  iat: number;
  iss: string;
  webid: string;
}

export interface SolidAccessToken {
  header: SolidAccessTokenHeader;
  payload: SolidAccessTokenPayload;
  signature: string;
}

export interface SolidDpopBoundAccessTokenPayload
  extends SolidAccessTokenPayload {
  cnf: { jkt: string };
}

export interface SolidDpopBoundAccessToken {
  header: SolidAccessTokenHeader;
  payload: SolidDpopBoundAccessTokenPayload;
  signature: string;
}
