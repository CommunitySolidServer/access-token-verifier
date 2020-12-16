import LRUCache from "lru-cache";
import type { JTICheckFunction } from "../types";

export class DPoPJTICache extends LRUCache<string, boolean> {
  public constructor() {
    super({ max: 50, maxAge: 30000 });
  }

  public isDuplicateJTI(jti: string): ReturnType<JTICheckFunction> {
    if (this.get(jti) === undefined) {
      this.set(jti, true);
      return false;
    }
    return true;
  }
}
