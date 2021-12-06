import { asserts } from "ts-guards";
import { ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM } from "../constant/ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM";
import { REQUEST_METHOD } from "../constant/REQUEST_METHOD";
import type { DPoPToken, DPoPTokenHeader, DPoPTokenPayload } from "../type";
import { isDPoPPublicJWK } from "./isDPoPPublicJWK";

/**
 * Check valid DPoP JWT
 */
function isDPoPTokenHeader(x: unknown): asserts x is DPoPTokenHeader {
  asserts.areObjectPropertiesOf(x, ["alg", "jwk", "typ"]);
  asserts.isLiteralType(x.alg, ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM);
  isDPoPPublicJWK(x.jwk);
  asserts.isLiteral(x.typ, "dpop+jwt" as const);
}

function isDPoPTokenBody(x: unknown): asserts x is DPoPTokenPayload {
  asserts.areObjectPropertiesOf(x, ["htm", "htu", "iat", "jti"]);
  asserts.isLiteralType(x.htm, REQUEST_METHOD);
  asserts.isString(x.htu);
  asserts.isNumber(x.iat);
  asserts.isString(x.jti);
}

export function isDPoPToken(x: unknown): asserts x is DPoPToken {
  asserts.areObjectPropertiesOf(x, ["header", "payload", "signature"]);
  isDPoPTokenHeader(x.header);
  isDPoPTokenBody(x.payload);
  asserts.isString(x.signature);
}
