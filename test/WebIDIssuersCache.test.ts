import { issuers } from "../src/lib/WebID";
import { WebIDIssuersCache } from "../src/lib/WebIDIssuersCache";

jest.mock("../src/lib/WebID", () => ({
  issuers: jest.fn(),
}));

describe("WebID Issuers cache", () => {
  const webid = new URL("https://example.com/#me");
  const cache = new WebIDIssuersCache();

  it("Retrieves WebIDs", async () => {
    (issuers as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(["https://example-issuer.com/"])
    );
    expect((await cache.getIssuers(webid))[0]).toBe(
      "https://example-issuer.com/"
    );
    expect(issuers).toHaveBeenCalledTimes(1);
  });

  it("Caches WebIDs", async () => {
    expect((await cache.getIssuers(webid))[0]).toBe(
      "https://example-issuer.com/"
    );
    expect(issuers).toHaveBeenCalledTimes(1);
  });

  it("Returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });

  it("Throws when failing to retrieve WebID", async () => {
    (issuers as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource"))
    );
    await expect(
      cache.getIssuers(new URL("https://example.com/#another"))
    ).rejects.toThrow();
  });
});
