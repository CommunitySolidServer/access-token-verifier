import LRUCache from "lru-cache";
import { retrieveIdDocumentTrustedOidcIssuers } from "../algorithm/retrieveWebidTrustedOidcIssuers";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "../config";
import type { RetrieveOidcIssuersFunction } from "../type";

export class IdDocumentIssuersCache extends LRUCache<string, Array<string>> {
  public constructor() {
    super({ max: maxRequestsPerSecond, maxAge: maxAgeInMilliseconds });
  }

  public async getIssuers(
    identifier: string,
  ): ReturnType<RetrieveOidcIssuersFunction> {
    const cachedValue = this.get(identifier);
    if (cachedValue === undefined) {
      const issuersValue =
        await retrieveIdDocumentTrustedOidcIssuers(identifier);
      this.set(identifier, issuersValue);
      return issuersValue;
    }
    return cachedValue;
  }
}
