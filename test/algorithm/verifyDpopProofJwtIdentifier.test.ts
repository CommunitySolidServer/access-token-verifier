import { verifyDpopProofJwtIdentifier } from "../../src/algorithm/verifyDpopProofJwtIdentifier";
import { JwtIdentifierVerificationError } from "../../src/error";

describe("The verifyDpopProofJwtIdentifier function", () => {
  it("Doesn't throw when the DPoP proof identifier is unique", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier((jti) => ["x"].includes(jti), "y");
    }).not.toThrow();
  });

  it("Throws when the DPoP proof identifier is not unique", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier((jti) => ["x"].includes(jti), "x");
    }).toThrow(JwtIdentifierVerificationError);
  });
});
