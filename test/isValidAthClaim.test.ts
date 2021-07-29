import { isValidAthClaim } from "../src/algorithm/isValidAthClaim";

// Example data extracted from https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-03#section-7.1
describe("isValidAthClaim", () => {
  it("Validates a correct claim", () => {
    expect(
      isValidAthClaim(
        "Kz~8mXK1EalYznwH-LC-1fBAo.4Ljp~zsPE_NeO.gxU",
        "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo"
      )
    ).toBe(true);
  });
});
