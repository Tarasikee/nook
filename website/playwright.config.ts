import { defineConfig, devices } from '@playwright/test'

/**
 * Two servers: the production build (full suite) and the dev server (page and demo checks).
 * Dev and build resolve modules differently, so a site can work in one and break in the other.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    reporter: process.env.CI ? 'github' : 'list',
    use: { trace: 'retain-on-failure' },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4173' } },
        {
            name: 'dev',
            use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5174' },
            // The dev server compiles each page on first request, so allow a cold start.
            expect: { timeout: 15_000 },
            grep: /renders without errors|every React demo island mounts|the Code tab shows the exact file/
        }
    ],
    webServer: [
        {
            command: 'pnpm build && pnpm preview',
            url: 'http://localhost:4173',
            reuseExistingServer: !process.env.CI,
            timeout: 180_000
        },
        {
            command: 'pnpm exec vitepress dev --port 5174 --strictPort',
            url: 'http://localhost:5174',
            env: { NOOK_CACHE_DIR: '.vitepress/cache/playwright' },
            reuseExistingServer: !process.env.CI,
            timeout: 60_000
        }
    ]
})
