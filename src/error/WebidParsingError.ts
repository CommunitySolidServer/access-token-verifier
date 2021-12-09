export class WebidParsingError extends Error {
  constructor() {
    super(
      `The WebID could not be parsed.\nActual: Invalid RDF\nExpected: A valid turtle document`
    );
  }
}
