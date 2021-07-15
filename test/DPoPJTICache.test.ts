import { DPoPJTICache } from "../src/lib/DPoPJTICache";

describe("DPoP JTI cache", () => {
  const jti = "identifier";
  const cache = new DPoPJTICache();

  it("Checks JTI", () => {
    expect(cache.isDuplicateJTI(jti)).toBe(false);
  });

  it("Caches JTI", () => {
    expect(cache.isDuplicateJTI(jti)).toBe(true);
  });

  it("Returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });
});
