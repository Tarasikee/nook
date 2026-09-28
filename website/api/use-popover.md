---
title: usePopover
description: API reference for usePopover().
---

# usePopover

<p class="nk-lead">A click-triggered popover built on the native <code>popovertarget</code> relationship. It works before hydration and reads native state after it.</p>

<div class="nk-signature">usePopover(options?: UsePopoverOptions): UsePopoverResult</div>

## Options

| Option         | Type                      | Default   | Description                                                                                                                                  |
| -------------- | ------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `mode`         | `'auto' \| 'manual'`      | `'auto'`  | `'auto'` light-dismisses; `'manual'` closes only through the trigger, `closeProps`, or code.                                                 |
| `open`         | `boolean`                 |           | Controlled state. In `'auto'` mode the browser can still close the popover; this is reported through `onOpenChange` and cannot be prevented. |
| `defaultOpen`  | `boolean`                 | `false`   | Opens once after mount. Ignored when `open` is set.                                                                                          |
| `onOpenChange` | `(open: boolean) => void` |           | Called after every native state change, whatever caused it.                                                                                  |
| `id`           | `string`                  | `useId()` | The content element's id.                                                                                                                    |

## Returns

| Property       | Type                                             | Description                                                          |
| -------------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `open`         | `boolean`                                        | The browser's actual state (`:popover-open`). `false` on the server. |
| `show()`       | `() => void`                                     | Opens it, passing the trigger as `source` so it stays anchored.      |
| `hide()`       | `() => void`                                     | Closes it.                                                           |
| `toggle()`     | `() => void`                                     | Toggles it.                                                          |
| `triggerProps` | `{ popoverTarget, 'data-open'? }`                | Spread onto a `<button>`.                                            |
| `contentProps` | `{ id, popover, 'aria-labelledby', ref }`        | Spread onto the popover surface.                                     |
| `titleProps`   | `{ id }`                                         | Spread onto the heading that names it.                               |
| `closeProps`   | `{ popoverTarget, popoverTargetAction: 'hide' }` | Spread onto a `<button>` inside; closes without JavaScript.          |

`triggerProps` contains attributes only: no event handlers and no ref. `show()` before the content mounts is applied once it attaches.

## Example

```tsx
const [open, setOpen] = useState(false)
const status = usePopover({ mode: 'manual', open, onOpenChange: setOpen })

return (
  <>
    <button {...status.triggerProps}>Status</button>
    <button onClick={() => setOpen(true)}>Open from state</button>
    <div {...status.contentProps} className="panel">
      <h2 {...status.titleProps}>Everything is live.</h2>
      <button {...status.closeProps}>Dismiss</button>
    </div>
  </>
)
```

See the [Popover guide](../guide/popover).
