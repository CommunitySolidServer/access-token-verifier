import { verifyJwtTokenIdentifier } from "../../src/algorithm/verifyJwtTokenIdentifier";

describe("The verifyJwtTokenIdentifier function", () => {
  it("Doesn't throw when a DPoP proof identifier is unique", () => {
    expect(() => {
      verifyJwtTokenIdentifier((jti) => ["x"].includes(jti), "y");
    }).not.toThrow();
  });

  it("Throws when a DPoP proof identifier is not unique", () => {
    expect(() => {
      verifyJwtTokenIdentifier((jti) => ["x"].includes(jti), "x");
    }).toThrow("The DPoP Proof's unique identifier has already been used.");
  });
});
