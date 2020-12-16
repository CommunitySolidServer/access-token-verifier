import { asserts } from "ts-guards";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import type {
  AccessToken,
  AccessTokenHeader,
  AccessTokenPayload,
  DPoPBoundAccessTokenPayload,
} from "../types";
import { digitalSignatureAsymetricCryptographicAlgorithm } from "../types";

/**
 * Check valid Access Token
 */
/* eslint-disable no-use-before-define */
export function isAccessToken(x: unknown): asserts x is AccessToken {
  asserts.areObjectPropertiesOf(x, ["header", "payload", "signature"]);
  isAccessTokenHeader(x.header);
  isAccessTokenPayload(x.payload);
  asserts.isString(x.signature);
}

export function isAccessTokenHeader(
  x: unknown
): asserts x is AccessTokenHeader {
  asserts.areObjectPropertiesOf(x, ["alg", "kid"]);
  asserts.isLiteralType(x.alg, digitalSignatureAsymetricCryptographicAlgorithm);
  asserts.isString(x.kid);
}

export function isAccessTokenPayload(
  x: unknown
): asserts x is AccessTokenPayload {
  asserts.areObjectPropertiesOf(x, ["aud", "exp", "iat", "iss", "webid"]);
  asserts.isLiteral(x.aud, "solid" as const);
  asserts.isNumber(x.exp);
  asserts.isNumber(x.iat);
  asserts.isString(x.iss);
  asserts.isString(x.webid);
  if (isObjectPropertyOf(x, "cnf")) {
    asserts.isObjectPropertyOf(x.cnf, "jkt");
    asserts.isString(x.cnf.jkt);
  }
  if (isObjectPropertyOf(x, "client_id")) {
    asserts.isString(x.client_id);
  }
}

export function isDPoPBoundAccessTokenPayload(
  x: AccessTokenPayload
): asserts x is DPoPBoundAccessTokenPayload {
  asserts.isObjectPropertyOf(x, "cnf");
  asserts.isObjectPropertyOf(x.cnf, "jkt");
  asserts.isString(x.cnf.jkt);
}
/* eslint-enable no-use-before-define */
