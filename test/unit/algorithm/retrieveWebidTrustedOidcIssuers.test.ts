import fetch from "node-fetch";
import {
  retrieveIdDocumentTrustedOidcIssuers,
  retrieveWebidTrustedOidcIssuers,
} from "../../../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { IdDocumentParsingError } from "../../../src/error/IdDocumentParsingError";
import { WebidDereferencingError } from "../../../src/error/WebidDereferencingError";
import { WebidIriError } from "../../../src/error/WebidIriError";

jest.mock("node-fetch", () => jest.fn());

const webid = "https://example.com/webid#";
const webidDocument = "https://example.com/webid";
const responseHeaders = (
  contentType: string | null,
): { get: () => string | null } => ({
  get: () => contentType,
});
const turtleHeaders = responseHeaders("text/turtle; charset=utf-8");
const cidHeaders = responseHeaders("application/cid; charset=utf-8");

describe("retrieveWebidTrustedOidcIssuers", () => {
  it("retains retrieveWebidTrustedOidcIssuers as an alias", () => {
    expect(retrieveWebidTrustedOidcIssuers).toBe(
      retrieveIdDocumentTrustedOidcIssuers,
    );
  });

  it("returns the trusted OIDC issuer of a WebID", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return `<${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/> .`;
        },
        url: webidDocument,
        headers: turtleHeaders,
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
    ]);
  });

  it("returns all trusted OIDC issuers of a WebID", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return `<${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/>, <https://example.other.issuer.com/> .`;
        },
        url: webidDocument,
        headers: turtleHeaders,
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
      "https://example.other.issuer.com/",
    ]);
  });

  it("returns the trusted OIDC issuers with relative paths and redirect webId", async () => {
    const webidDocumentRedirect = "https://webid.example/profile/card";

    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return `<${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <../> .`;
        },
        url: webidDocumentRedirect,
        headers: turtleHeaders,
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://webid.example/",
    ]);
  });

  it.each(["application/cid", "application/ld+json", "application/json"])(
    "returns OpenID provider services from a controlled identifier document served as %s",
    async (contentType) => {
      (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          text: () =>
            JSON.stringify({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "@context": ["https://www.w3.org/ns/cid/v1"],
              id: webid,
              service: [
                {
                  type: "https://www.w3.org/ns/lws#OpenIdProvider",
                  serviceEndpoint: "https://example.issuer.com/",
                },
                {
                  type: [
                    "https://example.com/AnotherService",
                    "https://www.w3.org/ns/lws#OpenIdProvider",
                  ],
                  serviceEndpoint: [
                    "https://example.other.issuer.com/",
                    "https://example.third.issuer.com/",
                  ],
                },
                {
                  type: "https://example.com/AnotherService",
                  serviceEndpoint: "https://example.untrusted.issuer.com/",
                },
              ],
            }),
          url: webidDocument,
          headers: responseHeaders(contentType),
        }),
      );

      expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
        "https://example.issuer.com/",
        "https://example.other.issuer.com/",
        "https://example.third.issuer.com/",
      ]);
    },
  );

  it("accepts a single OpenID provider service object", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          JSON.stringify({
            id: webid,
            service: {
              type: "https://www.w3.org/ns/lws#OpenIdProvider",
              serviceEndpoint: "https://example.issuer.com/",
            },
          }),
        url: webidDocument,
        headers: responseHeaders("application/ld+json"),
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
    ]);
  });

  it("returns OIDC issuers from a JSON-LD WebID document", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          JSON.stringify([
            {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "@context": {
                solid: "http://www.w3.org/ns/solid/terms#",
                oidcIssuer: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  "@id": "solid:oidcIssuer",
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  "@type": "@id",
                },
              },
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "@id": webid,
              oidcIssuer: "https://example.issuer.com/",
            },
          ]),
        url: webidDocument,
        headers: responseHeaders("application/ld+json"),
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
    ]);
  });

  it("rejects a controlled identifier document for another subject", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          JSON.stringify({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "@context": ["https://www.w3.org/ns/cid/v1"],
            id: "https://example.com/someone-else",
            service: {
              type: "https://www.w3.org/ns/lws#OpenIdProvider",
              serviceEndpoint: "https://example.issuer.com/",
            },
          }),
        url: webidDocument,
        headers: responseHeaders("application/ld+json"),
      }),
    );

    await expect(retrieveWebidTrustedOidcIssuers(webid)).rejects.toThrow(
      IdDocumentParsingError,
    );
  });

  it("ignores malformed services in a controlled identifier document", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          JSON.stringify({
            id: webid,
            service: [null, [], "not a service"],
          }),
        url: webidDocument,
        headers: cidHeaders,
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([]);
  });

  it("rejects a controlled identifier document that is not an object", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => "[]",
        url: webidDocument,
        headers: cidHeaders,
      }),
    );

    await expect(retrieveWebidTrustedOidcIssuers(webid)).rejects.toThrow(
      IdDocumentParsingError,
    );
  });

  it("rejects malformed controlled identifier JSON", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => "{",
        url: webidDocument,
        headers: cidHeaders,
      }),
    );

    await expect(retrieveWebidTrustedOidcIssuers(webid)).rejects.toThrow(
      IdDocumentParsingError,
    );
  });

  it("rejects malformed JSON-LD", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => "{",
        url: webidDocument,
        headers: responseHeaders("application/ld+json"),
      }),
    );

    await expect(retrieveWebidTrustedOidcIssuers(webid)).rejects.toThrow(
      IdDocumentParsingError,
    );
  });

  it("rejects a response without a supported content type", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => "{}",
        url: webidDocument,
        headers: responseHeaders(null),
      }),
    );

    await expect(retrieveWebidTrustedOidcIssuers(webid)).rejects.toThrow(
      IdDocumentParsingError,
    );
  });

  it("ignores issuers in a non-default graph", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return `<#g> { <${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/> . }`;
        },
        url: webidDocument,
        headers: turtleHeaders,
      }),
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([]);
  });

  it("returns the trusted OIDC issuer via the RetrieveOidcIssuersFunction function", async () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/require-await
      await retrieveWebidTrustedOidcIssuers(webid, async () => [""]),
    ).toStrictEqual([""]);
  });

  it("throws when the WebID cannot be dereferenced", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource")),
    );

    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("http://example.com");
    }).rejects.toThrow(WebidDereferencingError);
  });

  it("throws when the WebID is not a URL", async () => {
    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("x");
    }).rejects.toThrow(WebidIriError);
  });

  it("throws when there is an error parsing the WebID", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return "very invalid turtle";
        },
        url: webidDocument,
        headers: turtleHeaders,
      }),
    );

    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("http://example.com");
    }).rejects.toThrow(IdDocumentParsingError);
  });
});
