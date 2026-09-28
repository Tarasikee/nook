---
title: Quick start
description: Install @nook/react and build an anchored popover.
---

# Quick start

<p class="nk-lead">Call a hook, spread its props, add a few lines of CSS.</p>

## Install

Requires React 19.2+. The packages are private while the API is shaped, so install them from a checkout:

::: code-group

```sh [pnpm]
git clone https://github.com/Tarasikee/nook.git
cd nook && pnpm install && pnpm build
pnpm add file:../nook/packages/react file:../nook/packages/core
```

```sh [npm]
git clone https://github.com/Tarasikee/nook.git
cd nook && pnpm install && pnpm build
npm install ../nook/packages/react ../nook/packages/core
```

:::

## 1. Call the hook and spread its props

```tsx
import { usePopover } from '@nook/react'

export function ShareMenu() {
  const share = usePopover({ onOpenChange: (open) => console.log(open) })

  return (
    <>
      <button {...share.triggerProps} onClick={trackShare}>Share</button>
      <div {...share.contentProps} className="panel">
        <h2 {...share.titleProps}>Invite collaborators</h2>
        <p>Anyone with this link can view the project.</p>
        <button {...share.closeProps}>Done</button>
      </div>
    </>
  )
}
```

The props are attributes only, so your `onClick` is untouched. The button now toggles the panel, and outside clicks and <kbd>Esc</kbd> close it.

## 2. Position it

The trigger is the popover's implicit anchor, so CSS can place the panel next to it:

```css
@supports (position-area: block-end) {
  .panel {
    inset: auto;
    margin: 0;
    position-area: block-end span-inline-end;
    margin-block-start: 8px;
    position-try-fallbacks: flip-block;
  }
}
```

## Result

<ReactDemo name="popover" :height="330" />

## Next

- [Tooltip](./tooltip): add a hover and focus hint with `useTooltip()`.
- [Popover](./popover): modes, controlled state, and opening from code.
- [Positioning](./styling#positioning) and [Animation](./styling#animation): the CSS recipes.
- [Browser support](./browser-support): which browsers each hook needs.
