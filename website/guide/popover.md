---
title: Popover
description: Modes, controlled state, and opening from code with usePopover().
---

# Popover

<p class="nk-lead">A click-triggered surface linked to your button through <code>popovertarget</code>. Basic usage is in the <a href="./getting-started">quick start</a>; props are in the <a href="../api/#usepopover">API reference</a>.</p>

## Modes

| Mode                 | Outside click and <kbd>Esc</kbd> | Other popovers                      |
| -------------------- | -------------------------------- | ----------------------------------- |
| `'auto'` _(default)_ | Close it                         | An unrelated auto popover closes it |
| `'manual'`           | Ignored                          | Independent; any number can be open |

## Controlled state

```tsx
const [open, setOpen] = useState(false)
const status = usePopover({ mode: 'manual', open, onOpenChange: setOpen })
```

<ReactDemo name="controlled" :height="300" />

::: warning The browser has the final say
In `'auto'` mode, <kbd>Esc</kbd> and outside clicks close the popover even when `open` is `true`, because the platform cannot cancel closing. The close is reported through `onOpenChange(false)`. Use `'manual'` when your app decides when it closes. For uncontrolled popovers, `defaultOpen: true` opens it once after mount.
:::

## Opening from code

Call `show()`, `hide()`, or `toggle()` from event handlers; for state-driven opening, use `open`. `show()` passes the trigger as the native `source`: without it, Chromium does not anchor a popover opened from script.

```tsx
async function deploy() {
  await startDeployment()
  status.show()
}
```

## Keyboard and focus

All native: <kbd>Enter</kbd> or <kbd>Space</kbd> toggles, <kbd>Tab</kbd> from the open trigger moves into the popover, and <kbd>Esc</kbd> closes an auto popover and returns focus to the trigger. Popovers are non-modal; for a modal task use `<dialog>`.

## Good to know

- Only `<button>` elements can use `popovertarget`.
- Style the open trigger with `[data-open]`, and the open popover with `:popover-open`.
- Changing `mode` while open closes the popover.
- Render `titleProps` on a heading, or the popover has no accessible name.
