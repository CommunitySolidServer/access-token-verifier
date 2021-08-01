import type createRemoteJWKSet from "jose/jwks/remote";
import type { RetrieveOidcIssuersFunction } from "./RetrieveOidcIssuersFunction";

export interface GetKeySetFunction {
  (iss: string): Promise<ReturnType<typeof createRemoteJWKSet>>;
}

export interface AuthenticationOptions {
  header: string;
  issuers?: RetrieveOidcIssuersFunction;
  keySet?: GetKeySetFunction;
}
