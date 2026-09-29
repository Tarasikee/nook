/**
 * Compares Nook with Radix and Floating UI on the same screen: N items, each a button with a
 * hover tooltip and a click popover, written idiomatically for each library.
 *
 * Fairness rules:
 * - Production builds; shared app code is compiled by React Compiler for every library.
 * - Same markup, placements, 8px offsets, and a 0ms tooltip delay everywhere.
 * - "Open" and "hover" end only when the surface is visible AND at its final position.
 * - Every metric is reported, including ones where Nook is worse (for example DOM size:
 *   Nook renders hidden content up front, the others mount it on open).
 * - Chromium only (Nook's tooltip needs interestfor); CPU throttled; median of RUNS fresh pages.
 *
 * Usage: pnpm bench             (RUNS=7 CPU=4 by default)
 *        pnpm bench --publish   also updates the website Performance page
 */
import { transformAsync } from '@babel/core'
import { chromium } from '@playwright/test'
import { build } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const here = fileURLToPath(new URL('.', import.meta.url))
const libraries = ['nook', 'radix', 'floating']
const runs = Number(process.env.RUNS ?? 7)
const cpu = Number(process.env.CPU ?? 4)

const css = `
    body { margin: 0; font: 14px system-ui; }
    #root { padding: 80px 16px 4000px; } /* room above row one, so tooltips need not flip */
    .item { display: inline-block; margin: 4px; }
    .trigger { font: inherit; }
    .panel, .tip { margin: 0; padding: 8px; border: 1px solid #ccc; background: #fff; }
    .panel h3 { margin: 0 0 4px; font-size: 14px; }
    .panel p { margin: 0; }
    [popover].panel, [popover].tip { inset: auto; }
    [popover].panel { position-area: block-end span-inline-end; margin-block-start: 8px; }
    [popover].tip { position-area: block-start; margin-block-end: 8px; }
    [interestfor] { interest-delay: 0s 0s; }
`

// React Compiler for the shared app code, so each library gets the same treatment.
const reactCompiler = {
    name: 'react-compiler',
    setup(builder) {
        builder.onLoad({ filter: /bench\/src\/.*\.tsx$/ }, async ({ path }) => {
            const result = await transformAsync(await readFile(path, 'utf8'), {
                filename: path,
                babelrc: false,
                configFile: false,
                presets: [
                    ['@babel/preset-typescript', { isTSX: true, allExtensions: true, onlyRemoveTypeImports: true }]
                ],
                plugins: [['babel-plugin-react-compiler', { target: '19' }]]
            })
            return { contents: result.code, loader: 'jsx' }
        })
    }
}

async function bundle(entry, lib) {
    const result = await build({
        entryPoints: [`${here}src/${entry}`],
        bundle: true,
        write: false,
        minify: true,
        format: 'iife',
        jsx: 'automatic',
        define: { 'process.env.NODE_ENV': '"production"' },
        alias: lib ? { 'bench-lib': `${here}src/${lib}.tsx` } : {},
        plugins: [reactCompiler],
        logLevel: 'silent'
    })
    return result.outputFiles[0].text
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const range = (values) => `${Math.min(...values).toFixed(0)}–${Math.max(...values).toFixed(0)}`
const gzip = (code) => gzipSync(code, { level: 9 }).length

async function openPage(browser, code, count) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu })
    await page.setContent(`<!doctype html><style>${css}</style><div id="root"></div>`)
    await page.evaluate((n) => (window.benchCount = n), count)
    await page.addScriptTag({ content: code })
    await page.waitForFunction(() => window.benchPainted > 0)
    return { page, cdp }
}

/** In-page helpers: find the item-0 surfaces and check final placement. */
const probes = `
    window.benchProbe = {
        trigger: () => document.querySelector('.trigger'),
        visible: (selector, text) =>
            [...document.querySelectorAll(selector)].find((el) => el.textContent.includes(text) && el.checkVisibility()),
        panelPlaced() {
            const panel = this.visible('.panel', 'Panel 0')
            if (!panel) return false
            const t = this.trigger().getBoundingClientRect(), p = panel.getBoundingClientRect()
            return Math.abs(p.left - t.left) < 2 && p.top >= t.bottom + 6 && p.top <= t.bottom + 10
        },
        tipPlaced() {
            const tip = this.visible('.tip', 'Tooltip 0')
            if (!tip) return false
            const t = this.trigger().getBoundingClientRect(), r = tip.getBoundingClientRect()
            return r.bottom <= t.top - 6 && r.bottom >= t.top - 10
        },
        async until(check, limit = 2000) {
            const start = performance.now()
            while (!check()) {
                if (performance.now() - start > limit) return false
                await new Promise((resolve) => requestAnimationFrame(resolve))
            }
            return true
        }
    }
`

