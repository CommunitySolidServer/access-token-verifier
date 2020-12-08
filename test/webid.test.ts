import { Readable } from 'stream';
import { jest, describe, it, expect } from "@jest/globals";
import { StreamParser } from "n3";
import { oidcIssuer } from '../src/lib/WebID'

jest.mock("rdf-dereference", () => ({
  dereference: jest.fn().mockImplementation(() => {
    const streamParser = new StreamParser();
    const rdfStream = Readable.from('<https://example-profile.com/card#me> <http://www.w3.org/ns/solid/terms#oidcIssuer> <https://example-issuer.com/> .');
    return Promise.resolve({ quads: rdfStream.pipe(streamParser) });
  }),
}));

beforeEach((): void => {
  jest.clearAllMocks();
});

describe("oidcIssuer", () => {
  it("Parses Quad Stream and retrieves OIDC issuer", async () => {
      const issuer: string = await oidcIssuer("https://example-profile.com/card#me", "https://example-issuer.com/");

      expect(issuer).toBe('https://example-issuer.com/');
  });

  it('should test async errors', async () =>  {        
      await expect(oidcIssuer("https://example-profile.com/card#me", "https://example-issuer-missing.com/")).rejects.toThrow();
  });
});
