import { decodeBase64UrlEncodedJson } from "../../src/algorithm/decodeBase64UrlEncodedJson";
import { Base64UrlEncodedJsonDecodingError } from "../../src/error";

// Test data extracted from https://datatracker.ietf.org/doc/html/rfc7519#section-3.1
describe("decodeBase64UrlEncodedJson()", () => {
  it("doesn't throw when the access token hash is matched", () => {
    expect(() => {
      decodeBase64UrlEncodedJson("eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9");
    }).not.toThrow();
  });

  it("throws when the access token hash doesn't matched", () => {
    expect(() => {
      decodeBase64UrlEncodedJson("");
    }).toThrow(Base64UrlEncodedJsonDecodingError);
  });
});
