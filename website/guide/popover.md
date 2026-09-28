---
title: Popover
description: Click-triggered, light-dismissible popovers with usePopover().
---

# Popover

<p class="nk-lead">A click-triggered surface connected to your button through the native <code>popovertarget</code> relationship. It opens in the top layer and closes on outside clicks and Escape, even before hydration.</p>

<div class="nk-meta">
  <span><strong>Hook</strong> <code>usePopover</code> from <code>@nook/react</code></span>
  <span><strong>Native feature</strong> <code>popovertarget</code></span>
  <span><strong>API</strong> <a href="../api/use-popover">usePopover()</a></span>
</div>

<ReactDemo name="popover" :height="330" />

## Usage

::: code-group

```tsx [ShareMenu.tsx]
import { usePopover } from '@nook/react'

export function ShareMenu() {
  const share = usePopover()

  return (
    <>
      <button {...share.triggerProps} className="button">Share</button>
      <div {...share.contentProps} className="panel">
        <h2 {...share.titleProps}>Invite collaborators</h2>
        <p>Anyone with this link can view the project.</p>
        <button {...share.closeProps}>Done</button>
      </div>
    </>
  )
}
```

```css [panel.css]
@supports (position-area: block-end) {
  .panel {
    inset: auto;
    margin: 0;
    position-area: block-end span-inline-end;
    margin-block-start: 8px;
    position-try-fallbacks: flip-block;
  }
}

/* Style the trigger while open. */
.button[data-open] {
  outline: 2px solid var(--brand);
}
```

:::

## Anatomy

| Props | Spread onto | Renders |
| --- | --- | --- |
| `triggerProps` | a `<button>` | `popovertarget`, plus `data-open` while open |
| `contentProps` | the popover surface | `id`, `popover`, `aria-labelledby`, `ref` |
| `titleProps` | the heading that names it | `id` |
| `closeProps` | a `<button>` inside | `popovertarget` with `popovertargetaction="hide"` |

Only buttons support `popovertarget`; style a `<button>` rather than using a link. The expanded state for assistive technology comes from `popovertarget` itself, so Nook does not add `aria-expanded`.

## Modes

| Mode | Light dismiss | Escape | Other popovers |
| --- | --- | --- | --- |
| `'auto'` *(default)* | Yes | Yes | Opening an unrelated auto popover closes this one. |
| `'manual'` | No | No | Independent; any number can be open. |

## Controlled state

Pass `open` and `onOpenChange` to drive the popover from React state:

```tsx
const [open, setOpen] = useState(false)
const status = usePopover({ mode: 'manual', open, onOpenChange: setOpen })
```

<ReactDemo name="controlled" :height="300" />

::: warning The browser still has the final say
In `'auto'` mode, <kbd>Esc</kbd> and outside clicks close the popover even when `open` is `true`. The platform can cancel opening but not closing. Nook reports the close through `onOpenChange(false)`; update your state there. Use `'manual'` when your application must decide when the surface closes.
:::

For uncontrolled popovers, `defaultOpen: true` opens it once after mount.

## Opening from code

`show()`, `hide()`, and `toggle()` drive the native popover. When showing, Nook passes the trigger as the native `source`. Without it, a popover opened from script is not anchored to its trigger (verified in Chromium 145).

```tsx
const status = usePopover({ mode: 'manual' })

async function deploy() {
  await startDeployment()
  status.show() // anchored to status.triggerProps' button
}
```

Prefer calling these from event handlers. For state-driven opening, use the controlled `open` option instead of calling `show()` from an effect.

## Keyboard and focus

All keyboard behavior is native:

| Key | Behavior |
| --- | --- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger | Toggles the popover. |
| <kbd>Tab</kbd> from the open trigger | Moves focus into the popover content. |
| <kbd>Esc</kbd> | Closes an auto popover and returns focus to the trigger. |

Popovers are non-modal. For a modal task, use `<dialog>` with `showModal()`.

## Caveats

- **Changing `mode` while open closes the popover.** This is native behavior.
- **`aria-labelledby` always points at the title id.** If you don't render `titleProps`, browsers ignore the missing id and the popover is unnamed. Name it another way if it is a meaningful region.
- **`source` support varies.** Older browsers show the popover but may not anchor it when it is opened from code. See [Browser support](./browser-support).
