import type {
  SolidAccessToken,
  SolidAccessTokenHeader,
  SolidDpopBoundAccessTokenPayload,
} from "../../src/types";

const header: SolidAccessTokenHeader = {
  alg: "RS256",
  kid: "x",
};

const payload: SolidDpopBoundAccessTokenPayload = {
  aud: "solid",
  exp: 1603386448,
  iat: 1603386448,
  iss: "https://example.com/issuer",
  webid: "https://example.com/webid",
  client_id: "https://example.com/clientid",
  cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
};

const payloadAudienceArray: SolidDpopBoundAccessTokenPayload = {
  aud: ["solid"],
  exp: 1603386448,
  iat: 1603386448,
  iss: "https://example.com/issuer",
  webid: "https://example.com/webid",
  client_id: "https://example.com/clientid",
  cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
};

export const badProtocolPayload: SolidDpopBoundAccessTokenPayload = {
  aud: "solid",
  exp: 1603386448,
  iat: 1603386448,
  iss: "https://example.com/issuer",
  webid: "xyz://example.com/webid",
  client_id: "https://example.com/clientid",
  cnf: { jkt: "0ZcOCORZNYy-DWpqq30jZyJGHTN0d2HglBV3uiguA4I" },
};

export const token: SolidAccessToken = {
  header,
  payload,
  signature: "",
};

export const tokenAudienceArray: SolidAccessToken = {
  header,
  payload: payloadAudienceArray,
  signature: "",
};
