import { DigitalSignatureAsymetricCryptographicAlgorithm } from "./DPoPJWK";
import { WebIDBearer } from "./WebIDBearer";

/**
 * Solid DPoP Bound Access Token
 * 
 * See also: https://solid.github.io/authentication-panel/solid-oidc/#tokens-access
 */
export interface AccessToken {
  header: AccessTokenHeader;
  payload: AccessTokenPayload;
  signature: string;
}

export interface AccessTokenHeader {
  kid: string;
  alg: DigitalSignatureAsymetricCryptographicAlgorithm;
}

export interface AccessTokenPayload extends WebIDBearer {
  aud: "solid";
  client_id: string;
  cnf: { jkt: string };
  exp: number;
  iat: number;
  iss: string;
  jti?: string;
  sub?: string;
}

// TODO: Remove
export interface LegacyAccessTokenPayload {
  cnf: { jkt: string };
  exp: number;
  iat: number;
  iss: string;
  sub?: string;
  webid?: string;
}
