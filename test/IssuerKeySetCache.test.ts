import { retrieveAccessTokenIssuerKeySet } from "../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { IssuerKeySetCache } from "../src/class/IssuerKeySetCache";

jest.mock("../src/algorithm/retrieveAccessTokenIssuerKeySet", () => ({
  retrieveAccessTokenIssuerKeySet: jest.fn(),
}));

describe("WebID Issuers cache", () => {
  const issuer = "https://example-issuer.com/";
  const cache = new IssuerKeySetCache();

  it("Retrieves KeySet", async () => {
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(() => true)
    );
    expect(
      (await cache.getKeySet(issuer))({}, { payload: "", signature: "" })
    ).toBe(true);
    expect(retrieveAccessTokenIssuerKeySet).toHaveBeenCalledTimes(1);
  });

  it("Caches KeySet", async () => {
    expect(
      (await cache.getKeySet(issuer))({}, { payload: "", signature: "" })
    ).toBe(true);
    expect(retrieveAccessTokenIssuerKeySet).toHaveBeenCalledTimes(1);
  });

  it("Returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });

  it("Throws when failing to retrieve WebID", async () => {
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource"))
    );
    await expect(
      cache.getKeySet("https://example.com/#another")
    ).rejects.toThrow();
  });
});
