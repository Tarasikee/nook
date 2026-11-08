import { Code } from '../../components/Code'

export default function GuideConceptsPage() {
    return (
        <>
            <p className="lead">
                When the browser already provides a behavior, render the HTML that asks for it instead of recreating it
                in JavaScript.
            </p>

            <h2 id="hooks-render-relationships">Hooks render relationships</h2>

            <p>
                <code>usePopover()</code> returns <code>popovertarget</code> and <code>popover</code> attributes;{' '}
                <code>useTooltip()</code> returns <code>interestfor</code> and <code>popover="hint"</code>. Once they
                are in the DOM, the browser handles activation, dismissal, focus order, focus return, and the implicit
                anchor.
            </p>

            <h2 id="attributes-not-handlers">Attributes, not handlers</h2>

            <p>
                Trigger props contain no event handlers and no ref. Spread the native attributes onto your element next
                to your own handlers. Merge classes and existing ARIA references explicitly:
            </p>

            <Code
                code={'<button {...actions.triggerProps} {...hint.triggerProps} onClick={track}>…</button>\n'}
                language="tsx"
            />
            <p>
                Your design system's <code>&lt;Button&gt;</code> works if it forwards props to a native button.
            </p>

            <h2 id="the-browser-owns-the-state">The browser owns the state</h2>

            <p>
                The base hooks generate attributes and do not observe state. Use native <code>onToggle</code> for
                callbacks. Opt into <code>usePopoverOpen(element)</code> only when rendering depends on{' '}
                <code>:popover-open</code>; <code>usePopoverControl(element, open, source)</code> separately
                synchronizes a requested boolean.
            </p>

            <h2 id="server-rendering">Server rendering</h2>

            <p>
                Relationships are attributes with ids from <code>useId</code>, so server-rendered HTML already works
                before hydration, and <code>popover</code> keeps content hidden so nothing flashes. Call the hooks in
                client components; the package is marked <code>'use client'</code>.
            </p>

            <h2 id="top-layer-no-portals">Top layer, no portals</h2>

            <p>
                Open popovers render in the top layer, above <code>overflow: hidden</code> and stacking contexts. The
                element stays where you rendered it, so context, events, and CSS inheritance keep working.
            </p>

            <h2 id="styleless">Styleless</h2>

            <p>
                The popover hook adds no styles; the tooltip hook includes a trigger class for interest delays.
                Placement and animation are your CSS; see <a href="/guide/styling">Styling</a>. Semantics beyond what
                the hooks render are yours; see <a href="/guide/accessibility">Accessibility</a>.
            </p>
        </>
    )
}
