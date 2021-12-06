import { asserts } from "ts-guards";
import { RSA_ALGORITHM } from "../constant/RSA_ALGORITHM";
import type { RSAPublicJWK } from "../type";

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
  asserts.isLiteralType(x.alg, RSA_ALGORITHM);
  asserts.isLiteral(x.kty, "RSA" as const);
  asserts.isString(x.n);
  asserts.isString(x.e);
}
