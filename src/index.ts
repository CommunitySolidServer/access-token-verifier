import { SolidTokenVerifier } from "./class/SolidTokenVerifier";
import type { SolidTokenVerifierFunction } from "./type/SolidTokenVerifierFunction";

// Functions
export function createSolidTokenVerifier(): SolidTokenVerifierFunction {
  const cache = new SolidTokenVerifier();
  return cache.verify.bind(cache);
}

// Types
export type { AsymetricCryptographicAlgorithm } from "./type/AsymetricCryptographicAlgorithm";
export type { AuthenticationOptions } from "./type/AuthenticationOptions";
export type { DPoPOptions } from "./type/DPoPOptions";
export type { DPoPPublicJWK } from "./type/DPoPPublicJWK";
export type { DPoPToken } from "./type/DPoPToken";
export type { DPoPTokenHeader } from "./type/DPoPTokenHeader";
export type { DPoPTokenPayload } from "./type/DPoPTokenPayload";
export type { ECPublicJWK } from "./type/ECPublicJWK";
export type { JTICheckFunction } from "./type/JTICheckFunction";
export type { PrivateKeyProperties } from "./type/PrivateKeyProperties";
export type { RequestMethod } from "./type/RequestMethod";
export type { RetrieveIssuerKeySetFunction } from "./type/RetrieveIssuerKeySetFunction";
export type { RetrieveOidcIssuersFunction } from "./type/RetrieveOidcIssuersFunction";
export type { RSAPublicJWK } from "./type/RSAPublicJWK";
export type { SolidAccessToken } from "./type/SolidAccessToken";
export type { SolidAccessTokenHeader } from "./type/SolidAccessTokenHeader";
export type { SolidAccessTokenPayload } from "./type/SolidAccessTokenPayload";
export type { SolidAuthenticationScheme } from "./type/SolidAuthenticationScheme";
export type { SolidDpopBoundAccessToken } from "./type/SolidDpopBoundAccessToken";
export type { SolidDpopBoundAccessTokenPayload } from "./type/SolidDpopBoundAccessTokenPayload";
export type { SolidJwt } from "./type/SolidJwt";
export type { SolidTokenVerifierFunction } from "./type/SolidTokenVerifierFunction";
