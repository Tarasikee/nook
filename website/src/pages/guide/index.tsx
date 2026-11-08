export default function GuideIndexPage() {
    return (
        <>
            <p className="lead">Build popovers and tooltips with native HTML and headless React hooks.</p>

            <p>
                <code>popovertarget</code> and <code>interestfor</code> link triggers to content. The browser handles
                opening, dismissal, and placement; Nook exposes the native state to React, adds ARIA relationships, and
                anchors popovers opened from code.
            </p>

            <p>
                Use the hooks without styles, or use the optional <a href="/ui/">styled components</a>. Nook ships no
                polyfills.
            </p>

            <h2 id="where-to-look">Where to look</h2>

            <div className="my-6 overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>I want to…</th>
                            <th>Page</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Build a first popover</td>
                            <td>
                                <a href="/guide/getting-started">Quick start</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Understand the design</td>
                            <td>
                                <a href="/guide/concepts">Concepts</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Use modes, controlled state, or open from code</td>
                            <td>
                                <a href="/guide/popover">Popover</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Set tooltip delays, groups, or ARIA roles</td>
                            <td>
                                <a href="/guide/tooltip">Tooltip</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Place, flip, or animate</td>
                            <td>
                                <a href="/guide/styling">Styling</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Check roles, labels, and what is verified</td>
                            <td>
                                <a href="/guide/accessibility">Accessibility</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Know which browsers work</td>
                            <td>
                                <a href="/guide/browser-support">Browser support</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Compare with Radix and Floating UI</td>
                            <td>
                                <a href="/guide/performance">Performance</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Use ready-made, styled components</td>
                            <td>
                                <a href="/ui/">Nook UI</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Look up an option or return value</td>
                            <td>
                                <a href="/api/">API reference</a>
                            </td>
                        </tr>
                        <tr>
                            <td>Copy a working pattern</td>
                            <td>
                                <a href="/examples/">Examples</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="status-and-roadmap">Status and roadmap</h2>

            <p>
                Early implementation; the API may change. <code>@nook/ui/hooks</code> has <code>usePopover()</code> and{' '}
                <code>useTooltip()</code> for React 19.2+, built on local browser helpers. The workspace packages are
                private and not on npm yet.
            </p>

            <p>
                Planned: <strong>menu</strong> (roles, arrow keys, type-to-find; <code>focusgroup</code> was unavailable
                in Chromium 145), <strong>hover card</strong>, <strong>toast</strong> (<code>ariaNotify()</code>),{' '}
                <strong>select</strong> (customizable native select), and <strong>combobox</strong>.
            </p>
        </>
    )
}
