---
title: Quick start
description: Install @nook/react and build an anchored popover and a tooltip.
---

# Quick start

<p class="nk-lead">Build an anchored, dismissible popover in three steps: call a hook, spread its props, add a few lines of CSS.</p>

## Requirements

- **React 19.2 or later.** The hooks use `useEffectEvent` and React 19 ref cleanup.
- **The native Popover API** for popovers: Chrome 114, Firefox 125, Safari 17.
- **Chromium 142 or later** for tooltips, which use `interestfor`. See [Browser support](./browser-support).

## Installation

The packages are private while the API is shaped, so they are not on npm yet. Use them from a checkout:

::: code-group

```sh [pnpm]
git clone https://github.com/Tarasikee/nook.git
cd nook && pnpm install && pnpm build

# In your project
pnpm add file:../nook/packages/react file:../nook/packages/core
```

```sh [npm]
git clone https://github.com/Tarasikee/nook.git
cd nook && pnpm install && pnpm build

# In your project
npm install ../nook/packages/react ../nook/packages/core
```

:::

`@nook/react` ships ES modules compiled by React Compiler, with TypeScript declarations. It has no runtime dependencies besides `@nook/core` and your React.

## 1. Call the hook

```tsx
import { usePopover } from '@nook/react'

export function ShareMenu() {
  const share = usePopover({
    onOpenChange: (open) => console.log(open ? 'opened' : 'closed')
  })

  // …
}
```

## 2. Spread the props

Spread each props object onto your own elements. They contain attributes only, so your own `onClick` and other props are untouched.

```tsx
return (
  <>
    <button {...share.triggerProps} onClick={trackShare}>
      Share
    </button>

    <div {...share.contentProps} className="panel">
      <h2 {...share.titleProps}>Invite collaborators</h2>
      <p>Anyone with this link can view the project.</p>
      <button {...share.closeProps}>Done</button>
    </div>
  </>
)
```

The button now toggles the panel natively. Outside clicks and <kbd>Esc</kbd> close it. `onOpenChange` reports every change, and `share.open` is the browser's actual state. All of this already works in server-rendered HTML, before hydration.

## 3. Position it with CSS

Open popovers are centered in the viewport by default. The trigger is the popover's **implicit anchor**, so CSS can place it:

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

That is the whole example:

<ReactDemo name="popover" :height="330" />

## Add a tooltip

`useTooltip()` renders `interestfor`, so the browser shows the tooltip on hover, focus, and long press. Its timing is CSS:

```tsx
import { useTooltip } from '@nook/react'

function ArchiveButton() {
  const tooltip = useTooltip({ role: 'label' }) // the tooltip names the icon button

  return (
    <>
      <button {...tooltip.triggerProps}>
        <ArchiveIcon aria-hidden />
      </button>
      <div {...tooltip.contentProps} className="tooltip">Archive project</div>
    </>
  )
}
```

```css
[interestfor] {
  interest-delay: 300ms 100ms; /* show after 300 ms, hide after 100 ms */
}
```

<ReactDemo name="tooltip" :height="260" />

## Next steps

<div class="nk-cards">
  <a class="nk-card" href="./concepts"><strong>Core concepts →</strong><span>Why the hooks return attributes, and where state lives.</span></a>
  <a class="nk-card" href="./popover"><strong>Popover →</strong><span>Modes, controlled state, and keyboard behavior.</span></a>
  <a class="nk-card" href="./positioning"><strong>Positioning →</strong><span>Placement, offsets, and flipping with CSS.</span></a>
  <a class="nk-card" href="./animation"><strong>Animation →</strong><span>Entry and exit transitions without JavaScript.</span></a>
</div>
