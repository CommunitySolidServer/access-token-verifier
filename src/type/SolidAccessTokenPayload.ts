// TODO: Phased-in client_id becomes enforced
export interface SolidAccessTokenPayload {
  aud: "solid" | string[];
  // eslint-disable-next-line camelcase
  client_id?: string;
  // TODO: Rework the types DPoP bound should be closer to this, we shouldn't need so many types
  cnf?: { jkt: string };
  exp: number;
  iat: number;
  iss: string;
  webid: string;
}
