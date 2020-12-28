import type { AsymetricCryptographicAlgorithm } from "./DPoPJWK";

/**
 * Solid DPoP Bound Access Token
 *
 * See also: https://solid.github.io/authentication-panel/solid-oidc/#tokens-access
 */
export interface AccessTokenHeader {
  kid: string;
  alg: AsymetricCryptographicAlgorithm;
}

export interface AccessTokenPayload {
  aud: "solid";
  client_id: string;
  cnf?: { jkt: string };
  exp: number;
  iat: number;
  iss: string;
  webid: string;
}

export interface AccessToken {
  header: AccessTokenHeader;
  payload: AccessTokenPayload;
  signature: string;
}

export interface DPoPBoundAccessTokenPayload extends AccessTokenPayload {
  cnf: { jkt: string };
}

export interface DPoPBoundAccessToken {
  header: AccessTokenHeader;
  payload: DPoPBoundAccessTokenPayload;
  signature: string;
}
