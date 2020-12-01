module.exports = {
  "**/*.{js,jsx,ts,tsx}": (filenames) =>
    filenames.map((filename) => `eslint --fix '${filename}'`),
  "**/*.{css,md,mdx}": (filenames) =>
    filenames.map((filename) => `prettier --write '${filename}'`),
};
