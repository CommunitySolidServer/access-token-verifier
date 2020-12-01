import { asserts } from "ts-guards";
import {
  AccessToken,
  AccessTokenHeader,
  AccessTokenPayload,
  LegacyAccessTokenPayload,
} from "../type/AccessToken";
import { digitalSignatureAsymetricCryptographicAlgorithm } from "../type/DPoPJWK";

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

export function isAccessTokenPayload(x: unknown): asserts x is AccessTokenPayload {
  asserts.areObjectPropertiesOf(x, [
    "aud",
    "client_id",
    "cnf",
    "exp",
    "iat",
    "iss",
    "webid",
  ]);
  asserts.isLiteral(x.aud, "solid" as const);
  asserts.isString(x.client_id);
  asserts.isObjectPropertyOf(x.cnf, "jkt");
  asserts.isString(x.cnf.jkt);
  asserts.isNumber(x.exp);
  asserts.isNumber(x.iat);
  asserts.isString(x.iss);
  asserts.isString(x.webid);
}

// TODO: Remove support for legacy tokens
export function isLegacyAccessTokenPayload(x: unknown): asserts x is LegacyAccessTokenPayload {
  try {
    asserts.areObjectPropertiesOf(x, [
      "aud",
      "cnf",
      "exp",
      "iat",
      "iss",
      "webid",
    ]);
    asserts.isLiteral(x.aud, "solid" as const);
    asserts.isObjectPropertyOf(x.cnf, "jkt");
    asserts.isString(x.cnf.jkt);
    asserts.isNumber(x.exp);
    asserts.isNumber(x.iat);
    asserts.isString(x.iss);
    asserts.isString(x.webid);

  } catch {
    asserts.areObjectPropertiesOf(x, [
      "aud",
      "cnf",
      "exp",
      "iat",
      "iss",
      "sub",
    ]);
    asserts.isLiteral(x.aud, "solid" as const);
    asserts.isObjectPropertyOf(x.cnf, "jkt");
    asserts.isString(x.cnf.jkt);
    asserts.isNumber(x.exp);
    asserts.isNumber(x.iat);
    asserts.isString(x.iss);
    asserts.isString(x.sub);
  }
}
/* eslint-enable no-use-before-define */
