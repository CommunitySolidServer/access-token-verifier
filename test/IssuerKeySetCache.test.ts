import { keySet } from "../src/lib/Issuer";
import { IssuerKeySetCache } from "../src/lib/IssuerKeySetCache";

jest.mock("../src/lib/Issuer", () => ({
  keySet: jest.fn(),
}));

describe("WebID Issuers cache", () => {
  const issuer = new URL("https://example-issuer.com/");
  const cache = new IssuerKeySetCache();

  it("Retrieves KeySet", async () => {
    (keySet as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(() => true)
    );
    expect(
      (await cache.getKeySet(issuer))({}, { payload: "", signature: "" })
    ).toBe(true);
    expect(keySet).toHaveBeenCalledTimes(1);
  });

  it("Caches KeySet", async () => {
    expect(
      (await cache.getKeySet(issuer))({}, { payload: "", signature: "" })
    ).toBe(true);
    expect(keySet).toHaveBeenCalledTimes(1);
  });

  it("Returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });

  it("Throws when failing to retrieve WebID", async () => {
    (keySet as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource"))
    );
    await expect(
      cache.getKeySet(new URL("https://example.com/#another"))
    ).rejects.toThrow();
  });
});
