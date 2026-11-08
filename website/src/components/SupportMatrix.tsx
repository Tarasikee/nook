import { useSyncExternalStore } from 'react'

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

const subscribeNever = () => () => {}
const snapshot = () =>
    rows.map((row) => (row.detect ? (row.detect() ? 'Detected' : 'Missing') : 'Not detectable')).join(',')

export function SupportMatrix() {
    const detected = useSyncExternalStore(subscribeNever, snapshot, () => '')
    const values = detected.split(',')
    return (
        <div className="my-6 overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        {['Capability', 'Used by', 'Chrome', 'Firefox', 'Safari', 'This browser'].map((label) => (
                            <th key={label} scope="col">
                                {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.capability}>
                            <th scope="row">
                                <code>{row.capability}</code>
                            </th>
                            <td>{row.usedBy}</td>
                            {[row.chrome, row.firefox, row.safari].map((version, index) => (
                                <td key={index}>
                                    <span
                                        className={
                                            version === 'No'
                                                ? 'text-rose-600'
                                                : version === 'Preview'
                                                  ? 'text-amber-600'
                                                  : 'text-emerald-700 dark:text-emerald-400'
                                        }
                                    >
                                        {version}
                                    </span>
                                </td>
                            ))}
                            <td
                                className={
                                    values[index] === 'Detected'
                                        ? 'text-emerald-700 dark:text-emerald-400'
                                        : 'text-slate-400'
                                }
                            >
                                {values[index] || '…'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
