import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

const pages = [
    '/',
    '/guide/',
    '/guide/getting-started',
    '/guide/concepts',
    '/guide/popover',
    '/guide/tooltip',
    '/guide/styling',
    '/guide/accessibility',
    '/guide/browser-support',
    '/guide/performance',
    '/api/',
    '/examples/'
]

function collectErrors(page: Page) {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
        // Aborted prefetches during navigation are transport noise, not application errors.
        if (message.type() === 'error' && !message.text().includes('net::ERR_')) errors.push(message.text())
    })
    return errors
}

for (const path of pages) {
    test(`${path} renders without errors`, async ({ page }) => {
        const errors = collectErrors(page)
        const response = await page.goto(path)

        expect(response?.status()).toBe(200)
        await expect(page.locator('h1').first()).toBeVisible()
        await expect(page.locator('.nk-island[data-pending]')).toHaveCount(0)
        await expect(page.locator('.nk-demo__unsupported')).toHaveCount(0)
        expect(errors).toEqual([])
    })
}

// Demos are located by role and accessible name, like a user would find them.
const panel = (page: Page, title: string) =>
    page.locator('.nk-panel').filter({ has: page.getByRole('heading', { name: title }) })

test('home hero popover opens, keeps the app handler, and closes on Escape', async ({ page }) => {
    await page.goto('/')
    const title = page.getByRole('heading', { name: 'Share “Product roadmap”' })

    await page.getByRole('button', { name: 'Share', exact: true }).click()
    await expect(title).toBeVisible()
    await expect(page.getByText('your onClick ran 1×')).toBeVisible()
    await expect(page.getByText('onOpenChange(true)')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(title).toBeHidden()
    await expect(page.getByText('onOpenChange(false)')).toBeVisible()
})

test('popover demo light-dismisses on outside click', async ({ page }) => {
    await page.goto('/guide/getting-started')
    const title = page.getByRole('heading', { name: 'Invite collaborators' })

    await page.getByRole('button', { name: 'Share', exact: true }).click()
    await expect(title).toBeVisible()

    await page.mouse.click(5, 300)
    await expect(title).toBeHidden()
})

test('tooltip opens on keyboard focus and closes on blur', async ({ page }) => {
    await page.goto('/guide/tooltip')
    const trigger = page.getByRole('button', { name: 'Italic' })
    const tooltip = page.getByRole('tooltip').filter({ hasText: 'Italic' })

    await trigger.focus()
    await expect(tooltip).toBeVisible()

    await trigger.blur()
    await expect(tooltip).toBeHidden()
})

test('toolbar tooltips switch without the delay once one is showing', async ({ page }) => {
    await page.goto('/guide/tooltip')

    // Milliseconds from hover until the named tooltip opens, on the page clock.
    const openDelay = async (name: string) => {
        const tooltip = page.getByRole('tooltip', { includeHidden: true }).filter({ hasText: new RegExp(`^${name}$`) })
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
        await page.getByRole('button', { name }).hover()
        await expect(tooltip).toHaveAttribute('data-opened-at', /\d/)
        return Number(await tooltip.getAttribute('data-opened-at')) - start
    }

    expect(await openDelay('Bold')).toBeGreaterThan(200) // interest-delay: 300ms
    expect(await openDelay('Italic')).toBeLessThan(150)
})

test.describe('demo source tabs', () => {
    test('the Code tab shows the exact file that runs the demo', async ({ page }) => {
        await page.goto('/guide/getting-started')
        const demo = page.locator('.nk-demo').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })

        await demo.getByRole('tab', { name: 'Code' }).click()
        const code = demo.getByRole('tabpanel', { name: 'Code' })
        await expect(code).toBeVisible()
        await expect(demo.getByRole('tabpanel', { name: 'Preview' })).toBeHidden()

        const source = readFileSync(new URL('../.vitepress/theme/react/PopoverDemo.tsx', import.meta.url), 'utf8')
        expect(await code.locator('pre code').textContent()).toBe(source.trim())
        await expect(code.locator('span[style*="--shiki-light"]').first()).toBeVisible()
        await expect(code.locator('button.copy')).toHaveCount(1)
    })

    test('tabs follow the keyboard pattern and the CSS tab shows the behavior styles', async ({ page }) => {
        await page.goto('/guide/getting-started')
        const demo = page.locator('.nk-demo').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })
        const preview = demo.getByRole('tab', { name: 'Preview' })

        await expect(preview).toHaveAttribute('aria-selected', 'true')
        await preview.focus()
        await page.keyboard.press('ArrowRight')
        await page.keyboard.press('ArrowRight')
        const css = demo.getByRole('tab', { name: 'CSS' })
        await expect(css).toBeFocused()
        await expect(css).toHaveAttribute('aria-selected', 'true')
        await expect(demo.getByRole('tabpanel', { name: 'CSS' })).toContainText('position-area')

        await page.keyboard.press('Home')
        await expect(preview).toBeFocused()
        await expect(demo.getByRole('tabpanel', { name: 'Preview' })).toBeVisible()
    })

    test('the preview keeps its state while another tab is shown', async ({ page }) => {
        await page.goto('/guide/getting-started')
        const demo = page.locator('.nk-demo').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })

        await demo.getByRole('button', { name: 'Share', exact: true }).click()
        await page.keyboard.press('Escape')
        await expect(demo.getByText('your onClick ran 1×')).toBeVisible()

        await demo.getByRole('tab', { name: 'Code' }).click()
        await demo.getByRole('tab', { name: 'Preview' }).click()
        await expect(demo.getByText('your onClick ran 1×')).toBeVisible()
    })
})

