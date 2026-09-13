export class WebidDereferencingError extends Error {
  constructor(actual: string) {
    super(
      `The identity document could not be dereferenced.\nActual: ${actual}\nExpected: A dereferenceable resource`,
    );
  }
}
