import { verifyDpopProofHttpUri } from "../../src/algorithm/verifyDpopProofHttpUri";
import { HttpUriVerificationError } from "../../src/error";

describe("The verifyDpopProofHttpUri function", () => {
  it("Doesn't throw when the HTTP URI matches", () => {
    expect(() => {
      verifyDpopProofHttpUri("https://example.com/x", "https://example.com/x");
    }).not.toThrow();
  });

  it("Doesn't throw when only the query part of the HTTP URI differs", () => {
    expect(() => {
      verifyDpopProofHttpUri(
        "https://example.com/x?a",
        "https://example.com/x"
      );
    }).not.toThrow();
  });

  it("Doesn't throw when only the fragment part of the HTTP URI differs", () => {
    expect(() => {
      verifyDpopProofHttpUri(
        "https://example.com/x#a",
        "https://example.com/x"
      );
    }).not.toThrow();
  });

  it("Throws when the DPoP proof htu includes a fragment", () => {
    expect(() => {
      verifyDpopProofHttpUri(
        "https://example.com/x#a",
        "https://example.com/x#a"
      );
    }).toThrow(HttpUriVerificationError);
  });

  it("Throws when the DPoP proof htu includes a query", () => {
    expect(() => {
      verifyDpopProofHttpUri(
        "https://example.com/x?a",
        "https://example.com/x?a"
      );
    }).toThrow(HttpUriVerificationError);
  });

  it("Throws when the HTTP URI doesn't match", () => {
    expect(() => {
      verifyDpopProofHttpUri("https://example.com/x", "https://example.com/y");
    }).toThrow(HttpUriVerificationError);
  });
});
