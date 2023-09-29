export class IssuerConfigurationDereferencingError extends Error {
  constructor(actual: string, expected: string) {
    super(
      `The Issuer openid configuration could not be dereferenced.\nActual: HTTP status code ${actual}\nExpected: A dereferenceable resource at ${expected}`,
    );
  }
}
