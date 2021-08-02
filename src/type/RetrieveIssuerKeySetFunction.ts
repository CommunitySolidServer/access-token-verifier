import type createRemoteJWKSet from "jose/jwks/remote";

export interface RetrieveIssuerKeySetFunction {
  (iss: string): Promise<ReturnType<typeof createRemoteJWKSet>>;
}
