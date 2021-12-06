import { verifyAuthenticationScheme } from "../../../src/algorithm/verifyAuthenticationScheme";
import { AuthenticationSchemeVerificationError } from "../../../src/error/AuthenticationSchemeVerificationError";

describe("verifyAuthenticationScheme()", () => {
  it("doesn't throw when the authentication scheme is supported", () => {
    expect(() => verifyAuthenticationScheme("dpop ")).not.toThrow();
    expect(() => verifyAuthenticationScheme("BeArer ")).not.toThrow();
    expect(() => verifyAuthenticationScheme("DPoP    ")).not.toThrow();
    expect(() =>
      verifyAuthenticationScheme("bearer             ")
    ).not.toThrow();
  });

  it("throws when the authentication scheme is not supported", () => {
    expect(() => verifyAuthenticationScheme("dpop")).toThrow(
      AuthenticationSchemeVerificationError
    );
    expect(() => verifyAuthenticationScheme("BeArer")).toThrow(
      AuthenticationSchemeVerificationError
    );
    expect(() => verifyAuthenticationScheme("DPoP\t    ")).toThrow(
      AuthenticationSchemeVerificationError
    );
    expect(() => verifyAuthenticationScheme("bearere             ")).toThrow(
      AuthenticationSchemeVerificationError
    );
  });
});
