import { retrieveIdDocumentTrustedOidcIssuers } from "../../../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { IdDocumentIssuersCache } from "../../../src/class/IdDocumentIssuersCache";
import { WebIDIssuersCache } from "../../../src/class/WebIDIssuersCache";

jest.mock("../../../src/algorithm/retrieveWebidTrustedOidcIssuers", () => ({
  retrieveIdDocumentTrustedOidcIssuers: jest.fn(),
}));

describe("IdDocumentIssuersCache", () => {
  const identifier = "https://example.com/#me";
  const cache = new IdDocumentIssuersCache();

  it("retains WebIDIssuersCache as an alias", () => {
    expect(WebIDIssuersCache).toBe(IdDocumentIssuersCache);
  });

  it("retrieves identity documents", async () => {
    (retrieveIdDocumentTrustedOidcIssuers as jest.Mock).mockImplementationOnce(
      () => Promise.resolve(["https://example-issuer.com/"]),
    );
    expect((await cache.getIssuers(identifier))[0]).toBe(
      "https://example-issuer.com/",
    );
    expect(retrieveIdDocumentTrustedOidcIssuers).toHaveBeenCalledTimes(1);
  });

  it("caches identity documents", async () => {
    expect((await cache.getIssuers(identifier))[0]).toBe(
      "https://example-issuer.com/",
    );
    expect(retrieveIdDocumentTrustedOidcIssuers).toHaveBeenCalledTimes(1);
  });

  it("returns undefined for non-existant keys", () => {
    expect(cache.get("non-existant")).toBeUndefined();
  });

  it("throws when failing to retrieve an identity document", async () => {
    (retrieveIdDocumentTrustedOidcIssuers as jest.Mock).mockImplementationOnce(
      () => Promise.reject(new Error("No resource")),
    );
    await expect(
      cache.getIssuers("https://example.com/#another"),
    ).rejects.toThrow();
  });
});
