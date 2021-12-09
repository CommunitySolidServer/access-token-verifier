import type { SolidAccessToken } from "../../src/type/SolidAccessToken";

export const SOLID_ACCESS_TOKEN_X: SolidAccessToken = {
  header: {
    alg: "ES256",
    kid: "x",
  },
  payload: {
    aud: "solid",
    exp: 0,
    iat: 0,
    iss: "x",
    webid: "x",
    client_id: "x",
  },
  signature: "x",
};
