export class RequiredClaimVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The Solid access token payload is missing a required claim.\nActual: ${actual}\nExpected: ${expected}`,
    );
  }
}
