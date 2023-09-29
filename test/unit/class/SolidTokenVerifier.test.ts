import { verifySolidAccessToken } from "../../../src/algorithm/verifySolidAccessToken";
import { SolidTokenVerifier } from "../../../src/class/SolidTokenVerifier";

jest.mock("../../../src/algorithm/verifySolidAccessToken");

afterEach(() => {
  jest.clearAllMocks();
});

describe("SolidTokenVerifier", () => {
  (verifySolidAccessToken as jest.Mock).mockResolvedValue(true);
  const solidTokenVerifier = new SolidTokenVerifier();

  it("calls the verification function with DPoP options", async () => {
    expect(
      await solidTokenVerifier.verify("", {
        header: "",
        method: "GET",
        url: "",
      }),
    ).toBe(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });

  it("calls the verification function with authorization header", async () => {
    expect(await solidTokenVerifier.verify("")).toBe(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });
});
