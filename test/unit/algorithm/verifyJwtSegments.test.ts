import { verifyJwtSegments } from "../../../src/algorithm/verifyJwtSegments";
import { JwtStructureError } from "../../../src/error/JwtStructureError";

describe("verifyJwtSegments", () => {
  it("doesn't throw when the correct number of JWT segments are present", () => {
    expect(() => verifyJwtSegments("dpop x.y.z")).not.toThrow();
  });

  it("throws when the incorrect number of JWT segments are present", () => {
    expect(() => verifyJwtSegments("dpop y.z")).toThrow(JwtStructureError);
    expect(() => verifyJwtSegments("dpop v.w.x.y.z")).toThrow(
      JwtStructureError
    );
  });
});
