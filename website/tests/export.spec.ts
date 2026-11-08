import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { pages } from '../src/pages'

const output = new URL('../dist/', import.meta.url)
const exportedPage = (path: string) => new URL(`${path.replace(/^\//, '').replace(/\/$/, '')}/index.html`, output)

test('static export contains complete pages, search data, sitemap, and a 404', async () => {
    const index = JSON.parse(await readFile(new URL('search.json', output), 'utf8'))
    expect(index.map((entry: { path: string }) => entry.path)).toEqual(pages.map((page) => page.path))
    const sitemap = await readFile(new URL('sitemap.xml', output), 'utf8')
    expect([...sitemap.matchAll(/<loc>/g)]).toHaveLength(pages.length)
    const notFound = await readFile(new URL('404.html', output), 'utf8')
    expect(notFound).toContain('Page not found')
    expect(notFound).toContain('<meta name="robots" content="noindex">')

    for (const page of pages) {
        const html = await readFile(page.path === '/' ? new URL('index.html', output) : exportedPage(page.path), 'utf8')
        expect(html).toMatch(/<h1\b/)
        expect(html).toContain('<link rel="canonical"')
        expect(html).not.toContain('data-source=')
        for (const [, path] of html.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)) {
            expect((await readFile(new URL(path.slice(1), output))).length).toBeGreaterThan(0)
        }
    }
})

test('static export keeps every internal page and heading link valid', async () => {
    const documents = new Map<string, string>()
    const normalize = (path: string) => path.replace(/\/$/, '') || '/'
    for (const page of pages) {
        documents.set(
            normalize(page.path),
            await readFile(page.path === '/' ? new URL('index.html', output) : exportedPage(page.path), 'utf8')
        )
    }
    for (const [path, html] of documents) {
        for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
            const url = new URL(href, `https://local${path}`)
            if (url.origin !== 'https://local') continue
            const target = documents.get(normalize(url.pathname))
            expect(target, `Broken link on ${path}: ${href}`).toBeDefined()
            if (url.hash)
                expect(target, `Missing heading on ${path}: ${href}`).toContain(
                    `id="${decodeURIComponent(url.hash.slice(1))}"`
                )
        }
    }
})

test('code examples copy their source text', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/guide/getting-started')
    const block = page.locator('.code-block').first()
    const source = await block.locator('pre code').textContent()
    await block.getByRole('button', { name: 'Copy code' }).click()
    await expect(block.getByRole('button', { name: 'Copy code' })).toHaveText('Copied')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source)
})
