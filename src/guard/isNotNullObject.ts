// eslint-disable-next-line @typescript-eslint/ban-types
export function isNotNullObject(x: unknown): x is object {
  return typeof x === "object" && x !== null;
}
