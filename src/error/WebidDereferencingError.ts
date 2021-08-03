export class WebidDereferencingError extends Error {
  constructor(actual: string) {
    super(
      `The WebID could not be dereferenced.\nActual: ${actual}\nExpected: A dereferenceable resource`
    );
  }
}
