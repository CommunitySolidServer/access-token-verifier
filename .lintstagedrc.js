module.exports = {
  "**/*.{js,jsx,ts,tsx}": (filenames) =>
    filenames.map((filename) => `eslint --fix '${filename}'`),
  "**/*.{css,html,json,md,mdx,yml}": (filenames) =>
    filenames.map((filename) => `prettier --write '${filename}'`),
};
