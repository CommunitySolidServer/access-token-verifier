// eslint-disable-next-line no-shadow
import fetch from "node-fetch";
import { retrieveWebidTrustedOidcIssuers } from "../../../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { WebidDereferencingError } from "../../../src/error/WebidDereferencingError";
import { WebidParsingError } from "../../../src/error/WebidParsingError";

jest.mock("node-fetch", () => jest.fn());

const webid = "https://example.com/webid#";

describe("retrieveWebidTrustedOidcIssuers", () => {
  it("returns the trusted OIDC issuer of a WebID", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return `<${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/> .`;
        },
      })
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
      })
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
      "https://example.other.issuer.com/",
    ]);
  });

  it("ignores issuers in a non-default graph", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return `<#g> { <${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/> . }`;
        },
      })
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([]);
  });

  it("returns the trusted OIDC issuer via the RetrieveOidcIssuersFunction function", async () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/require-await
      await retrieveWebidTrustedOidcIssuers(webid, async () => [""])
    ).toStrictEqual([""]);
  });

  it("throws when the WebID cannot be dereferenced", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource"))
    );

    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("x");
    }).rejects.toThrow(WebidDereferencingError);
  });

  it("throws when there is an error parsing the WebID", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        text: () => {
          return "very invalid turtle";
        },
      })
    );

    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("x");
    }).rejects.toThrow(WebidParsingError);
  });
});
