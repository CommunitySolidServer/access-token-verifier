import { verifyDpopProofHttpMethod } from "../../../src/algorithm/verifyDpopProofHttpMethod";
import { HttpMethodVerificationError } from "../../../src/error/HttpMethodVerificationError";

describe("verifyDpopProofHttpMethod()", () => {
  it("doesn't throw when the HTTP request method matches", () => {
    expect(() => {
      verifyDpopProofHttpMethod("GET", "GET");
    }).not.toThrow();
  });

  it("throws when the HTTP request method doesn't match", () => {
    expect(() => {
      verifyDpopProofHttpMethod("POST", "GET");
    }).toThrow(HttpMethodVerificationError);
  });
});
