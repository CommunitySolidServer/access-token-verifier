import { DigitalSignatureAsymetricCryptographicAlgorithm } from "./DPoPJWK";
import { WebIDBearer } from "./WebIDBearer";

/**
 * DPoP Bound Access Token
 * (DPoP header.jwk.kid to match Access Token payload.cnf.jkt)
 * In the context of Solid requires a webid and client_webid claim in the payload
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
  azp: string;
  client_webid: string;
  cnf: { jkt: string };
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  sub: string;
}
