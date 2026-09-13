export class WebidIriError extends Error {
  constructor(actual: string) {
    super(
      `The identifier could not be parsed as a URL.\nActual: ${actual}\nExpected: A valid URL`,
    );
  }
}
