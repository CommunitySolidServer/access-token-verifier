import type {
  SolidAccessToken,
  SolidAccessTokenHeader,
  SolidAccessTokenPayload,
} from "../../src/type";

const header: SolidAccessTokenHeader = {
  alg: "RS256",
  kid: "x",
};

const payload: SolidAccessTokenPayload = {
  aud: "solid",
  exp: 1603386448,
  iat: 1603386448,
  iss: "https://example.com/issuer",
  webid: "https://example.com/webid",
  client_id: "https://example.com/clientid",
};

export const token: SolidAccessToken = {
  header,
  payload,
  signature: "",
};
