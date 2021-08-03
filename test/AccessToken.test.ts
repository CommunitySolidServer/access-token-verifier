import jwtVerify from "jose/jwt/verify";
import { retrieveAccessTokenIssuerKeySet } from "../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { verifySolidAccessToken } from "../src/algorithm/verifySolidAccessToken";
import {
  IssuerVerificationError,
  SecureUriClaimVerificationError,
} from "../src/error";
import { token as bearerToken } from "./fixture/BearerAccessToken";
import {
  badProtocolPayload,
  token as accessToken,
  tokenAudienceArray,
} from "./fixture/DPoPBoundAccessToken";
import { encodeToken } from "./fixture/EncodeToken";

jest.mock("jose/jwt/verify");
jest.mock("../src/algorithm/retrieveAccessTokenIssuerKeySet");

describe("Access Token", () => {
  (retrieveAccessTokenIssuerKeySet as jest.Mock).mockImplementation(() => true);

  it("Checks DPoP bound access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    expect(
      await verifySolidAccessToken(
        encodeToken(accessToken),
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        retrieveAccessTokenIssuerKeySet
      )
    ).toStrictEqual(accessToken);
  });

  it("Checks DPoP bound access token with audience array", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: tokenAudienceArray.payload,
      protectedHeader: tokenAudienceArray.header,
    });

    expect(
      await verifySolidAccessToken(
        encodeToken(tokenAudienceArray),
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        retrieveAccessTokenIssuerKeySet
      )
    ).toStrictEqual(tokenAudienceArray);
  });

  it("Checks bearer access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: bearerToken.payload,
      protectedHeader: accessToken.header,
    });

    expect(
      await verifySolidAccessToken(
        encodeToken(bearerToken),
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        retrieveAccessTokenIssuerKeySet
      )
    ).toStrictEqual({
      header: bearerToken.header,
      payload: bearerToken.payload,
      signature: bearerToken.signature,
    });
  });

  it("Throws on non conforming access token", async () => {
    const wrongProtocolToken = {
      header: accessToken.header,
      payload: badProtocolPayload,
      signature: accessToken.signature,
    };

    await expect(
      verifySolidAccessToken(
        encodeToken(wrongProtocolToken),
        () => Promise.resolve(["https://example.com/issuer"]),
        retrieveAccessTokenIssuerKeySet
      )
    ).rejects.toThrow(SecureUriClaimVerificationError);
  });

  it("Throws when issuer doesn't match", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    await expect(
      verifySolidAccessToken(
        encodeToken(accessToken),
        () => Promise.resolve(["https://example.com/not_the_issuer"]),
        retrieveAccessTokenIssuerKeySet
      )
    ).rejects.toThrow(IssuerVerificationError);
  });
});
