import { verifySolidAccessToken } from "../src/algorithm/verifySolidAccessToken";
import { createSolidTokenVerifier } from "../src/class/SolidTokenVerifier";

jest.mock("../src/algorithm/verifySolidAccessToken");

afterEach(() => {
  jest.clearAllMocks();
});

describe("SolidTokenVerifier (instantiated via createSolidTokenVerifier())", () => {
  (verifySolidAccessToken as jest.Mock).mockResolvedValue(true);
  const solidTokenVerifier = createSolidTokenVerifier();

  it("calls the verification function with DPoP options", async () => {
    expect(
      await solidTokenVerifier("", { header: "", method: "GET", url: "" })
    ).toBe(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });

  it("calls the verification function with authorization header", async () => {
    expect(await solidTokenVerifier("")).toBe(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });
});
