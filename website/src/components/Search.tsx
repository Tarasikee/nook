import { useEffect, useId, useRef, useState } from 'react'
import { useHydrated } from '../useHydrated'

export type SearchEntry = { path: string; title: string; description: string; text: string }

export function Search() {
    const hydrated = useHydrated()
    const dialog = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const [query, setQuery] = useState('')
    const [entries, setEntries] = useState<SearchEntry[] | null>(null)
    const [error, setError] = useState(false)

    async function open() {
        dialog.current?.showModal()
        if (entries) return
        setError(false)
        try {
            const response = await fetch('/search.json')
            if (!response.ok) throw new Error('Search is unavailable')
            setEntries(await response.json())
        } catch {
            setError(true)
        }
    }

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (document.querySelector('dialog:modal')) return
            if (
                event.target instanceof HTMLElement &&
                event.target.closest('input, textarea, select, [contenteditable]')
            )
                return
            if (event.key === '/' || (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) {
                event.preventDefault()
                void open()
            }
        }
        window.addEventListener('keydown', listener)
        return () => window.removeEventListener('keydown', listener)
    })

    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
    const results = (entries ?? [])
        .filter((entry) =>
            words.every((word) => `${entry.title} ${entry.description} ${entry.text}`.toLowerCase().includes(word))
        )
        .sort(
            (a, b) =>
                Number(b.title.toLowerCase().includes(query.toLowerCase())) -
                Number(a.title.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 8)

    return (
        <>
            <button
                type="button"
                disabled={!hydrated}
                onClick={() => void open()}
                className="flex cursor-pointer items-center gap-8 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:border-slate-400 dark:border-slate-800"
                aria-label="Search documentation"
            >
                <span>Search</span>
                <kbd className="hidden text-xs sm:inline">⌘ K</kbd>
            </button>
            <dialog
                ref={dialog}
                aria-labelledby={titleId}
                className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl backdrop:bg-slate-950/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                onClick={(event) => {
                    if (event.target === event.currentTarget) dialog.current?.close()
                }}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 id={titleId} className="font-semibold">
                        Search documentation
                    </h2>
                    <button
                        type="button"
                        onClick={() => dialog.current?.close()}
                        className="cursor-pointer rounded border border-slate-300 px-2 py-1 text-xs dark:border-slate-700"
                    >
                        Close
                    </button>
                </div>
                <input
                    aria-label="Search query"
                    autoFocus
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-3 outline-emerald-600 dark:border-slate-600"
                    placeholder="Components, native APIs, examples…"
                />
                <div className="mt-4 max-h-[50vh] overflow-auto" aria-live="polite">
                    {error ? (
                        <p role="status">Search could not load. Try opening it again.</p>
                    ) : !entries ? (
                        <p>Loading search…</p>
                    ) : !words.length ? (
                        <p className="text-sm text-slate-500">Type to search all pages.</p>
                    ) : results.length ? (
                        <ul className="space-y-1">
                            {results.map((entry) => (
                                <li key={entry.path}>
                                    <a
                                        className="block rounded-lg p-3 hover:bg-slate-50 focus:bg-slate-50 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                                        href={entry.path}
                                    >
                                        <strong className="block text-sm">{entry.title}</strong>
                                        <span className="text-xs text-slate-500">{entry.description}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No pages found.</p>
                    )}
                </div>
            </dialog>
        </>
    )
}
