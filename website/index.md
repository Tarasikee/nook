---
layout: home
title: Nook
titleTemplate: Accessible primitives on native HTML
markdownStyles: false
---

<HomePage>
<template #code>

::: code-group

```tsx [ShareMenu.tsx]
import { usePopover } from '@nook/react'

export function ShareMenu() {
  const share = usePopover({ onOpenChange: (open) => console.log(open) })

  return (
    <>
      <button {...share.triggerProps} onClick={trackShare}>Share</button>
      <div {...share.contentProps} className="panel">
        <h2 {...share.titleProps}>Invite collaborators</h2>
        <button {...share.closeProps}>Done</button>
      </div>
    </>
  )
}
```

```html [Rendered HTML]
<!-- Works before hydration: the browser opens, closes, and dismisses it. -->
<button popovertarget="r1">Share</button>
<div id="r1" popover="auto" aria-labelledby="r1-title" class="panel">
  <h2 id="r1-title">Invite collaborators</h2>
  <button popovertarget="r1" popovertargetaction="hide">Done</button>
</div>
```

```css [panel.css]
.panel {
  inset: auto;
  margin: 0;
  /* The trigger is the implicit anchor. */
  position-area: block-end span-inline-end;
  margin-block-start: 8px;
  position-try-fallbacks: flip-block;
}
```

:::

</template>
</HomePage>
