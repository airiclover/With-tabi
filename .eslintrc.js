module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  plugins: [],
  extends: ["plugin:react/recommended"],
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
  },
};
