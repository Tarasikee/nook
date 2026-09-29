import { expect, test } from '@playwright/test'
import { accessibilityNode, isOpen } from './harness'

/**
 * Platform assumptions Nook's design relies on, checked in Playwright's
 * Chromium. If one of these starts failing, revisit the design and the
 * reference notes rather than patching around it.
 */

test.beforeEach(async ({ page }) => {
    await page.setContent(`
        <style>
            body { margin: 0; }
            main { padding: 120px 200px; }
            [popover] { margin: 0; inset: auto; position-area: block-end span-inline-end; }
            [interestfor] { interest-delay: 100ms 100ms; }
        </style>
        <main>
            <button id="tip-trigger" interestfor="tip">Archive</button>
            <div id="tip" popover="hint">Archive this project</div>
            <button id="card-trigger" interestfor="card">Profile</button>
            <div id="card" popover="hint"><p>Card</p><button>Follow</button></div>
            <button id="panel-trigger" popovertarget="panel">Share</button>
            <div id="panel" popover>Panel</div>
        </main>
    `)
})

test('interestfor shows a hint on hover and keyboard focus, and Escape cancels it', async ({ page }) => {
    await page.hover('#tip-trigger')
    await expect.poll(() => isOpen(page, '#tip')).toBe(true)
    await page.mouse.move(5, 5)
    await expect.poll(() => isOpen(page, '#tip')).toBe(false)

    await page.locator('#tip-trigger').focus()
    await expect.poll(() => isOpen(page, '#tip')).toBe(true)
    await page.keyboard.press('Escape')
    await expect.poll(() => isOpen(page, '#tip')).toBe(false)
})

test('interest is kept while the pointer is inside the target', async ({ page }) => {
    await page.hover('#card-trigger')
    await expect.poll(() => isOpen(page, '#card')).toBe(true)

    const card = (await page.locator('#card').boundingBox())!
    await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2, { steps: 8 })
    await page.waitForTimeout(400)
    expect(await isOpen(page, '#card')).toBe(true)
})

test('interestfor exposes the description only while the hint is open', async ({ page }) => {
    expect((await accessibilityNode(page, '#tip-trigger')).description).toBeUndefined()

    await page.hover('#tip-trigger')
    await expect.poll(() => isOpen(page, '#tip')).toBe(true)
    expect((await accessibilityNode(page, '#tip-trigger')).description).toBe('Archive this project')
})

test('popovertarget exposes expanded state natively', async ({ page }) => {
    expect(await accessibilityNode(page, '#panel-trigger')).toMatchObject({ expanded: false })
    await page.click('#panel-trigger')
    expect(await accessibilityNode(page, '#panel-trigger')).toMatchObject({ expanded: true })
})

test('showPopover() anchors to the trigger only when given a source', async ({ page }) => {
    await page.evaluate(() => document.getElementById('panel')!.showPopover())
    const unanchored = (await page.locator('#panel').boundingBox())!
    await page.evaluate(() => document.getElementById('panel')!.hidePopover())

    await page.evaluate(() => {
        const panel = document.getElementById('panel') as HTMLElement & {
            showPopover(options?: { source?: HTMLElement }): void
        }
        panel.showPopover({ source: document.getElementById('panel-trigger')! })
    })
    const anchored = (await page.locator('#panel').boundingBox())!
    const trigger = (await page.locator('#panel-trigger').boundingBox())!

    expect(unanchored.x).toBe(0)
    expect(Math.round(anchored.x)).toBe(Math.round(trigger.x))
    expect(Math.round(anchored.y)).toBe(Math.round(trigger.y + trigger.height))
})

test.describe('tooltip groups', () => {
    // A normal delay long enough to tell apart from an instant switch.
    const groupPage = `
        <style>
            body { margin: 0; }
            section { display: flex; gap: 8px; padding: 120px 200px 40px; }
            [popover] { margin: 0; inset: auto; position-area: block-start; }
            [interestfor] { interest-delay: 600ms 150ms; }
            .group:has(:interest-source) [interestfor] { interest-delay-start: 0s; }
        </style>
        <section class="group">
            <button id="a" interestfor="tip-a">A</button>
            <button id="b" interestfor="tip-b">B</button>
        </section>
        <section class="solo">
            <button id="c" interestfor="tip-c">C</button>
            <button id="d" interestfor="tip-d">D</button>
        </section>
        <div id="tip-a" popover="hint">A</div>
        <div id="tip-b" popover="hint">B</div>
        <div id="tip-c" popover="hint">C</div>
        <div id="tip-d" popover="hint">D</div>
    `

    /** Milliseconds from hovering `trigger` until `tip` opens, measured with the page clock. */
    async function openDelay(page: import('@playwright/test').Page, trigger: string, tip: string) {
        await page.evaluate((id) => {
            const element = document.getElementById(id)!
            element.addEventListener(
                'toggle',
                (event) => {
                    if ((event as ToggleEvent).newState === 'open') {
                        element.dataset.openedAt = String(performance.now())
                    }
                },
                { once: true }
            )
        }, tip)
        const start = await page.evaluate(() => performance.now())
        await page.hover(trigger)
        const opened = await page.waitForFunction((id) => document.getElementById(id)!.dataset.openedAt, tip)
        return Number(await opened.jsonValue()) - start
    }

    test('an :interest-source group rule shows the next tooltip immediately', async ({ page }) => {
        await page.setContent(groupPage)

        const first = await openDelay(page, '#a', 'tip-a')
        const next = await openDelay(page, '#b', 'tip-b')

        expect(first).toBeGreaterThan(450)
        expect(next).toBeLessThan(250)
        await expect.poll(() => isOpen(page, '#tip-a')).toBe(false)
    })

    test('without the group rule, the next tooltip waits the full delay', async ({ page }) => {
        await page.setContent(groupPage)

        await openDelay(page, '#c', 'tip-c')
        const next = await openDelay(page, '#d', 'tip-d')

        expect(next).toBeGreaterThan(450)
    })

    test('the group cools down once interest has ended', async ({ page }) => {
        await page.setContent(groupPage)

        await openDelay(page, '#a', 'tip-a')
        await page.mouse.move(5, 5)
        await expect.poll(() => isOpen(page, '#tip-a')).toBe(false)
        const again = await openDelay(page, '#b', 'tip-b')

        expect(again).toBeGreaterThan(450)
    })
})
