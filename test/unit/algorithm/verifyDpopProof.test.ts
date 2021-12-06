import type * as Jose from "jose";
import { jwtVerify } from "jose";
import { verifyDpopProof } from "../../../src/algorithm/verifyDpopProof";
import { verifyDpopProofAccessTokenHash } from "../../../src/algorithm/verifyDpopProofAccessTokenHash";
import { HttpMethodVerificationError } from "../../../src/error/HttpMethodVerificationError";
import { HttpUriVerificationError } from "../../../src/error/HttpUriVerificationError";
import { JwkThumbprintVerificationError } from "../../../src/error/JwkThumbprintVerificationError";
import { JwtIdentifierVerificationError } from "../../../src/error/JwtIdentifierVerificationError";
import type {
  DPoPToken,
  DPoPTokenPayload,
  SolidAccessToken,
} from "../../../src/type";
import { encodeToken } from "../../util/encodeToken";

jest.mock("jose", () => {
  return {
    ...jest.requireActual("jose"),
    jwtVerify: jest.fn(),
  } as typeof Jose;
});
jest.mock("../../../src/algorithm/verifyDpopProofAccessTokenHash");

const dpop: DPoPToken = {
  header: {
    typ: "dpop+jwt",
    alg: "ES256",
    jwk: {
      kty: "EC",
      x: "l8tFrhx-34tV3hRICRDY9zCkDlpBhF42UQUfWVAWBFs",
      y: "9VE4jf_Ok_o64zbTTlcuNJajHmt6v9TDVrU0CdvGRDA",
      crv: "P-256",
    },
  },
  payload: {
    jti: "e1j3V_bKic8-LAEB",
    htm: "GET",
    htu: "https://resource.example.org/protectedresource",
    iat: 1562262618,
  },
  signature:
    "lNhmpAX1WwmpBvwhok4E74kWCiGBNdavjLAeevGy32H3dbF0Jbri69Nm2ukkwb-uyUI4AUg1JSskfWIyo4UCbQ",
};

const dpopPayloadWithAth: DPoPTokenPayload = {
  jti: "e1j3V_bKic8-LAEB",
  htm: "GET",
  htu: "https://resource.example.org/protectedresource",
  iat: 1562262618,
  ath: "bla",
};

const dpopRSA: DPoPToken = {
  header: {
    typ: "dpop+jwt",
    alg: "RS256",
    jwk: {
      alg: "RS256",
      kty: "RSA",
      e: "AQAB",
      n: "12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ",
    },
  },
  payload: dpop.payload,
  signature: "",
};

const dpopWrongKeyType: DPoPToken = {
  header: {
    typ: "dpop+jwt",
    alg: "RS256",
    jwk: {
      alg: "RS256",
      kty: "UNSUPPORTED_KEY_TYPE",
      e: "AQAB",
      n: "12oBZRhCiZFJLcPg59LkZZ9mdhSMTKAQZYq32k_ti5SBB6jerkh-WzOMAO664r_qyLkqHUSp3u5SbXtseZEpN3XPWGKSxjsy-1JyEFTdLSYe6f9gfrmxkUF_7DTpq0gn6rntP05g2-wFW50YO7mosfdslfrTJYWHFhJALabAeYirYD7-9kqq9ebfFMF4sRRELbv9oi36As6Q9B3Qb5_C1rAzqfao_PCsf9EPsTZsVVVkA5qoIAr47lo1ipfiBPxUCCNSdvkmDTYgvvRm6ZoMjFbvOtgyts55fXKdMWv7I9HMD5HwE9uW839PWA514qhbcIsXEYSFMPMV6fnlsiZvQQ",
    },
  },
  payload: dpop.payload,
  signature: "",
};

describe("verifyDpopProof()", () => {
  it("checks conforming proof with EC Key", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpop.payload,
      protectedHeader: dpop.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).resolves.not.toThrow();
  });

  it("checks conforming proof with EC Key and ath claim", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopPayloadWithAth,
      protectedHeader: dpop.header,
    });
    (verifyDpopProofAccessTokenHash as jest.Mock).mockReturnValueOnce(true);

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).resolves.not.toThrow();
  });

  it("throws on invalid DPoP header", async () => {
    await expect(
      verifyDpopProof(
        "invalid",
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).rejects.toThrow();
  });

  it("throws on invalid ath claim", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopPayloadWithAth,
      protectedHeader: dpop.header,
    });
    (verifyDpopProofAccessTokenHash as jest.Mock).mockImplementationOnce(() => {
      throw new Error();
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).rejects.toThrow();
  });

  it("checks conforming proof with RSA Key", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopRSA.payload,
      protectedHeader: dpopRSA.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpopRSA),
        {
          payload: {
            cnf: { jkt: "cbaZgHZazjgQq0Q2-Hy_o2-OCDpPu02S30lNhTsNU1Q" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).resolves.not.toThrow();
  });

  it("fails unsupported Key type", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpopWrongKeyType.payload,
      protectedHeader: dpopWrongKeyType.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpopRSA),
        {
          payload: {
            cnf: { jkt: "cbaZgHZazjgQq0Q2-Hy_o2-OCDpPu02S30lNhTsNU1Q" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).rejects.toThrow("Expected EC or RSA, got:\nUNSUPPORTED_KEY_TYPE");
  });

  it("throws on wrong method", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpop.payload,
      protectedHeader: dpop.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "POST",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).rejects.toThrow(HttpMethodVerificationError);
  });

  it("throws on wrong url", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpop.payload,
      protectedHeader: dpop.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/otherresource",
        () => false
      )
    ).rejects.toThrow(HttpUriVerificationError);
  });

  it("throws on duplicate JTI", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpop.payload,
      protectedHeader: dpop.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: {
            cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
          },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => true
      )
    ).rejects.toThrow(JwtIdentifierVerificationError);
  });

  it("throws on wrong confirmation claim", async () => {
    (jwtVerify as jest.Mock).mockResolvedValueOnce({
      payload: dpop.payload,
      protectedHeader: dpop.header,
    });

    await expect(
      verifyDpopProof(
        encodeToken(dpop),
        {
          payload: { cnf: { jkt: "UNCONFIRMED_KEY_THUMBPRINT" } },
        } as any as SolidAccessToken,
        "",
        "GET",
        "https://resource.example.org/protectedresource",
        () => false
      )
    ).rejects.toThrow(JwkThumbprintVerificationError);
  });
});
