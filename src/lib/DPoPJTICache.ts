import LRUCache from "lru-cache";
import type { JTICheckFunction } from "../types";
import { maxAgeInMilliseconds, maxRequestsPerSecond } from "./Defaults";

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
