import { verifySolidAccessTokenIssuer } from "../../src/algorithm/verifySolidAccessTokenIssuer";
import { IssuerVerificationError } from "../../src/error";

describe("verifySolidAccessTokenIssuer()", () => {
  it("doesn't throw when the issuer is listed", () => {
    expect(() => {
      verifySolidAccessTokenIssuer(
        ["https://example.issuer.com"],
        "https://example.issuer.com"
      );
    }).not.toThrow();
  });

  it("doesn't throw when the issuer is listed among other", () => {
    expect(() => {
      verifySolidAccessTokenIssuer(
        [
          "https://example.other.issuer.com",
          "https://example.issuer.com",
          "https://example.issuer.org",
        ],
        "https://example.issuer.com"
      );
    }).not.toThrow();
  });

  it("throws when the issuer is not listed", () => {
    expect(() => {
      verifySolidAccessTokenIssuer(
        ["http://example.issuer.com"],
        "https://example.unlisted.issuer.com"
      );
    }).toThrow(IssuerVerificationError);
  });
});
