import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'

export default function GuideStylingPage() {
    return (
        <>
            <p className="lead">
                Use CSS anchor positioning for placement and transitions for animation. Style the native bodies
                directly.
            </p>

            <h2 id="positioning">Positioning</h2>

            <ReactDemo name="placement" />

            <p>
                The native invoker makes the trigger the <strong>implicit anchor</strong>: <code>popovertarget</code>{' '}
                from <code>usePopover()</code>, <code>interestfor</code> from <code>useTooltip()</code>, and the{' '}
                <code>source</code> passed by <code>showPopover()</code>. So <code>position-area</code> is enough, with
                no <code>anchor-name</code> needed:
            </p>

            <Code
                code={
                    '@supports (position-area: block-end) {\n  .panel {\n    inset: auto; /* remove the default centered placement */\n    margin: 0;\n    position-area: block-end span-inline-end;\n    margin-block-start: 8px; /* offset from the trigger */\n    position-try-fallbacks: flip-block; /* flip above when there is no room below */\n  }\n}\n'
                }
                language="css"
            />
            <ul>
                <li>
                    <strong>Reset first.</strong> Default popover styles (<code>inset: 0; margin: auto</code>) center it
                    in the viewport and would stretch it inside the chosen area.
                </li>
                <li>
                    <strong>
                        <code>@supports</code>
                    </strong>{' '}
                    keeps the centered default in browsers without anchor positioning, instead of a popover stuck at its
                    static position.
                </li>
                <li>
                    <strong>Placement:</strong> <code>position-area</code> names a cell of a 3×3 grid around the anchor.
                    Logical keywords (<code>block-end span-inline-end</code>) and physical ones (
                    <code>bottom span-right</code>) both work.
                </li>
                <li>
                    <strong>Offsets:</strong> a margin on the side facing the anchor. <code>margin: 8px</code> on all
                    sides works for any placement.
                </li>
                <li>
                    <strong>Another anchor:</strong> set <code>anchor-name: --toolbar</code> on the element and{' '}
                    <code>position-anchor: --toolbar</code> on the popover.
                </li>
            </ul>

            <h2 id="animation">Animation</h2>

            <ReactDemo name="animation" />

            <Code
                code={
                    '.panel {\n  opacity: 0; /* closed state, also the exit target */\n  translate: 0 -4px;\n  transition:\n    opacity 160ms ease-out,\n    translate 160ms ease-out,\n    display 160ms allow-discrete,\n    overlay 160ms allow-discrete;\n}\n\n.panel:popover-open {\n  opacity: 1;\n  translate: 0 0;\n}\n\n@starting-style {\n  .panel:popover-open {\n    opacity: 0; /* where the entry starts; must come after the rule above */\n    translate: 0 -4px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .panel {\n    transition: none;\n  }\n}\n'
                }
                language="css"
            />
            <ul>
                <li>
                    <code>@starting-style</code> supplies the first frame after leaving <code>display: none</code>.{' '}
                    <code>display</code> and <code>overlay</code> with <code>allow-discrete</code> keep the popover
                    rendered and in the top layer during the exit.
                </li>
                <li>
                    Content stays mounted, so exit transitions just work. <code>onToggle</code> fires on the state
                    change, not when the animation ends.
                </li>
                <li>
                    The same recipe works for tooltips, or key it off <code>:interest-target</code>.
                </li>
            </ul>

            <p>
                Browser versions for these properties, including limited <code>overlay</code> support, are on{' '}
                <a href="/guide/browser-support">Browser support</a>.
            </p>
        </>
    )
}
