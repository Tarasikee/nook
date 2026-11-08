import { expect, test } from '@playwright/test'
import { accessibilityNode, events, hydrateFixture, isOpen, mountFixture, renderFixture, variant } from './harness'

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

test.describe('server rendering', () => {
    test('popover markup carries the native relationships', async () => {
        const html = await renderFixture('uncontrolled')
        const id = html.match(/<div[^>]* id="([^"]+)"[^>]*popover="auto"/)?.[1]

        expect(id).toBeTruthy()
        const idPattern = escape(id!)
        expect(html).toMatch(new RegExp(`<button[^>]*popoverTarget="${idPattern}"[^>]*id="trigger"`, 'i'))
        expect(html).toContain(`aria-labelledby="${id}-title"`)
        expect(html).toContain(`<h2 id="${id}-title">`)
        expect(html).toMatch(new RegExp(`popoverTarget="${idPattern}" popoverTargetAction="hide"`, 'i'))
        expect(html).not.toContain('data-open')
    })

    test('tooltip markup carries interestfor and an explicit relationship', async () => {
        const html = await renderFixture('tooltips')

        expect(html).toMatch(/<button interestfor="([^"]+)"[^>]*aria-describedby="\1" id="described"/)
        expect(html).toMatch(/<button interestfor="([^"]+)"[^>]*aria-labelledby="\1" id="labelled"/)
        expect(html).toMatch(/popover="hint" role="tooltip"/)
    })
})

test.describe('before hydration', () => {
    test('trigger, close button, and Escape work without JavaScript', async ({ page }) => {
        await mountFixture(page, 'uncontrolled', { hydrate: false })

        await page.click('#trigger')
        expect(await isOpen(page, '.panel')).toBe(true)
        await page.click('#close')
        expect(await isOpen(page, '.panel')).toBe(false)

        await page.click('#trigger')
        await page.keyboard.press('Escape')
        expect(await isOpen(page, '.panel')).toBe(false)
    })

    test('state opened before hydration is picked up after hydration', async ({ page }) => {
        await mountFixture(page, 'uncontrolled', { hydrate: false })
        await page.click('#trigger')

        await hydrateFixture(page, 'uncontrolled')
        await expect(page.locator('#state')).toHaveText('true')
    })
})

test.describe('usePopover', () => {
    test('hydrates without warnings and mirrors native state', async ({ page }) => {
        const messages = await mountFixture(page, 'uncontrolled')

        await page.click('#trigger')
        await expect(page.locator('.panel')).toBeVisible()
        await expect(page.locator('#state')).toHaveText('true')
        await expect(page.locator('#clicks')).toHaveText('1')

        await page.keyboard.press('Escape')
        await expect(page.locator('#state')).toHaveText('false')

        await page.click('#trigger')
        await expect(page.locator('#state')).toHaveText('true')
        await page.mouse.click(5, 5)
        await expect(page.locator('#state')).toHaveText('false')

        expect(await events(page)).toEqual(['popover:true', 'popover:false', 'popover:true', 'popover:false'])
        expect(messages).toEqual([])
    })

    test('does not report coalesced toggles that end where they started', async ({ page }) => {
        await mountFixture(page, 'uncontrolled')

        await page.locator('.panel').evaluate((panel: HTMLElement) => {
            panel.showPopover()
            panel.hidePopover()
        })
        await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 50)))

        expect(await events(page)).toEqual([])
        await expect(page.locator('#state')).toHaveText('false')
    })

    test('names the content from the title and exposes expanded natively', async ({ page }) => {
        await mountFixture(page, 'uncontrolled')

        expect(await accessibilityNode(page, '#trigger')).toMatchObject({ expanded: false })
        await page.click('#trigger')
        expect(await accessibilityNode(page, '#trigger')).toMatchObject({ expanded: true })
        expect(await accessibilityNode(page, '.panel')).toMatchObject({ name: 'Invite collaborators' })
    })

    test('native showPopover with an explicit source anchors the popover to its trigger', async ({ page }) => {
        await mountFixture(page, 'uncontrolled')

        await page.click('#show')
        await expect(page.locator('.panel')).toBeVisible()

        const trigger = (await page.locator('#trigger').boundingBox())!
        const panel = (await page.locator('.panel').boundingBox())!
        expect(Math.round(panel.x)).toBe(Math.round(trigger.x))
        expect(Math.round(panel.y)).toBe(Math.round(trigger.y + trigger.height + 8))
    })

    test('controlled auto: state opens it, and the browser can still close it', async ({ page }) => {
        const messages = await mountFixture(page, 'controlled-auto')

        await page.click('#external-open')
        await expect(page.locator('.panel')).toBeVisible()
        await expect(page.locator('#state')).toHaveText('true')

        const trigger = (await page.locator('#trigger').boundingBox())!
        const panel = (await page.locator('.panel').boundingBox())!
        expect(Math.round(panel.x)).toBe(Math.round(trigger.x))
        expect(Math.round(panel.y)).toBe(Math.round(trigger.y + trigger.height + 8))

        await page.keyboard.press('Escape')
        await expect(page.locator('.panel')).toBeHidden()
        await expect(page.locator('#controlled')).toHaveText('false')
        expect(await events(page)).toEqual(['controlled:true', 'controlled:false'])
        expect(messages).toEqual([])
    })

    test('controlled manual: ignores Escape and closes from state', async ({ page }) => {
        await mountFixture(page, 'controlled-manual')

        await page.click('#external-open')
        await expect(page.locator('.panel')).toBeVisible()
        await page.keyboard.press('Escape')
        await page.mouse.click(5, 5)
        await expect(page.locator('.panel')).toBeVisible()

        await page.click('#external-close')
        await expect(page.locator('.panel')).toBeHidden()
        await expect(page.locator('#state')).toHaveText('false')
    })

    test('initial controlled opening reports once under StrictMode', async ({ page }) => {
        const messages = await mountFixture(page, 'controlled-initial')
        await expect(page.locator('#state')).toHaveText('true')
        await expect.poll(() => events(page)).toEqual(['controlled:true'])
        expect(messages).toEqual([])
    })

    test('controlled state applies when content attaches or is replaced', async ({ page }) => {
        await mountFixture(page, 'deferred')
        await expect(page.locator('.panel')).toHaveCount(0)
        await page.click('#toggle-content')
        await expect(page.locator('.panel')).toBeVisible()
        await page.click('#toggle-content')
        await expect(page.locator('#state')).toHaveText('false')
        await page.click('#toggle-content')
        await expect(page.locator('.panel')).toBeVisible()
        await page.click('#external-close')
        await expect(page.locator('.panel')).toBeHidden()
    })

    test('unchanged controlled props do not undo native dismissal on unrelated renders', async ({ page }) => {
        await mountFixture(page, 'controlled-readonly')
        await expect(page.locator('.panel')).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(page.locator('#state')).toHaveText('false')
        await expect(page.locator('#controlled')).toHaveText('true')
        await page.click('#rerender')
        await expect(page.locator('#rerender')).toHaveText('Re-render 1')
        await expect(page.locator('.panel')).toBeHidden()
    })
})

