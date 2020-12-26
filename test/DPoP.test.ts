import jwtVerify from "jose/jwt/verify";
import { verify } from "../src/lib/DPoP";
import {
  dpopTokenHeaderUnsupported,
  dpopTokenEC,
  dpopTokenRSA,
} from "./fixture/DPoPToken";
import { encodeToken } from "./fixture/EncodeToken";

jest.mock("jose/jwt/verify");

describe("DPoP proof", () => {
  const accessToken: any = { payload: { cnf: { jkt: "confirmed_ID" } } };
  const wrongAccessToken: any = { payload: { cnf: { jkt: "unconfirmed_ID" } } };

  it("Checks conforming proof", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    expect(
      await verify(
        encodeToken(dpopTokenEC),
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
        encodeToken(dpopTokenRSA),
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
    const unsupportedKeyType = {
      header: dpopTokenHeaderUnsupported,
      payload: dpopTokenRSA.payload,
      signature: "",
    };
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */

    await expect(
      verify(
        encodeToken(unsupportedKeyType),
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
        encodeToken(dpopTokenEC),
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
        encodeToken(dpopTokenEC),
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
      verify(
        encodeToken(dpopTokenEC),
        accessToken,
        "GET",
        "https://example.com",
        () => true
      )
    ).rejects.toThrow("Expected false, got:\ntrue");
  });

  it("Throws on wrong confirmation claim", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopTokenEC.payload,
      protectedHeader: dpopTokenEC.header,
    });

    await expect(
      verify(
        encodeToken(dpopTokenEC),
        wrongAccessToken,
        "GET",
        "https://example.com",
        () => true
      )
    ).rejects.toThrow("Expected unconfirmed_ID, got:\nconfirmed_ID");
  });
});
