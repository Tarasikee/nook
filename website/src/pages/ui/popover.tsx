import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'
import { examples } from '../../demos/examples'

export default function UiPopoverPage() {
    return (
        <>
            <p className="lead">
                <code>PopoverBody</code> is a styled native popover. You render its trigger, heading, content, and close
                buttons explicitly.
            </p>
            <ReactDemo name="ui-popover" />
            <Code code={examples['ui-popover']} />
            <p>
                All native div attributes, event handlers, and refs pass through. <code>popover</code> defaults to{' '}
                <code>'auto'</code>. <code>side</code> accepts <code>top | bottom | left | right</code> and defaults to{' '}
                <code>bottom</code>; <code>align</code> accepts <code>start | center | end</code> and defaults to{' '}
                <code>start</code>. Use <code>className</code> for utility overrides.
            </p>
            <p>
                <code>usePopover</code> supplies relationships. Native buttons also work directly with an explicit{' '}
                <code>id</code> and <code>popoverTarget</code>. Controlled synchronization and reactive state are{' '}
                <a href="/api/#usepopovercontrol">optional hooks</a>.
            </p>
            <h2 id="with-a-tooltip">With a tooltip</h2>
            <p>
                Put both sets of native attributes on your button and render the bodies separately. Your app owns prop
                conflicts and coordination.
            </p>
            <Code code={examples['ui-combined']} />
        </>
    )
}
