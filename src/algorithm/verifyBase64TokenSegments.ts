import { Base64TokenSegmentError } from "../error/Base64TokenSegmentError";

/**
 * Verify each segment is a Base 64 token
 *
 * > b64token = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 * > -- https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
 *
 * @param authorizationHeader The authorization header used for the request.
 */
export function verifyBase64TokenSegments(authorizationHeader: string): void {
  const segments = authorizationHeader
    .replace(/^(DPoP|Bearer) +/i, "")
    .split(".");

  segments.forEach((x, key) => {
    // Last segments can end with 0 or more "="
    if (Object.is(segments.length - 1, key)) {
      if (!/^[\w\-~+/]+(=+)?$/.test(x)) {
        throw new Base64TokenSegmentError(x);
      }
    } else if (!/^[\w\-~+/]+$/.test(x)) {
      throw new Base64TokenSegmentError(x);
    }
  });
}
