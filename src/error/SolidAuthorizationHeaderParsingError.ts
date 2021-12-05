export class SolidAuthorizationHeaderParsingError extends Error {
  constructor(actual: string) {
    super(
      `The Authorization header parsing failed.\nActual: ${actual}\nExpected: A DPoP or Bearer authentication scheme and a JWT composed of URL-safe parts (base64 url-encoded values) separated by period ('.') characters`
    );
  }
}
