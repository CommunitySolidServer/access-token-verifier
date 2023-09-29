import LRUCache from "lru-cache";
import { retrieveWebidTrustedOidcIssuers } from "../algorithm/retrieveWebidTrustedOidcIssuers";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "../config";
import type { RetrieveOidcIssuersFunction } from "../type";

export class WebIDIssuersCache extends LRUCache<string, Array<string>> {
  public constructor() {
    super({ max: maxRequestsPerSecond, maxAge: maxAgeInMilliseconds });
  }

  public async getIssuers(
    webid: string,
  ): ReturnType<RetrieveOidcIssuersFunction> {
    const cachedValue = this.get(webid.toString());
    if (cachedValue === undefined) {
      const issuersValue = await retrieveWebidTrustedOidcIssuers(webid);
      this.set(webid.toString(), issuersValue);
      return issuersValue;
    }
    return cachedValue;
  }
}
