<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Row = {
    capability: string
    usedBy: string
    chrome: string
    firefox: string
    safari: string
    detect?: () => boolean
}

const rows: Row[] = [
    {
        capability: 'Popover API',
        usedBy: 'usePopover, useTooltip',
        chrome: '114',
        firefox: '125',
        safari: '17',
        detect: () => 'showPopover' in HTMLElement.prototype
    },
    {
        capability: 'popovertarget invoker',
        usedBy: 'usePopover',
        chrome: '114',
        firefox: '125',
        safari: '17',
        detect: () => 'popoverTargetElement' in HTMLButtonElement.prototype
    },
    {
        capability: 'popover="hint"',
        usedBy: 'useTooltip',
        chrome: '151',
        firefox: '153',
        safari: 'Preview',
        detect: () => {
            const element = document.createElement('div')
            element.setAttribute('popover', 'hint')
            return element.popover === 'hint'
        }
    },
    {
        capability: 'interestfor',
        usedBy: 'useTooltip',
        chrome: '142',
        firefox: 'No',
        safari: 'No',
        detect: () => Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement')
    },
    {
        capability: 'interest-delay',
        usedBy: 'Tooltip timing',
        chrome: '142',
        firefox: 'No',
        safari: 'No',
        detect: () => CSS.supports('interest-delay', '0s')
    },
    {
        capability: 'showPopover({ source })',
        usedBy: 'show(), controlled open',
        chrome: '137',
        firefox: '144',
        safari: '26'
    },
    {
        capability: 'Implicit invoker anchor',
        usedBy: 'Positioning recipes',
        chrome: '133',
        firefox: '147',
        safari: '26'
    },
    {
        capability: 'position-area',
        usedBy: 'Positioning recipes',
        chrome: '129',
        firefox: '147',
        safari: '26',
        detect: () => CSS.supports('position-area', 'top')
    },
    {
        capability: '@starting-style',
        usedBy: 'Animation recipes',
        chrome: '117',
        firefox: '129',
        safari: '17.5',
        detect: () => 'CSSStartingStyleRule' in window
    },
    {
        capability: 'transition-behavior',
        usedBy: 'Animation recipes',
        chrome: '117',
        firefox: '129',
        safari: '17.4',
        detect: () => CSS.supports('transition-behavior', 'allow-discrete')
    },
    {
        capability: 'overlay transition',
        usedBy: 'Animation recipes',
        chrome: '117',
        firefox: 'No',
        safari: 'No',
        detect: () => CSS.supports('overlay', 'auto')
    }
]

const results = ref<Record<string, boolean | undefined>>({})

onMounted(() => {
    const next: Record<string, boolean | undefined> = {}
    for (const row of rows) {
        next[row.capability] = row.detect?.()
    }
    results.value = next
})

function status(capability: string) {
    if (!(capability in results.value)) return { label: '…', tone: 'pending' }
    const result = results.value[capability]
    if (result === undefined) return { label: 'Not detectable', tone: 'unknown' }
    return result ? { label: 'Detected', tone: 'yes' } : { label: 'Missing', tone: 'no' }
}

function tone(version: string) {
    if (version === 'No') return 'no'
    if (version === 'Preview') return 'partial'
    return 'yes'
}
</script>

<template>
    <div class="nk-support">
        <table>
            <thead>
                <tr>
                    <th scope="col">Capability</th>
                    <th scope="col">Used by</th>
                    <th scope="col">Chrome</th>
                    <th scope="col">Firefox</th>
                    <th scope="col">Safari</th>
                    <th scope="col">This browser</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows" :key="row.capability">
                    <th scope="row"><code>{{ row.capability }}</code></th>
                    <td class="nk-support__used">{{ row.usedBy }}</td>
                    <td><span class="nk-version" :data-tone="tone(row.chrome)">{{ row.chrome }}</span></td>
                    <td><span class="nk-version" :data-tone="tone(row.firefox)">{{ row.firefox }}</span></td>
                    <td><span class="nk-version" :data-tone="tone(row.safari)">{{ row.safari }}</span></td>
                    <td>
                        <span class="nk-detect" :data-tone="status(row.capability).tone">
                            {{ status(row.capability).label }}
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.nk-support {
    margin: 1.25rem 0;
    overflow-x: auto;
}

.nk-support table {
    margin: 0;
}

.nk-support th[scope='row'] {
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.86rem;
    white-space: nowrap;
}

.nk-support__used {
    color: var(--vp-c-text-2);
    font-size: 0.82rem;
}

.nk-version,
.nk-detect {
    display: inline-block;
    padding: 0.1rem 0.45rem;
    border-radius: 5px;
    font-family: var(--vp-font-family-mono);
    font-size: 0.78rem;
    white-space: nowrap;
}

.nk-version[data-tone='yes'] {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
}

[data-tone='partial'] {
    color: var(--vp-c-warning-1);
    background: var(--vp-c-warning-soft);
}

[data-tone='no'] {
    color: var(--vp-c-danger-1);
    background: var(--vp-c-danger-soft);
}

.nk-detect[data-tone='yes'] {
    color: var(--vp-c-success-1);
    background: var(--vp-c-success-soft);
}

.nk-detect[data-tone='unknown'],
.nk-detect[data-tone='pending'] {
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft);
}
</style>

