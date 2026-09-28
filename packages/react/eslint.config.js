import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

/**
 * Enforces the Rules of React with the compiler-backed rules from
 * eslint-plugin-react-hooks. Reports are evidence to triage, not verdicts:
 * a justified exception needs an inline comment with the reason.
 */
export default tseslint.config(
    { ignores: ['dist/**', 'node_modules/**', 'test-results/**'] },
    {
        files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: { ecmaFeatures: { jsx: true } }
        },
        plugins: { 'react-hooks': reactHooks },
        rules: {
            ...reactHooks.configs.flat['recommended-latest'].rules,
            // https://react.dev/reference/eslint-plugin-react-hooks/lints/component-hook-factories
            'react-hooks/component-hook-factories': 'error',
            'react-hooks/exhaustive-deps': 'error',
            // Project rule: React Compiler owns memoization.
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
    }
)

