import { expect, test, type Page } from '@playwright/test'

const pages = [
    '/',
    '/guide/',
    '/guide/getting-started',
    '/guide/concepts',
    '/guide/popover',
    '/guide/tooltip',
    '/guide/positioning',
    '/guide/animation',
    '/guide/accessibility',
    '/guide/server-rendering',
    '/guide/quality',
    '/guide/browser-support',
    '/guide/roadmap',
    '/api/',
    '/api/use-popover',
    '/api/use-tooltip',
    '/api/core',
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

test('home hero popover opens, keeps the app handler, and closes on Escape', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByTestId('hero-share')
    const panel = page.getByTestId('hero-share-panel')

    await trigger.click()
    await expect(panel).toBeVisible()
    await expect(page.getByText('your onclick ran 1×')).toBeVisible()
    await expect(page.getByText('onOpenChange(true)')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
    await expect(page.getByText('onOpenChange(false)')).toBeVisible()
})

test('popover demo light-dismisses on outside click', async ({ page }) => {
    await page.goto('/guide/popover')
    const panel = page.getByTestId('popover-content')

    await page.getByTestId('popover-trigger').click()
    await expect(panel).toBeVisible()

    await page.mouse.click(5, 300)
    await expect(panel).toBeHidden()
})

test('tooltip opens on keyboard focus and closes on blur', async ({ page }) => {
    await page.goto('/guide/tooltip')
    const trigger = page.getByTestId('tooltip-trigger-italic')
    const tooltip = page.getByTestId('tooltip-content-italic')

    await trigger.focus()
    await expect(tooltip).toBeVisible()
    await expect(trigger).toHaveAccessibleName('Italic')

    await trigger.blur()
    await expect(tooltip).toBeHidden()
})

test('manual popover ignores Escape and closes through the controller', async ({ page }) => {
    await page.goto('/guide/popover')
    const panel = page.getByTestId('manual-content')

    await page.getByTestId('manual-trigger').click()
    await expect(panel).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(panel).toBeVisible()

    await page.getByRole('button', { name: 'setOpen(false)' }).click()
    await expect(panel).toBeHidden()
})

test('popover is anchored below its trigger', async ({ page }) => {
    await page.goto('/guide/popover')
    const trigger = page.getByTestId('popover-trigger')
    const panel = page.getByTestId('popover-content')

    // Leave room below the trigger; otherwise position-try-fallbacks correctly flips the panel above.
    await trigger.evaluate((element) => {
        element.scrollIntoView({ block: 'start' })
        window.scrollBy(0, -120)
    })
    await trigger.click()
    await expect(panel).toBeVisible()
    await panel.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

    const triggerBox = (await trigger.boundingBox())!
    const panelBox = (await panel.boundingBox())!
    expect(panelBox.y).toBeGreaterThanOrEqual(triggerBox.y + triggerBox.height)
    expect(Math.abs(panelBox.x - triggerBox.x)).toBeLessThan(2)
})

test('client-side navigation cleans up demos', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/guide/popover')
    await page.getByTestId('popover-trigger').click()

    await page.keyboard.press('Escape')
    await page.locator('.VPSidebar').getByRole('link', { name: 'Tooltip', exact: true }).click()
    await expect(page).toHaveURL(/\/guide\/tooltip$/)
    await expect(page.getByTestId('popover-content')).toHaveCount(0)
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



