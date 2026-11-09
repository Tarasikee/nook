import { ReactDemo } from '../../components/ReactDemo'
import { Code } from '../../components/Code'

export default function UiButtonPage() {
    return (
        <>
            <p className="lead">
                A native <code>&lt;button&gt;</code> in Nook's style. Every prop you pass reaches the element.
            </p>

            <ReactDemo name="ui-button" />

            <Code code={'<Button variant="primary" type="submit">Save changes</Button>'} />
            <div className="my-6 overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Values</th>
                            <th>Default</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <code>variant</code>
                            </td>
                            <td>
                                <code>'primary' | 'secondary' | 'ghost'</code>
                            </td>
                            <td>
                                <code>'secondary'</code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>size</code>
                            </td>
                            <td>
                                <code>'medium' | 'small'</code>
                            </td>
                            <td>
                                <code>'medium'</code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>icon</code>
                            </td>
                            <td>
                                <code>boolean</code>, square for one icon
                            </td>
                            <td>
                                <code>false</code>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <code>type</code>
                            </td>
                            <td>native button type</td>
                            <td>
                                <code>'button'</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p>
                Other props, including <code>ref</code>, go to the <code>&lt;button&gt;</code>.
            </p>

            <ul>
                <li>
                    <strong>Name icon buttons:</strong> <code>aria-label</code>, or wrap them in a{' '}
                    <a href="/ui/tooltip">Tooltip</a> with <code>useTooltip({"{ role: 'label' }"})</code>.
                </li>
            </ul>
        </>
    )
}
