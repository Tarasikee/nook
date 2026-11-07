import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

const pages = [
    '/',
    '/guide/',
    '/guide/getting-started',
    '/guide/concepts',
    '/guide/popover',
    '/guide/tooltip',
    '/guide/dialog',
    '/guide/styling',
    '/guide/accessibility',
    '/guide/browser-support',
    '/guide/performance',
    '/api/',
    '/ui/',
    '/ui/button',
    '/ui/tooltip',
    '/ui/popover',
    '/ui/dialog',
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
        await expect(page.locator('.nk-island [role="status"]')).toHaveCount(0)
        expect(errors).toEqual([])
    })
}

const sections = [
    { name: 'Guide', path: '/guide/', groups: ['Getting started', 'Guides'], prefix: '/guide/' },
    { name: 'Nook', path: '/guide/popover', groups: ['Primitives'], prefix: '/guide/' },
    { name: 'Nook UI', path: '/ui/', groups: ['Nook UI'], prefix: '/ui/' },
    { name: 'API', path: '/api/', groups: ['API'], prefix: '/api/' },
    { name: 'Examples', path: '/examples/', groups: ['Examples'], prefix: '/examples/' }
]

test('header tabs switch to their own sidebars', async ({ page }) => {
    await page.goto('/guide/')
    const header = page.getByRole('navigation', { name: 'Main Navigation' })
    const sidebar = page.getByRole('navigation', { name: 'Sidebar Navigation' })

    await expect(header.locator('a.VPNavBarMenuLink')).toHaveText(sections.map(({ name }) => name))
    for (const section of sections) {
        await header.getByRole('link', { name: section.name, exact: true }).click()
        await expect(page).toHaveURL(new RegExp(`${section.path}$`))
        await expect(header.locator('a.active')).toHaveText(section.name)
        await expect(sidebar.getByRole('heading')).toHaveText(section.groups)
        const links = await sidebar
            .getByRole('link')
            .evaluateAll((elements) => elements.map((element) => element.getAttribute('href')!))
        expect(links.every((link) => link.startsWith(section.prefix))).toBe(true)
        if (section.name === 'Guide') {
            expect(links).not.toContain('/guide/popover')
            expect(links).not.toContain('/guide/tooltip')
            expect(links).not.toContain('/guide/dialog')
        }
    }
})

for (const path of ['/guide/popover', '/guide/tooltip', '/guide/dialog']) {
    test(`${path} belongs to the Nook tab`, async ({ page }) => {
        await page.goto(path)
        await expect(page.locator('.VPNavBarMenu a.active')).toHaveText('Nook')
        await expect(page.locator('.VPSidebar h2')).toHaveText(['Primitives'])
    })
}

for (const path of ['/api/', '/examples/']) {
    test(`${path} sidebar anchors target existing headings`, async ({ page }) => {
        await page.goto(path)
        const anchors = page.locator('.VPSidebar a[href*="#"]')
        expect(await anchors.count()).toBeGreaterThan(0)
        for (const anchor of await anchors.all()) {
            const hash = new URL((await anchor.getAttribute('href'))!, page.url()).hash
            await anchor.click()
            await expect(page).toHaveURL(new RegExp(`${hash}$`))
            await expect(page.locator(hash)).toHaveCount(1)
        }
    })
}

// Demos are located by role and accessible name, like a user would find them.
const panel = (page: Page, title: string) =>
    page.locator('[popover]').filter({ has: page.getByRole('heading', { name: title }) })

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

