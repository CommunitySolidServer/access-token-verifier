export class HttpMethodVerificationError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The DPoP proof htm parameter doesn't match the HTTP request method.\nActual: ${actual}\nExpected: ${expected}`
    );
  }
}
