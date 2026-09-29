import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: process.env.CI ? 'github' : 'list',
    use: { ...devices['Desktop Chrome'], trace: 'retain-on-failure' },
    projects: [
        { name: 'compiled', testIgnore: /platform\.spec\.ts/ },
        { name: 'source', testIgnore: /platform\.spec\.ts/ },
        { name: 'platform', testMatch: /platform\.spec\.ts/ }
    ]
})
