import { expect, test } from '@playwright/test'
import { accessibilityNode, events, mountFixture, renderFixture, tooltipDelay } from './harness'

test.describe('server rendering', () => {
    test('Button renders a native button with design attributes', async () => {
        const html = await renderFixture('buttons')
        expect(html).toMatch(
            /<button type="button"[^>]*class="nook-button [^"]+" data-variant="primary" data-size="medium">/
        )
        expect(html).toMatch(/<button type="submit" aria-label="Send"[^>]*data-icon=""/)
    })

    test('explicit props connect one real button to both native bodies', async ({ page }) => {
        await page.setContent(await renderFixture('combinations'))
        const button = page.getByRole('button', { name: 'Project actions' })
        const panel = page.locator('.nook-popover')
        const tooltip = page.locator('.nook-tooltip')
        await expect(page.locator('button')).toHaveCount(1)
        await expect(button).toHaveAttribute('popovertarget', (await panel.getAttribute('id'))!)
        await expect(button).toHaveAttribute('interestfor', (await tooltip.getAttribute('id'))!)
        await expect(panel).toHaveAttribute('popover', 'auto')
        await expect(panel).toHaveAttribute('data-side', 'bottom')
        await expect(tooltip).toHaveAttribute('popover', 'hint')
        await expect(tooltip).toHaveAttribute('data-side', 'top')
    })

    test('Dialog connects native commands to a named dialog before hydration', async () => {
        const html = await renderFixture('dialogs')
        const id = html.match(/<dialog[^>]*id="([^"]+)"[^>]*aria-labelledby="([^"]+)"/)
        expect(id).not.toBeNull()
        expect(html).toContain(`commandfor="${id![1]}" command="show-modal"`)
        expect(html).toContain(`commandfor="${id![1]}" command="close"`)
        expect(html).toContain(`id="${id![2]}"`)
        expect(html).toContain('closedby="any"')
    })

    test('Dialog opens and closes with only server HTML', async ({ page }) => {
        await page.setContent(await renderFixture('dialogs'))
        await page.locator('#open-dialog').click()
        const dialog = page.getByRole('dialog', { name: 'Delete project?' })
        await expect(dialog).toBeVisible()
        expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true)
        await page.locator('#cancel').click()
        await expect(dialog).toBeHidden()
    })
})

test.describe('Dialog', () => {
    test('stays centered with Tailwind Preflight', async ({ page }) => {
        await mountFixture(page, 'dialogs')
        await page.locator('#open-dialog').click()
        const dialog = page.getByRole('dialog', { name: 'Delete project?' })
        await expect(dialog).toBeVisible()
        await dialog.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

        const viewport = page.viewportSize()!
        const box = (await dialog.boundingBox())!
        expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(1.5)
        expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(1.5)
    })
    test('opens modally, is named, closes declaratively, and returns focus', async ({ page }) => {
        const messages = await mountFixture(page, 'dialogs')
        const trigger = page.locator('#open-dialog')
        const dialog = page.getByRole('dialog', { name: 'Delete project?' })

        await trigger.click()
        await expect(dialog).toBeVisible()
        await expect(dialog).toHaveJSProperty('open', true)
        await expect(dialog).toHaveCSS('border-radius', '8px')
        expect(await dialog.evaluate((element) => getComputedStyle(element, '::backdrop').backgroundColor)).toBe(
            'oklab(0 0 0 / 0.5)'
        )
        expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true)
        await expect(page.locator('#cancel')).toBeFocused()
        await page.locator('#outside').focus()
        await expect(page.locator('#outside')).not.toBeFocused()
        await page.locator('#cancel').click()
        await expect(dialog).toBeHidden()
        await expect(trigger).toBeFocused()
        await expect.poll(() => events(page)).toContain('dialog:close')

        await trigger.click()
        await page.keyboard.press('Escape')
        await expect(dialog).toBeHidden()
        await expect(trigger).toBeFocused()
        expect(messages).toEqual([])
    })

    test('passes closedby and className through for backdrop dismissal', async ({ page }) => {
        const messages = await mountFixture(page, 'dialogs')
        await page.locator('#open-dismissible').click()
        const dialog = page.getByRole('dialog', { name: 'Dismissible' })
        await expect(dialog).toBeVisible()
        await expect(dialog).toHaveClass(/custom-dialog/)
        await page.mouse.click(5, 5)
        await expect(dialog).toBeHidden()
        expect(messages).toEqual([])
    })
})

