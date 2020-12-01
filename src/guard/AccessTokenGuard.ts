import { asserts } from "ts-guards";
import {
  AccessToken,
  AccessTokenHeader,
  AccessTokenPayload,
} from "../type/AccessToken";
import { digitalSignatureAsymetricCryptographicAlgorithm } from "../type/DPoPJWK";

/**
 * Check valid Access Token
 */
/* eslint-disable no-use-before-define */
export function isAccessToken(x: unknown): asserts x is AccessToken {
  asserts.areObjectPropertiesOf(x, ["header", "payload", "signature"]);
  isAccessTokenHeader(x.header);
  isAccessTokenBody(x.payload);
  asserts.isString(x.signature);
}

export function isAccessTokenHeader(
  x: unknown
): asserts x is AccessTokenHeader {
  asserts.areObjectPropertiesOf(x, ["alg", "kid"]);
  asserts.isLiteralType(x.alg, digitalSignatureAsymetricCryptographicAlgorithm);
  asserts.isString(x.kid);
}

export function isAccessTokenBody(x: unknown): asserts x is AccessTokenPayload {
  asserts.areObjectPropertiesOf(x, [
    "aud",
    "azp",
    "client_webid",
    "cnf",
    "exp",
    "iat",
    "iss",
    "jti",
    "sub",
    "webid",
  ]);
  asserts.isLiteral(x.aud, "solid" as const);
  asserts.isString(x.azp);
  asserts.isString(x.client_webid);
  asserts.isObjectPropertyOf(x.cnf, "jkt");
  asserts.isString(x.cnf.jkt);
  asserts.isNumber(x.exp);
  asserts.isNumber(x.iat);
  asserts.isString(x.iss);
  asserts.isString(x.jti);
  asserts.isString(x.sub);
  asserts.isString(x.webid);
}
/* eslint-enable no-use-before-define */
