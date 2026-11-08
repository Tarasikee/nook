import { BenchResults } from '../../components/BenchResults'

export default function GuidePerformancePage() {
    return (
        <>
            <p className="lead">
                Native primitives move work from JavaScript into the browser. This page measures the gain and the cost
                against Radix and Floating UI.
            </p>

            <p>
                Each library builds the same screen: items with a hover tooltip and a click popover, written as each
                library documents. Production builds, React Compiler for every library's app code, equal placements,
                offsets, and zero tooltip delay. Open and hover times stop only when the surface is visible{' '}
                <strong>and</strong> in its final position.
            </p>

            <BenchResults />

            <h2 id="reading-the-results">Reading the results</h2>

            <ul>
                <li>
                    <strong>Nook runs less JavaScript:</strong> no positioning code, portals, or per-item state
                    machines. That shows in bundle size, mount, re-render, heap, open and hover time, and script time
                    while moving the pointer or scrolling.
                </li>
                <li>
                    <strong>Nook costs more DOM:</strong> it renders hidden content up front, while the others mount it
                    on open. It also does more browser style and layout work during a pointer sweep.
                </li>
                <li>
                    <strong>Limits:</strong> Chromium only, one machine, a synthetic screen with slowed CPU. Measure
                    your own interface.
                </li>
                <li>
                    <strong>Fairness note:</strong> reading Floating UI's <code>refs.*</code> inline during render makes
                    React Compiler skip the component, so the benchmark destructures the setters first. The run refuses
                    to start unless every item compiles.
                </li>
            </ul>

            <p>
                Reproduce with <code>pnpm bench</code>; <code>pnpm bench --publish</code> updates this page. The code is
                in <code>bench/</code>.
            </p>
        </>
    )
}
