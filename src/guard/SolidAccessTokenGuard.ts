import { asserts, literalType, standardObject } from "ts-guards";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import type {
  SolidAccessToken,
  SolidAccessTokenHeader,
  SolidAccessTokenPayload,
  SolidDpopBoundAccessTokenPayload,
} from "../type";
import { asymetricCryptographicAlgorithm } from "../type";

/**
 * Check valid Access Token
 */
/* eslint-disable no-use-before-define */
export function isSolidAccessToken(x: unknown): asserts x is SolidAccessToken {
  asserts.areObjectPropertiesOf(x, ["header", "payload", "signature"]);
  isSolidAccessTokenHeader(x.header);
  isSolidAccessTokenPayload(x.payload);
  asserts.isString(x.signature);
}

export function isSolidAccessTokenHeader(
  x: unknown
): asserts x is SolidAccessTokenHeader {
  asserts.areObjectPropertiesOf(x, ["alg", "kid"]);
  asserts.isLiteralType(x.alg, asymetricCryptographicAlgorithm);
  asserts.isString(x.kid);
}

export function isSolidAccessTokenPayload(
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
  if (isObjectPropertyOf(x, "cnf")) {
    asserts.isObjectPropertyOf(x.cnf, "jkt");
    asserts.isString(x.cnf.jkt);
  }
}

export function isSolidDPoPBoundAccessTokenPayload(
  x: SolidAccessTokenPayload
): asserts x is SolidDpopBoundAccessTokenPayload {
  asserts.isObjectPropertyOf(x, "cnf");
  asserts.isObjectPropertyOf(x.cnf, "jkt");
  asserts.isString(x.cnf.jkt);
}
/* eslint-enable no-use-before-define */
