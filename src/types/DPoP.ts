import type { RequestMethod } from "./RequestMethod";

export interface JTICheckFunction {
  (jti: string): boolean;
}

export interface DPoPOptions {
  header: string;
  method: RequestMethod;
  url: string;
  isDuplicateJTI?: JTICheckFunction;
}
