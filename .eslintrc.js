module.exports = {
  extends: ["@solid/eslint-config-base"],
  env: {
    browser: false,
    node: true,
  },
  globals: {
    fetch: "off",
    TextDecoder: "off",
  },
  // TODO: Remove exceptions related to DOM/Node overlapping typescript types issues, see: https://github.com/microsoft/TypeScript/issues/41727
  rules: {
    // "no-shadow": ["error", { allow: ["URL", "TextDecoder"] }],
  },
};
