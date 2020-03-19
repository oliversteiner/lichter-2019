module.exports = {
  "env": {
    "browser": true,
    "node": true
  },
  "extends": [
    'plugin:@typescript-eslint/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  "globals": {},
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "project": "tsconfig.json",
    "sourceType": "module",
    "ecmaFeatures": {
      "modules": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "@typescript-eslint/tslint",
    "prettier"
  ],
  "settings": {},
  "rules": {
    "@typescript-eslint/indent": ["error", 2, {
      "SwitchCase": 1,
      "CallExpression": {"arguments": "first"},
      "FunctionExpression": {"parameters": "first"},
      "FunctionDeclaration": {"parameters": "first"}
    }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "singleline": {
          "delimiter": "semi",
          "requireLast": true
        }
      }
    ],
    "quotes": ["error", "single"],

  }
};
