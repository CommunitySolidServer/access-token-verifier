import { verifyDpopProofJwtIdentifier } from "../../src/algorithm/verifyDpopProofJwtIdentifier";
import { JwtIdentifierVerificationError } from "../../src/error";

const isDuplicateJTI = (jti: string) => ["x"].includes(jti);

describe("The verifyDpopProofJwtIdentifier function", () => {
  it("Doesn't throw when the DPoP proof identifier is unique", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier("y", isDuplicateJTI);
    }).not.toThrow();
  });

  it("Doesn't throw when there is no JTI check function", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier("y", isDuplicateJTI);
    }).not.toThrow();
  });

  it("Throws when the DPoP proof identifier is not unique", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier("x", isDuplicateJTI);
    }).toThrow(JwtIdentifierVerificationError);
  });
});
