import LRUCache from "lru-cache";
import type { GetIssuersFunction } from "../type";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "./Defaults";
import { issuers } from "./WebID";

export class WebIDIssuersCache extends LRUCache<string, Array<string>> {
  public constructor() {
    super({ max: maxRequestsPerSecond, maxAge: maxAgeInMilliseconds });
  }

  public async getIssuers(webid: URL): ReturnType<GetIssuersFunction> {
    const cachedValue = this.get(webid.toString());
    if (cachedValue === undefined) {
      const issuersValue = await issuers(webid);
      this.set(webid.toString(), issuersValue);
      return issuersValue;
    }
    return cachedValue;
  }
}
