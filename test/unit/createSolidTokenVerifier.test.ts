import { verifySolidAccessToken } from "../../src/algorithm/verifySolidAccessToken";
import { createSolidTokenVerifier } from "../../src/index";

jest.mock("../../src/algorithm/verifySolidAccessToken");

afterEach(() => {
  jest.clearAllMocks();
});

describe("createSolidTokenVerifier", () => {
  (verifySolidAccessToken as jest.Mock).mockResolvedValue(true);
  const solidTokenVerifier = createSolidTokenVerifier();

  it("instantiates a function that calls the verification function with DPoP options", async () => {
    expect(
      await solidTokenVerifier("", { header: "", method: "GET", url: "" })
    ).toBe(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });

  it("instantiates a function that calls the verification function with authorization header", async () => {
    expect(await solidTokenVerifier("")).toBe(true);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
  });
});
