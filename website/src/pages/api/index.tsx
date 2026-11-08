import { Code } from '../../components/Code'

export default function ApiPage() {
    return (
        <>
            <p className="lead">
                Declarative attributes by default. State synchronization and observation are separate opt-in hooks.
            </p>
            <Code
                code={"import { usePopover, useTooltip, usePopoverControl, usePopoverOpen } from '@nook/ui/hooks'"}
                language="ts"
            />
            <h2 id="usepopover">usePopover</h2>
            <p>
                <code>usePopover({'{ mode?, id? }'})</code> generates IDs and native attributes. The mode defaults to{' '}
                <code>'auto'</code>; <code>'manual'</code> ignores light dismissal and Escape. A supplied ID replaces
                the generated one.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Result</th>
                        <th>Spread onto</th>
                        <th>Attributes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <code>triggerProps</code>
                        </td>
                        <td>button</td>
                        <td>
                            <code>popoverTarget</code>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>contentProps</code>
                        </td>
                        <td>popover body</td>
                        <td>
                            <code>id</code>, <code>popover</code>, <code>aria-labelledby</code>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>titleProps</code>
                        </td>
                        <td>heading</td>
                        <td>
                            <code>id</code>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>closeProps</code>
                        </td>
                        <td>button</td>
                        <td>
                            <code>popoverTarget</code>, <code>popoverTargetAction: 'hide'</code>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                Render the heading or supply your own accessible name. Refs and native event handlers belong on your
                elements.
            </p>
            <h2 id="usetooltip">useTooltip</h2>
            <p>
                <code>useTooltip({'{ role?, id? }'})</code> returns <code>triggerProps</code> and{' '}
                <code>contentProps</code>. The role defaults to <code>'description'</code>; choose <code>'label'</code>{' '}
                to name an icon button.
            </p>
            <table>
                <thead>
                    <tr>
                        <th>Result</th>
                        <th>Attributes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <code>triggerProps</code>
                        </td>
                        <td>
                            <code>interestfor</code>, <code>aria-describedby</code> or <code>aria-labelledby</code>, and
                            a Tailwind class setting the interest delay
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <code>contentProps</code>
                        </td>
                        <td>
                            <code>id</code>, <code>popover: 'hint'</code>, <code>role: 'tooltip'</code>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                Merge existing ID references or classes explicitly when combining props. The hook does not clone
                children or merge handlers.
            </p>
            <h2 id="usepopovercontrol">usePopoverControl</h2>
            <p>
                <code>usePopoverControl(element, open, source?)</code> calls the native show or hide method when the
                element, requested boolean, or source changes. Pass the invoking element as <code>source</code> to
                preserve programmatic anchoring. Changes are applied after attachment, including to replacement
                elements.
            </p>
            <p>
                It does not observe state, install event handlers, queue imperative requests, or prevent native
                dismissal. Use <code>onToggle</code> to update your state. See the{' '}
                <a href="/guide/popover#controlled-state">controlled example</a>.
            </p>
            <h2 id="usepopoveropen">usePopoverOpen</h2>
            <p>
                <code>usePopoverOpen(element)</code> returns the current <code>:popover-open</code> state through{' '}
                <code>useSyncExternalStore</code>. It accepts a popover or tooltip element, follows element replacement,
                and unsubscribes when passed <code>null</code>. The server snapshot is <code>false</code>; hydration
                picks up the native state.
            </p>
            <Code
                code={
                    'const [panel, setPanel] = useState<HTMLDivElement | null>(null)\nconst open = usePopoverOpen(panel)\n\n<PopoverBody {...popover.contentProps} ref={setPanel}>…</PopoverBody>'
                }
            />
            <h2 id="core">Native events and refs</h2>
            <p>
                Use <code>onToggle</code> for notifications, <code>element.matches(':popover-open')</code> for an
                immediate read, and <code>showPopover({'{ source }'})</code>, <code>hidePopover()</code>, or{' '}
                <code>togglePopover()</code> from handlers. Native toggle events can coalesce; compare{' '}
                <code>oldState</code> and <code>newState</code> if only final changes matter to your callback.
            </p>
        </>
    )
}
