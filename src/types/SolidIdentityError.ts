/**
 * Solid Identity Errors
 */
export const solidIdentityErrorCode = new Set([
  "SolidIdentityInvalidAcccessToken",
  "SolidIdentityInvalidDPoPToken",
  "SolidIdentityInvalidIssuerClaim",
  "SolidIdentityHTTPError",
  "SolidIdentityIssuerConfigError",
] as const);
export type SolidIdentityErrorCode = typeof solidIdentityErrorCode extends Set<
  infer T
>
  ? T
  : never;
