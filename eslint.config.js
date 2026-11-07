import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

const extensionlessImports = [
    'ImportDeclaration > Literal',
    'ExportNamedDeclaration > Literal',
    'ExportAllDeclaration > Literal',
    'ImportExpression > Literal',
    'CallExpression[callee.name="require"] > Literal'
].map((selector) => ({
    selector: `${selector}[value=/[.](js|jsx|mjs|cjs|ts|tsx|mts|cts)($|[?])/]`,
    message: 'Omit JavaScript and TypeScript file extensions from imports.'
}))

// Project rules live here instead of in prose. Reports are evidence to triage:
// a justified exception needs an inline comment with the reason.
export default tseslint.config(
    {
        ignores: [
            '**/dist/**',
            '**/node_modules/**',
            '**/test-results/**',
            'website/.vitepress/cache/**',
            'website/.vitepress/dist/**'
        ]
    },
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        rules: {
            'no-restricted-syntax': ['error', ...extensionlessImports]
        }
    },
    {
        // Rules of React, backed by React Compiler analysis.
        files: ['packages/ui/**/*.{ts,tsx}', 'website/.vitepress/theme/react/**/*.tsx', 'bench/src/**/*.tsx'],
        plugins: { 'react-hooks': reactHooks },
        rules: {
            ...reactHooks.configs.flat['recommended-latest'].rules,
            'react-hooks/component-hook-factories': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: 'react',
                            importNames: ['useMemo', 'useCallback', 'memo'],
                            message: 'React Compiler handles memoization in this project.'
                        }
                    ]
                }
            ]
        }
    },
    {
        // The native state helper has no React dependency.
        files: ['packages/ui/src/popover-store.ts'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['react', 'react-*', 'vue', '@nook/*'],
                            message: 'Native state helpers must stay framework-independent.'
                        }
                    ]
                }
            ]
        }
    },
    {
        // Demos are public example code; tests find elements by role and name instead.
        files: ['website/.vitepress/theme/react/**/*.tsx'],
        rules: {
            'no-restricted-syntax': [
                'error',
                ...extensionlessImports,
                {
                    selector: "JSXAttribute[name.name='data-testid']",
                    message: 'Locate demo elements by role and accessible name.'
                }
            ]
        }
    },
    prettier
)
