import { DPoPJTICache } from "../src/class/DPoPJTICache";

describe("DPoPJTICache", () => {
  const jti = "identifier";
  const cache = new DPoPJTICache();

  it("checks JTI", () => {
    expect(cache.isDuplicateJTI(jti)).toBe(false);
  });

  it("caches JTI", () => {
    expect(cache.isDuplicateJTI(jti)).toBe(true);
  });

  it("returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });
});
