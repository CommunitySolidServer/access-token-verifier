import type createRemoteJWKSet from "jose/jwks/remote";
import LRUCache from "lru-cache";
import type { GetKeySetFunction } from "../types";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "./Defaults";
import { keySet } from "./Issuer";

export class IssuerKeySetCache extends LRUCache<
  string,
  ReturnType<typeof createRemoteJWKSet>
> {
  public constructor() {
    super({ max: maxRequestsPerSecond, maxAge: maxAgeInMilliseconds });
  }

  public async getKeySet(iss: URL): ReturnType<GetKeySetFunction> {
    const cachedValue = this.get(iss.toString());
    if (cachedValue === undefined) {
      const keySetValue = await keySet(iss);
      this.set(iss.toString(), keySetValue);
      return keySetValue;
    }
    return cachedValue;
  }
}
