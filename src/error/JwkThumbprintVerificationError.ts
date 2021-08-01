export class JwkThumbprintVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The DPoP proof JWK thumbprint doesn't match the access token cnf jkt parameter.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
