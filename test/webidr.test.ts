import rdfDereferencer from 'rdf-dereference'
import { Readable } from 'stream';
import { jest, describe, it, expect } from "@jest/globals";
import { StreamParser } from "n3";
import { issuers } from '../src/lib/WebID'

jest.mock("rdf-dereference", () => ({
  dereference: jest.fn(),
}));

describe("oidcIssuer", () => {
  const webid = new URL("https://example-profile.com/card#me");

  it("Parses Quad Stream and retrieves OIDC issuer", async () => {
    (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(() => {
      const streamParser = new StreamParser();
      const rdfStream = Readable.from('<https://example-profile.com/card#me> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example-issuer.com/> .');
      return Promise.resolve({ quads: rdfStream.pipe(streamParser) });
    });

    const issuer: string[] = await issuers(webid);

    expect(issuer[0]).toBe('https://example-issuer.com/');
    expect(issuer.length).toBe(1);
  });

  it('Throws an error if issuer is missing', async () => {
    (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error("No resource")));

    await expect(issuers(webid)).rejects.toThrow();
  });
});
