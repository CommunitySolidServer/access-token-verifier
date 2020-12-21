module.exports = {
  extends: ["@solid/eslint-config-base"],
  rules: {
    // TODO: Remove after https://github.com/benmosher/eslint-plugin-import/issues/1810
    "import/no-unresolved": [
      "error",
      {
        ignore: ["jose"],
      },
    ],
  },
};
