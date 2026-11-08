import { SupportMatrix } from '../../components/SupportMatrix'
import { Code } from '../../components/Code'

export default function GuideBrowserSupportPage() {
    return (
        <>
            <p className="lead">
                Nook uses native features directly and ships no polyfills. Features that only one engine supports are
                acceptable when documented.
            </p>

            <ul>
                <li>
                    <strong>
                        <code>usePopover()</code>
                    </strong>{' '}
                    needs the Popover API: Chrome 114, Firefox 125, Safari 17.
                </li>
                <li>
                    <strong>
                        <code>useTooltip()</code>
                    </strong>{' '}
                    needs <code>interestfor</code>: Chromium 142+, experimental. Current <code>hint</code> behavior
                    needs Chrome 151 or Firefox 153.
                </li>
                <li>
                    <strong>Positioning</strong> needs <code>position-area</code> and the implicit invoker anchor:
                    Chrome 133, Firefox 147, Safari 26.
                </li>
            </ul>

            <SupportMatrix />

            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
                Versions are the first stable release in MDN browser-compat-data, checked September 28, 2026. "This
                browser" is a live check.
            </p>

            <h2 id="without-support">Without support</h2>

            <div className="my-6 overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Missing</th>
                            <th>Effect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Popover API</td>
                            <td>Content is not shown as a popover.</td>
                        </tr>
                        <tr>
                            <td>
                                <code>interestfor</code>
                            </td>
                            <td>Tooltips never appear; their ARIA relationship remains.</td>
                        </tr>
                        <tr>
                            <td>Anchor positioning</td>
                            <td>
                                With <code>@supports</code>, popovers keep the default centered placement.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>@starting-style</code>, <code>overlay</code>
                            </td>
                            <td>Popovers open and close without animation, or leave the top layer early.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>
                Other caveats: older <code>hint</code> engines (Chrome 133–150, Firefox 149–152) behave differently; iOS
                did not dismiss on outside taps before 18.3; older browsers may not anchor popovers opened from code.
            </p>

            <h2 id="detect-support">Detect support</h2>

            <Code
                code={
                    "const hasPopover = 'showPopover' in HTMLElement.prototype\nconst hasInterest = Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement')\nconst hasAnchorPositioning = CSS.supports('position-area', 'top')\n"
                }
                language="ts"
            />
            <p>
                Sources and observed behavior:{' '}
                <a href="https://github.com/Tarasikee/nook/blob/main/docs/research.md">browser research</a>.
            </p>
        </>
    )
}
