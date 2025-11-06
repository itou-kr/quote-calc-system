// eslint.config.mjs
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */

export default [
    {files: ['**/*.{js,mjs,cjs,ts}']},
    {languageOptions: { globals: globals.node }},
    js.configs.recommended,           // JavaScript用
    ...tseslint.configs.recommended,     // TypeScript用
    prettier,                         // Prettier競合解消  
    {
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                 { 
                    argsIgnorePattern: '^_', 
                    caughtErrorsIgnorePattern: '^_' 
                }
            ],
            'no-console': ['error'],
        }
    },
    {
        ignores: [
            '**/src/apis/index.ts',
            '**/src/apis/*Api/types.ts',
            '**/src/apis/*Api/index.ts',
            '**/src/module/*.ts',
        ],
    },
];
