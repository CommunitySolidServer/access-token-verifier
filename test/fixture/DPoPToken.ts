import type {
  DPoPToken,
  DPoPTokenHeader,
  DPoPTokenPayload,
} from "../../src/type";

const dpopTokenHeaderEC: DPoPTokenHeader = {
  typ: "dpop+jwt",
  alg: "ES256",
  jwk: {
    kty: "EC",
    x: "l8tFrhx-34tV3hRICRDY9zCkDlpBhF42UQUfWVAWBFs",
    y: "9VE4jf_Ok_o64zbTTlcuNJajHmt6v9TDVrU0CdvGRDA",
    crv: "P-256",
  },
};

export const dpopTokenHeaderUnsupported: unknown = {
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
  signature: "x",
};
