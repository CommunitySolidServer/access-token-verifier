import type {
  AccessToken,
  AccessTokenHeader,
  AccessTokenPayload,
} from "../../src/types";

const header: AccessTokenHeader = {
  alg: "RS256",
  kid: "x",
};

const payload: AccessTokenPayload = {
  aud: "solid",
  exp: 1603386448,
  iat: 1603386448,
  iss: "https://example.com/issuer",
  webid: "https://example.com/webid",
  client_id: "https://example.com/clientid",
};

export const token: AccessToken = {
  header,
  payload,
  signature: "",
};
