export class WebidParsingError extends Error {
  constructor() {
    super(
      `The identity document could not be parsed.\nActual: Invalid document\nExpected: A valid Turtle WebID or JSON controlled identifier document`,
    );
  }
}
