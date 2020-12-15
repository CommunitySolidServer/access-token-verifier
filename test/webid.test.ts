import { Readable } from 'stream';
import { jest, describe, it, expect } from "@jest/globals";
import { StreamParser } from "n3";
import { issuers } from '../src/lib/WebID'

jest.mock("rdf-dereference", () => ({
  dereference: jest.fn().mockImplementationOnce(() => {
    const streamParser = new StreamParser();
    const rdfStream = Readable.from('<https://example-profile.com/card#me> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example-issuer.com/> .');
    return Promise.resolve({ quads: rdfStream.pipe(streamParser) });
  }).mockImplementationOnce(() => Promise.reject(new Error("No resource"))),
}));

beforeEach((): void => {
  jest.clearAllMocks();
});

describe("oidcIssuer", () => {
  it("Parses Quad Stream and retrieves OIDC issuer", async () => {
    const issuer: string[] = await issuers(new URL("https://example-profile.com/card#me"));

    expect(issuer[0]).toBe('https://example-issuer.com/');
    expect(issuer.length).toBe(1);
  });

  // TODO: find the proper way to mock 
  it('Throws an error if issuer is missing', async () => {
    await expect(issuers(new URL("https://example-profile.com/card#me"))).rejects.toThrow();
  });
});
