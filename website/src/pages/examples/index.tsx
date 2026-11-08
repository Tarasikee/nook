import { ReactDemo } from '../../components/ReactDemo'

export default function ExamplesIndexPage() {
    return (
        <>
            <p className="lead">
                Every demo runs on <code>@nook/ui/hooks</code>. Open a demo's <strong>Code</strong> tab for the exact
                source, including its Tailwind utilities and local style helpers.
            </p>

            <h2 id="share-popover">Share popover</h2>

            <ReactDemo name="popover" />

            <h2 id="toolbar-tooltips-with-a-group">Toolbar tooltips with a group</h2>

            <ReactDemo name="tooltip" />

            <h2 id="tooltip-and-popover-on-one-button">Tooltip and popover on one button</h2>

            <ReactDemo name="combined" />

            <h2 id="controlled-manual-panel">Controlled manual panel</h2>

            <ReactDemo name="controlled" />

            <h2 id="placement-playground">Placement playground</h2>

            <ReactDemo name="placement" />

            <h2 id="animated-popover">Animated popover</h2>

            <ReactDemo name="animation" />
        </>
    )
}
