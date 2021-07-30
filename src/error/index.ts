/* eslint-disable @typescript-eslint/naming-convention */
export const AccessTokenHashVerificationError: Error = new Error(
  "The DPoP proof's access token hash doesn't match the base64 URL encoded SHA256 hash of the ASCII encoded associated access token's value."
);
export const HttpUriVerificationError: Error = new Error(
  "The DPoP proof's HTTP URI used for the request, without query and fragment parts, doesn't match."
);
export const JwtTokenIdentifierNotUniqueError: Error = new Error(
  "The DPoP proof's unique identifier matched a previously used identifier."
);
