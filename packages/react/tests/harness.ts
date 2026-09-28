import { build } from 'esbuild'
import { mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test, type Page } from '@playwright/test'
import type { FixtureName } from './fixtures/fixtures'

export type Variant = 'compiled' | 'source'

const packageDir = fileURLToPath(new URL('..', import.meta.url))
const cacheDir = `${packageDir}node_modules/.cache/nook-tests/`

const entries = {
    compiled: `${packageDir}dist/index.js`,
    source: `${packageDir}src/index.ts`
}

const core = fileURLToPath(new URL('../../core/src/index.ts', import.meta.url))

const css = `
    body { margin: 0; font: 16px system-ui; }
    main { padding: 120px 200px; }
    button { margin: 4px; }
    .panel { margin: 0; inset: auto; position-area: block-end span-inline-end; margin-block-start: 8px; padding: 12px; }
    .tooltip { margin: 0; inset: auto; position-area: block-start; margin-block-end: 8px; padding: 4px 8px; }
    [interestfor] { interest-delay: 100ms 100ms; }
`

const clientBundles = new Map<Variant, Promise<string>>()
const serverModules = new Map<Variant, Promise<{ render(name: FixtureName): string }>>()

export function variant(): Variant {
    return test.info().project.name as Variant
}

function clientBundle(target: Variant) {
    let bundle = clientBundles.get(target)
    if (!bundle) {
        bundle = build({
            entryPoints: [`${packageDir}tests/fixtures/client.tsx`],
            bundle: true,
            write: false,
            format: 'iife',
            platform: 'browser',
            jsx: 'automatic',
            define: { 'process.env.NODE_ENV': '"development"' },
            alias: { '@nook/react': entries[target], '@nook/core': core },
            logLevel: 'silent'
        }).then((result) => result.outputFiles[0].text)
        clientBundles.set(target, bundle)
    }
    return bundle
}

function serverModule(target: Variant) {
    let module = serverModules.get(target)
    if (!module) {
        mkdirSync(cacheDir, { recursive: true })
        const outfile = `${cacheDir}server-${target}-${process.pid}.mjs`
        module = build({
            entryPoints: [`${packageDir}tests/fixtures/server.tsx`],
            bundle: true,
            outfile,
            format: 'esm',
            platform: 'node',
            jsx: 'automatic',
            external: ['react', 'react-dom', 'react/*', 'react-dom/*'],
            alias: { '@nook/react': entries[target], '@nook/core': core },
            logLevel: 'silent'
        }).then(async () => {
            // Node keeps the module in memory once imported, so the file can go immediately.
            const imported = await import(pathToFileURL(outfile).href)
            rmSync(outfile, { force: true })
            return imported
        })
        serverModules.set(target, module)
    }
    return module
}

export async function renderFixture(name: FixtureName) {
    return (await serverModule(variant())).render(name)
}

/**
 * Serves a fixture's server-rendered HTML. With `hydrate`, the client bundle
 * hydrates it in StrictMode. Returns console errors and warnings collected on the page.
 */
export async function mountFixture(page: Page, name: FixtureName, { hydrate = true } = {}) {
    const messages: string[] = []
    page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))
    page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') {
            messages.push(`${message.type()}: ${message.text()}`)
        }
    })

    const html = await renderFixture(name)
    await page.setContent(
        `<!doctype html><html><head><style>${css}</style></head><body><div id="root">${html}</div></body></html>`
    )

    if (hydrate) {
        await hydrateFixture(page, name)
    }

    return messages
}

export async function hydrateFixture(page: Page, name: FixtureName) {
    const bundle = await clientBundle(variant())
    await page.evaluate((fixture) => {
        window.nookFixture = fixture as FixtureName
    }, name)
    await page.addScriptTag({ content: bundle })
    await page.waitForFunction(() => window.nookHydrated === true)
    // Let effects run after hydration.
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve))))
}

export function isOpen(page: Page, selector: string) {
    return page.locator(selector).evaluate((element) => element.matches(':popover-open'))
}

export async function events(page: Page) {
    return page.evaluate(() => window.nookEvents ?? [])
}

/** Reads Chromium's own accessibility tree, not Playwright's DOM-based approximation. */
export async function accessibilityNode(page: Page, selector: string) {
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Accessibility.enable')
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false })
    const node = nodes[0] as {
        role?: { value: string }
        name?: { value: string }
        description?: { value: string }
        properties?: { name: string; value: { value: unknown } }[]
    }
    await cdp.detach()
    return {
        role: node.role?.value,
        name: node.name?.value,
        description: node.description?.value,
        expanded: node.properties?.find((property) => property.name === 'expanded')?.value.value
    }
}
