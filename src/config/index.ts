/*
 * Default configuration.
 *
 * - clockToleranceInSeconds: How far in the future a token can be (if client's or server's clocks are off).
 * - maxAccessTokenAgeInSeconds: How old an Access Token can be.
 * - maxAgeInMilliseconds: For DPoP proofs & JTI cache (so that DPoP would fail to be replayed); also for Issuer Key Set cache & WebID issuers cache.
 * - maxRequestsPerSecond: Used to calculate the default cache size based on max age.
 *
 * Note: DPoP clock tolerance for time based token verification is advised to be a few seconds or minutes. See DPoP Proof Replay https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-09#section-11.1).
 */
// Set to 120 so clients can be a bit off
export const clockToleranceInSeconds = 120;
// Limit Access Token Age to 24 Hours, it should probably have an exp claim much shorter than that
export const maxAccessTokenAgeInSeconds = 86400;
// Default max age to 60 seconds for everything else
export const maxAgeInMilliseconds = 120000;
// An estimate of 100 rps for most small to medium projects
export const maxRequestsPerSecond = 100;
