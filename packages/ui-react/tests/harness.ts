import { test, type Page } from '@playwright/test'
import { build } from 'esbuild'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import type { FixtureName } from './fixtures/fixtures'

type Variant = 'compiled' | 'source'

const packageDir = fileURLToPath(new URL('..', import.meta.url))
const packages = fileURLToPath(new URL('../../', import.meta.url))
const cacheDir = `${packageDir}node_modules/.cache/nook-ui-tests/`
const css = readFileSync(`${packages}ui/nook.css`, 'utf8')

const aliases = (variant: Variant) => ({
    '@nook/ui-react': variant === 'compiled' ? `${packageDir}dist/index.js` : `${packageDir}src/index.ts`,
    '@nook/react': `${packages}react/src/index.ts`,
    '@nook/core': `${packages}core/src/index.ts`
})

const clientBundles = new Map<Variant, Promise<string>>()
const serverModules = new Map<Variant, Promise<{ render(name: FixtureName): string }>>()

export const variant = () => test.info().project.name as Variant

function clientBundle(target: Variant) {
    let bundle = clientBundles.get(target)
    if (!bundle) {
        bundle = build({
            entryPoints: [`${packageDir}tests/fixtures/client.tsx`],
            bundle: true,
            write: false,
            format: 'iife',
            jsx: 'automatic',
            define: { 'process.env.NODE_ENV': '"development"' },
            alias: aliases(target),
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
            alias: aliases(target),
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

/** Server-renders a fixture with nook.css, then hydrates it in StrictMode. Returns console errors and warnings. */
export async function mountFixture(page: Page, name: FixtureName) {
    const messages: string[] = []
    page.on('pageerror', (error) => messages.push(`pageerror: ${error.message}`))
    page.on('console', (message) => {
        if (message.type() === 'error' || message.type() === 'warning') {
            messages.push(`${message.type()}: ${message.text()}`)
        }
    })

    const html = await renderFixture(name)
    await page.setContent(
        `<!doctype html><html><head><style>${css} main { padding: 120px 200px; display: flex; gap: 12px; }</style></head><body><div id="root">${html}</div></body></html>`
    )
    await page.evaluate((fixture) => (window.nookFixture = fixture as FixtureName), name)
    await page.addScriptTag({ content: await clientBundle(variant()) })
    await page.waitForFunction(() => window.nookHydrated === true)
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve))))
    return messages
}

export const events = (page: Page) => page.evaluate(() => window.nookEvents ?? [])

/** Reads Chromium's own accessibility tree, not Playwright's DOM-based approximation. */
export async function accessibilityNode(page: Page, selector: string) {
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Accessibility.enable')
    const { root } = await cdp.send('DOM.getDocument', { depth: -1 })
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })
    const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false })
    const node = nodes[0] as {
        name?: { value: string }
        description?: { value: string }
        properties?: { name: string; value: { value: unknown } }[]
    }
    await cdp.detach()
    return {
        name: node.name?.value,
        description: node.description?.value,
        expanded: node.properties?.find((property) => property.name === 'expanded')?.value.value
    }
}

/** Milliseconds from hover until the tooltip with this exact text opens, on the page clock. */
export async function tooltipDelay(page: Page, trigger: string, text: string) {
    const tooltip = page.getByRole('tooltip', { includeHidden: true }).filter({ hasText: new RegExp(`^${text}$`) })
    await tooltip.evaluate((element) => {
        element.addEventListener(
            'toggle',
            (event) => {
                if ((event as ToggleEvent).newState === 'open') element.dataset.openedAt = String(performance.now())
            },
            { once: true }
        )
    })
    const start = await page.evaluate(() => performance.now())
    await page.locator(trigger).hover()
    await tooltip.and(page.locator('[data-opened-at]')).waitFor({ state: 'attached' })
    return Number(await tooltip.getAttribute('data-opened-at')) - start
}
