import { Code } from '../../components/Code'
import { ReactDemo } from '../../components/ReactDemo'

export default function GuidePopoverPage() {
    return (
        <>
            <p className="lead">
                A click-triggered surface linked to your button through <code>popovertarget</code>. Basic usage is in
                the <a href="/guide/getting-started">quick start</a>; props are in the{' '}
                <a href="/api/#usepopover">API reference</a>.
            </p>

            <h2 id="modes">Modes</h2>

            <div className="my-6 overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Mode</th>
                            <th>
                                Outside click and <kbd>Esc</kbd>
                            </th>
                            <th>Other popovers</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <code>'auto'</code> <em>(default)</em>
                            </td>
                            <td>Close it</td>
                            <td>An unrelated auto popover closes it</td>
                        </tr>
                        <tr>
                            <td>
                                <code>'manual'</code>
                            </td>
                            <td>Ignored</td>
                            <td>Independent; any number can be open</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="controlled-state">Controlled state</h2>

            <Code
                code={
                    "const [open, setOpen] = useState(false)\nconst [panel, setPanel] = useState<HTMLDivElement | null>(null)\nconst [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)\nconst status = usePopover({ mode: 'manual' })\nusePopoverControl(panel, open, trigger)\n\n<button {...status.triggerProps} ref={setTrigger}>Status</button>\n<PopoverBody {...status.contentProps} ref={setPanel}\n  onToggle={(event) => setOpen(event.newState === 'open')}>\n  <h2 {...status.titleProps}>Status</h2>\n</PopoverBody>"
                }
                language="tsx"
            />
            <ReactDemo name="controlled" />

            <aside>
                <p>
                    <strong>The browser has the final say</strong>
                </p>
                <p>
                    In <code>'auto'</code> mode, <kbd>Esc</kbd> and outside clicks close the popover even when{' '}
                    <code>open</code> is <code>true</code>, because the platform cannot cancel closing. Use native{' '}
                    <code>onToggle</code> to report the final state. Use <code>'manual'</code> when you do not want
                    outside clicks or Escape to dismiss it.
                </p>
            </aside>

            <h2 id="opening-from-code">Opening from code</h2>

            <p>
                Call native <code>showPopover()</code>, <code>hidePopover()</code>, or <code>togglePopover()</code> on
                your element ref. Pass the invoking button as <code>source</code> when opening programmatically so the
                browser anchors the popover to it. Requests require an attached element; the helpers do not queue them.
            </p>

            <Code
                code={
                    'async function deploy() {\n  await startDeployment()\n  panel?.showPopover({ source: trigger })\n}'
                }
                language="tsx"
            />
            <h2 id="keyboard-and-focus">Keyboard and focus</h2>

            <p>
                All native: <kbd>Enter</kbd> or <kbd>Space</kbd> toggles, <kbd>Tab</kbd> from the open trigger moves
                into the popover, and <kbd>Esc</kbd> closes an auto popover and returns focus to the trigger. Popovers
                are non-modal; for a modal task use a{' '}
                <a href="/guide/dialog">
                    <code>&lt;dialog&gt;</code>
                </a>
                .
            </p>

            <h2 id="good-to-know">Good to know</h2>

            <ul>
                <li>
                    Only <code>&lt;button&gt;</code> elements can use <code>popovertarget</code>.
                </li>
                <li>
                    Style the open popover with <code>:popover-open</code>. For React output, explicitly opt into{' '}
                    <code>usePopoverOpen(element)</code>; trigger props do not mirror open state.
                </li>
                <li>
                    Changing <code>mode</code> while open closes the popover.
                </li>
                <li>
                    Render <code>titleProps</code> on a heading, or the popover has no accessible name.
                </li>
            </ul>
        </>
    )
}
