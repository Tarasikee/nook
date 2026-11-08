import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'

export default function UiDialogPage() {
    return (
        <>
            <p className="lead">
                <code>Dialog</code> is a styled native dialog. Connect your own command buttons with an explicit ID.
            </p>
            <ReactDemo name="ui-dialog" />
            <Code
                code={
                    'const id = useId()\n\n<Button commandfor={id} command="show-modal">Delete project</Button>\n<Dialog id={id} aria-labelledby={`${id}-title`}>\n  <h2 id={`${id}-title`}>Delete “Atlas”?</h2>\n  <p>This removes the project and its history for everyone.</p>\n  <Button commandfor={id} command="close">Cancel</Button>\n</Dialog>'
                }
            />
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
