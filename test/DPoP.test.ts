import jwtVerify from "jose/jwt/verify";
import { encode as base64Encode } from "jose/util/base64url";
import { verify } from "../src/lib/DPoP";
import type {
  DPoPToken,
  DPoPTokenHeader,
  DPoPTokenPayload,
} from "../src/types";

jest.mock("jose/jwt/verify");

describe("DPoP proof", () => {
  const dpopTokenHeaderEC: DPoPTokenHeader = {
    alg: "ES256",
    jwk: {
      crv: "P-256",
      x: "",
      y: "",
      kid: "confirmed_ID",
      kty: "EC",
    },
    typ: "dpop+jwt",
  };
  const dpopTokenHeaderRSA: DPoPTokenHeader = {
    alg: "RS256",
    jwk: {
      alg: "RS256",
      e: "",
      n: "",
      kid: "confirmed_ID",
      kty: "RSA",
    },
    typ: "dpop+jwt",
  };
  const dpopTokenHeaderUnsupported: any = {
    alg: "RS256",
    jwk: {
      alg: "RS256",
      e: "",
      n: "",
      kid: "confirmed_ID",
      kty: "UNSUPPORTED_KEY_TYPE",
    },
    typ: "dpop+jwt",
  };
  const dpopTokenPayload: DPoPTokenPayload = {
    htm: "GET",
    htu: "https://example.com",
    iat: 1603386448,
    jti: "1",
  };
  const dpopTokenEC: DPoPToken = {
    header: dpopTokenHeaderEC,
    payload: dpopTokenPayload,
    signature: "",
  };
  const dpopTokenRSA: DPoPToken = {
    header: dpopTokenHeaderRSA,
    payload: dpopTokenPayload,
    signature: "",
  };
  const accessToken: any = { payload: { cnf: { jkt: "confirmed_ID" } } };
  const wrongAccessToken: any = { payload: { cnf: { jkt: "unconfirmed_ID" } } };
  const dpopHeader = `${base64Encode(
    JSON.stringify(dpopTokenEC.header)
  )}.${base64Encode(JSON.stringify(dpopTokenEC.payload))}.`;
  const dpopHeaderRSA = `${base64Encode(
    JSON.stringify(dpopTokenRSA.header)
  )}.${base64Encode(JSON.stringify(dpopTokenRSA.payload))}.`;
  const dpopHeaderUnsupported = `${base64Encode(
    JSON.stringify(dpopTokenHeaderUnsupported)
  )}.${base64Encode(JSON.stringify(dpopTokenRSA.payload))}.`;

  it("Checks conforming proof", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    expect(
      await verify(
        dpopHeader,
        accessToken,
        "GET",
        "https://example.com",
        () => false
      )
    ).toStrictEqual(dpopTokenEC);
  });

  it("Checks conforming proof with RSA JWK", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenRSA.payload,
      protectedHeader: dpopTokenRSA.header,
    });

    expect(
      await verify(
        dpopHeaderRSA,
        accessToken,
        "GET",
        "https://example.com",
        () => false
      )
    ).toStrictEqual(dpopTokenRSA);
  });

  it("Throws on unsupported JWK", async () => {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenRSA.payload,
      protectedHeader: dpopTokenHeaderUnsupported,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    await expect(
      verify(
        dpopHeaderUnsupported,
        accessToken,
        "GET",
        "https://example.com",
        () => false
      )
    ).rejects.toThrow("Expected EC or RSA, got:\nUNSUPPORTED_KEY_TYPE");
  });

  it("Throws on wrong method", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    await expect(
      verify(
        dpopHeader,
        accessToken,
        "POST",
        "https://example.com",
        () => false
      )
    ).rejects.toThrow("Expected POST, got:\nGET");
  });

  it("Throws on wrong URL", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    await expect(
      verify(
        dpopHeader,
        accessToken,
        "GET",
        "https://example.coms",
        () => false
      )
    ).rejects.toThrow(
      "Expected https://example.coms, got:\nhttps://example.com"
    );
  });

  it("Throws on duplicate JTI", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    await expect(
      verify(dpopHeader, accessToken, "GET", "https://example.com", () => true)
    ).rejects.toThrow("Expected false, got:\ntrue");
  });

  it("Throws on wrong confirmation claim", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    await expect(
      verify(
        dpopHeader,
        wrongAccessToken,
        "GET",
        "https://example.com",
        () => true
      )
    ).rejects.toThrow("Expected unconfirmed_ID, got:\nconfirmed_ID");
  });
});
