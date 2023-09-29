export class WebidIriError extends Error {
  constructor(actual: string) {
    super(
      `The WebID could not be parsed as a URL.\nActual: ${actual}\nExpected: A valid URL`,
    );
  }
}
