import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'

export default function GuideTooltipPage() {
    return (
        <>
            <p className="lead">
                A short, non-interactive hint the browser shows on hover, focus, or long press through{' '}
                <code>interestfor</code>. Props are in the <a href="/api/#usetooltip">API reference</a>.
            </p>

            <ReactDemo name="tooltip" />

            <Code
                code={
                    'const tooltip = useTooltip({ role: \'label\' })\n\n<button {...tooltip.triggerProps}><BoldIcon aria-hidden /></button>\n<div {...tooltip.contentProps} className="tooltip">Bold</div>\n'
                }
                language="tsx"
            />
            <h2 id="what-the-browser-does-and-what-nook-adds">What the browser does, and what Nook adds</h2>

            <p>
                The browser decides when the user shows interest, shows the <code>popover="hint"</code> target, hides it
                when interest ends or on <kbd>Esc</kbd>, and anchors it to the trigger. Nook installs no listeners or
                timers.
            </p>

            <p>
                Chromium exposes the tooltip text to assistive technology only{' '}
                <strong>while the tooltip is open</strong>, so a screen reader hears nothing until the delay passes. The
                hook adds a relationship that always exists: <code>role: 'description'</code> (default) renders{' '}
                <code>aria-describedby</code> for extra text, and <code>role: 'label'</code> renders{' '}
                <code>aria-labelledby</code> for icon-only buttons.
            </p>

            <h2 id="delays">Delays</h2>

            <p>Delays are CSS, not options:</p>

            <Code
                code={'[interestfor] {\n  interest-delay: 300ms 100ms; /* show after 300ms, hide after 100ms */\n}\n'}
                language="css"
            />
            <h2 id="tooltip-groups">Tooltip groups</h2>

            <p>In a toolbar, the first tooltip should wait, but the next should appear at once. Add one rule:</p>

            <Code
                code={'.toolbar:has(:interest-source) [interestfor] {\n  interest-delay-start: 0s;\n}\n'}
                language="css"
            />
            <p>How it works:</p>

            <ol>
                <li>The first hover waits the normal delay, because nothing in the toolbar has interest yet.</li>
                <li>
                    While a tooltip shows, its trigger matches <code>:interest-source</code>, so the toolbar matches the
                    rule and every trigger in it opens with no delay.
                </li>
                <li>
                    Moving to the next button keeps the toolbar matched for the length of the hide delay, so the next
                    tooltip opens at once. Opening a hint closes the previous one.
                </li>
                <li>
                    Once the pointer has been away longer than the hide delay, the rule stops matching and the full
                    delay returns.
                </li>
            </ol>

            <p>
                The hide delay is the switching window: longer means more forgiving, but tooltips also linger longer.
                Use <code>:root:has(:interest-source)</code> to group every tooltip on the page. Verified in Chromium
                145 with timed tests; the toolbar above uses this rule.
            </p>

            <h2 id="with-a-popover-on-the-same-button">With a popover on the same button</h2>

            <p>
                A <code>hint</code> does not close an open auto popover, and both hooks return attributes only:
            </p>

            <ReactDemo name="combined" />

            <h2 id="good-to-know">Good to know</h2>

            <ul>
                <li>
                    Triggers must be <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, or <code>&lt;area&gt;</code>.
                </li>
                <li>
                    Keep tooltips short and non-interactive; use a <a href="/guide/popover">popover</a> for interactive
                    content.
                </li>
                <li>
                    Without <code>interestfor</code> support, tooltips never appear, but the ARIA relationship still
                    gives their text to assistive technology.
                </li>
            </ul>
        </>
    )
}
