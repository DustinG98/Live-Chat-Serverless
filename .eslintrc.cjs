module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "airbnb-base",
       "airbnb-typescript/base"
    ],
    "parserOptions": {
        "project": "./tsconfig.json",
        "tsconfigRootDir": __dirname,
    },
    "rules": {
        "linebreak-style": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "import/prefer-default-export": "off",
    },
    "ignorePatterns": ["*.js", "*.cjs"],
    root: true,
}
