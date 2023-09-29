export function isObjectPropertyOf<P extends PropertyKey>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  x: object,
  property: P,
): x is { [K in P]: unknown } {
  return property in x;
}
