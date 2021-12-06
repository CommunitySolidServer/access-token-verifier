import { Readable } from "stream";
import { StreamParser } from "n3";
import rdfDereferencer from "rdf-dereference";
import { retrieveWebidTrustedOidcIssuers } from "../../../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { WebidDereferencingError } from "../../../src/error/WebidDereferencingError";

jest.mock("rdf-dereference", () => ({
  dereference: jest.fn(),
}));

const mockRdfDereferencer = (rdf: string) => {
  return (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(
    () => {
      const streamParser = new StreamParser({ format: "application/trig" });
      const rdfStream = Readable.from(`${rdf}`);
      return Promise.resolve({ quads: rdfStream.pipe(streamParser) });
    }
  );
};
const webid = "https://example.com/webid#";

describe("retrieveWebidTrustedOidcIssuers()", () => {
  it("returns the trusted OIDC issuer of a WebID", async () => {
    mockRdfDereferencer(
      `<${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/> .`
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
    ]);
  });

  it("returns all trusted OIDC issuers of a WebID", async () => {
    mockRdfDereferencer(
      `<${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/>, <https://example.other.issuer.com/> .`
    );

    expect(await retrieveWebidTrustedOidcIssuers(webid)).toStrictEqual([
      "https://example.issuer.com/",
      "https://example.other.issuer.com/",
    ]);
  });

  it("ignores issuers in a non-default graph", async () => {
    mockRdfDereferencer(
      `<#g> { <${webid}> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example.issuer.com/> . }`
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
    (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("No resource"))
    );

    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("x");
    }).rejects.toThrow(WebidDereferencingError);
  });

  it("throws when there is an error parsing the WebID", async () => {
    mockRdfDereferencer("very invalid turtle");

    await expect(async () => {
      await retrieveWebidTrustedOidcIssuers("x");
    }).rejects.toThrow('Unexpected "very" on line 1.');
  });
});
