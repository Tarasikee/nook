import { Code } from '../../components/Code'
import { ReactDemo } from '../../components/ReactDemo'
import { examples } from '../../demos/examples'

export default function GuideGettingStartedPage() {
    return (
        <>
            <p className="lead">
                Copy a component into your app. Keep its source, Tailwind classes, and native browser behavior.
            </p>
            <h2 id="install">Build the registry</h2>
            <p>
                Nook is an early preview. Start from this checkout with Node.js and pnpm. Your app needs React 19.2+,
                Tailwind CSS v4.3+, and a shadcn <code>components.json</code>.
            </p>
            <Code
                language="sh"
                code={
                    'git clone https://github.com/Tarasikee/nook.git\ncd nook\npnpm install\npnpm build:registry\npnpm exec nook add button popover --cwd ../your-app'
                }
            />
            <p>
                The CLI copies the selected component and its local helpers into your configured UI directory and
                installs its npm dependencies. It does not add a Nook runtime package.
            </p>
            <h2 id="use-the-component">Use the component</h2>
            <Code code={examples['ui-popover']} />
            <p>
                Install <code>Button</code> separately, or use a native button as the trigger. Import paths follow the
                aliases in your app.
            </p>
            <h2 id="native-behavior">Native behavior</h2>
            <p>
                Click to open, click outside or press <kbd>Escape</kbd> to dismiss. The browser handles the top layer
                and anchor positioning. The low-level hook demo below shows the same native relationships on your own
                markup.
            </p>
            <ReactDemo name="popover" />
            <h2 id="next">Next</h2>
            <ul>
                <li>
                    <a href="/ui/">Browse the components</a> for ready-made buttons, tooltips, popovers, and dialogs.
                </li>
                <li>
                    <a href="/guide/popover">Read the Popover guide</a> for controlled state and imperative opening.
                </li>
                <li>
                    <a href="/guide/browser-support">Check browser support</a> before choosing native capabilities for
                    your app.
                </li>
            </ul>
        </>
    )
}
