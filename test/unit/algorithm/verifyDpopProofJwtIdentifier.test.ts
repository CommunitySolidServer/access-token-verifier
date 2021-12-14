import { verifyDpopProofJwtIdentifier } from "../../../src/algorithm/verifyDpopProofJwtIdentifier";
import { JwtIdentifierVerificationError } from "../../../src/error/JwtIdentifierVerificationError";

const isDuplicateJTI = (jti: string) => ["x"].includes(jti);

describe("verifyDpopProofJwtIdentifier", () => {
  it("doesn't throw when the DPoP proof identifier is unique", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier("y", isDuplicateJTI);
    }).not.toThrow();
  });

  it("doesn't throw when there is no JTI check function", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier("y", isDuplicateJTI);
    }).not.toThrow();
  });

  it("throws when the DPoP proof identifier is not unique", () => {
    expect(() => {
      verifyDpopProofJwtIdentifier("x", isDuplicateJTI);
    }).toThrow(JwtIdentifierVerificationError);
  });
});
