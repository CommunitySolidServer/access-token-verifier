import rdfDereferencer from 'rdf-dereference'
import { Readable } from 'stream';
import { jest, describe, it, expect } from "@jest/globals";
import { StreamParser } from "n3";
import { issuers } from '../src/lib/WebID'

jest.mock("rdf-dereference", () => ({
  dereference: jest.fn(),
}));

describe("WebID's identity issuers", () => {
  const webid = new URL("https://example-profile.com/card#me");

  it("Parses Quad Stream and retrieves identity issuers", async () => {
    (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(() => {
      const streamParser = new StreamParser();
      const rdfStream = Readable.from('<https://example-profile.com/card#me> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example-issuer.com/> .');
      return Promise.resolve({ quads: rdfStream.pipe(streamParser) });
    });

    const issuer: string[] = await issuers(webid);

    expect(issuer[0]).toBe('https://example-issuer.com/');
    expect(issuer.length).toBe(1);
  });

  it("Returns an empty array if no issuers where found in the WebID", async () => {
    (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(() => {
      const streamParser = new StreamParser();
      const rdfStream = Readable.from('<s> <p> <o> .');
      return Promise.resolve({ quads: rdfStream.pipe(streamParser) });
    });

    const issuer: string[] = await issuers(webid);

    expect(Array.isArray(issuer)).toBe(true);
    expect(issuer.length).toBe(0);
  });

  it('Throws an error if WebID is missing', async () => {
    (rdfDereferencer.dereference as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error("No resource")));

    await expect(issuers(webid)).rejects.toThrow();
  });
});