test('controlled manual popover ignores Escape and closes from state', async ({ page }) => {
    await page.goto('/guide/popover')
    const title = page.getByRole('heading', { name: 'Everything is live.' })

    await page.getByRole('button', { name: 'Deployment status' }).click()
    await expect(title).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(title).toBeVisible()

    await page.getByRole('button', { name: 'setOpen(false)' }).click()
    await expect(title).toBeHidden()
})

test('popover is anchored below its trigger', async ({ page }) => {
    await page.goto('/guide/getting-started')
    const trigger = page.getByRole('button', { name: 'Share', exact: true })
    const surface = panel(page, 'Invite collaborators')

    // Leave room below the trigger; otherwise position-try-fallbacks correctly flips the panel above.
    await trigger.evaluate((element) => {
        element.scrollIntoView({ block: 'start' })
        window.scrollBy(0, -120)
    })
    await trigger.click()
    await expect(surface).toBeVisible()
    await surface.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

    const triggerBox = (await trigger.boundingBox())!
    const panelBox = (await surface.boundingBox())!
    expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height)
    expect(Math.abs(panelBox.x - triggerBox.x)).toBeLessThan(2)
})

test('client-side navigation cleans up demos', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/guide/getting-started')
    await page.getByRole('button', { name: 'Share', exact: true }).click()

    await page.keyboard.press('Escape')
    await page.locator('.VPSidebar').getByRole('link', { name: 'Tooltip', exact: true }).click()
    await expect(page).toHaveURL(/\/guide\/tooltip$/)
    await expect(page.getByRole('heading', { name: 'Invite collaborators' })).toHaveCount(0)
    expect(errors).toEqual([])
})

test('every React demo island mounts', async ({ page }) => {
    await page.goto('/examples/')
    await expect(page.locator('.nk-island[data-pending]')).toHaveCount(0)
    await expect(page.locator('.nk-island .nk-demo')).toHaveCount(6)
})

test.describe('mobile layout', () => {
    test.use({ viewport: { width: 375, height: 740 } })

    for (const path of ['/', '/guide/getting-started', '/guide/browser-support', '/examples/']) {
        test(`${path} has no horizontal page overflow`, async ({ page }) => {
            await page.goto(path)
            const overflow = await page.evaluate(
                () => document.documentElement.scrollWidth - document.documentElement.clientWidth
            )
            expect(overflow).toBeLessThanOrEqual(0)
        })
    }
})
