import { verifySecureUriClaim } from "../../src/algorithm/verifySecureUriClaim";
import { SecureUriClaimVerificationError } from "../../src/error";

describe("The verifySecureUriClaim function", () => {
  it("Doesn't throw when the URI is secure", () => {
    expect(() => {
      verifySecureUriClaim("https://example.com", "");
    }).not.toThrow();
  });

  it("Doesn't throw when the URI is localhost", () => {
    expect(() => {
      verifySecureUriClaim("http://localhost:8080/", "");
    }).not.toThrow();
  });

  it("Throws when the URI is not secure", () => {
    expect(() => {
      verifySecureUriClaim("http://example.com", "");
    }).toThrow(SecureUriClaimVerificationError);
  });
});
