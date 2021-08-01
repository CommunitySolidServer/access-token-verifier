import { verifySolidAccessTokenIssuer } from "../../src/algorithm/verifySolidAccessTokenIssuer";
import { IssuerVerificationError } from "../../src/error";

describe("The verifySolidAccessTokenIssuer function", () => {
  it("Doesn't throw when the issuer is listed", () => {
    expect(() => {
      verifySolidAccessTokenIssuer(
        ["https://example.issuer.com"],
        "https://example.issuer.com"
      );
    }).not.toThrow();
  });

  it("Throws when the issuer is not listed", () => {
    expect(() => {
      verifySolidAccessTokenIssuer(
        ["http://example.issuer.com"],
        "https://example.unlisted.issuer.com"
      );
    }).toThrow(IssuerVerificationError);
  });
});
