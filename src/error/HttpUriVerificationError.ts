export class HttpUriVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The DPoP proof htu parameter doesn't match the HTTP request URI without query and fragment parts.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
