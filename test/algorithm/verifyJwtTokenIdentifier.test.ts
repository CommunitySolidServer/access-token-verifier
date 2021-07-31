import { verifyJwtTokenIdentifier } from "../../src/algorithm/verifyJwtTokenIdentifier";
import { JwtTokenIdentifierVerificationError } from "../../src/error";

describe("The verifyJwtTokenIdentifier function", () => {
  it("Doesn't throw when the DPoP proof identifier is unique", () => {
    expect(() => {
      verifyJwtTokenIdentifier((jti) => ["x"].includes(jti), "y");
    }).not.toThrow();
  });

  it("Throws when the DPoP proof identifier is not unique", () => {
    expect(() => {
      verifyJwtTokenIdentifier((jti) => ["x"].includes(jti), "x");
    }).toThrow(JwtTokenIdentifierVerificationError);
  });
});
