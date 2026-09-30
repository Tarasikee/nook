---
title: Dialog
description: Nook's styled modal dialog.
---

# Dialog

<p class="nk-lead">Wrap a button to open a modal dialog. Opening, closing, focus, <kbd>Esc</kbd>, and the inert background are native, through <code>commandfor</code> and <code>&lt;dialog&gt;</code>.</p>

<ReactDemo name="ui-dialog" :height="240" />

```tsx
<Dialog
  title="Delete “Atlas”?"
  content={
    <>
      <p>This removes the project and its history for everyone.</p>
      <div className="nook-dialog__actions">
        <DialogClose>Cancel</DialogClose>
        <DialogClose variant="primary">Delete</DialogClose>
      </div>
    </>
  }
>
  <Button variant="primary">Delete project</Button>
</Dialog>
```

| Prop          | Description                                                                                              | Default  |
| ------------- | -------------------------------------------------------------------------------------------------------- | -------- |
| `content`     | The dialog body                                                                                          | required |
| `title`       | Heading and accessible name of the dialog                                                                |          |
| `dialogProps` | Native dialog attributes: `closedby: 'any'` for backdrop dismissal, `onClose`, `className`, `aria-label` |          |
| `children`    | One `<button>` or `Button`                                                                               | required |

**DialogClose** renders a small ghost `Button` that closes the dialog natively; use it inside `content`. Put action buttons in a `nook-dialog__actions` element to align them at the end.

- **Before hydration:** the trigger and `DialogClose` already work, because they are plain `commandfor` and `command` attributes.
- **State:** there is no controlled `open` prop. Use `dialogProps.onClose`, or observe the native `open` attribute as shown in the [Dialog guide](../guide/dialog#reading-state-in-react).
- **Browsers:** needs `command` and `commandfor`: Chrome 135, Firefox 144, or Safari 26.2.
