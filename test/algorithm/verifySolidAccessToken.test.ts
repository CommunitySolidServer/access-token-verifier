import type * as Jose from "jose";
import { jwtVerify } from "jose";
import { retrieveAccessTokenIssuerKeySet } from "../../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { verifySolidAccessToken } from "../../src/algorithm/verifySolidAccessToken";
import {
  IssuerVerificationError,
  SecureUriClaimVerificationError,
} from "../../src/error";
import { token as bearerToken } from "../fixture/BearerAccessToken";
import {
  badProtocolPayload,
  token as accessToken,
  tokenAudienceArray,
} from "../fixture/DPoPBoundAccessToken";
import { encodeToken } from "../util/encodeToken";

jest.mock("jose", () => {
  return {
    ...jest.requireActual("jose"),
    jwtVerify: jest.fn(),
  } as typeof Jose;
});
jest.mock("../../src/algorithm/retrieveAccessTokenIssuerKeySet");
jest.mock("../../src/algorithm/verifyDpopProof");

describe("verifySolidAccessToken()", () => {
  (retrieveAccessTokenIssuerKeySet as jest.Mock).mockImplementation(() => true);

  it("checks DPoP bound access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: bearerToken.payload,
      protectedHeader: bearerToken.header,
    });

    expect(
      await verifySolidAccessToken(
        {
          header: `DPoP ${encodeToken(bearerToken)}`,
          issuers: () =>
            Promise.resolve([
              "https://example.com/abc",
              "https://example.com/issuer",
            ]),
          keySet: retrieveAccessTokenIssuerKeySet,
        },
        {
          header: "x.y.z",
          method: "GET",
          url: "https://example.org",
          isDuplicateJTI: () => false,
        }
      )
    ).toStrictEqual(bearerToken.payload);
  });

  it("checks DPoP bound access token with audience array", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: tokenAudienceArray.payload,
      protectedHeader: tokenAudienceArray.header,
    });

    expect(
      await verifySolidAccessToken(
        {
          header: `DPoP ${encodeToken(tokenAudienceArray)}`,
          issuers: () =>
            Promise.resolve([
              "https://example.com/abc",
              "https://example.com/issuer",
            ]),
          keySet: retrieveAccessTokenIssuerKeySet,
        },
        {
          header: "x.y.z",
          method: "GET",
          url: "https://example.org",
          isDuplicateJTI: () => false,
        }
      )
    ).toStrictEqual(tokenAudienceArray.payload);
  });

  it("checks bearer access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: bearerToken.payload,
      protectedHeader: accessToken.header,
    });

    expect(
      await verifySolidAccessToken({
        header: `Bearer ${encodeToken(bearerToken)}`,
        issuers: () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        keySet: retrieveAccessTokenIssuerKeySet,
      })
    ).toStrictEqual(bearerToken.payload);
  });

  it("throws on invalid header", async () => {
    await expect(
      verifySolidAccessToken({
        header: "invalid",
        issuers: () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        keySet: retrieveAccessTokenIssuerKeySet,
      })
    ).rejects.toThrow();
  });

  it("throws on non conforming access token", async () => {
    const wrongProtocolToken = {
      header: accessToken.header,
      payload: badProtocolPayload,
      signature: accessToken.signature,
    };

    await expect(
      verifySolidAccessToken({
        header: `Bearer ${encodeToken(wrongProtocolToken)}`,
        issuers: () => Promise.resolve(["https://example.com/issuer"]),
        keySet: retrieveAccessTokenIssuerKeySet,
      })
    ).rejects.toThrow(SecureUriClaimVerificationError);
  });

  it("throws when issuer doesn't match", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    await expect(
      verifySolidAccessToken({
        header: `Bearer ${encodeToken(accessToken)}`,
        issuers: () => Promise.resolve(["https://example.com/not_the_issuer"]),
        keySet: retrieveAccessTokenIssuerKeySet,
      })
    ).rejects.toThrow(IssuerVerificationError);
  });
});
