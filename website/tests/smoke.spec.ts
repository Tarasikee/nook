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
    '/api/',
    '/api/use-popover',
    '/api/use-tooltip',
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
