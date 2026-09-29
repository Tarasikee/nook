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

test.describe('dialog', () => {
    const dialogPage = `
        <main style="padding: 40px">
            <button id="open" commandfor="dialog" command="show-modal">Open</button>
            <button id="outside">Outside</button>
            <dialog id="dialog" aria-labelledby="dialog-title" style="width: 300px; padding: 20px">
                <h2 id="dialog-title">Title</h2>
                <button id="inside">Inside</button>
                <button id="close" commandfor="dialog" command="close">Close</button>
            </dialog>
            <button id="open-any" commandfor="dismissible" command="show-modal">Open dismissible</button>
            <dialog id="dismissible" closedby="any" style="width: 300px; padding: 20px">Dismissible</dialog>
        </main>
    `
    const state = (page: import('@playwright/test').Page, id: string) =>
        page.evaluate((selector) => {
            const dialog = document.getElementById(selector) as HTMLDialogElement
            return { open: dialog.open, modal: dialog.matches(':modal'), focus: document.activeElement?.id }
        }, id)

    test('command="show-modal" opens a modal dialog without script, and Escape returns focus', async ({ page }) => {
        await page.setContent(dialogPage)
        await page.click('#open')
        expect(await state(page, 'dialog')).toMatchObject({ open: true, modal: true, focus: 'inside' })

        await page.keyboard.press('Escape')
        expect(await state(page, 'dialog')).toMatchObject({ open: false, focus: 'open' })
    })

    test('command="close" closes it and the page behind is inert while open', async ({ page }) => {
        await page.setContent(dialogPage)
        await page.click('#open')
        expect(await page.locator('#outside').evaluate((button) => button.matches(':focus'))).toBe(false)
        await page.locator('#outside').click({ force: true, timeout: 1000 }).catch(() => {})
        expect(await state(page, 'dialog')).toMatchObject({ open: true })

        await page.click('#close')
        expect(await state(page, 'dialog')).toMatchObject({ open: false, focus: 'open' })
    })

    test('closedby="any" closes on a backdrop click; the default does not', async ({ page }) => {
        await page.setContent(dialogPage)
        await page.click('#open')
        await page.mouse.click(5, 5)
        expect(await state(page, 'dialog')).toMatchObject({ open: true })
        await page.keyboard.press('Escape')

        await page.click('#open-any')
        await page.mouse.click(5, 5)
        expect(await state(page, 'dismissible')).toMatchObject({ open: false })
    })

    test('the open attribute reflects state for a MutationObserver', async ({ page }) => {
        await page.setContent(dialogPage)
        await page.evaluate(() => {
            const dialog = document.getElementById('dialog')!
            ;(window as unknown as { seen: string[] }).seen = []
            new MutationObserver(() =>
                (window as unknown as { seen: string[] }).seen.push(String((dialog as HTMLDialogElement).open))
            ).observe(dialog, { attributeFilter: ['open'] })
        })
        await page.click('#open')
        await page.keyboard.press('Escape')
        await expect.poll(() => page.evaluate(() => (window as unknown as { seen: string[] }).seen)).toEqual(['true', 'false'])
    })
})

