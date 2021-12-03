export class JwtStructureError extends Error {
  constructor(actual: string) {
    super(
      `The Authorization header token should be a JWT consisting of three parts: a JOSE header; a JWS payload; and a JWS signature.\nActual: ${actual}\nExpected: 3`
    );
  }
}
