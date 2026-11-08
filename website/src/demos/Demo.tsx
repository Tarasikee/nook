import { createContext, use, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Code } from '../components/Code'
import { useHydrated } from '../useHydrated'

export const DemoSourceContext = createContext<string | null>(null)

export function Demo({
    title,
    badge,
    hint,
    unsupported,
    children
}: {
    title: string
    badge?: string
    hint?: string
    unsupported?: string
    children: ReactNode
}) {
    const source = use(DemoSourceContext)
    const hydrated = useHydrated()
    const [tab, setTab] = useState<'preview' | 'code'>('preview')
    const id = useId()
    const tabs = ['preview', 'code'] as const
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
        event.preventDefault()
        const next =
            event.key === 'Home' ? 'preview' : event.key === 'End' ? 'code' : tab === 'preview' ? 'code' : 'preview'
        setTab(next)
        event.currentTarget.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus()
    }
    return (
        <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 text-sm dark:border-slate-800">
                <span className="font-medium">
                    {title}{' '}
                    {badge ? <span className="ml-2 font-mono text-xs font-normal text-slate-400">{badge}</span> : null}
                </span>
                {source ? (
                    <div
                        role="tablist"
                        aria-label={`${title} demo`}
                        onKeyDown={onKeyDown}
                        className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900"
                    >
                        {tabs.map((name) => (
                            <button
                                key={name}
                                type="button"
                                disabled={!hydrated}
                                role="tab"
                                data-tab={name}
                                id={`${id}-${name}-tab`}
                                aria-controls={`${id}-${name}`}
                                aria-selected={tab === name}
                                tabIndex={tab === name ? 0 : -1}
                                onClick={() => setTab(name)}
                                className="cursor-pointer rounded-md px-3 py-1 text-xs capitalize aria-selected:bg-white aria-selected:text-slate-900 aria-selected:shadow-sm dark:aria-selected:bg-slate-700 dark:aria-selected:text-white"
                            >
                                {name === 'code' ? 'Code' : 'Preview'}
                            </button>
                        ))}
                    </div>
                ) : null}
            </figcaption>
            <div
                id={`${id}-preview`}
                role={source ? 'tabpanel' : undefined}
                aria-labelledby={source ? `${id}-preview-tab` : undefined}
                hidden={tab !== 'preview'}
                className="flex min-h-48 flex-wrap items-center justify-center gap-5 bg-slate-50/60 px-5 py-12 dark:bg-slate-900/30"
            >
                {children}
                {unsupported ? (
                    <p role="status" className="w-full text-center text-xs text-amber-700">
                        {unsupported}
                    </p>
                ) : null}
            </div>
            {source ? (
                <div
                    id={`${id}-code`}
                    role="tabpanel"
                    aria-labelledby={`${id}-code-tab`}
                    hidden={tab !== 'code'}
                    className="px-3"
                >
                    <Code code={source} />
                </div>
            ) : null}
            {hint && tab === 'preview' ? (
                <p className="border-t border-slate-200 px-5 py-3 text-xs leading-relaxed text-slate-500 dark:border-slate-800">
                    {hint}
                </p>
            ) : null}
        </figure>
    )
}
