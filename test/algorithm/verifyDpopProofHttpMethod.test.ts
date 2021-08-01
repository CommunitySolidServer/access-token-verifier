import { verifyDpopProofHttpMethod } from "../../src/algorithm/verifyDpopProofHttpMethod";
import { HttpMethodVerificationError } from "../../src/error";

describe("The verifyHttpMethod function", () => {
  it("Doesn't throw when the HTTP request method matches", () => {
    expect(() => {
      verifyDpopProofHttpMethod("GET", "GET");
    }).not.toThrow();
  });

  it("Throws when the HTTP request method doesn't match", () => {
    expect(() => {
      verifyDpopProofHttpMethod("POST", "GET");
    }).toThrow(HttpMethodVerificationError);
  });
});
