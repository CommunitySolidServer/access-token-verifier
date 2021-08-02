export class Base64UrlEncodedJsonDecodingError extends Error {
  constructor(actual: string) {
    super(
      `The string could not be parsed as a base 64 URL encoded JSON object.\nActual: ${actual}\nExpected: A base 64 encoded JSON object`
    );
  }
}
