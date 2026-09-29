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

Import `@nook/ui/nook.css` (or `@nook/ui/dialog.css` and `@nook/ui/button.css`), then use `Dialog` and `DialogClose` from `@nook/ui-react`:

```tsx
<Dialog
  title="Delete project?"
  content={
    <>
      <p>This removes the project for everyone.</p>
      <DialogClose>Cancel</DialogClose>
    </>
  }
>
  <Button>Delete project</Button>
</Dialog>
```

`children` is one button (or a button-forwarding component). `content` is the dialog body; `title` renders a heading and names the dialog. Without `title`, supply `aria-label` or `aria-labelledby` via `dialogProps`. Pass `closedby: 'any'` in `dialogProps` to enable backdrop dismissal; other native dialog props, such as `onClose` and `className`, also go there. The trigger and `DialogClose` work before hydration using native `commandfor`/`command` attributes. There is no controlled `open` prop: use `dialogProps.onClose` or observe the native `open` attribute when you need state.

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
