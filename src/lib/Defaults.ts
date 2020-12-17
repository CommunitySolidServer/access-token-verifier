// Clock tolerance for all time based token verifications
export const clockToleranceInSeconds = 5;
// Limit Access Token Age to 24 Hours, it should probably have an exp claim much shorter than that
export const maxAccessTokenAgeInSeconds = 86400;
// Default max age for everything else
export const maxAgeInMilliseconds = 60000;
// Used to calculate the default cache size based on max age
export const maxRequestsPerSecond = 100;