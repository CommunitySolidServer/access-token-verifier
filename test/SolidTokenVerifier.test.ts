import { verifySolidAccessToken } from "../src/algorithm/verifySolidAccessToken";
import { createSolidTokenVerifier } from "../src/class/SolidTokenVerifier";

jest.mock("../src/algorithm/verifySolidAccessToken");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Solid Token Verifier", () => {
  (verifySolidAccessToken as jest.Mock).mockResolvedValue(true);
  const solidTokenVerifier = createSolidTokenVerifier();

  it("Calls the verification function with DPoP options", async () => {
    expect(
      await solidTokenVerifier("", { header: "", method: "GET", url: "" })
    ).toStrictEqual(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });

  it("Calls the verification function with authorization header", async () => {
    expect(await solidTokenVerifier("")).toStrictEqual(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });
});
