export class SecureUriClaimVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The URI claim could not be verified as secure.\nActual: ${actual}\nExpected: The ${expected} claim to be an HTTPS URI or a localhost with port number HTTP URI`,
    );
  }
}
