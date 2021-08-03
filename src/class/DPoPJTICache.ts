import LRUCache from "lru-cache";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "../config";
import type { JTICheckFunction } from "../type";

export class DPoPJTICache extends LRUCache<string, boolean> {
  public constructor() {
    super({
      max: (maxRequestsPerSecond * maxAgeInMilliseconds) / 1000,
      maxAge: maxAgeInMilliseconds,
    });
  }

  public isDuplicateJTI(jti: string): ReturnType<JTICheckFunction> {
    if (this.get(jti) === undefined) {
      this.set(jti, true);
      return false;
    }
    return true;
  }
}
