---
title: Accessibility
description: Who handles what, and what has been verified.
---

# Accessibility

<p class="nk-lead">Native invokers provide real keyboard and assistive-technology behavior, but they do not decide what your content is.</p>

| Concern                                                                           | Handled by                                    |
| --------------------------------------------------------------------------------- | --------------------------------------------- |
| Keyboard activation, expanded state, focus order, <kbd>Esc</kbd> and focus return | Browser, via `popovertarget`                  |
| Tooltip on hover, focus, and long press                                           | Browser, via `interestfor`                    |
| Tooltip described or named while closed                                           | Nook: `aria-describedby` or `aria-labelledby` |
| Tooltip role, popover name from its title                                         | Nook: `role="tooltip"`, `aria-labelledby`     |
| Content roles (menu, dialog, listbox) and their keyboard patterns                 | You                                           |
| Focus trapping for modal tasks                                                    | You, with [`<dialog>`](./dialog)              |
| Visible focus styles                                                              | You                                           |

## Verified

Checked in Chromium 145 against Chromium's own accessibility tree, and covered by tests:

- A `popovertarget` trigger exposes `expanded` false, then true.
- A popover is named by its `titleProps` heading.
- A `useTooltip()` trigger is described (or named) by the tooltip text before the tooltip opens.

**Not verified yet:** screen reader output, touch long press, and browsers other than Chromium.

## Checklist

- Triggers are `<button>` elements with an accessible name.
- Meaningful popovers render `titleProps`.
- Menus, listboxes, and dialogs have their full semantics and keyboard support; Nook does not add them.
- Tooltips are short and not interactive, and never the only place for essential information.
- Focus is visible, and everything works with animations disabled.
