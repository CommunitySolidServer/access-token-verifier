import { createSolidTokenVerifier } from "../src/lib/SolidTokenVerifier";
import { verify as verifyToken } from "../src/lib/Verify";

jest.mock("../src/lib/Verify");

describe("Verifying Token", () => {
  it("Returns a verify solid token function that calls the solid token verification function", async () => {
    (verifyToken as jest.Mock).mockResolvedValueOnce(true);
    const solidTokenVerifier = createSolidTokenVerifier();

    const x = await solidTokenVerifier("", "", "GET", "");
    expect(x).toStrictEqual(true);
    expect(verifyToken).toHaveBeenCalledTimes(1);
  });
});