const scenarios = {
    async mount(page) {
        return page.evaluate(async () => {
            globalThis.gc?.()
            return {
                commitMs: window.benchMounted - window.benchStart,
                firstFrameMs: window.benchPainted - window.benchStart,
                heapMB: performance.memory.usedJSHeapSize / 1024 / 1024,
                domNodes: document.getElementsByTagName('*').length
            }
        })
    },

    async rerender(page) {
        return page.evaluate(async () => {
            const start = performance.now()
            window.benchRerender()
            while (!(window.benchCommitted > start)) await new Promise((resolve) => setTimeout(resolve))
            return { rerenderMs: window.benchCommitted - start }
        })
    },

    async open(page) {
        await page.addScriptTag({ content: probes })
        return page.evaluate(async () => {
            const probe = window.benchProbe
            const start = performance.now()
            probe.trigger().click()
            const placed = await probe.until(() => probe.panelPlaced())
            return { openMs: performance.now() - start, placed }
        })
    },

    async hover(page) {
        await page.addScriptTag({ content: probes })
        await page.mouse.move(1200, 780)
        await page.evaluate(() => {
            const trigger = window.benchProbe.trigger()
            document.addEventListener(
                'pointerover',
                (event) => {
                    if (event.target === trigger && !window.benchHoverStart) window.benchHoverStart = performance.now()
                },
                true
            )
        })
        const box = await page.locator('.trigger').first().boundingBox()
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        return page.evaluate(async () => {
            const probe = window.benchProbe
            await probe.until(() => window.benchHoverStart > 0)
            const placed = await probe.until(() => probe.tipPlaced())
            return { hoverMs: performance.now() - window.benchHoverStart, placed }
        })
    },

    /** Pointer sweeps across 30 triggers: interest invokers need no JS per pointer event. */
    async sweep(page, cdp) {
        const points = await page.locator('.trigger').evaluateAll((triggers) =>
            triggers.slice(0, 30).map((trigger) => {
                const rect = trigger.getBoundingClientRect()
                return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
            })
        )
        await page.mouse.move(points[0].x, points[0].y - 60)
        await cdp.send('Performance.enable')
        const metric = async () =>
            Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]))
        const before = await metric()
        for (const point of points) {
            await page.mouse.move(point.x, point.y, { steps: 4 })
        }
        await page.waitForTimeout(100)
        const after = await metric()
        const delta = (name) => (after[name] - before[name]) * 1000
        const shown = await page.evaluate(() =>
            [...document.querySelectorAll('.tip')].some((tip) => tip.checkVisibility())
        )
        return {
            scriptMs: delta('ScriptDuration'),
            styleLayoutMs: delta('RecalcStyleDuration') + delta('LayoutDuration'),
            shown
        }
    },

    async scroll(page, cdp) {
        await page.addScriptTag({ content: probes })
        await page.evaluate(async () => {
            window.benchProbe.trigger().click()
            await window.benchProbe.until(() => window.benchProbe.panelPlaced())
        })
        await cdp.send('Performance.enable')
        const metric = async () =>
            Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]))
        const before = await metric()
        const frames = await page.evaluate(async () => {
            const times = []
            for (let frame = 0; frame < 60; frame++) {
                window.scrollBy(0, 3)
                times.push(await new Promise((resolve) => requestAnimationFrame(resolve)))
            }
            return times
        })
        const after = await metric()
        const placed = await page.evaluate(() => window.benchProbe.panelPlaced())
        const delta = (name) => (after[name] - before[name]) * 1000
        const intervals = frames.slice(1).map((time, index) => time - frames[index])
        return {
            scriptMs: delta('ScriptDuration'),
            styleLayoutMs: delta('RecalcStyleDuration') + delta('LayoutDuration'),
            avgFrameMs: intervals.reduce((sum, value) => sum + value, 0) / intervals.length,
            placed
        }
    }
}

const plan = [
    { scenario: 'mount', count: 200 },
    { scenario: 'mount', count: 1000 },
    { scenario: 'rerender', count: 1000 },
    { scenario: 'open', count: 200 },
    { scenario: 'hover', count: 200 },
    { scenario: 'sweep', count: 200 },
    { scenario: 'scroll', count: 200 }
]

const baseline = gzip(await bundle('baseline.tsx'))
const code = {}
const sizes = []
for (const lib of libraries) {
    code[lib] = await bundle('entry.tsx', lib)
    sizes.push({ lib, addedKB: ((gzip(code[lib]) - baseline) / 1024).toFixed(1) })
}
console.log(`\nBundle size added over React (${(baseline / 1024).toFixed(1)} KB), min+gzip`)
console.table(sizes)

const browser = await chromium.launch({ args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] })
const report = { date: new Date().toISOString(), browser: browser.version(), cpu, runs, sizes, results: [] }

for (const { scenario, count } of plan) {
    const rows = []
    for (const lib of libraries) {
        const samples = []
        for (let run = 0; run < runs; run++) {
            const { page, cdp } = await openPage(browser, code[lib], count)
            samples.push(await scenarios[scenario](page, cdp))
            await page.close()
        }
        const row = { lib }
        for (const key of Object.keys(samples[0])) {
            const values = samples.map((sample) => sample[key])
            if (typeof values[0] === 'boolean') {
                row[key] = values.every(Boolean)
            } else {
                row[key] = Number(median(values).toFixed(key === 'domNodes' ? 0 : 1))
                if (key.endsWith('Ms')) row[`${key} range`] = range(values)
            }
        }
        rows.push(row)
    }
    console.log(`\n${scenario}, ${count} items (median of ${runs}, CPU ×${cpu})`)
    console.table(rows)
    report.results.push({ scenario, count, rows })
}

await browser.close()
await mkdir(`${here}results`, { recursive: true })
await writeFile(`${here}results/latest.json`, JSON.stringify(report, null, 2))
if (process.argv.includes('--publish')) {
    await writeFile(`${here}../website/.vitepress/theme/bench-results.json`, JSON.stringify(report, null, 2) + '\n')
    console.log('Published to website/.vitepress/theme/bench-results.json')
}
console.log(`\nChromium ${report.browser}. Full results: bench/results/latest.json`)
