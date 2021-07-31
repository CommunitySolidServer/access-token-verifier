export class UriSecuredOverTlsVerificationError extends Error {
  constructor(uri: string) {
    super(
      `The URI could not be verified as secure.\nActual: ${uri}\nExpected: An HTTPS URI`
    );
  }
}
