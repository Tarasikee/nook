import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'
import { examples } from '../../demos/examples'

export default function UiDialogPage() {
    return (
        <>
            <p className="lead">
                <code>Dialog</code> is a styled native dialog. Connect your own command buttons with an explicit ID.
            </p>
            <ReactDemo name="ui-dialog" />
            <Code code={examples['ui-dialog']} />
            <p>
                All native dialog attributes, handlers, and refs pass through, including <code>closedby="any"</code> for
                backdrop dismissal, <code>onClose</code>, and <code>className</code>. Your children are the dialog
                content.
            </p>
            <p>
                Command buttons open and close the modal before hydration. The browser manages focus and the inert
                background. Use <code>showModal()</code> and <code>close()</code> on your ref for imperative control;
                the native <code>open</code> attribute alone is non-modal.
            </p>
            <p>
                See the <a href="/guide/dialog">Dialog guide</a> for native behavior and state observation.
            </p>
        </>
    )
}
