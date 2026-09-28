# Interest invokers

Verified: **2026-09-28**. Status and individual versions are in [compatibility](browser-compatibility.md).

## What the feature offers

An invoker's `interestfor` references a target ID. HTML anchors, buttons, and areas, plus SVG anchors, can be invokers. The target can be a popover or an ordinary element used for another interaction.

The browser interprets interest, typically from hover, focus, or long press. Exact gestures can vary by browser. A popover target can appear and disappear without JavaScript, while activating a link still performs normal navigation. Escape provides a document-wide way to cancel interest.

An invoker can separately target a hint on interest and a different popover on activation. The relationship also supplies an implicit anchor for positioning. A profile link with optional preview content is a useful progressive-enhancement example: navigation remains useful without the preview.

Source: [MDN interest invoker guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers).

## Timing and styling

`interest-delay` sets the start and end delays. One value applies to both; two values specify start then end. Longhands are `interest-delay-start` and `interest-delay-end`. `normal` selects the browser default; avoid assuming a universal millisecond value. The property is inherited. [MDN interest-delay reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interest-delay)

`:interest-source` selects an active invoker and `:interest-target` its target. Combined with `:has()`, these can support quicker transitions between related invokers once interest is already active. Interest state is distinct from a popover's open state. [MDN interest invoker guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers)

## DOM and event surface

- `interestForElement` reads or assigns the target element on the supported invoker interfaces. [MDN DOM property reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/interestForElement)
- `interest` fires on the target when interest is gained; it does not fire on the invoker as the event target. [MDN interest event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/interest_event)
- `loseinterest` fires on the target when interest is lost. It is normally cancelable, but the Escape-triggered loss of all interest is not. [MDN loseinterest event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/loseinterest_event)
- Both use `InterestEvent`; its `source` identifies the invoker. [MDN interest invoker guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers)

## Current limits

MDN labels the interest events experimental and non-standard. BCD records the main HTML/DOM/CSS surfaces in Chromium from 142 and no Firefox or Safari implementation in this snapshot. This is separate from support for ordinary popovers and `hint`. See the [dated compatibility evidence](browser-compatibility.md).

## Observed in Chromium 145

Verified: **2026-09-28**, Playwright's bundled Chromium 145.0.7632.6. Accessibility results come from Chromium's own tree through CDP (`Accessibility.getPartialAXTree`), not Playwright's DOM-based approximation. Guarded by `packages/react/tests/platform.spec.ts`.

- Hover and keyboard focus both show the target; Escape cancels interest. With no `interest-delay`, the hint appeared between 400 and 800 ms after hover.
- Moving the pointer from the invoker into the target keeps interest, so an interactive hover card stays open.
- For a plain-text `popover="hint"` target, the invoker's accessible description is the target text **only while it is open**. When closed, there is no description. A rich target (with a button inside) produced no description relationship.
- With an explicit `aria-labelledby` pointing at the hint, Chromium exposed the text as both name and description, even while closed. Screen reader output was not tested.
- `interestfor` and `popovertarget` coexist on one button; a `hint` target does not close an open `auto` popover.

Nook's `useTooltip` adds an explicit `aria-describedby` (or `aria-labelledby`) because of the open-only description above.

## Implications to investigate for Nook

- Nook's tooltip now relies on this capability (Chromium-only accepted). Remaining questions: long press on touch, multiple invokers sharing a target, and screen reader output.
- Detect interest support independently from Popover support. Check the invoker interface actually being used, and the specific CSS features required.
- Distinguish a text tooltip from an interactive preview card before assigning roles or focus behavior. Native invocation does not settle those design questions.

These are Nook research questions. This document does not commit to an interest-invoker dependency or a tooltip API; the decision to defer compatibility work is established in the architecture.
