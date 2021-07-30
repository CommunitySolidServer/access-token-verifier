export class JwtTokenIdentifierNotUniqueError extends Error {
  constructor(jti: string) {
    super(
      `The DPoP proof's unique identifier matched a previously used identifier.\nActual: ${jti} was previously used\nExpected: ${jti} to be unique`
    );
  }
}
