<script setup lang="ts">
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
</script>

<template>
    <div class="nk-bench">
        <p class="nk-bench__meta">
            Chromium {{ results.browser }}, CPU slowed ×{{ results.cpu }}, median of {{ results.runs }} fresh page
            loads, measured {{ date }}. Lower is better; the best value in each column is highlighted.
        </p>

        <h3>Bundle size added over React</h3>
        <table>
            <thead>
                <tr>
                    <th v-for="size in results.sizes" :key="size.lib" scope="col">{{ libraryNames[size.lib] }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td v-for="size in results.sizes" :key="size.lib">{{ size.addedKB }} KB</td>
                </tr>
            </tbody>
        </table>

        <template v-for="result in results.results" :key="`${result.scenario}-${result.count}`">
            <h3>{{ titles[result.scenario] }}, {{ result.count }} items</h3>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Library</th>
                        <th v-for="key in metrics(result.rows as Row[])" :key="key" scope="col">{{ labels[key] }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in result.rows as Row[]" :key="String(row.lib)">
                        <th scope="row">{{ libraryNames[String(row.lib)] }}</th>
                        <td
                            v-for="key in metrics(result.rows as Row[])"
                            :key="key"
                            :class="{ 'nk-bench__best': row[key] === best(result.rows as Row[], key) }"
                            :title="row[`${key} range`] ? `range ${row[`${key} range`]}` : undefined"
                        >
                            {{ format(row[key]) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </template>
    </div>
</template>

<style scoped>
.nk-bench {
    & h3 {
        margin-top: 1.75rem;
    }

    & td {
        font-family: var(--vp-font-family-mono);
        font-size: 0.82rem;
        white-space: nowrap;
    }
}

.nk-bench__meta {
    color: var(--vp-c-text-2);
    font-size: 0.88rem;
}

.nk-bench__best {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    font-weight: 700;
}
</style>
