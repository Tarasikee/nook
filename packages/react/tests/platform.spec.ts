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
        const panel = document.getElementById('panel') as HTMLElement & { showPopover(options?: { source?: HTMLElement }): void }
        panel.showPopover({ source: document.getElementById('panel-trigger')! })
    })
    const anchored = (await page.locator('#panel').boundingBox())!
    const trigger = (await page.locator('#panel-trigger').boundingBox())!

    expect(unanchored.x).toBe(0)
    expect(Math.round(anchored.x)).toBe(Math.round(trigger.x))
    expect(Math.round(anchored.y)).toBe(Math.round(trigger.y + trigger.height))
})

