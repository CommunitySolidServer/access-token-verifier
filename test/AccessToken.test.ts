import jwtVerify from "jose/jwt/verify";
import { encode as base64Encode } from "jose/util/base64url";
import { verify } from "../src/lib/AccessToken";
import { keySet as getKeySet } from "../src/lib/Issuer";
import type { AccessToken, AccessTokenPayload } from "../src/types";

jest.mock("jose/jwt/verify");
jest.mock("../src/lib/Issuer");

describe("Access Token", () => {
  (getKeySet as jest.Mock).mockImplementation(() => true);
  const accessTokenPayload: AccessTokenPayload = {
    aud: "solid",
    exp: 1603386448,
    iat: 1603386448,
    iss: "https://example.com/issuer",
    webid: "https://example.com/webid",
    client_id: "https://example.com/clientid",
    cnf: { jkt: "confirmed_ID" },
  };
  const wrongAccessTokenPayload: AccessTokenPayload = {
    aud: "solid",
    exp: 1603386448,
    iat: 1603386448,
    iss: "https://example.com/issuer",
    webid: "xyz://example.com/webid",
    client_id: "https://example.com/clientid",
    cnf: { jkt: "confirmed_ID" },
  };
  const accessToken: AccessToken = {
    header: {
      alg: "RS256",
      kid: "x",
    },
    payload: accessTokenPayload,
    signature: "",
  };
  const authorizationHeader = `${base64Encode(
    JSON.stringify(accessToken.header)
  )}.${base64Encode(JSON.stringify(accessToken.payload))}.`;
  const wrongAuthorizationHeader = `${base64Encode(
    JSON.stringify(accessToken.header)
  )}.${base64Encode(JSON.stringify(wrongAccessTokenPayload))}.`;

  it("Checks conforming access token", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    expect(
      await verify(
        authorizationHeader,
        () =>
          Promise.resolve([
            "https://example.com/abc",
            "https://example.com/issuer",
          ]),
        getKeySet
      )
    ).toStrictEqual(accessToken);
  });

  it("Throws on non conforming access token", async () => {
    await expect(
      verify(
        wrongAuthorizationHeader,
        () => Promise.resolve(["https://example.com/issuer"]),
        getKeySet
      )
    ).rejects.toThrow("Unsupported URL claim protocol.");
  });

  it("Throws when issuer doesn't match", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: accessToken.payload,
      protectedHeader: accessToken.header,
    });

    await expect(
      verify(
        authorizationHeader,
        () => Promise.resolve(["https://example.com/not_the_issuer"]),
        getKeySet
      )
    ).rejects.toThrow(
      "Incorrect issuer https://example.com/issuer for WebID https://example.com/webid"
    );
  });
});
