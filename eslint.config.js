import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

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
        // Rules of React, backed by React Compiler analysis.
        files: ['packages/react/**/*.{ts,tsx}', 'website/.vitepress/theme/react/**/*.tsx', 'bench/src/**/*.tsx'],
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
        // Core is framework-independent and never depends on a binding.
        files: ['packages/core/**/*.ts'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['react', 'react-*', 'vue', '@nook/*'],
                            message: 'Core must stay framework-independent.'
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
                {
                    selector: "JSXAttribute[name.name='data-testid']",
                    message: 'Locate demo elements by role and accessible name.'
                }
            ]
        }
    },
    prettier
)
