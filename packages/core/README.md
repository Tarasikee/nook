# Nook core

The future framework-independent foundation for Nook's popovers, tooltips, and selects.

Core will use native browser capabilities wherever practical and supply the minimum JavaScript needed to complete the interaction. It will own shared browser behavior without depending on React, other frameworks, or third-party runtime libraries.

The first implementation exports `createPopover()` and `createTooltip()`. Both functions attach behavior to existing DOM elements and return a controller for lifecycle and imperative visibility. `createPopover()` uses the native declarative trigger relationship; `createTooltip()` keeps trigger behavior separate through DOM event listeners.

```ts
createPopover({ trigger: shareButton, content: sharePanel })
createTooltip({ trigger: archiveButton, content: archiveHint })
```

The popover content needs an `id`; the controller uses it to create the browser's native trigger relationship. Tooltip behavior handles pointer and keyboard focus with its own DOM listeners, leaving the trigger's existing event handlers untouched. Both rely on the browser's Popover API and do not provide a fallback.

The package remains private while its API is being shaped. Read the [implementation direction](../../docs/implementation-direction.md) before building on these first primitives.

See the runnable [website examples](../../website/README.md), [architecture direction](../../docs/architecture.md) and [contributor guide](../../CONTRIBUTING.md).
