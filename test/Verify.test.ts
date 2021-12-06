import type * as Jose from "jose";
import { jwtVerify } from "jose";
import { retrieveAccessTokenIssuerKeySet } from "../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { retrieveWebidTrustedOidcIssuers } from "../src/algorithm/retrieveWebidTrustedOidcIssuers";
import { verifyDpopProof } from "../src/algorithm/verifyDpopProof";
import { verifySolidAccessToken } from "../src/algorithm/verifySolidAccessToken";
import { AuthenticationSchemeVerificationError } from "../src/error/AuthenticationSchemeVerificationError";
import type { DPoPOptions } from "../src/type";
import { token as bearerAccessToken } from "./fixture/BearerAccessToken";
import { token as dpopBoundAccessToken } from "./fixture/DPoPBoundAccessToken";
import { encodeToken } from "./util/encodeToken";

jest.mock("jose", () => {
  return {
    ...jest.requireActual("jose"),
    jwtVerify: jest.fn(),
  } as typeof Jose;
});
jest.mock("../src/algorithm/retrieveAccessTokenIssuerKeySet");
jest.mock("../src/algorithm/retrieveWebidTrustedOidcIssuers");
jest.mock("../src/algorithm/verifyDpopProof");

afterEach(() => {
  jest.clearAllMocks();
});

describe("verifySolidAccessToken()", () => {
  const dpopOptions: DPoPOptions = { header: "", method: "GET", url: "" };
  const dpopOptionsWithJTICheckFunction: DPoPOptions = {
    header: "",
    method: "GET",
    url: "",
    isDuplicateJTI: () => false,
  };

  it("verifies DPoP bound token based on cnf claim", async () => {
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      dpopBoundAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopBoundAccessToken.payload,
      protectedHeader: dpopBoundAccessToken.header,
    });
    (verifyDpopProof as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verifySolidAccessToken(
        { header: `dpop ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("verifies DPoP bound token based on prefix", async () => {
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      bearerAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopBoundAccessToken.payload,
      protectedHeader: dpopBoundAccessToken.header,
    });

    expect(
      await verifySolidAccessToken(
        { header: `DPoP ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("verifies DPoP bound token with custom GetIssuersFunction, GetKeySetFunction and JTICheckFunction", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopBoundAccessToken.payload,
      protectedHeader: dpopBoundAccessToken.header,
    });
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      dpopBoundAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);
    (verifyDpopProof as jest.Mock).mockResolvedValueOnce(true);

    expect(
      await verifySolidAccessToken(
        {
          header: `DPoP ${encodeToken(dpopBoundAccessToken)}`,
          // eslint-disable-next-line @typescript-eslint/require-await
          issuers: retrieveWebidTrustedOidcIssuers,
          keySet: retrieveAccessTokenIssuerKeySet,
        },
        dpopOptionsWithJTICheckFunction
      )
    ).toStrictEqual(dpopBoundAccessToken.payload);
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("throws when DPoP bound token DPoP validation fails", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopBoundAccessToken.payload,
      protectedHeader: dpopBoundAccessToken.header,
    });
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      dpopBoundAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);
    (verifyDpopProof as jest.Mock).mockRejectedValueOnce(
      new Error("Not a proof")
    );

    await expect(
      verifySolidAccessToken(
        { header: `DPoP ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).rejects.toThrow("Not a proof");
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(1);
  });

  it("throws when DPoP options are missing", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopBoundAccessToken.payload,
      protectedHeader: dpopBoundAccessToken.header,
    });
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      dpopBoundAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      verifySolidAccessToken({
        header: `DPoP ${encodeToken(dpopBoundAccessToken)}`,
      })
    ).rejects.toThrow(
      "DPoP options missing for DPoP bound access token verification"
    );
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(0);
  });

  it("verifies Bearer token", async () => {
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      bearerAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: bearerAccessToken.payload,
      protectedHeader: bearerAccessToken.header,
    });

    expect(
      await verifySolidAccessToken({
        header: `bearer ${encodeToken(bearerAccessToken)}`,
      })
    ).toStrictEqual(bearerAccessToken.payload);
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(0);
  });

  it("throws when verification fails", async () => {
    (retrieveWebidTrustedOidcIssuers as jest.Mock).mockResolvedValueOnce([
      bearerAccessToken.payload.iss,
    ]);
    (retrieveAccessTokenIssuerKeySet as jest.Mock).mockResolvedValueOnce(null);
    (jwtVerify as jest.Mock).mockRejectedValueOnce(
      new Error("Not a valid access token")
    );

    await expect(
      verifySolidAccessToken(
        { header: `DPoP ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).rejects.toThrow("Not a valid access token");
    expect(jwtVerify).toHaveBeenCalledTimes(1);
    expect(verifyDpopProof).toHaveBeenCalledTimes(0);
  });

  it("throws when authentication scheme is not supported", async () => {
    await expect(
      verifySolidAccessToken(
        { header: `OtherScheme ${encodeToken(dpopBoundAccessToken)}` },
        dpopOptions
      )
    ).rejects.toThrow(AuthenticationSchemeVerificationError);
  });
});
