export class Base64TokenSegmentError extends Error {
  constructor(actual: string) {
    super(
      `Token segments should be Base 64 encoded strings.\nActual: ${actual}\nExpected: A base 64 encoded token segment`
    );
  }
}
