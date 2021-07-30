import { verifyJwtTokenIdentifier } from "../../src/algorithm/verifyJwtTokenIdentifier";
import { JwtTokenIdentifierNotUniqueError } from "../../src/error";

describe("The verifyJwtTokenIdentifier function", () => {
  it("Doesn't throw when a DPoP proof identifier is unique", () => {
    expect(() => {
      verifyJwtTokenIdentifier((jti) => ["x"].includes(jti), "y");
    }).not.toThrow();
  });

  it("Throws when a DPoP proof identifier is not unique", () => {
    expect(() => {
      verifyJwtTokenIdentifier((jti) => ["x"].includes(jti), "x");
    }).toThrow(JwtTokenIdentifierNotUniqueError);
  });
});
