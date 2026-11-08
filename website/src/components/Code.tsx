import { createContext, use, useEffect, useState } from 'react'
import { useHydrated } from '../useHydrated'

export const CodeContext = createContext<Record<string, string>>({})

export function Code({ code, language = 'tsx', title }: { code: string; language?: string; title?: string }) {
    const highlights = use(CodeContext)
    const hydrated = useHydrated()
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
    const source = code.trim()
    const key = encodeURIComponent(JSON.stringify([language, source]))
    const html = highlights[key]

    useEffect(() => {
        if (copyState === 'idle') return
        const timer = setTimeout(() => setCopyState('idle'), 1500)
        return () => clearTimeout(timer)
    }, [copyState])

    return (
        <div className="code-block group relative my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 font-mono text-xs text-slate-500 dark:border-slate-800">
                <span>{title ?? language}</span>
                <button
                    type="button"
                    disabled={!hydrated}
                    aria-label="Copy code"
                    className="cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-300"
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(source)
                            setCopyState('copied')
                        } catch {
                            setCopyState('failed')
                        }
                    }}
                >
                    {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy'}
                </button>
            </div>
            {html ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
                <pre data-language={language} data-source={key}>
                    <code>{source}</code>
                </pre>
            )}
        </div>
    )
}
