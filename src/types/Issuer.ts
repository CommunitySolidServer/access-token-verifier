import type createRemoteJWKSet from "jose/jwks/remote";

export interface GetKeySetFunction {
  (iss: URL): Promise<ReturnType<typeof createRemoteJWKSet>>;
}
