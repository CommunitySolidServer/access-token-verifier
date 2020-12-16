import LRUCache from "lru-cache";
import type { GetIssuersFunction } from "../types";
import { issuers } from "./WebID";

export class WebIDIssuersCache extends LRUCache<string, Array<string>> {
  public constructor() {
    super({ max: 50, maxAge: 30000 });
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
