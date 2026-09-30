---
title: Dialog
description: Modal dialogs with the native dialog element and command buttons, without JavaScript.
---

# Dialog

<p class="nk-lead">A modal dialog needs no hook. Use native <code>&lt;dialog&gt;</code> and command buttons directly, or Nook's styled React <code>Dialog</code>. The browser handles focus, dismissal, and the inert background.</p>

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

## Styled React component

For a styled version, use `Dialog` and `DialogClose` from `@nook/ui-react`, described with a live demo in [Nook UI: Dialog](../ui/dialog).

## Behavior

- Opening moves focus to the first focusable element inside.
- While it is open, the rest of the page cannot be focused or clicked.
- <kbd>Esc</kbd> or `command="close"` closes it and returns focus to the button that opened it.
- A backdrop click does not close it. Add `closedby="any"` to close on a backdrop click.
- Inert does not stop key listeners on `window` or `document`. Skip app-wide shortcuts while `document.querySelector('dialog:modal')` matches, or they act on the page behind the dialog.

For content that should not block the page, use a [popover](./popover) instead.

## Reading state in React

The `open` attribute tracks every open and close, including <kbd>Esc</kbd>, so observe it instead of keeping a second copy of the state:

```tsx
new MutationObserver(() => setOpen(dialog.open)).observe(dialog, { attributeFilter: ['open'] })
```

## Browser support

`command` and `commandfor` need Chrome 135, Firefox 144, or Safari 26.2. The behavior on this page is verified in Chromium 145, including `closedby`; other browsers are not verified yet.
