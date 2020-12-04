/**
 * Solid OIDC Errors
 */
export const solidOIDCErrorCode = new Set([
  "SolidOIDCInvalidAcccessToken",
  "SolidOIDCInvalidDPoPToken",
  "SolidOIDCInvalidIssuerClaim",
  "SolidOIDCHTTPError",
  "SolidOIDCIssuerConfigError",
] as const);
export type SolidOIDCErrorCode = typeof solidOIDCErrorCode extends Set<infer T>
  ? T
  : never;
