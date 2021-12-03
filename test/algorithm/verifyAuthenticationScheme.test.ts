import { verifyAuthenticationScheme } from "../../src/algorithm/verifyAuthenticationScheme";
import { AuthenticationSchemeVerificationError } from "../../src/error";

describe("verifyAuthenticationScheme()", () => {
  it("doesn't throw when the authentication scheme is supported", () => {
    expect(() => {
      verifyAuthenticationScheme("dpop ");
      verifyAuthenticationScheme("BeArer ");
      verifyAuthenticationScheme("DPoP    ");
      verifyAuthenticationScheme("bearer             ");
    }).not.toThrow();
  });

  it("throws when the authentication scheme is not supported", () => {
    expect(() => {
      verifyAuthenticationScheme("dpop");
      verifyAuthenticationScheme("BeArer");
      verifyAuthenticationScheme("DPoP\t    ");
      verifyAuthenticationScheme("bearere             ");
    }).toThrow(AuthenticationSchemeVerificationError);
  });
});