test.describe('Button', () => {
    test('consumer utilities override CVA defaults', async ({ page }) => {
        await mountFixture(page, 'buttons')
        const button = page.getByRole('button', { name: 'Custom' })
        await expect(button).toHaveCSS('min-height', '48px')
        await expect(button).toHaveCSS('padding-left', '24px')
        await expect(button).toHaveCSS('padding-right', '24px')
    })

    test('defaults to type="button" and keeps its handlers', async ({ page }) => {
        const messages = await mountFixture(page, 'buttons')
        await expect(page.getByRole('button', { name: 'Save' })).toHaveCSS('background-color', 'rgb(4, 120, 87)')
        await expect(page.getByRole('button', { name: 'Save' })).toHaveCSS('padding-inline', '16px')
        await expect(page.getByRole('button', { name: 'Ghost' })).toHaveCSS('padding-inline', '12px')
        await expect(page.getByRole('button', { name: 'Send' })).toHaveCSS('width', '36px')
        await expect(page.getByRole('button', { name: 'Send' })).toHaveCSS('padding-inline', '0px')
        await page.getByRole('button', { name: 'Save' }).click()
        await expect(page.locator('#clicks')).toHaveText('1')
        await expect(page.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
        expect(messages).toEqual([])
    })
})

test.describe('Tooltip', () => {
    test('describes, labels, and accepts explicitly composed descriptions', async ({ page }) => {
        const messages = await mountFixture(page, 'tooltips')

        expect(await accessibilityNode(page, '#publish')).toMatchObject({
            name: 'Publish',
            description: 'Visible to everyone in your workspace'
        })
        expect(await accessibilityNode(page, '#bold')).toMatchObject({ name: 'Bold' })
        expect(await accessibilityNode(page, '#merge')).toMatchObject({
            description: 'Existing hint Extra detail'
        })
        expect(messages).toEqual([])
    })

    test('opens on hover, placed above and centered', async ({ page }) => {
        await mountFixture(page, 'tooltips')
        const trigger = page.getByRole('button', { name: 'Publish' })
        await trigger.hover()
        const tooltip = page.getByRole('tooltip').filter({ hasText: 'Visible to everyone' })
        await expect(tooltip).toBeVisible()
        await tooltip.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

        const t = (await trigger.boundingBox())!
        const r = (await tooltip.boundingBox())!
        expect(Math.round(r.y + r.height)).toBe(Math.round(t.y - 8))
        expect(Math.abs(r.x + r.width / 2 - (t.x + t.width / 2))).toBeLessThan(1.5)
        // Tailwind's text-xs.
        await expect(tooltip).toHaveCSS('font-size', '12px')
        await expect(tooltip).toHaveCSS('line-height', '16px')
        expect(await events(page)).toEqual(['tooltip:true'])
    })
})

test.describe('TooltipGroup', () => {
    test('is the toolbar itself: role, name, and layout apply to it', async ({ page }) => {
        const messages = await mountFixture(page, 'groups')
        const toolbar = page.getByRole('toolbar', { name: 'Formatting' })
        await expect(toolbar).toHaveClass(/nook-tooltip-group/)
        await expect(toolbar).toHaveCSS('display', 'flex')
        expect(await accessibilityNode(page, '.nook-tooltip-group')).toMatchObject({ name: 'Formatting' })
        expect(messages).toEqual([])
    })

    test('the next tooltip in a group opens without the delay', async ({ page }) => {
        await mountFixture(page, 'groups')
        expect(await tooltipDelay(page, 'button:has-text("B")', 'Bold')).toBeGreaterThan(200)
        expect(await tooltipDelay(page, 'button:has-text("I")', 'Italic')).toBeLessThan(150)
    })

    test('outside a group, the next tooltip waits', async ({ page }) => {
        await mountFixture(page, 'groups')
        await tooltipDelay(page, 'button:has-text("U")', 'Undo')
        expect(await tooltipDelay(page, 'button:has-text("R")', 'Redo')).toBeGreaterThan(200)
    })
})

test.describe('Popover', () => {
    for (const side of ['left', 'right'] as const) {
        for (const align of ['start', 'center', 'end'] as const) {
            test(`${side}/${align} uses the corresponding logical anchor area`, async ({ page }) => {
                await mountFixture(page, 'placements')
                await page.locator('#placement-side').selectOption(side)
                await page.locator('#placement-align').selectOption(align)
                const trigger = page.getByRole('button', { name: 'Anchor' })
                await trigger.click()
                const panel = page.locator('.nook-popover')
                await expect(panel).toBeVisible()
                await panel.evaluate((element) =>
                    Promise.all(element.getAnimations().map((animation) => animation.finished))
                )
                const t = (await trigger.boundingBox())!
                const p = (await panel.boundingBox())!
                expect(Math.abs(side === 'left' ? p.x + p.width - (t.x - 8) : p.x - (t.x + t.width + 8))).toBeLessThan(
                    1.5
                )
                if (align === 'start') expect(Math.abs(p.y - t.y)).toBeLessThan(1.5)
                if (align === 'center') expect(Math.abs(p.y + p.height / 2 - (t.y + t.height / 2))).toBeLessThan(1.5)
                if (align === 'end') expect(Math.abs(p.y + p.height - (t.y + t.height))).toBeLessThan(1.5)
            })
        }
    }

    test('respects reduced motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' })
        await mountFixture(page, 'popovers')
        await page.getByRole('button', { name: 'Share' }).click()
        await expect(page.locator('.nook-popover').filter({ hasText: 'Invite collaborators' })).toHaveCSS(
            'transition-property',
            'none'
        )
    })

    test('opens below and start-aligned, is named by its title, and closes natively', async ({ page }) => {
        const messages = await mountFixture(page, 'popovers')
        const trigger = page.getByRole('button', { name: 'Share' })
        await trigger.click()
        const panel = page.locator('.nook-popover').filter({ hasText: 'Invite collaborators' })
        await expect(panel).toBeVisible()
        await expect(panel.locator('.nook-popover__actions')).toHaveCSS('display', 'flex')
        await expect(panel.locator('.nook-popover__actions')).toHaveCSS('margin-top', '16px')
        await panel.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

        const t = (await trigger.boundingBox())!
        const p = (await panel.boundingBox())!
        expect(Math.round(p.x)).toBe(Math.round(t.x))
        expect(Math.round(p.y)).toBe(Math.round(t.y + t.height + 8))
        expect(await accessibilityNode(page, '.nook-popover:has(h2)')).toMatchObject({ name: 'Invite collaborators' })
        expect(await accessibilityNode(page, '#share')).toMatchObject({ expanded: true })

        // Wait for each change to be reported: browsers merge a close and reopen in the same task.
        await page.getByRole('button', { name: 'Done' }).click()
        await expect.poll(() => events(page)).toEqual(['popover:true', 'popover:false'])
        await trigger.click()
        await expect.poll(() => events(page)).toEqual(['popover:true', 'popover:false', 'popover:true'])
        await page.keyboard.press('Escape')
        await expect(panel).toBeHidden()
        await expect
            .poll(() => events(page))
            .toEqual(['popover:true', 'popover:false', 'popover:true', 'popover:false'])
        expect(messages).toEqual([])
    })

    test('side and align place the panel', async ({ page }) => {
        await mountFixture(page, 'popovers')
        const trigger = page.getByRole('button', { name: 'Top' })
        await trigger.click()
        const panel = page.locator('.nook-popover').filter({ hasText: 'Placed above' })
        await expect(panel).toBeVisible()
        await panel.evaluate((element) => Promise.all(element.getAnimations().map((animation) => animation.finished)))

        const t = (await trigger.boundingBox())!
        const p = (await panel.boundingBox())!
        expect(Math.round(p.y + p.height)).toBe(Math.round(t.y - 8))
        expect(Math.round(p.x + p.width)).toBe(Math.round(t.x + t.width))
    })

    test('controlled manual state opens it and ignores Escape', async ({ page }) => {
        await mountFixture(page, 'controlled')
        await page.click('#external-open')
        const panel = page.locator('.nook-popover').filter({ hasText: 'Live' })
        await expect(panel).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(panel).toBeVisible()
        await expect(page.locator('#state')).toHaveText('true')
    })
})

test.describe('Tooltip with Popover', () => {
    test('explicit trigger props put both behaviors on one button', async ({ page }) => {
        const messages = await mountFixture(page, 'combinations')
        const trigger = page.getByRole('button', { name: 'Project actions', exact: true })
        await trigger.hover()
        await expect(page.getByRole('tooltip').filter({ hasText: 'Project actions' })).toBeVisible()
        await trigger.click()
        await expect(page.locator('.nook-popover')).toBeVisible()
        await expect(page.getByRole('tooltip').filter({ hasText: 'Project actions' })).toBeVisible()
        expect(messages).toEqual([])
    })

    test('the trigger keeps its own click handler', async ({ page }) => {
        await mountFixture(page, 'combinations')
        await page.getByRole('button', { name: 'Project actions' }).click()
        await expect(page.locator('#clicks')).toHaveText('1')
    })
})
