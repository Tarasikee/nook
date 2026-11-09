import { chromium } from '@playwright/test'
import { build } from 'esbuild'
import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { fileURLToPath } from 'node:url'

const { countReactFibers, installReactTreeProbe } = await import(new URL('./react-tree.mjs', import.meta.url))

let browser
let code

before(async () => {
    browser = await chromium.launch()
    const result = await build({
        stdin: {
            contents: `
                import { createContext, Fragment } from 'react'
                import { createRoot } from 'react-dom/client'
                import { createPortal, flushSync } from 'react-dom'

                const Context = createContext(null)
                function Leaf({ label }) { return <span>{label}{1}</span> }
                function Empty() { return null }
                function App({ portal, label, empty }) {
                    if (empty) return null
                    return <Context.Provider value={null}>
                        <Fragment key="group">
                            <Leaf label={label} />
                            <Leaf label={label} />
                            <Empty />
                            {portal ? createPortal(<aside><Leaf label={label} /></aside>, document.body) : null}
                        </Fragment>
                    </Context.Provider>
                }
                const root = createRoot(document.getElementById('root'))
                window.renderTree = (props) => flushSync(() => root.render(<App {...props} />))
                window.unmountTree = () => flushSync(() => root.unmount())
                window.renderTree({ label: 'first' })
            `,
            loader: 'jsx',
            resolveDir: fileURLToPath(new URL('.', import.meta.url))
        },
        bundle: true,
        write: false,
        minify: true,
        jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"production"' }
    })
    code = result.outputFiles[0].text
})

after(async () => {
    await browser?.close()
})

test('counts the committed production React tree, including non-DOM nodes and portals', async () => {
    const page = await browser.newPage()
    try {
        await page.setContent('<div id="root"></div>')
        await page.evaluate(installReactTreeProbe)
        await page.addScriptTag({ content: code })

        // App, provider, keyed fragment, two Leaf/span/text/text branches, and Empty.
        assert.equal(await page.evaluate(countReactFibers), 12)
        assert.equal(await page.locator('#root *').count(), 2)

        for (const label of ['second', 'third']) {
            await page.evaluate((label) => window.renderTree({ label }), label)
            assert.equal(await page.evaluate(countReactFibers), 12, 'updates must not count alternate Fibers')
        }

        await page.evaluate(() => window.renderTree({ label: 'portaled', portal: true }))
        assert.equal(await page.locator('body > aside span').textContent(), 'portaled1')
        assert.equal(await page.evaluate(countReactFibers), 18)

        await page.evaluate(() => window.renderTree({ label: 'closed', portal: false }))
        assert.equal(await page.evaluate(countReactFibers), 12, 'removed portal nodes must not remain counted')

        await page.evaluate(() => window.renderTree({ empty: true }))
        assert.equal(await page.evaluate(countReactFibers), 1, 'a component rendering null still has a Fiber')

        await page.evaluate(() => window.unmountTree())
        assert.equal(await page.evaluate(countReactFibers), 0)
    } finally {
        await page.close()
    }
})

test('fails if React inspection is unavailable instead of reporting zero nodes', async () => {
    const page = await browser.newPage()
    try {
        await assert.rejects(page.evaluate(countReactFibers), /React did not expose a committed Fiber root/)
    } finally {
        await page.close()
    }
})
