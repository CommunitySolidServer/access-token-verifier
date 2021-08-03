import { retrieveAccessTokenIssuerKeySet } from "../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { retrieveWebidTrustedOidcIssuers } from "../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { verifyDpopProof } from "../src/algorithm/verifyDpopProof";
import { verifySolidAccessToken } from "../src/algorithm/verifySolidAccessToken";
import { verify } from "../src/lib/Verify";
import type { DPoPOptions } from "../src/type";
import { token as bearerAccessToken } from "./fixture/BearerAccessToken";
import { token as dpopBoundAccessToken } from "./fixture/DPoPBoundAccessToken";
import { encodeToken } from "./fixture/EncodeToken";

jest.mock("../src/algorithm/verifySolidAccessToken");
jest.mock("../src/algorithm/verifyDpopProof");

afterEach(() => {
  jest.clearAllMocks();
});

describe("Verifying Token", () => {
  const dpopOptions: DPoPOptions = { header: "", method: "GET", url: "" };
  const dpopOptionsWithJTICheckFunction: DPoPOptions = {
    header: "",
    method: "GET",
    url: "",
    isDuplicateJTI: () => false,
  };

  it("Verifies DPoP bound token based on cnf claim", async () => {
    (verifySolidAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDpopProof as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verify({ header: encodeToken(dpopBoundAccessToken) }, dpopOptions)
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("Verifies DPoP bound token based on prefix", async () => {
    (verifySolidAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDpopProof as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verify(
        { header: `DPoP ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("Verifies DPoP bound token with custom GetIssuersFunction, GetKeySetFunction and JTICheckFunction", async () => {
    (verifySolidAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDpopProof as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verify(
        {
          header: `DPoP ${encodeToken(dpopBoundAccessToken)}`,
          issuers: retrieveWebidTrustedOidcIssuers,
          keySet: retrieveAccessTokenIssuerKeySet,
        },
        dpopOptionsWithJTICheckFunction
      )
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("Throws when DPoP bound token DPoP validation fails", async () => {
    (verifySolidAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDpopProof as jest.Mock).mockRejectedValueOnce(
      new Error("Not a proof")
    );

    await expect(
      verify(
        { header: `DPoP ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).rejects.toThrow("Not a proof");
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("Throws when DPoP options are missing", async () => {
    (verifySolidAccessToken as jest.Mock).mockResolvedValueOnce(
      dpopBoundAccessToken
    );
    (verifyDpopProof as jest.Mock).mockRejectedValueOnce(
      new Error("Not a proof")
    );

    await expect(
      verify({ header: `DPoP ${encodeToken(dpopBoundAccessToken)}` })
    ).rejects.toThrow(
      "DPoP options missing for DPoP bound access token verification"
    );
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(0);
  });

  it("Verifies Bearer token", async () => {
    (verifySolidAccessToken as jest.Mock).mockResolvedValueOnce(
      bearerAccessToken
    );

    expect(
      await verify({ header: encodeToken(bearerAccessToken) })
    ).toStrictEqual(bearerAccessToken.payload);
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(0);
  });

  it("Throws when verification fails", async () => {
    (verifySolidAccessToken as jest.Mock).mockRejectedValueOnce(
      new Error("Not a valid access token")
    );

    await expect(
      verify(
        { header: `DPoP ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).rejects.toThrow("Not a valid access token");
    expect(verifySolidAccessToken).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(0);
  });
});
