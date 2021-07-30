import { verifyAccessTokenHash } from "../../src/algorithm/verifyAccessTokenHash";

// Example data extracted from https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-7.1
describe("The verifyAccessTokenHash function", () => {
  it("Doesn't throw when a correct claim is verified", () => {
    expect(() => {
      verifyAccessTokenHash(
        "Kz~8mXK1EalYznwH-LC-1fBAo.4Ljp~zsPE_NeO.gxU",
        "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo"
      );
    }).not.toThrow();
  });

  it("Throws when an incorrect access token hash is verified", () => {
    expect(() => {
      verifyAccessTokenHash(
        "Kz~8mXK1EalYznwH-LC-1fBAo.4Ljp~zsPE_NeO.gxU",
        "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo "
      );
    }).toThrow(
      "The DPoP Proof's ath parameter doesn't match the base64 URL encoded SHA256 hash of the ASCII encoded associated access token's value."
    );
  });
});
