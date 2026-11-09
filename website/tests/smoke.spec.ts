import { expect, test, type Page } from '@playwright/test'
import { pages, sections } from '../src/pages'

function collectErrors(page: Page) {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
        if (message.type() === 'error' && !message.text().includes('net::ERR_')) errors.push(message.text())
    })
    return errors
}

for (const entry of pages) {
    test(`${entry.path} renders and hydrates without errors`, async ({ page, request }) => {
        const errors = collectErrors(page)
        const response = await page.goto(entry.path)
        expect(response?.status()).toBe(200)
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        const theme = page.getByRole('button', { name: 'Toggle color theme' })
        await theme.click()
        await expect(theme).toHaveAttribute('aria-pressed', 'true')
        await expect(page.locator('pre[data-source]')).toHaveCount(0)
        expect(errors).toEqual([])
        const html = await (await request.get(entry.path)).text()
        expect(html).toContain('<div id="root">')
        expect(html).toContain('<h1')
        expect(html).toContain('<meta name="description"')
        expect(html).toContain('<script id="nook-page" type="application/json">')
    })
}

test('header links and sidebars use the page list', async ({ page }) => {
    await page.goto('/ui/')
    const navigation = page.getByRole('navigation', { name: 'Main navigation', exact: true })
    await expect(navigation.getByRole('link')).toHaveText(sections.map((section) => section.name))
    for (const section of sections) {
        await navigation.getByRole('link', { name: section.name, exact: true }).click()
        await expect(page).toHaveURL(new RegExp(`${section.path}$`))
        await expect(navigation.locator('[aria-current="location"]')).toHaveText(section.name)
        const sidebar = page.getByRole('navigation', { name: 'Documentation navigation' })
        await expect(sidebar.getByRole('link')).toHaveText(
            pages.filter((entry) => entry.section === section.name).map((entry) => entry.title)
        )
    }
})

test('performance tables compare Base UI and show DOM and React tree counts', async ({ page }) => {
    await page.goto('/guide/performance')
    for (const table of await page.getByRole('table').all()) {
        await expect(
            table
                .getByRole('rowheader', { name: 'Base UI', exact: true })
                .or(table.getByRole('columnheader', { name: 'Base UI', exact: true }))
        ).toBeVisible()
    }
    for (const count of [200, 1000]) {
        const section = page
            .locator('section')
            .filter({ has: page.getByRole('heading', { name: `Mount, ${count} items`, exact: true }) })
        await expect(section.getByRole('columnheader', { name: 'DOM elements', exact: true })).toBeVisible()
        await expect(
            section.getByRole('columnheader', { name: 'React tree nodes (Fibers)', exact: true })
        ).toBeVisible()
        for (const row of await section.locator('tbody tr').all()) {
            expect(Number(await row.getByRole('cell').last().textContent())).toBeGreaterThan(count)
        }
    }
})

for (const path of ['/api/', '/examples/']) {
    test(`${path} outline links target rendered headings`, async ({ page }) => {
        await page.goto(path)
        const links = page.getByRole('navigation', { name: 'On this page' }).getByRole('link')
        expect(await links.count()).toBeGreaterThan(0)
        for (const link of await links.all()) {
            const hash = (await link.getAttribute('href'))!
            await link.click()
            await expect(page.locator(hash)).toBeVisible()
            expect(await page.locator(hash).count()).toBe(1)
        }
    })
}

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false })
    test('pregenerated native controls work before hydration', async ({ page }) => {
        await page.goto('/guide/getting-started')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Quick start')
        await page.getByRole('button', { name: 'Share', exact: true }).click()
        const heading = page.getByRole('heading', { name: 'Invite collaborators' })
        await expect(heading).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(heading).toBeHidden()
        await page.goto('/ui/dialog')
        await page.getByRole('button', { name: 'Delete project' }).click()
        const dialog = page.getByRole('dialog', { name: 'Delete “Atlas”?' })
        await expect(dialog).toBeVisible()
        await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
        await dialog.getByRole('button', { name: 'Cancel' }).click()
        await expect(dialog).toBeHidden()
    })
})

test('home hero preserves native events after hydration', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Share', exact: true }).click()
    const title = page.getByRole('heading', { name: 'Share “Product roadmap”' })
    await expect(title).toBeVisible()
    await expect(page.getByText('your onClick ran 1×')).toBeVisible()
    await expect(page.getByText('onToggle(open)')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(title).toBeHidden()
    await expect(page.getByText('onToggle(closed)')).toBeVisible()
    expect(errors).toEqual([])
})

test('popover keeps its native anchor and light dismissal', async ({ page }) => {
    await page.goto('/guide/getting-started')
    const trigger = page.getByRole('button', { name: 'Share', exact: true })
    await trigger.evaluate((element) => {
        element.scrollIntoView({ block: 'start' })
        window.scrollBy(0, -150)
    })
    await trigger.click()
    const panel = page.locator('[popover]').filter({ has: page.getByRole('heading', { name: 'Invite collaborators' }) })
    await expect(panel).toBeVisible()
    await panel.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
    const a = (await trigger.boundingBox())!
    const b = (await panel.boundingBox())!
    expect(Math.abs(b.x - a.x)).toBeLessThan(2)
    expect(Math.abs(b.y - (a.y + a.height + 8))).toBeLessThan(2)
    await page.mouse.click(5, 300)
    await expect(panel).toBeHidden()
})

