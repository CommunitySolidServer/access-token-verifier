export class JwkThumbprintVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The access token cnf jkt parameter doesn't match the thumbprint of the DPoP proof's JWK.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
