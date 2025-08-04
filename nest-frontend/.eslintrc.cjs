// @see https://eslint.bootcss.com/docs/rules/

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    /* Specifies how to parse syntax */
    parser: 'vue-eslint-parser',
    /** Lower priority than parser configuration */
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        jsxPragma: 'React',
        ecmaFeatures: {
            jsx: true,
        },
    },
    /* Extends existing rules */
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-essential',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['vue', '@typescript-eslint'],
    /*
     * "off" or 0    ==>  turn off rule
     * "warn" or 1   ==>  turn on rule as a warning (doesn't affect code execution)
     * "error" or 2  ==>  turn on rule as an error (code cannot execute, shows error on interface)
     */
    rules: {
        // eslint (https://eslint.bootcss.com/docs/rules/)
        'no-var': 'error', // require 'let' or 'const' instead of 'var'
        'no-multiple-empty-lines': ['warn', { max: 1 }], // disallow multiple empty lines
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-unexpected-multiline': 'error', // disallow unnecessary multiline
        'no-useless-escape': 'off', // disallow unnecessary escape characters

        // typeScript (https://typescript-eslint.io/rules)
        '@typescript-eslint/no-unused-vars': 'error', // disallow unused variables
        '@typescript-eslint/prefer-ts-expect-error': 'error', // disallow using @ts-ignore
        '@typescript-eslint/no-explicit-any': 'off', // disallow using 'any' type
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-namespace': 'off', // disallow custom TypeScript modules and namespaces
        '@typescript-eslint/semi': 'off',

        // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
        'vue/multi-word-component-names': 'off', // require component names to be multi-word and kebab-case
        'vue/script-setup-uses-vars': 'error', // prevent variables used in <script setup> from being marked as unused in <template>
        'vue/no-mutating-props': 'off', // disallow mutation of component props
        'vue/attribute-hyphenation': 'off', // enforce attribute naming style on custom components in templates
        'vue/require-component-is': 'off'
    },
}