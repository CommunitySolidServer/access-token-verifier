export class JwtTokenIdentifierVerificationError extends Error {
  constructor(actual: string) {
    super(
      `The DPoP proof jti parameter matched a previously used identifier.\nActual: ${actual} was previously used\nExpected: A unique JWT identifier`
    );
  }
}
