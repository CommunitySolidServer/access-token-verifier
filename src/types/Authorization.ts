import type createRemoteJWKSet from "jose/jwks/remote";

export interface GetKeySetFunction {
  (iss: URL): Promise<ReturnType<typeof createRemoteJWKSet>>;
}

export interface GetIssuersFunction {
  (webid: URL): Promise<Array<string>>;
}

export interface AuthorizationOptions {
  header: string;
  issuers?: GetIssuersFunction;
  keySet?: GetKeySetFunction;
}
