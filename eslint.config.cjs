const nextConfig = require("eslint-config-next");

module.exports = [
  ...nextConfig,
  {
    files: ["src/app/**/*.{ts,tsx,js,jsx}", "src/pages/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXOpeningElement[name.name=/^(button|input|select|textarea)$/] > JSXAttribute[name.name='className']",
          message:
            "Use shared UI components instead of styling native interactive elements directly."
        }
      ]
    }
  }
];
