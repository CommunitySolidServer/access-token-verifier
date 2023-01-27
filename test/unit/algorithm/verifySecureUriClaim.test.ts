import { verifySecureUriClaim } from "../../../src/algorithm/verifySecureUriClaim";
import { SecureUriClaimVerificationError } from "../../../src/error/SecureUriClaimVerificationError";

describe("verifySecureUriClaim", () => {
  it("doesn't throw when the URI is secure", () => {
    expect(() => {
      verifySecureUriClaim("https://example.com", "");
    }).not.toThrow();
  });

  it("doesn't throw when the URI is localhost", () => {
    expect(() => {
      verifySecureUriClaim("http://localhost:8080/", "");
    }).not.toThrow();
  });

  it("doesn't throw when the URI is subdomain.localhost", () => {
    expect(() => {
      verifySecureUriClaim("http://subdomain.localhost:8080/", "");
    }).not.toThrow();
  });

  it("throws when the URI is not secure", () => {
    expect(() => {
      verifySecureUriClaim("http://example.com", "");
    }).toThrow(SecureUriClaimVerificationError);
  });
});
