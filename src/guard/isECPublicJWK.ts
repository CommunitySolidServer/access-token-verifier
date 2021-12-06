import { asserts } from "ts-guards";
import type { ECPublicJWK } from "../type";

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
  asserts.isLiteralType(x.crv, new Set(["P-256", "P-384", "P-521"]));
  asserts.isString(x.x);
  asserts.isString(x.y);
}
