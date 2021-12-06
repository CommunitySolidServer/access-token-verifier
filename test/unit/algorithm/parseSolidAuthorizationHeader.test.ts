import { parseSolidAuthorizationHeader } from "../../../src/algorithm/parseSolidAuthorizationHeader";
import { AuthenticationSchemeVerificationError } from "../../../src/error/AuthenticationSchemeVerificationError";
import { JwtStructureError } from "../../../src/error/JwtStructureError";
import { SolidAuthorizationHeaderParsingError } from "../../../src/error/SolidAuthorizationHeaderParsingError";

describe("parseSolidAuthorizationHeader()", () => {
  it("doesn't throw when the authentication scheme is supported", () => {
    expect(parseSolidAuthorizationHeader("dpop x.y.z")).toStrictEqual({
      authenticationScheme: "DPoP",
      joseHeader: "x",
      jwsPayload: "y",
      jwsSignature: "z",
      value: "x.y.z",
    });
  });

  it("throws when the authentication scheme is not supported", () => {
    expect(() => {
      parseSolidAuthorizationHeader("dpops x.y");
    }).toThrow(AuthenticationSchemeVerificationError);
  });

  it("throws when the number of segments is wrong", () => {
    expect(() => {
      parseSolidAuthorizationHeader("dpop x.y");
    }).toThrow(JwtStructureError);
  });

  it("throws when the JWT contains unsafe characters", () => {
    expect(() => {
      parseSolidAuthorizationHeader("dpop x.y.z§");
    }).toThrow(SolidAuthorizationHeaderParsingError);
  });
});
