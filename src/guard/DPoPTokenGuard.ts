import { asserts } from "ts-guards";
import { asymetricCryptographicAlgorithm, requestMethod } from "../type";
import type { DPoPToken, DPoPTokenHeader, DPoPTokenPayload } from "../type";
import { isDPoPPublicJWK } from "./DPoPJWKGuard";

/**
 * Check valid DPoP JWT
 */
/* eslint-disable no-use-before-define */
export function isDPoPToken(x: unknown): asserts x is DPoPToken {
  asserts.areObjectPropertiesOf(x, ["header", "payload", "signature"]);
  isDPoPTokenHeader(x.header);
  isDPoPTokenBody(x.payload);
  asserts.isString(x.signature);
}

export function isDPoPTokenHeader(x: unknown): asserts x is DPoPTokenHeader {
  asserts.areObjectPropertiesOf(x, ["alg", "jwk", "typ"]);
  asserts.isLiteralType(x.alg, asymetricCryptographicAlgorithm);
  isDPoPPublicJWK(x.jwk);
  asserts.isLiteral(x.typ, "dpop+jwt" as const);
}

export function isDPoPTokenBody(x: unknown): asserts x is DPoPTokenPayload {
  asserts.areObjectPropertiesOf(x, ["htm", "htu", "iat", "jti"]);
  asserts.isLiteralType(x.htm, requestMethod);
  asserts.isString(x.htu);
  asserts.isNumber(x.iat);
  asserts.isString(x.jti);
}
/* eslint-enable no-use-before-define */
