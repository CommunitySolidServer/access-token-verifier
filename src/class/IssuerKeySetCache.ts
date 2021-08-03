import type createRemoteJWKSet from "jose/jwks/remote";
import LRUCache from "lru-cache";
import { retrieveAccessTokenIssuerKeySet } from "../algorithm/retrieveAccessTokenIssuerKeySet";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "../config";
import type { RetrieveIssuerKeySetFunction } from "../type";

export class IssuerKeySetCache extends LRUCache<
  string,
  ReturnType<typeof createRemoteJWKSet>
> {
  public constructor() {
    super({ max: maxRequestsPerSecond, maxAge: maxAgeInMilliseconds });
  }

  public async getKeySet(
    iss: string
  ): ReturnType<RetrieveIssuerKeySetFunction> {
    const cachedValue = this.get(iss.toString());
    if (cachedValue === undefined) {
      const keySetValue = await retrieveAccessTokenIssuerKeySet(iss);
      this.set(iss.toString(), keySetValue);
      return keySetValue;
    }
    return cachedValue;
  }
}
