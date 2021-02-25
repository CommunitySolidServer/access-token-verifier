import { asserts } from "ts-guards";
import type { DPoPPublicJWK, ECPublicJWK, RSAPublicJWK } from "../types";
import { curve, rsaAlgorithm } from "../types";

/**
 * JWK Validation
 */
/* eslint-disable no-use-before-define */
/*
 * export function isDPoPJWK(x: unknown): asserts x is DPoPJWK {
 *   asserts.isObjectPropertyOf(x, "kty");
 *   if (x.kty === "EC") {
 *     isECJWK(x);
 *   } else if (x.kty === "RSA") {
 *     isRSAJWK(x);
 *   } else {
 *     asserts.error("EC or RSA", x.kty);
 *   }
 * }
 */

export function isDPoPPublicJWK(x: unknown): asserts x is DPoPPublicJWK {
  asserts.isObjectPropertyOf(x, "kty");
  if (x.kty === "EC") {
    isECPublicJWK(x);
  } else if (x.kty === "RSA") {
    isRSAPublicJWK(x);
  } else {
    asserts.error("EC or RSA", x.kty);
  }
}

/*
 * export function isECJWK(x: unknown): asserts x is ECJWK {
 *   isECPublicJWK(x);
 *   asserts.isObjectPropertyOf(x, "d");
 *   asserts.isString(x.d);
 * }
 */

export function isECPublicJWK(x: unknown): asserts x is ECPublicJWK {
  asserts.areObjectPropertiesOf(x, ["kty", "crv", "x", "y"]);
  asserts.isLiteral(x.kty, "EC" as const);
  asserts.isLiteralType(x.crv, curve);
  asserts.isString(x.x);
  asserts.isString(x.y);
}

/*
 * export function isRSAJWK(x: unknown): asserts x is RSAJWK {
 *   isRSAPublicJWK(x);
 *   asserts.areObjectPropertiesOf(x, ["d", "p", "q", "dp", "dq", "qi"]);
 *   asserts.isString(x.d);
 *   asserts.isString(x.p);
 *   asserts.isString(x.q);
 *   asserts.isString(x.dp);
 *   asserts.isString(x.dq);
 *   asserts.isString(x.qi);
 * }
 */

export function isRSAPublicJWK(x: unknown): asserts x is RSAPublicJWK {
  asserts.areObjectPropertiesOf(x, ["alg", "kty", "n", "e"]);
  asserts.isLiteralType(x.alg, rsaAlgorithm);
  asserts.isLiteral(x.kty, "RSA" as const);
  asserts.isString(x.n);
  asserts.isString(x.e);
}
/* eslint-enable no-use-before-define */
