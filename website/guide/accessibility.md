---
title: Accessibility
description: What the browser provides, what Nook adds, what remains yours, and what has been verified.
---

# Accessibility

<p class="nk-lead">Native invokers bring real keyboard and assistive-technology behavior, but they don't decide what your content is. Here is who does what, and what has been verified.</p>

## Responsibilities

| Concern | Browser | Nook | You |
| --- | --- | --- | --- |
| Keyboard activation of the trigger | ✓ native `<button>` | | Use a real button |
| Expanded state on the trigger | ✓ via `popovertarget` | Renders the relationship | |
| Focus order into the popover | ✓ after the invoker | Passes `source` when opening from code | |
| <kbd>Esc</kbd> closes and returns focus | ✓ auto and hint popovers | | |
| Tooltip on hover, focus, long press | ✓ `interestfor` | Renders the relationship | |
| Tooltip described while closed | Only while open | ✓ `aria-describedby` / `aria-labelledby` | |
| Tooltip role | | ✓ `role="tooltip"` | |
| Popover name | | ✓ `aria-labelledby` → `titleProps` | Render a title |
| Roles for popover content | | | ✓ |
| Focus trapping for modal tasks | | | Use `<dialog>` |

## Verified behavior

Checked on 2026-09-28 in Chromium 145 against **Chromium's own accessibility tree** (over the DevTools protocol), not a DOM approximation. These checks run in the test suite.

- A `popovertarget` trigger exposes `expanded: false`, then `true` when open. Nook adds no `aria-expanded`.
- Popover content named by `titleProps` is exposed with that name.
- With `useTooltip()`, the trigger's description is the tooltip text **before** the tooltip opens. Without the hook's `aria-describedby`, Chromium exposes it only while open.
- With `role: 'label'`, the trigger's name is the tooltip text.

**Not verified yet:** actual screen reader output (VoiceOver, NVDA, JAWS, TalkBack), touch long press, and browsers other than Chromium. Treat this page as the intended model and test your interfaces.

## Popovers

- **Name the content.** Render `titleProps` on a heading. Without it, the popover is an unnamed group.
- **Choose semantics deliberately.** A group of controls usually needs no role. A menu needs `role="menu"`, `menuitem`, and arrow keys, which Nook does not implement yet. A modal task needs `<dialog>`.

## Tooltips

- Use `role: 'label'` for icon-only buttons and the default `'description'` for extra text on labeled controls.
- Keep tooltips short and non-interactive. Never put essential information only in a tooltip.

## Visible focus

Nook adds no styles, so it adds no focus rings. Give triggers and focusable content a visible `:focus-visible` style.

## Checklist

- Triggers are `<button>` elements with an accessible name.
- Popovers that are meaningful regions render `titleProps`.
- Menus, listboxes, and dialogs have their full pattern semantics and keyboard support.
- Tooltip content is short and not interactive.
- Focus is visible everywhere.
- Everything works with animations disabled.
- Behavior is checked with a screen reader in your target browsers.
