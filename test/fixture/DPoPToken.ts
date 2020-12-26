import type {
  DPoPToken,
  DPoPTokenHeader,
  DPoPTokenPayload,
} from "../../src/types";

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

export const dpopTokenHeaderUnsupported: any = {
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

export const dpopTokenEC: DPoPToken = {
  header: dpopTokenHeaderEC,
  payload: dpopTokenPayload,
  signature: "",
};

export const dpopTokenRSA: DPoPToken = {
  header: dpopTokenHeaderRSA,
  payload: dpopTokenPayload,
  signature: "",
};
