import { asserts } from "ts-guards";
import type {
  SolidAccessTokenPayload,
  SolidDpopBoundAccessTokenPayload,
} from "../type";

export function isSolidDPoPBoundAccessTokenPayload(
  x: SolidAccessTokenPayload,
): asserts x is SolidDpopBoundAccessTokenPayload {
  asserts.isObjectPropertyOf(x, "cnf");
  asserts.isObjectPropertyOf(x.cnf, "jkt");
  asserts.isString(x.cnf.jkt);
}
