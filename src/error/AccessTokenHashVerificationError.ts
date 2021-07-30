export class AccessTokenHashVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The DPoP proof's access token hash doesn't match the base64 URL encoded SHA256 hash of the ASCII encoded associated access token's value.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
