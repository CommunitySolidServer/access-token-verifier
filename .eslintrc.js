module.exports = {
  extends: ["./.eslintrc.base.js"],

  rules: {
    // TODO: Remove after https://github.com/benmosher/eslint-plugin-import/issues/1810
    "import/no-unresolved": [
      2,
      {
        ignore: ["jose"],
      },
    ],
    "import/prefer-default-export": 0,
    "import/no-default-export": 2,
  },
};
