export class AuthenticationSchemeVerificationError extends Error {
  constructor(actual: string) {
    super(
      `The Authentication scheme must be DPoP or Bearer.\nActual: ${actual}`,
    );
  }
}
