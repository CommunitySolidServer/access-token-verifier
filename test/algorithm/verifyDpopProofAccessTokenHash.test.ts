import { verifyDpopProofAccessTokenHash } from "../../src/algorithm/verifyDpopProofAccessTokenHash";
import { AccessTokenHashVerificationError } from "../../src/error";

// Test data extracted from https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-7.1
describe("verifyDpopProofAccessTokenHash()", () => {
  it("doesn't throw when the access token hash is matched", () => {
    expect(() => {
      verifyDpopProofAccessTokenHash(
        "Kz~8mXK1EalYznwH-LC-1fBAo.4Ljp~zsPE_NeO.gxU",
        "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo"
      );
    }).not.toThrow();
  });

  it("throws when the access token hash doesn't matched", () => {
    expect(() => {
      verifyDpopProofAccessTokenHash(
        "Kz~8mXK1EalYznwH-LC-1fBAo.4Ljp~zsPE_NeO.gxU",
        "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo "
      );
    }).toThrow(AccessTokenHashVerificationError);
  });
});
