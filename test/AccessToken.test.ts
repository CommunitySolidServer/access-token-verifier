import jwtVerify from "jose/jwt/verify";
import { SecureUriVerificationError } from "../src/error";
import { verify } from "../src/lib/AccessToken";
import { keySet as getKeySet } from "../src/lib/Issuer";
import { token as bearerToken } from "./fixture/BearerAccessToken";
import {
  badProtocolPayload,
  token as accessToken,
  tokenAudienceArray,
} from "./fixture/DPoPBoundAccessToken";
import { encodeToken } from "./fixture/EncodeToken";

jest.mock("jose/jwt/verify");
jest.mock("../src/lib/Issuer");

describe("Access Token", () => {
  (getKeySet as jest.Mock).mockImplementation(() => true);

  it("Checks DPoP bound access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    expect(
      await verify(
        encodeToken(accessToken),
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        getKeySet
      )
    ).toStrictEqual(accessToken);
  });

  it("Checks DPoP bound access token with audience array", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: tokenAudienceArray.payload,
      protectedHeader: tokenAudienceArray.header,
    });

    expect(
      await verify(
        encodeToken(tokenAudienceArray),
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        getKeySet
      )
    ).toStrictEqual(tokenAudienceArray);
  });

  it("Checks bearer access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: bearerToken.payload,
      protectedHeader: accessToken.header,
    });

    expect(
      await verify(
        encodeToken(bearerToken),
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        getKeySet
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
      verify(
        encodeToken(wrongProtocolToken),
        () => Promise.resolve(["https://example.com/issuer"]),
        getKeySet
      )
    ).rejects.toThrow(SecureUriVerificationError);
  });

  it("Throws when issuer doesn't match", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    await expect(
      verify(
        encodeToken(accessToken),
        () => Promise.resolve(["https://example.com/not_the_issuer"]),
        getKeySet
      )
    ).rejects.toThrow(
      "Incorrect issuer https://example.com/issuer for WebID https://example.com/webid"
    );
  });
});
