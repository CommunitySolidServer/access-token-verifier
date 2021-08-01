export class IssuerVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The access token issuer doesn't match its associated WebID's trusted OIDC issuers.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
