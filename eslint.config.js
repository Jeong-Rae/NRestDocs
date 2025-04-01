import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";

export default [
    {
        ignores: ["dist/**", "sample/**"],
    },
    eslint.configs.recommended,
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            globals: {
                URL: "readonly",
                process: "readonly",
                describe: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeEach: "readonly",
                afterAll: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: prettier,
        },
        rules: {
            "prettier/prettier": "error",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                    varsIgnorePattern: "^_",
                    args: "none",
                },
            ],
            "no-unused-vars": "off",
        },
    },
];
