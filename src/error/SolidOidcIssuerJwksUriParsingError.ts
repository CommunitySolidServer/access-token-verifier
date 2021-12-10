export class SolidOidcIssuerJwksUriParsingError extends Error {
  constructor(actual: string) {
    super(
      `The OIDC Identity Provider well-known configuration parsing failed.\nActual: ${actual}\nExpected: A well-known config with a jwks_uri field containing a valid URL`
    );
  }
}
