---
title: Server rendering
description: Why Nook's popovers and tooltips work before hydration, and how state is picked up after it.
---

# Server rendering

<p class="nk-lead">Everything that makes a Nook popover work is an HTML attribute. The server renders it, and the browser acts on it before any JavaScript runs.</p>

## What the server renders

```tsx
const share = usePopover()
```

```html
<button popovertarget="r1">Share</button>
<div id="r1" popover="auto" aria-labelledby="r1-title">
  <h2 id="r1-title">Invite collaborators</h2>
  <button popovertarget="r1" popovertargetaction="hide">Done</button>
</div>
```

Ids come from `useId`, so they match between server and client. Before hydration:

- the trigger toggles the popover
- the close button closes it
- <kbd>Esc</kbd> and outside clicks dismiss it
- `popover` keeps the content hidden, so there is no flash of unstyled panels
- tooltips with `interestfor` work on hover and focus

## After hydration

The hooks read the browser's state with `useSyncExternalStore`. On the server the snapshot is `false`, since nothing can be open there. After hydration, React reads the real `:popover-open` state. So **a popover the user opened before hydration is reported as open**, with no hydration mismatch and no effect setting state. The test suite covers this.

## React Server Components

`@nook/react` marks its entry with `'use client'`. Call the hooks in client components. Server components can render the surrounding markup.

## Tested

Every build is tested by rendering fixtures with `renderToString`, checking the markup, using the page with JavaScript disabled, and then hydrating in StrictMode with a check for hydration warnings. See [Quality](./quality).

