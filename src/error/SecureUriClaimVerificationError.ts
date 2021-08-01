export class SecureUriClaimVerificationError extends Error {
  constructor(uri: string, claim: string) {
    super(
      `The URI claim "${claim}" could not be verified as secure.\nActual: ${uri}\nExpected: An HTTPS URI or localhost with a port number.`
    );
  }
}
