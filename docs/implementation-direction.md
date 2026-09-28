# Implementation direction

This is design guidance for when implementation starts, not a public API specification. The goal is the convenience of Floating UI's ready-to-use, composable primitives with a smaller native-browser foundation and direct integration into the user's own elements.

## Product shape

Offer headless primitives for the main use cases: popover, tooltip, and select. They should provide behavior, useful semantics, and state while leaving visual design to the consumer. A team should be able to bring its own element, classes, and design system without first adopting Nook styling.

Keep the browser-independent contracts small. Let `packages/core` own DOM behavior and decisions that apply regardless of framework. Let `packages/react` expose idiomatic React primitives over those contracts. Keep the examples in `website` independent from the package implementation so they demonstrate actual consumer usage.

Start each feature with an obvious ready-to-use path, then add lower-level composition only when a real use case needs it. Avoid making consumers assemble a large interaction stack merely to get a working popover.

## Let native relationships do the work

Use browser relationships before synthesizing matching JavaScript behavior. Where they meet the need, a trigger can reference its popover declaratively, and a single element can participate in more than one interaction. For example, a trigger may open a click-controlled popover and show a separate, transient hint on interest. The native modes are designed to let a hint remain open alongside an auto popover.

These relationships avoid making each primitive compete to own a trigger's `onClick`, `onPointerEnter`, `onFocus`, and dismissal handlers. An existing user handler stays the user's handler. Native invokers, popover state, CSS, and browser events carry Nook behavior wherever possible.

Not every use case maps to one HTML attribute. For extra behavior that needs listeners, install and remove DOM listeners through an explicit lifecycle, rather than assigning the `onclick` property or overwriting a handler supplied by the user. Separate independent behaviors so a click primitive and an interest primitive can each observe the same DOM element. Define ordering and cancellation only where a feature actually needs them.

Observe native state changes as well as Nook initiated changes. Outside dismissal and Escape can change the browser's popover state without going through a React callback. The React layer should stay synchronized with the element's actual open state. Whether to offer controlled state, uncontrolled state, or both should be decided against working examples; avoid a second state machine that can silently drift from the browser.

## Compose without a mandatory Slot

Prefer explicit trigger and content primitives that work with consumer-owned elements. Do not require child cloning, a Slot wrapper, or generic event-prop merging just to attach behavior. Avoid a Nook trigger wrapping the user's button when the browser can associate the actual button with the actual popover.

This keeps composition understandable: the consumer sees which DOM element is the trigger, can attach their ordinary props, and can combine distinct trigger behaviors without figuring out a library-specific order for competing handlers. It also avoids imposing render-time clone and prop-merge work on every consumer. If implementation later finds a case that truly needs polymorphic child composition, evaluate it as an optional integration feature with measured cost and clear event semantics.

Floating UI's React documentation composes interaction hooks with `useInteractions()` and asks callers to route user handlers through prop getters so handlers do not overwrite one another. Radix documents that Slot merges child and slot handlers, with the child handler taking precedence. Base UI documents `mergeProps` and `useRender` for combining handler props. Those are useful solutions for their composition models; Nook can reduce the need for this machinery when native relationships and separate browser listeners cover the feature. See [Floating UI interactions](https://floating-ui.com/docs/useinteractions), [Radix Slot](https://www.radix-ui.com/primitives/docs/utilities/slot), [Base UI useRender](https://base-ui.com/react/utils/use-render), and [Base UI mergeProps](https://base-ui.com/react/utils/merge-props).

The checked documentation describes API and composition behavior; it does not demonstrate that Slot has a large performance cost in a real application. Treat render-time work, callback creation, and cloning as things to measure in representative examples, not as assumed bottlenecks. Simpler event ownership is a sufficient design reason to avoid mandatory Slot composition.

## Keep interaction logic small and explicit

- Keep each primitive responsible for one interaction model. Do not automatically combine hover, focus, and click into one opaque trigger behavior.
- Make it possible to attach independent behaviors to one consumer-owned element, and let browser popover modes determine how simultaneous popovers interact.
- Preserve native button, link, and form behavior. A custom trigger should not make the consumer reimplement keyboard activation the browser already provides.
- Keep dismissal, focus, and ARIA behavior aligned with the semantics of the specific primitive. A popover is non-modal; it does not automatically make content a tooltip, menu, dialog, or select.
- Use React Compiler assumptions already recorded in this repository. Avoid manual memoization APIs.

## Initial implementation sequence

Use the website examples to validate one simple click popover, a tooltip, and a select before growing abstractions. Add a shared mechanism only after two real features need the same behavior. Record which browser capabilities each feature needs; limited availability is acceptable under the current project direction. Defer compatibility fixes, polyfills, and fallback implementations.

Keep decisions about exact component names, controlled-state API, portals, polymorphism, public hooks, and listener internals open until those examples expose the tradeoffs.
