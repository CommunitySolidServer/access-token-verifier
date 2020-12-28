/**
 * Solid Identity Errors
 */
export const solidTokenVerifierErrorCode = new Set([
  "SolidIdentityInvalidAcccessToken",
  "SolidIdentityInvalidDPoPToken",
  "SolidIdentityDPoPError",
  "SolidIdentityInvalidIssuerClaim",
  "SolidIdentityHTTPError",
  "SolidIdentityIssuerConfigError",
] as const);
export type SolidTokenVerifierErrorCode = typeof solidTokenVerifierErrorCode extends Set<
  infer T
>
  ? T
  : never;
