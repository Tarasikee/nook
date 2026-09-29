import { defineConfig, devices } from '@playwright/test'

/** Component tests run against the React Compiler output in `dist` and against uncompiled `src`. */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: process.env.CI ? 'github' : 'list',
    use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
    projects: [{ name: 'compiled' }, { name: 'source' }]
})
