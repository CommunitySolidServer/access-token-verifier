import type { REQUEST_METHOD } from "../constant/REQUEST_METHOD";

/**
 * Standard HTTP methods
 * As defined in:
 * - HTTP/1.1 Semantics and Content RFC7231 https://tools.ietf.org/html/rfc7231#section-4
 * - PATCH Method for HTTP RFC5789 https://tools.ietf.org/html/rfc5789
 */
export type RequestMethod = typeof REQUEST_METHOD extends Set<infer T>
  ? T
  : never;
