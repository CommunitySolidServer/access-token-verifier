import type createRemoteJWKSet from "jose/jwks/remote";
import LRUCache from "lru-cache";
import type { GetKeySetFunction } from "../types";
import { keySet } from "./Issuer";

export class IssuerKeySetCache extends LRUCache<
  string,
  ReturnType<typeof createRemoteJWKSet>
> {
  public constructor() {
    super({ max: 50, maxAge: 30000 });
  }

  public async getKeySet(iss: URL): ReturnType<GetKeySetFunction> {
    const cachedValue = this.get(iss.toString());
    if (cachedValue === undefined) {
      this.set(iss.toString(), await keySet(iss));
      return this.get(iss.toString());
    }
    return cachedValue;
  }
}
