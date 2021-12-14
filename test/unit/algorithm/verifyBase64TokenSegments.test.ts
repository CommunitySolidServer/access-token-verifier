import { verifyBase64TokenSegments } from "../../../src/algorithm/verifyBase64TokenSegments";
import { Base64TokenSegmentError } from "../../../src/error/Base64TokenSegmentError";

describe("verifyBase64TokenSegments", () => {
  it("doesn't throw on base 64 token segments", () => {
    expect(() => verifyBase64TokenSegments("dpop  x.y.z")).not.toThrow();
    expect(() => verifyBase64TokenSegments("dpop  x/.y./z==")).not.toThrow();
    expect(() =>
      verifyBase64TokenSegments("dpop  x.y.A0-_~+/==")
    ).not.toThrow();
    expect(() =>
      verifyBase64TokenSegments("A0-_~+/.A0-_~+/.A0-_~+/==")
    ).not.toThrow();
  });

  it("throws when on illegal characters in base 64 token segments", () => {
    expect(() => verifyBase64TokenSegments("dpop  x=.y.z")).toThrow(
      Base64TokenSegmentError
    );
    expect(() => verifyBase64TokenSegments("x.\\y.z==")).toThrow(
      Base64TokenSegmentError
    );
    expect(() => verifyBase64TokenSegments("x.y^.A0-_~+/==")).toThrow(
      Base64TokenSegmentError
    );
    expect(() =>
      verifyBase64TokenSegments("A0-_~+/.A0-_~+/.A0-$_~+/==")
    ).toThrow(Base64TokenSegmentError);
  });
});
