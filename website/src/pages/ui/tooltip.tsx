import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'
import { examples } from '../../demos/examples'

export default function UiTooltipPage() {
    return (
        <>
            <p className="lead">
                <code>TooltipBody</code> is a styled hint popover. Put the native interest and ARIA attributes on your
                trigger explicitly.
            </p>
            <ReactDemo name="ui-tooltip" />
            <Code code={examples.publish} />
            <p>
                Native div attributes, handlers, and refs pass through. The defaults are <code>popover="hint"</code>,{' '}
                <code>role="tooltip"</code>, <code>side="top"</code>, and <code>align="center"</code>. Set{' '}
                <code>side</code>, <code>align</code>, and <code>className</code> on the body to customize it.
            </p>
            <p>
                <code>TooltipGroup</code> is an unstyled div that removes the next trigger's delay while a member has
                interest. Give it your toolbar role, name, and layout. It uses CSS only.
            </p>
            <p>
                The trigger class from <code>useTooltip</code> sets <code>--nook-tooltip-delay</code> (300ms) and{' '}
                <code>--nook-tooltip-hide-delay</code> (100ms) defaults. Merge that class with your own classes
                explicitly. Existing ARIA references also need explicit merging.
            </p>
            <p>
                The explicit ARIA relationship exists before hover. Without native interest support, the tooltip does
                not appear, but its text remains available to assistive technology. Use <code>onToggle</code> for
                notifications or opt into <a href="/api/#usepopoveropen">usePopoverOpen</a> to render its state.
            </p>
        </>
    )
}
