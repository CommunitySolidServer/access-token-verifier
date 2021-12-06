const PRIVATE_KEY_PROPERTIES = new Set([
  "d",
  "p",
  "q",
  "dp",
  "dq",
  "qi",
] as const);

export type PrivateKeyProperties = typeof PRIVATE_KEY_PROPERTIES extends Set<
  infer T
>
  ? T
  : never;
