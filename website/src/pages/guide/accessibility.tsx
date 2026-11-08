export default function GuideAccessibilityPage() {
    return (
        <>
            <p className="lead">
                Native invokers provide real keyboard and assistive-technology behavior, but they do not decide what
                your content is.
            </p>

            <div className="my-6 overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Concern</th>
                            <th>Handled by</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Keyboard activation, expanded state, focus order, <kbd>Esc</kbd> and focus return
                            </td>
                            <td>
                                Browser, via <code>popovertarget</code>
                            </td>
                        </tr>
                        <tr>
                            <td>Tooltip on hover, focus, and long press</td>
                            <td>
                                Browser, via <code>interestfor</code>
                            </td>
                        </tr>
                        <tr>
                            <td>Tooltip described or named while closed</td>
                            <td>
                                Nook: <code>aria-describedby</code> or <code>aria-labelledby</code>
                            </td>
                        </tr>
                        <tr>
                            <td>Tooltip role, popover name from its title</td>
                            <td>
                                Nook: <code>role="tooltip"</code>, <code>aria-labelledby</code>
                            </td>
                        </tr>
                        <tr>
                            <td>Content roles (menu, dialog, listbox) and their keyboard patterns</td>
                            <td>You</td>
                        </tr>
                        <tr>
                            <td>Focus trapping for modal tasks</td>
                            <td>
                                You, with{' '}
                                <a href="/guide/dialog">
                                    <code>&lt;dialog&gt;</code>
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td>Visible focus styles</td>
                            <td>You</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="verified">Verified</h2>

            <p>Checked in Chromium 145 against Chromium's own accessibility tree, and covered by tests:</p>

            <ul>
                <li>
                    A <code>popovertarget</code> trigger exposes <code>expanded</code> false, then true.
                </li>
                <li>
                    A popover is named by its <code>titleProps</code> heading.
                </li>
                <li>
                    A <code>useTooltip()</code> trigger is described (or named) by the tooltip text before the tooltip
                    opens.
                </li>
            </ul>

            <p>
                <strong>Not verified yet:</strong> screen reader output, touch long press, and browsers other than
                Chromium.
            </p>

            <h2 id="checklist">Checklist</h2>

            <ul>
                <li>
                    Triggers are <code>&lt;button&gt;</code> elements with an accessible name.
                </li>
                <li>
                    Meaningful popovers render <code>titleProps</code>.
                </li>
                <li>
                    Menus, listboxes, and dialogs have their full semantics and keyboard support; Nook does not add
                    them.
                </li>
                <li>Tooltips are short and not interactive, and never the only place for essential information.</li>
                <li>Focus is visible, and everything works with animations disabled.</li>
            </ul>
        </>
    )
}
