export class HttpUriVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The DPoP proof's HTTP URI used for the request, without query and fragment parts, doesn't match.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
