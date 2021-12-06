import { RSA_ALGORITHM } from "./RSA_ALGORITHM";

export const ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM = new Set([
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512",
  ...RSA_ALGORITHM,
] as const);
