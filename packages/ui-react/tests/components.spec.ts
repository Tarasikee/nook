import { expect, test } from '@playwright/test'
import { accessibilityNode, events, mountFixture, renderFixture, tooltipDelay } from './harness'

test.describe('server rendering', () => {
    test('Button renders a native button with design attributes', async () => {
        const html = await renderFixture('buttons')
        expect(html).toContain('<button type="button" class="nook-button" data-variant="primary" data-size="medium">')
        expect(html).toMatch(/<button type="submit" aria-label="Send" class="nook-button"[^>]*data-icon=""/)
    })

    test('Tooltip and Popover add only attributes to one real button', async () => {
        const html = await renderFixture('combinations')
        const buttons = [...html.matchAll(/<button[^>]*>/g)].map((match) => match[0])
        const both = buttons.filter((tag) => /popoverTarget=/i.test(tag) && /interestfor=/.test(tag))
        expect(both).toHaveLength(2)
        expect(html).toMatch(/class="nook-tooltip" data-side="top" data-align="center"/)
        expect(html).toMatch(/popover="auto"[^>]*class="nook-popover" data-side="bottom" data-align="start"/)
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
    test('stays centered under a margin reset such as Tailwind Preflight', async ({ page }) => {
        await mountFixture(page, 'dialogs')
        await page.addStyleTag({
            content: '*, ::before, ::after, ::backdrop { margin: 0; padding: 0; border: 0 solid; }'
        })
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
            'rgba(0, 0, 0, 0.5)'
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
    test('defaults to type="button" and keeps its handlers', async ({ page }) => {
        const messages = await mountFixture(page, 'buttons')
        await page.getByRole('button', { name: 'Save' }).click()
        await expect(page.locator('#clicks')).toHaveText('1')
        await expect(page.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit')
        expect(messages).toEqual([])
    })
})

test.describe('Tooltip', () => {
    test('describes, labels, and merges existing descriptions', async ({ page }) => {
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
    test('opens below and start-aligned, is named by its title, and closes natively', async ({ page }) => {
        const messages = await mountFixture(page, 'popovers')
        const trigger = page.getByRole('button', { name: 'Share' })
        await trigger.click()
        const panel = page.locator('.nook-popover').filter({ hasText: 'Invite collaborators' })
        await expect(panel).toBeVisible()
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
    for (const [order, name, title] of [
        ['Tooltip outside', 'Project actions', 'Actions'],
        ['Popover outside', 'More options', 'More']
    ] as const) {
        test(`${order}: one button gets both behaviors`, async ({ page }) => {
            const messages = await mountFixture(page, 'combinations')
            const trigger = page.getByRole('button', { name, exact: true })

            await trigger.hover()
            await expect(page.getByRole('tooltip').filter({ hasText: name })).toBeVisible()
            await trigger.click()
            const panel = page.locator('.nook-popover').filter({ has: page.getByRole('heading', { name: title }) })
            await expect(panel).toBeVisible()
            await expect(page.getByRole('tooltip').filter({ hasText: name })).toBeVisible()
            expect(messages).toEqual([])
        })
    }

    test('the trigger keeps its own click handler', async ({ page }) => {
        await mountFixture(page, 'combinations')
        await page.getByRole('button', { name: 'Project actions' }).click()
        await expect(page.locator('#clicks')).toHaveText('1')
    })
})
