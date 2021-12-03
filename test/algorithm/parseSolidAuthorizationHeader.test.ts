import { parseSolidAuthorizationHeader } from "../../src/algorithm/parseSolidAuthorizationHeader";
import { JwtStructureError } from "../../src/error";

describe("verifyAuthenticationScheme()", () => {
  it("doesn't throw when the authentication scheme is supported", () => {
    expect(parseSolidAuthorizationHeader("dpop x.y.z")).toStrictEqual({
      authenticationScheme: "DPoP",
      joseHeader: "x",
      jwsPayload: "y",
      jwsSignature: "z",
    });
  });

  it("throws when the authentication scheme is not supported", () => {
    expect(() => {
      parseSolidAuthorizationHeader("dpop x.y");
    }).toThrow(JwtStructureError);
  });
});
