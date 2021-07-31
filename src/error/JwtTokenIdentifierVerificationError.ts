export class JwtTokenIdentifierVerificationError extends Error {
  constructor(jti: string) {
    super(
      `The DPoP proof jti parameter matched a previously used identifier.\nActual: ${jti} was previously used\nExpected: ${jti} to be unique`
    );
  }
}
