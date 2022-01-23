import { asserts, literalType, standardObject } from "ts-guards";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM } from "../constant/ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM";
import type {
  SolidAccessToken,
  SolidAccessTokenHeader,
  SolidAccessTokenPayload,
} from "../type";

/**
 * Check valid Access Token
 */
function isSolidAccessTokenHeader(
  x: unknown
): asserts x is SolidAccessTokenHeader {
  asserts.areObjectPropertiesOf(x, ["alg", "kid"]);
  asserts.isLiteralType(x.alg, ASYMMETRIC_CRYPTOGRAPHIC_ALGORITHM);
  asserts.isString(x.kid);
}

function isSolidAccessTokenPayload(
  x: unknown
): asserts x is SolidAccessTokenPayload {
  asserts.areObjectPropertiesOf(x, ["aud", "exp", "iat", "iss", "webid"]);
  asserts.isLiteral(
    literalType.isLiteral(x.aud, "solid" as const) ||
      (standardObject.isArray(x.aud) && x.aud.includes("solid")),
    true
  );
  asserts.isNumber(x.exp);
  asserts.isNumber(x.iat);
  asserts.isString(x.iss);
  asserts.isString(x.webid);
  // TODO: Increase coverage
  /* istanbul ignore next */
  if (isObjectPropertyOf(x, "cnf")) {
    asserts.isObjectPropertyOf(x.cnf, "jkt");
    asserts.isString(x.cnf.jkt);
  }
}

export function isSolidAccessToken(x: unknown): asserts x is SolidAccessToken {
  asserts.areObjectPropertiesOf(x, ["header", "payload", "signature"]);
  isSolidAccessTokenHeader(x.header);
  isSolidAccessTokenPayload(x.payload);
  asserts.isString(x.signature);
}
