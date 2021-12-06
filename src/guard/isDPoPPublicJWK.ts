import { asserts } from "ts-guards";
import type { DPoPPublicJWK } from "../type";
import { isECPublicJWK } from "./isECPublicJWK";
import { isRSAPublicJWK } from "./isRSAPublicJWK";

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
