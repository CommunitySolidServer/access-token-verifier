import { verify as verifyAccessToken } from "../src/lib/AccessToken";
import { verify as verifyDPoPToken } from "../src/lib/DPoP";
import { isDuplicate as isDuplicateJTI } from "../src/lib/JTI";
import { verify } from "../src/lib/Verify";
import { token as bearerAccessToken } from "./fixture/BearerAccessToken";
import { token as dpopBoundAccessToken } from "./fixture/DPoPBoundAccessToken";
import { encodeToken } from "./fixture/EncodeToken";

jest.mock("../src/lib/AccessToken");
jest.mock("../src/lib/DPoP");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Verifying Token", () => {
  it("Verifies DPoP bound token based on cnf claim", async () => {
    (verifyAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDPoPToken as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verify(encodeToken(dpopBoundAccessToken), "", "GET", "")
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifyAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDPoPToken).toHaveBeenCalledTimes(1);
  });

  it("Verifies DPoP bound token based on prefix", async () => {
    (verifyAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDPoPToken as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verify(`DPoP ${encodeToken(dpopBoundAccessToken)}`, "", "GET", "")
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifyAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDPoPToken).toHaveBeenCalledTimes(1);
  });

  it("Throws when DPoP bound token DPoP validation fails", async () => {
    (verifyAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDPoPToken as jest.Mock).mockRejectedValueOnce(
      new Error("Not a proof")
    );

    await expect(
      verify(`DPoP ${encodeToken(dpopBoundAccessToken)}`, "", "GET", "")
    ).rejects.toThrow("Not a proof");
    expect(verifyAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDPoPToken).toHaveBeenCalledTimes(1);
  });

  it("Verifies Bearer token", async () => {
    (verifyAccessToken as jest.Mock).mockResolvedValueOnce(bearerAccessToken);

    expect(
      await verify(encodeToken(bearerAccessToken), "", "GET", "")
    ).toStrictEqual(bearerAccessToken.payload);
    expect(verifyAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDPoPToken).toHaveBeenCalledTimes(0);
  });

  it("Throws when verification fails", async () => {
    (verifyAccessToken as jest.Mock).mockRejectedValueOnce(
      new Error("Not a valid access token")
    );

    await expect(
      verify(`DPoP ${encodeToken(dpopBoundAccessToken)}`, "", "GET", "")
    ).rejects.toThrow("Not a valid access token");
    expect(verifyAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDPoPToken).toHaveBeenCalledTimes(0);
  });

  it("By defaults checks JTI as not duplicate", () => {
    expect(isDuplicateJTI()).toBe(false);
  });
});
