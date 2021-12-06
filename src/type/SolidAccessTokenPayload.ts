// TODO: Phased-in client_id becomes enforced
export interface SolidAccessTokenPayload {
  aud: "solid" | string[];
  // eslint-disable-next-line camelcase
  client_id?: string;
  exp: number;
  iat: number;
  iss: string;
  webid: string;
}
