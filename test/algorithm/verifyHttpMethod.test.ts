import { verifyHttpMethod } from "../../src/algorithm/verifyHttpMethod";
import { HttpMethodVerificationError } from "../../src/error";

describe("The verifyHttpMethod function", () => {
  it("Doesn't throw when the HTTP request method matches", () => {
    expect(() => {
      verifyHttpMethod("GET", "GET");
    }).not.toThrow();
  });

  it("Throws when the HTTP request method doesn't match", () => {
    expect(() => {
      verifyHttpMethod("POST", "GET");
    }).toThrow(HttpMethodVerificationError);
  });
});
