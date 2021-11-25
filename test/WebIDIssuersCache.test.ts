import { retrieveWebidTrustedOidcIssuers } from "../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { WebIDIssuersCache } from "../src/class/WebIDIssuersCache";

jest.mock("../src/algorithm/retrieveWebidTrustedOidcIssuers", () => ({
  retrieveWebidTrustedOidcIssuers: jest.fn(),
}));

describe("WebIDIssuersCache()", () => {
  const webid = "https://example.com/#me";
  const cache = new WebIDIssuersCache();

  it("retrieves WebIDs", async () => {
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(["https://example-issuer.com/"])
    );
    expect((await cache.getIssuers(webid))[0]).toBe(
      "https://example-issuer.com/"
    );
    expect(retrieveWebidTrustedOidcIssuers).toHaveBeenCalledTimes(1);
  });

  it("caches WebIDs", async () => {
    expect((await cache.getIssuers(webid))[0]).toBe(
      "https://example-issuer.com/"
    );
    expect(retrieveWebidTrustedOidcIssuers).toHaveBeenCalledTimes(1);
  });

  it("returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });

  it("throws when failing to retrieve WebID", async () => {
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource"))
    );
    await expect(
      cache.getIssuers("https://example.com/#another")
    ).rejects.toThrow();
  });
});
