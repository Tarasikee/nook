import { useSyncExternalStore, type ComponentType } from 'react'
import { CodeContext } from './components/Code'
import { Search } from './components/Search'
import { pages, sections, type PageDefinition } from './pages'
import { useHydrated } from './useHydrated'

export type Heading = { id: string; text: string; level: number }
export type PageData = { path: string; outline: Heading[]; highlights: Record<string, string> }

const subscribeTheme = (listener: () => void) => {
    window.addEventListener('nook-theme', listener)
    return () => window.removeEventListener('nook-theme', listener)
}
const themeSnapshot = () => document.documentElement.classList.contains('dark')
const serverTheme = () => false

function ThemeToggle() {
    const hydrated = useHydrated()
    const dark = useSyncExternalStore(subscribeTheme, themeSnapshot, serverTheme)
    return (
        <button
            type="button"
            disabled={!hydrated}
            aria-label="Toggle color theme"
            aria-pressed={dark}
            className="cursor-pointer rounded-lg p-2 text-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => {
                const next = !dark
                document.documentElement.classList.toggle('dark', next)
                localStorage.setItem('nook-theme', next ? 'dark' : 'light')
                window.dispatchEvent(new Event('nook-theme'))
            }}
        >
            {dark ? '☀' : '◐'}
        </button>
    )
}

function Sidebar({ page }: { page: PageDefinition }) {
    const groupPages = pages.filter((candidate) => candidate.section === page.section && candidate.path !== '/')
    const groups = [...new Set(groupPages.map((candidate) => candidate.group))]
    return (
        <nav aria-label="Documentation navigation" className="space-y-6 text-sm">
            {groups.map((group) => (
                <div key={group}>
                    <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{group}</h2>
                    <ul className="space-y-1">
                        {groupPages
                            .filter((candidate) => candidate.group === group)
                            .map((candidate) => (
                                <li key={candidate.path}>
                                    <a
                                        href={candidate.path}
                                        aria-current={candidate.path === page.path ? 'page' : undefined}
                                        className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 aria-[current=page]:bg-emerald-50 aria-[current=page]:font-medium aria-[current=page]:text-emerald-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:aria-[current=page]:bg-emerald-950 dark:aria-[current=page]:text-emerald-300"
                                    >
                                        {candidate.title}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>
            ))}
        </nav>
    )
}

export function App({ page, Content, data }: { page: PageDefinition; Content: ComponentType; data: PageData }) {
    const siblings = pages.filter((candidate) => candidate.section === page.section && candidate.path !== '/')
    const current = siblings.indexOf(page)
    const previous = siblings[current - 1]
    const next = siblings[current + 1]
    const home = page.path === '/'

    return (
        <CodeContext value={data.highlights}>
            <a
                href="#content"
                className="fixed left-4 top-2 z-50 -translate-y-20 rounded-lg bg-emerald-700 p-3 text-white focus:translate-y-0"
            >
                Skip to content
            </a>
            <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <div className="mx-auto flex h-18 max-w-[1440px] items-center gap-3 px-5 lg:gap-6 lg:px-8">
                    <a
                        href="/"
                        aria-label="Nook home"
                        className="flex items-center gap-2 text-xl font-semibold tracking-tight"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="size-7 text-emerald-700"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path d="M4 20V4h5l6 11V4h5v16h-5L9 9v11Z" />
                        </svg>
                        Nook
                        <span className="ml-1 hidden rounded border border-slate-200 sm:inline px-1.5 py-0.5 text-[10px] font-normal tracking-normal text-slate-400 dark:border-slate-700">
                            preview
                        </span>
                    </a>
                    <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm lg:flex">
                        {sections.map((section) => (
                            <a
                                key={section.name}
                                href={section.path}
                                aria-current={section.name === page.section ? 'location' : undefined}
                                className="text-slate-500 hover:text-slate-950 aria-[current=location]:font-medium aria-[current=location]:text-emerald-700 dark:hover:text-white dark:aria-[current=location]:text-emerald-300"
                            >
                                {section.name}
                            </a>
                        ))}
                    </nav>
                    <div className="ml-auto flex items-center gap-2">
                        <Search />
                        <ThemeToggle />
                        <a
                            href="https://github.com/Tarasikee/nook"
                            className="hidden text-sm text-slate-500 hover:text-emerald-700 sm:block"
                        >
                            GitHub ↗
                        </a>
                    </div>
                    <details className="relative lg:hidden">
                        <summary className="cursor-pointer list-none rounded-lg border border-slate-200 p-2 text-sm dark:border-slate-700">
                            Menu
                        </summary>
                        <div className="absolute right-0 top-12 max-h-[75vh] w-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-950">
                            <nav
                                aria-label="Mobile navigation"
                                className="mb-6 flex flex-wrap gap-4 text-sm font-medium"
                            >
                                {sections.map((section) => (
                                    <a key={section.name} href={section.path}>
                                        {section.name}
                                    </a>
                                ))}
                            </nav>
                            {!home ? <Sidebar page={page} /> : null}
                        </div>
                    </details>
                </div>
            </header>
            {home ? (
                <main id="content" className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-24">
                    <Content />
                </main>
            ) : (
                <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_200px]">
                    <aside className="sticky top-18 hidden h-[calc(100vh-4.5rem)] overflow-y-auto border-r border-slate-200 px-5 py-10 dark:border-slate-800 lg:block">
                        <Sidebar page={page} />
                    </aside>
                    <main id="content" className="min-w-0 px-5 py-10 sm:px-10 lg:px-12">
                        <article className="mx-auto max-w-3xl">
                            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                                {page.group}
                            </p>
                            <h1 className="mb-5 text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
                            <div className="prose">
                                <Content />
                            </div>
                            <nav
                                aria-label="Previous and next pages"
                                className="mt-14 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800"
                            >
                                {previous ? (
                                    <a href={previous.path}>
                                        <span className="block text-xs text-slate-400">Previous</span>
                                        {previous.title}
                                    </a>
                                ) : (
                                    <span />
                                )}
                                {next ? (
                                    <a className="text-right" href={next.path}>
                                        <span className="block text-xs text-slate-400">Next</span>
                                        {next.title}
                                    </a>
                                ) : null}
                            </nav>
                        </article>
                    </main>
                    <aside className="sticky top-18 hidden h-fit max-h-[calc(100vh-4.5rem)] overflow-auto py-11 pr-5 xl:block">
                        <nav aria-label="On this page" className="space-y-3 text-xs text-slate-500">
                            <p className="font-medium text-slate-800 dark:text-slate-200">On this page</p>
                            {data.outline.map((heading) => (
                                <a
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    className={`block hover:text-emerald-700 ${heading.level === 3 ? 'pl-3' : ''}`}
                                >
                                    {heading.text}
                                </a>
                            ))}
                        </nav>
                    </aside>
                </div>
            )}
            <footer className="border-t border-slate-200 px-5 py-7 text-center text-xs text-slate-400 dark:border-slate-800">
                Built on native HTML. Components you own.{' '}
                <a href="https://github.com/Tarasikee/nook/blob/main/LICENSE" className="underline underline-offset-4">
                    MIT licensed.
                </a>
            </footer>
        </CodeContext>
    )
}