test.describe('useTooltip', () => {
    test('describes the trigger before the tooltip opens', async ({ page }) => {
        await mountFixture(page, 'tooltips')

        expect(await accessibilityNode(page, '#described')).toMatchObject({
            name: 'Publish',
            description: 'Visible to everyone in your workspace'
        })
        expect(await accessibilityNode(page, '#labelled')).toMatchObject({ name: 'Star project' })
    })

    test('opens on hover and focus through interestfor and reports state', async ({ page }) => {
        const messages = await mountFixture(page, 'tooltips')

        await page.hover('#described')
        await expect(page.getByRole('tooltip', { name: 'Visible to everyone in your workspace' })).toBeVisible()
        await expect(page.locator('#state')).toHaveText('true')

        await page.mouse.move(5, 5)
        await expect(page.locator('#state')).toHaveText('false')

        await page.locator('#described').focus()
        await expect(page.locator('#state')).toHaveText('true')
        await page.keyboard.press('Escape')
        await expect(page.locator('#state')).toHaveText('false')

        expect(await events(page)).toEqual(['tooltip:true', 'tooltip:false', 'tooltip:true', 'tooltip:false'])
        expect(messages).toEqual([])
    })
})

test('popover and tooltip share one trigger without closing each other', async ({ page }) => {
    await mountFixture(page, 'combined')

    await page.click('#trigger')
    await expect(page.locator('.panel')).toBeVisible()

    await page.hover('#trigger')
    await expect(page.locator('.tooltip')).toBeVisible()
    await expect(page.locator('.panel')).toBeVisible()

    // Clicking also hovers and focuses the trigger, so only assert the outcome, not the order.
    const recorded = await events(page)
    expect(recorded).toContain('popover:true')
    expect(recorded).toContain('tooltip:true')
    expect(recorded).not.toContain('popover:false')
})

test('returned prop objects keep their identity across re-renders only when compiled', async ({ page }) => {
    await mountFixture(page, 'identity')
    await page.evaluate(() => (window.nookIdentities = []))
    await page.click('#rerender')
    await page.click('#rerender')

    const stable = await page.evaluate(() => {
        const seen = window.nookIdentities!
        const last = seen.length - 2
        return { trigger: seen[last] === seen[last - 2], content: seen[last + 1] === seen[last - 1] }
    })

    // Measured evidence for the "compiler optimized" claim, not an assumption.
    expect(stable).toEqual(
        variant() === 'compiled' ? { trigger: true, content: true } : { trigger: false, content: false }
    )
})

test('base hooks do not re-render on native open or close', async ({ page }) => {
    await mountFixture(page, 'identity')
    const commits = await page.evaluate(() => window.nookCommits)
    await page.hover('#trigger')
    await expect(page.locator('.tooltip')).toBeVisible()
    await page.click('#trigger')
    await expect(page.locator('.panel')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.panel')).toBeHidden()
    expect(await page.evaluate(() => window.nookCommits)).toBe(commits)
})

test('optional observation follows replacement and unsubscribes from old elements', async ({ page }) => {
    const messages = await mountFixture(page, 'observation')
    const old = await page.locator('.panel').elementHandle()
    await old!.evaluate((element: HTMLElement) => element.showPopover())
    await expect(page.locator('#state')).toHaveText('true')
    await page.click('#replace')
    await expect(page.locator('#state')).toHaveText('false')
    await page.locator('.panel').evaluate((element: HTMLElement) => element.showPopover())
    await expect(page.locator('#state')).toHaveText('true')
    await page.click('#observe')
    await expect(page.locator('#state')).toHaveText('false')
    await page.locator('.panel').evaluate((element: HTMLElement) => element.hidePopover())
    await old!.evaluate((element) =>
        element.dispatchEvent(new ToggleEvent('toggle', { oldState: 'closed', newState: 'open' }))
    )
    await expect(page.locator('#state')).toHaveText('false')
    await page.click('#observe')
    await page.locator('.panel').evaluate((element: HTMLElement) => element.showPopover())
    await expect(page.locator('#state')).toHaveText('true')
    expect(messages).toEqual([])
})