test('UI dialog demo opens modally, closes from Cancel and the backdrop', async ({ page }) => {
    await page.goto('/ui/dialog')
    const trigger = page.getByRole('button', { name: 'Delete project' })
    const dialog = page.getByRole('dialog', { name: 'Delete “Atlas”?' })

    await trigger.click()
    await expect(dialog).toBeVisible()
    expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true)
    // VitePress ships Tailwind's Preflight, which removes the browser's centering margin.
    await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))
    const viewport = page.viewportSize()!
    const box = (await dialog.boundingBox())!
    expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(1.5)
    expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(1.5)
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    const news = page.getByRole('dialog', { name: 'What’s new' })
    await page.getByRole('button', { name: 'What’s new' }).click()
    await expect(news).toBeVisible()
    // Site search hotkeys would open search, unusable, underneath the modal.
    await page.keyboard.press('/')
    await page.keyboard.press('ControlOrMeta+k')
    await expect(page.locator('.VPLocalSearchBox')).toHaveCount(0)
    await page.mouse.click(5, 5)
    await expect(news).toBeHidden()
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
        const demo = page.getByRole('figure').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })

        await demo.getByRole('tab', { name: 'Code' }).click()
        const code = demo.getByRole('tabpanel', { name: 'Code' })
        await expect(code).toBeVisible()
        await expect(demo.getByRole('tabpanel', { name: 'Preview' })).toBeHidden()

        const source = readFileSync(new URL('../.vitepress/theme/react/PopoverDemo.tsx', import.meta.url), 'utf8')
        expect(await code.locator('pre code').textContent()).toBe(source.trim())
        await expect(code.locator('span[style*="--shiki-light"]').first()).toBeVisible()
        await expect(code.locator('button.copy')).toHaveCount(1)
    })

    test('tabs follow the keyboard pattern and the CSS tab shows the popover styles', async ({ page }) => {
        await page.goto('/guide/getting-started')
        const demo = page.getByRole('figure').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })
        const preview = demo.getByRole('tab', { name: 'Preview' })

        await expect(preview).toHaveAttribute('aria-selected', 'true')
        await preview.focus()
        await page.keyboard.press('ArrowRight')
        await page.keyboard.press('ArrowRight')
        const css = demo.getByRole('tab', { name: 'CSS' })
        await expect(css).toBeFocused()
        await expect(css).toHaveAttribute('aria-selected', 'true')
        await expect(demo.getByRole('tabpanel', { name: 'CSS' })).toContainText(
            "positionArea: 'block-end span-inline-end'"
        )

        await page.keyboard.press('Home')
        await expect(preview).toBeFocused()
        await expect(demo.getByRole('tabpanel', { name: 'Preview' })).toBeVisible()
    })

    test('the preview keeps its state while another tab is shown', async ({ page }) => {
        await page.goto('/guide/getting-started')
        const demo = page.getByRole('figure').filter({ has: page.getByRole('tablist', { name: 'Popover demo' }) })

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
    await page
        .getByRole('navigation', { name: 'Main Navigation' })
        .getByRole('link', { name: 'Nook', exact: true })
        .click()
    await page.locator('.VPSidebar a[href="/guide/tooltip"]').click()
    await expect(page).toHaveURL(/\/guide\/tooltip$/)
    await expect(page.getByRole('heading', { name: 'Invite collaborators' })).toHaveCount(0)
    expect(errors).toEqual([])
})

test('every React demo island mounts', async ({ page }) => {
    await page.goto('/examples/')
    await expect(page.locator('.nk-island[data-pending]')).toHaveCount(0)
    await expect(page.locator('.nk-island').getByRole('figure')).toHaveCount(6)
})

test.describe('mobile layout', () => {
    test.use({ viewport: { width: 375, height: 740 } })

    test('mobile header tabs open section-specific sidebars', async ({ page }) => {
        await page.goto('/guide/')
        for (const section of sections) {
            await page.getByRole('button', { name: 'Menu', exact: true }).first().click()
            const menu = page.locator('.VPNavScreen')
            await expect(menu.getByRole('link').filter({ hasText: /^(Guide|Nook|Nook UI|API|Examples)$/ })).toHaveText(
                sections.map(({ name }) => name)
            )
            await menu.getByRole('link', { name: section.name, exact: true }).click()
            await expect(page).toHaveURL(new RegExp(`${section.path}$`))
            await page.locator('.VPLocalNav').getByRole('button', { name: 'Menu', exact: true }).click()
            const sidebar = page.getByRole('navigation', { name: 'Sidebar Navigation' })
            await expect(sidebar).toBeVisible()
            await expect(sidebar.getByRole('heading')).toHaveText(section.groups)
            await page.locator('.VPBackdrop').click({ position: { x: 365, y: 400 } })
            await expect(page.locator('.VPSidebar')).not.toHaveClass(/open/)
        }
    })

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
