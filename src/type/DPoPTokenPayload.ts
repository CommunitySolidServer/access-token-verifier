import type { RequestMethod } from "./RequestMethod";

// TODO: Phased-in ath becomes enforced
export interface DPoPTokenPayload {
  htm: RequestMethod;
  htu: string;
  iat: number;
  jti: string;
  ath?: string;
}
