export class AccessTokenDecodingError extends Error {
  constructor(actual: string) {
    super(
      `The DPoP proof htm parameter doesn't match the HTTP request method.\nActual: ${actual}\nExpected: A base 64 encoded JWT`
    );
  }
}
