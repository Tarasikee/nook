import results from '../bench-results.json'

type Row = Record<string, string | number | boolean>

const labels: Record<string, string> = {
    commitMs: 'React commit (ms)',
    firstFrameMs: 'To first frame (ms)',
    heapMB: 'JS heap (MB)',
    domNodes: 'DOM elements',
    rerenderMs: 'Re-render all (ms)',
    openMs: 'Click → placed (ms)',
    hoverMs: 'Hover → placed (ms)',
    scriptMs: 'Script (ms)',
    styleLayoutMs: 'Style + layout (ms)',
    avgFrameMs: 'Avg frame (ms)',
    placed: 'Correctly placed',
    shown: 'Tooltip shown'
}

const titles: Record<string, string> = {
    mount: 'Mount',
    rerender: 'Parent re-render',
    open: 'Open a popover',
    hover: 'Show a tooltip',
    sweep: 'Pointer sweep across 30 tooltips',
    scroll: 'Scroll 60 frames with a popover open'
}

const libraryNames: Record<string, string> = { nook: 'Nook', radix: 'Radix', floating: 'Floating UI' }

const metrics = (rows: Row[]) => Object.keys(rows[0]).filter((key) => key in labels)

/** Lowest value wins for every numeric metric; booleans are checks, not scores. */
const best = (rows: Row[], key: string) => {
    const values = rows.map((row) => row[key]).filter((value): value is number => typeof value === 'number')
    return values.length ? Math.min(...values) : undefined
}

const format = (value: Row[string]) => (typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value))
const date = new Date(results.date).toISOString().slice(0, 10)

export function BenchResults() {
    return (
        <div>
            <p className="my-5 text-sm text-slate-500">
                Chromium {results.browser}, CPU slowed ×{results.cpu}, median of {results.runs} fresh page loads,
                measured {date}. Lower is better; the best value in each column is highlighted.
            </p>
            <h3 id="bundle-size">Bundle size added over React</h3>
            <div className="my-6 overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            {results.sizes.map((size) => (
                                <th key={size.lib} scope="col">
                                    {libraryNames[size.lib]}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {results.sizes.map((size) => (
                                <td key={size.lib}>{size.addedKB} KB</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            {results.results.map((result) => (
                <section key={result.scenario + '-' + result.count}>
                    <h3 className="mt-8 mb-4 text-lg font-semibold" id={result.scenario + '-' + result.count}>
                        {titles[result.scenario]}, {result.count} items
                    </h3>
                    <div className="my-6 overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Library</th>
                                    {metrics(result.rows as Row[]).map((key) => (
                                        <th key={key} scope="col">
                                            {labels[key]}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(result.rows as Row[]).map((row) => (
                                    <tr key={String(row.lib)}>
                                        <th scope="row">{libraryNames[String(row.lib)]}</th>
                                        {metrics(result.rows as Row[]).map((key) => (
                                            <td
                                                key={key}
                                                title={row[key + ' range'] ? 'range ' + row[key + ' range'] : undefined}
                                                className={
                                                    row[key] === best(result.rows as Row[], key)
                                                        ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                        : undefined
                                                }
                                            >
                                                {format(row[key])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ))}
        </div>
    )
}
