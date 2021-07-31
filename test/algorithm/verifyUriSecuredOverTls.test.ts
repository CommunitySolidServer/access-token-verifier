import { verifyUriSecuredOverTls } from "../../src/algorithm/verifyUriSecuredOverTls";
import { UriSecuredOverTlsVerificationError } from "../../src/error";

describe("The verifyUriSecuredOverTls function", () => {
  it("Doesn't throw when the URI is secure", () => {
    expect(() => {
      verifyUriSecuredOverTls("https://example.com");
    }).not.toThrow();
  });

  it("Doesn't throw when the URI is localhost", () => {
    expect(() => {
      verifyUriSecuredOverTls("http://localhost:8080/");
    }).not.toThrow();
  });

  it("Throws when the URI is not secure", () => {
    expect(() => {
      verifyUriSecuredOverTls("http://example.com");
    }).toThrow(UriSecuredOverTlsVerificationError);
  });
});
