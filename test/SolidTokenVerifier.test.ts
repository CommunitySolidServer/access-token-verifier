import { createSolidTokenVerifier } from "../src/lib/SolidTokenVerifier";
import { verify as verifyToken } from "../src/lib/Verify";

jest.mock("../src/lib/Verify");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Solid Token Verifier", () => {
  (verifyToken as jest.Mock).mockResolvedValue(true);
  const solidTokenVerifier = createSolidTokenVerifier();

  it("Calls the verification function with DPoP options", async () => {
    expect(
      await solidTokenVerifier("", { header: "", method: "GET", url: "" })
    ).toStrictEqual(true);
    expect(verifyToken).toHaveBeenCalledTimes(1);
  });

  it("Calls the verification function with authorization header", async () => {
    expect(await solidTokenVerifier("")).toStrictEqual(true);
    expect(verifyToken).toHaveBeenCalledTimes(1);
  });
});
