---
title: Popover
description: Click-triggered, light-dismissible popovers with usePopover().
---

# Popover

<p class="nk-lead">A click-triggered surface connected to your button through <code>popovertarget</code>. It opens in the top layer and closes on outside clicks and Escape.</p>

<div class="nk-meta">
  <span><strong>Hook</strong> <code>usePopover</code></span>
  <span><strong>Native feature</strong> <code>popovertarget</code></span>
  <span><strong>API</strong> <a href="../api/use-popover">usePopover()</a></span>
</div>

The [quick start](./getting-started) shows the basic usage and result. This page covers the rest.

## Anatomy

| Props          | Spread onto               | Renders                                           |
| -------------- | ------------------------- | ------------------------------------------------- |
| `triggerProps` | a `<button>`              | `popovertarget`, plus `data-open` while open      |
| `contentProps` | the popover surface       | `id`, `popover`, `aria-labelledby`, `ref`         |
| `titleProps`   | the heading that names it | `id`                                              |
| `closeProps`   | a `<button>` inside       | `popovertarget` with `popovertargetaction="hide"` |

Only buttons support `popovertarget`. Style `[data-open]` to highlight the trigger while open.

## Modes

| Mode                 | Light dismiss and Escape | Other popovers                       |
| -------------------- | ------------------------ | ------------------------------------ |
| `'auto'` _(default)_ | Yes                      | An unrelated auto popover closes it. |
| `'manual'`           | No                       | Independent; any number can be open. |

## Controlled state

```tsx
const [open, setOpen] = useState(false)
const status = usePopover({ mode: 'manual', open, onOpenChange: setOpen })
```

<ReactDemo name="controlled" :height="300" />

::: warning The browser has the final say
In `'auto'` mode, <kbd>Esc</kbd> and outside clicks close the popover even when `open` is `true`: the platform can cancel opening but not closing. The close is reported through `onOpenChange(false)`. Use `'manual'` when your app must decide when it closes.
:::

For uncontrolled popovers, `defaultOpen: true` opens it once after mount.

## Opening from code

Call `show()`, `hide()`, or `toggle()` from event handlers. `show()` passes the trigger as the native `source`, so the popover stays anchored:

```tsx
async function deploy() {
  await startDeployment()
  status.show()
}
```

For state-driven opening, use `open` rather than calling `show()` from an effect.

## Keyboard

All native:

| Key                                                | Behavior                                                 |
| -------------------------------------------------- | -------------------------------------------------------- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger | Toggles the popover.                                     |
| <kbd>Tab</kbd> from the open trigger               | Moves focus into the popover.                            |
| <kbd>Esc</kbd>                                     | Closes an auto popover and returns focus to the trigger. |

Popovers are non-modal. For a modal task, use `<dialog>` with `showModal()`.

## Caveats

- Changing `mode` while open closes the popover (native behavior).
- If you don't render `titleProps`, the popover is unnamed; name it another way if it is a meaningful region.
