# Browser research

Dated research on the browser features Nook builds on, verified **2026-09-28**. It is evidence, not a support promise; the policy is in the [README](../README.md#browser-support-policy). Recheck sources and record the date and browser version when updating.

"Observed" facts come from Playwright's bundled Chromium 145.0.7632.6. Accessibility observations use Chromium's own tree over CDP (`Accessibility.getPartialAXTree`), not Playwright's DOM approximation. They are guarded by `packages/react/tests/platform.spec.ts`.

## Compatibility

Numbers are the first stable version recorded by MDN browser-compat-data (BCD) at revision [`a2d2a59`](https://github.com/mdn/browser-compat-data/tree/a2d2a599a78df7885f57bfe21880d21821036dc5), unless marked. "No" means no implementation; "Preview only" is not a stable Safari release.

| Capability / BCD source                                                                                                                                          | Chrome                        | Firefox               | Safari (macOS)       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | --------------------- | -------------------- |
| [Popover attribute (base)](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/html/global_attributes.json)                 | 114                           | 125                   | 17                   |
| [Button popovertarget / declarative invoker](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/html/elements/button.json) | 114                           | 125                   | 17                   |
| [hint mode](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/html/global_attributes.json)                                | 151; 133–<151 partial         | 153; 149–<153 partial | Preview only         |
| [showPopover / hidePopover (base)](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)                | 114                           | 125                   | 17                   |
| [togglePopover (base)](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)                            | 114                           | 125                   | 17                   |
| [togglePopover boolean force](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)                     | 116                           | 141                   | 17                   |
| [togglePopover options.force](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)                     | 130                           | 141                   | 18.4                 |
| [togglePopover boolean return](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)                    | 116                           | 125                   | 17                   |
| [showPopover / togglePopover source option](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)       | 137; 133–<137 partial         | 144; 141–<144 partial | 26; 18.4–<26 partial |
| [Popover beforetoggle / toggle events](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)            | 114                           | 125                   | 17                   |
| [ToggleEvent.source](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/ToggleEvent.json)                              | 140                           | 145                   | 26.5                 |
| [Button command / commandfor](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/html/elements/button.json)                | 135                           | 144                   | 26.2                 |
| [popovertarget implicit anchor](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/html/elements/button.json)              | 133                           | 147                   | 26                   |
| [Button interestfor](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/html/elements/button.json)                         | 142                           | No                    | No                   |
| [Button interestForElement](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLButtonElement.json)                 | 142                           | No                    | No                   |
| [interest / loseinterest events](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/HTMLElement.json)                  | 142                           | No                    | No                   |
| [InterestEvent](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/api/InterestEvent.json)                                 | 142                           | No                    | No                   |
| [interest-delay](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/properties/interest-delay.json)                    | 142                           | No                    | No                   |
| [:interest-source](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/selectors/interest-source.json)                  | 142                           | No                    | No                   |
| [:interest-target](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/selectors/interest-target.json)                  | 142                           | No                    | No                   |
| [position-area](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/properties/position-area.json)                      | 129; 125–<131 as `inset-area` | 147                   | 26                   |
| [@starting-style](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/at-rules/starting-style.json)                     | 117                           | 129                   | 17.5                 |
| [transition-behavior](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/properties/transition-behavior.json)          | 117                           | 129                   | 17.4                 |
| [overlay](https://github.com/mdn/browser-compat-data/blob/a2d2a599a78df7885f57bfe21880d21821036dc5/css/properties/overlay.json)                                  | 117                           | No                    | No                   |
| [Element.ariaNotify](https://github.com/mdn/browser-compat-data/blob/0fe836f1c9b303b5684fc6fd1a55a565ae4e09d2/api/Element.json) ¹                                | 141                           | 150                   | 27                   |
| [Document.ariaNotify](https://github.com/mdn/browser-compat-data/blob/0fe836f1c9b303b5684fc6fd1a55a565ae4e09d2/api/Document.json) ¹                              | 141                           | 150                   | 27                   |

¹ Recorded from BCD revision [`0fe836f1c9b303b5684fc6fd1a55a565ae4e09d2`](https://github.com/mdn/browser-compat-data/tree/0fe836f1c9b303b5684fc6fd1a55a565ae4e09d2) (committed 2026-09-28), not the snapshot revision above. BCD marks it standard-track and not experimental.

From BCD `main`, checked 2026-09-28: `button.commandfor` and `command` are at Chrome 135, Firefox 144, and Safari 26.2, and are standards-track. `focusgroup` has no BCD entry and was absent in Chromium 145.

Caveats:

- **`hint` semantics changed.** Chrome 133–150 and Firefox 149–152 implement an older version; current behavior starts at Chrome 151 and Firefox 153. Unrecognized `hint` values map to `manual`.
- **iOS light dismiss** was broken before iOS 18.3.
- **`source`** was incomplete in Chrome 133–136, Firefox 141–143, and Safari from 18.4 until 26.
- **Interest invokers** are experimental and not standards-track in BCD.
- **CSS features ship separately:** `@starting-style` support does not imply the `overlay` transition. The older Chromium name for `position-area` was `inset-area`.

## Popover API

- Modes: `auto` light-dismisses and closes unrelated auto popovers; `hint` light-dismisses, keeps auto popovers open, and closes unrelated hints; `manual` closes only explicitly. Invalid values map to `manual`. Changing an open popover's mode hides it. [HTML Standard](https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute)
- Open popovers render in the top layer without moving the DOM node. Popovers are non-modal; modal tasks need `<dialog>`. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- A declarative invoker (`popovertarget` or `commandfor`) gives focus navigation after the invoker, returns focus on Escape, and exposes expanded state. Programmatic `source` gives focus navigation and anchoring but no implicit ARIA relationship. [MDN guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using)
- `beforetoggle` can cancel opening but **not closing**. `toggle` reports completed changes, can coalesce rapid ones, and is not an animation-end signal. [beforetoggle](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforetoggle_event), [toggle](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/toggle_event)
- Repeated show-when-open or hide-when-hidden is a no-op in the current standard. Disconnected elements and modal or fullscreen contexts can throw. [HTML Standard](https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover)

Observed:

- `showPopover()` without `source` is **not anchored** to the invoker (it rendered at the viewport origin). With `source`, or when opened by the invoker, it is.
- `popovertarget` and `commandfor` both expose `expanded` natively. Popover content is an unnamed `group` unless labeled.
- `showPopover()` then `hidePopover()` in one task produced a single `toggle` event from `closed` to `closed`. A click then an immediate outside click also coalesced.
- `ToggleEvent.source` reported the invoking button.

## Interest invokers

`interestfor` on `<a>`, `<button>`, `<area>`, or SVG `<a>` targets an element that the browser shows on hover, focus, or long press; Escape cancels all interest. It supplies an implicit anchor. `interest-delay` (one value, or start and end) sets timing; `:interest-source` and `:interest-target` style the pair. `interest` and `loseinterest` fire on the target with `InterestEvent.source`. Detect with `Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement')`. [MDN guide](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers)

Observed:

- Hover and keyboard focus show the target; Escape cancels. The default delay was 400–800 ms.
- Moving the pointer into the target keeps interest, so interactive hover cards stay open.
- A plain-text `hint` target describes the invoker **only while open**; a rich target produced no description. This is why `useTooltip` adds `aria-describedby`.
- With `aria-labelledby` pointing at the hint, the text was exposed as both name and description.
- `interestfor` and `popovertarget` coexist on one button, and a hint does not close an open auto popover.
- Tooltip groups work in CSS: with `interest-delay: 600ms 150ms` and `.group:has(:interest-source) [interestfor] { interest-delay-start: 0s }`, the first tooltip opened after more than 450 ms, and the next one in the group after less than 250 ms, closing the first. Without the rule, or after interest ended, the full delay applied.

## Dialog

`<button commandfor="id" command="show-modal">` opens a `<dialog>` as modal and `command="close"` closes it, without script (`commandfor` support is in the table above). A modal dialog is in the top layer and makes the rest of the page inert. `closedby` sets what light-dismisses it: `any`, `closerequest`, or `none`. [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)

Observed in Chromium 145 on 2026-09-29 (`packages/react/tests/platform.spec.ts`):

- `command="show-modal"` opened the dialog as `:modal` and moved focus to the first focusable element inside. Escape closed it and returned focus to the invoker.
- While open, the page behind could not be focused or clicked. `command="close"` closed it and returned focus to the invoker.
- A backdrop click did not close a default dialog; with `closedby="any"` it did.
- The `open` attribute tracked every open and close, including Escape, so a `MutationObserver` on it can mirror the state.
- The `@nook/ui-react` Dialog's server-rendered `commandfor` buttons opened and closed a modal before hydration; its compiled and source builds also returned focus on close/Escape and honored `closedby="any"` after hydration (Chromium 145.0.7632.6, 2026-09-29; `packages/ui-react/tests/components.spec.ts`).

## Positioning, transitions, select, announcements

- **Anchor positioning:** an implicit invoker anchor needs only `position-area`; reset the default popover `inset` and `margin` first. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using)
- **Transitions:** `@starting-style` gives the entry style; `display` and `overlay` with `allow-discrete` keep the exit visible and in the top layer. Closing must work with animations disabled. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overlay)
- **Customizable select:** `appearance: base-select`, `::picker(select)`, `<selectedcontent>`. The picker has an implicit popover and anchor. No support baseline is established. [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select)
- **`ariaNotify(text, { priority })`** on `Element` or `Document`: announcements without a live region. Caveats: often only the latest is spoken, so combine messages; VoiceOver can drop one that coincides with another accessibility event such as a focus move; ChromeOS never speaks them; live regions take precedence; a Permissions Policy can block it. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify)

## Open questions

- Screen reader output for tooltips and popovers, especially `role: 'label'` duplication.
- Touch long press on interest invokers, and multiple invokers sharing a target.
- Nested popovers and hints against the current `hint` stack rules.
- Placement fallbacks in scroll containers, writing modes, and zoom.
- `ariaNotify` timing relative to focus changes, for toasts.
- `closedby` support outside Chromium; it is not in the BCD snapshot above.