test('modal dialog centers, returns focus, and blocks search shortcuts', async ({ page }) => {
    await page.goto('/ui/dialog')
    const trigger = page.getByRole('button', { name: 'Delete project' })
    await trigger.click()
    const dialog = page.getByRole('dialog', { name: 'Delete “Atlas”?' })
    await expect(dialog).toBeVisible()
    await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
    const box = (await dialog.boundingBox())!
    const viewport = page.viewportSize()!
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(2)
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(2)
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(trigger).toBeFocused()
    await page.getByRole('button', { name: 'What’s new' }).click()
    const news = page.getByRole('dialog', { name: 'What’s new' })
    await expect(news).toBeVisible()
    await page.keyboard.press('/')
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.getByRole('dialog', { name: 'Search documentation' })).toBeHidden()
    await page.mouse.click(5, 5)
    await expect(news).toBeHidden()
})

for (const path of ['/guide/tooltip', '/ui/tooltip']) {
    test(`${path} tooltip toolbar renders and hydrates without errors`, async ({ page }) => {
        const errors = collectErrors(page)
        await page.goto(path)
        await expect(
            page
                .getByRole('tablist', { name: 'Tooltip demo', exact: true })
                .getByRole('tab', { name: 'Code', exact: true })
        ).toBeEnabled()
        const toolbar = page.getByRole('toolbar', { name: 'Formatting' })
        await expect(toolbar.getByRole('button')).toHaveCount(3)
        for (const label of ['Bold', 'Italic', 'Insert link']) {
            const button = toolbar.getByRole('button', { name: label, exact: true })
            await expect(button).toHaveCSS('width', '36px')
            await expect(button).toHaveCSS('height', '36px')
            await expect(button.locator('svg')).toHaveCSS('width', '18px')
            await expect(button.locator('svg')).toHaveCSS('height', '18px')
        }
        expect(errors).toEqual([])
    })
}

test('native tooltips open on focus and move between toolbar items', async ({ page }) => {
    await page.goto('/guide/tooltip')
    const trigger = page.getByRole('button', { name: 'Italic', exact: true })
    const hint = page.getByRole('tooltip').filter({ hasText: /^Italic$/ })
    await trigger.focus()
    await expect(hint).toBeVisible()
    await trigger.blur()
    await expect(hint).toBeHidden()
    await page.getByRole('button', { name: 'Bold', exact: true }).hover()
    await expect(page.getByRole('tooltip').filter({ hasText: /^Bold$/ })).toBeVisible()
    await trigger.hover()
    await expect(hint).toBeVisible()
})

test('code tabs show standalone implementations and preserve demo state', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/guide/getting-started')
    const demo = page.getByRole('figure').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })
    // The native trigger works before hydration; this assertion needs its React handler.
    await expect(demo.getByRole('tab', { name: 'Code', exact: true })).toBeEnabled()
    await demo.getByRole('button', { name: 'Share', exact: true }).click()
    await page.keyboard.press('Escape')
    await expect(demo.getByText('your onClick ran 1×')).toBeVisible()
    await demo.getByRole('tab', { name: 'Code', exact: true }).click()
    const code = demo.getByRole('tabpanel', { name: 'Code' })
    const implementation = await code.locator('pre code').textContent()
    expect(implementation).toContain('function SharePopover()')
    expect(implementation).not.toMatch(/\bimport\b|<Demo\b|kit\.|useUnsupported|nook\/ui/)
    expect(await code.locator('span[style*="--shiki-light"]').count()).toBeGreaterThan(0)
    await code.getByRole('button', { name: 'Copy code' }).click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(implementation)
    await demo.getByRole('tab', { name: 'Code', exact: true }).focus()
    await page.keyboard.press('Home')
    await expect(demo.getByRole('tab', { name: 'Preview' })).toBeFocused()
    await expect(demo.getByText('your onClick ran 1×')).toBeVisible()
})

test('controlled manual popover follows application state', async ({ page }) => {
    await page.goto('/guide/popover')
    await page.getByRole('button', { name: 'setOpen(true)' }).click()
    const title = page.getByRole('heading', { name: 'Everything is live.' })
    await expect(title).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(title).toBeVisible()
    await page.getByRole('button', { name: 'setOpen(false)' }).click()
    await expect(title).toBeHidden()
})

test('all examples render inside the single hydrated React tree', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/examples/')
    await expect(page.locator('[data-demo]')).toHaveCount(6)
    await expect(page.getByRole('figure')).toHaveCount(6)
    await expect(page.locator('[data-demo] [role="status"]')).toHaveCount(0)
    await page.getByRole('button', { name: 'Toggle color theme' }).click()
    expect(errors).toEqual([])
})

test('search finds generated content and follows a normal page link', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Search documentation', exact: true }).click()
    const search = page.getByRole('dialog', { name: 'Search documentation' })
    await search.getByRole('searchbox', { name: 'Search query' }).fill('browser support')
    await search.getByRole('link', { name: /^Browser support/ }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Browser support')
})

test('theme persists through a full page reload without hydration errors', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Toggle color theme' }).click()
    await expect(page.locator('html')).toHaveClass('dark')
    await page.reload()
    await expect(page.getByRole('button', { name: 'Toggle color theme' })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('html')).toHaveClass('dark')
    expect(errors).toEqual([])
})

test('missing URLs return a real 404 with React-rendered navigation', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
    await expect(page.getByRole('link', { name: 'Return to Nook' })).toHaveAttribute('href', '/')
})

test.describe('mobile layout', () => {
    test.use({ viewport: { width: 375, height: 740 } })
    test('mobile navigation reaches the documentation', async ({ page }) => {
        await page.goto('/')
        await page.getByText('Menu', { exact: true }).click()
        await page
            .getByRole('navigation', { name: 'Mobile navigation' })
            .getByRole('link', { name: 'Components' })
            .click()
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Components')
    })
    for (const path of ['/', '/guide/getting-started', '/guide/browser-support', '/examples/', '/guide/performance']) {
        test(`${path} has no horizontal page overflow`, async ({ page }) => {
            await page.goto(path)
            expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
        })
    }
})
