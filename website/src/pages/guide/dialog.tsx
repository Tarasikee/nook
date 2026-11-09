import { Code } from '../../components/Code'
import { examples } from '../../demos/examples'

export default function GuideDialogPage() {
    return (
        <>
            <p className="lead">
                A modal dialog needs no hook. Use native <code>&lt;dialog&gt;</code> and command buttons directly, or
                Nook's styled React <code>Dialog</code>. The browser handles focus, dismissal, and the inert background.
            </p>

            <h2 id="markup">Markup</h2>

            <Code
                code={
                    '<button commandfor="confirm" command="show-modal">Delete project</button>\n\n<dialog id="confirm" aria-labelledby="confirm-title">\n  <h2 id="confirm-title">Delete “Atlas”?</h2>\n  <p>This removes the project for everyone.</p>\n  <button commandfor="confirm" command="close">Cancel</button>\n  <button>Delete</button>\n</dialog>\n'
                }
                language="html"
            />
            <p>
                Name the dialog with <code>aria-labelledby</code> on its heading, as <code>titleProps</code> does for a
                popover.
            </p>

            <h2 id="styled-react-component">Styled React component</h2>

            <p>
                For a styled version, use <code>Dialog</code> with your own command buttons from <code>@nook/ui</code>,
                described with a live demo in <a href="/ui/dialog">Nook UI: Dialog</a>.
            </p>

            <h2 id="behavior">Behavior</h2>

            <ul>
                <li>Opening moves focus to the first focusable element inside.</li>
                <li>While it is open, the rest of the page cannot be focused or clicked.</li>
                <li>
                    <kbd>Esc</kbd> or <code>command="close"</code> closes it and returns focus to the button that opened
                    it.
                </li>
                <li>
                    A backdrop click does not close it. Add <code>closedby="any"</code> to close on a backdrop click.
                </li>
                <li>
                    Inert does not stop key listeners on <code>window</code> or <code>document</code>. Skip app-wide
                    shortcuts while <code>document.querySelector('dialog:modal')</code> matches, or they act on the page
                    behind the dialog.
                </li>
            </ul>

            <p>
                For content that should not block the page, use a <a href="/guide/popover">popover</a> instead.
            </p>

            <h2 id="reading-state-in-react">Reading state in React</h2>

            <p>
                The <code>open</code> attribute tracks every open and close, including <kbd>Esc</kbd>, so observe it
                instead of keeping a second copy of the state:
            </p>

            <Code code={examples['dialog-state']} />
            <h2 id="browser-support">Browser support</h2>

            <p>
                <code>command</code> and <code>commandfor</code> need Chrome 135, Firefox 144, or Safari 26.2. The
                behavior on this page is verified in Chromium 145, including <code>closedby</code>; other browsers are
                not verified yet.
            </p>
        </>
    )
}
