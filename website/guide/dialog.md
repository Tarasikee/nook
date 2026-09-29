---
title: Dialog
description: Modal dialogs with the native dialog element and command buttons, without JavaScript.
---

# Dialog

<p class="nk-lead">A modal dialog needs no hook. <code>&lt;dialog&gt;</code> with command buttons opens, closes, blocks the page behind, and returns focus, all in plain HTML. Nook does not wrap it.</p>

## Markup

```html
<button commandfor="confirm" command="show-modal">Delete project</button>

<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete “Atlas”?</h2>
  <p>This removes the project for everyone.</p>
  <button commandfor="confirm" command="close">Cancel</button>
  <button>Delete</button>
</dialog>
```

Name the dialog with `aria-labelledby` on its heading, as `titleProps` does for a popover.

## Behavior

- Opening moves focus to the first focusable element inside.
- While it is open, the rest of the page cannot be focused or clicked.
- <kbd>Esc</kbd> or `command="close"` closes it and returns focus to the button that opened it.
- A backdrop click does not close it. Add `closedby="any"` to close on a backdrop click.

For content that should not block the page, use a [popover](./popover) instead.

## Reading state in React

The `open` attribute tracks every open and close, including <kbd>Esc</kbd>, so observe it instead of keeping a second copy of the state:

```tsx
new MutationObserver(() => setOpen(dialog.open)).observe(dialog, { attributeFilter: ['open'] })
```

## Browser support

`command` and `commandfor` need Chrome 135, Firefox 144, or Safari 26.2. The behavior on this page is verified in Chromium 145, including `closedby`; other browsers are not verified yet.
