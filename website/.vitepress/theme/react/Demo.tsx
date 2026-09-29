import { createContext, use, useId, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as styles from './Demo.css'

type DemoProps = {
    title: string
    badge?: string
    hint?: string
    unsupported?: string
    children: ReactNode
}

/** A file's highlighted source, from `import source from './File.tsx?source'`. */
export type Source = { lang: string; html: string }

/** The running demo's component and the styles it demonstrates, provided by the demo registry. */
export type DemoSource = { code: Source; styles: Source }
export const DemoSourceContext = createContext<DemoSource | null>(null)

const tabs = [
    { id: 'preview', label: 'Preview' },
    { id: 'code', label: 'Code' },
    { id: 'css', label: 'CSS' }
] as const
type Tab = (typeof tabs)[number]['id']

const keyMoves: Record<string, (index: number, count: number) => number> = {
    ArrowRight: (index, count) => (index + 1) % count,
    ArrowLeft: (index, count) => (index - 1 + count) % count,
    Home: () => 0,
    End: (_, count) => count - 1
}

/** Renders like a VitePress code block, so the site's copy button and theme colors apply. */
function CodeBlock({ lang, html }: Source) {
    return (
        <div
            className={`language-${lang} vp-adaptive-theme`}
            dangerouslySetInnerHTML={{
                __html: `<button title="Copy Code" class="copy"></button><span class="lang">${lang}</span>${html}`
            }}
        />
    )
}

/**
 * A live demo with Preview, Code, and CSS tabs. `vp-raw` keeps the page's Markdown styles out of
 * the title bar and preview; the code panels keep them, since they are VitePress code blocks.
 */
export function Demo({ title, badge, hint, unsupported, children }: DemoProps) {
    const source = use(DemoSourceContext)
    const [tab, setTab] = useState<Tab>('preview')
    const id = useId()

    // Tabs pattern: arrow keys, Home, and End move selection and focus together.
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const move = keyMoves[event.key]
        if (!move) {
            return
        }
        event.preventDefault()
        const next = move(
            tabs.findIndex((candidate) => candidate.id === tab),
            tabs.length
        )
        setTab(tabs[next].id)
        event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
    }

    const panel = (name: Tab) =>
        source
            ? { id: `${id}-${name}`, role: 'tabpanel', 'aria-labelledby': `${id}-${name}-tab`, hidden: tab !== name }
            : {}

    return (
        <figure className={styles.demo}>
            <figcaption className={`${styles.bar} vp-raw`}>
                <span className={styles.heading}>
                    <span className={styles.title}>{title}</span>
                    {badge ? <code className={styles.badge}>{badge}</code> : null}
                </span>
                {source ? (
                    <div className={styles.tabs} role="tablist" aria-label={`${title} demo`} onKeyDown={onKeyDown}>
                        {tabs.map(({ id: name, label }) => (
                            <button
                                key={name}
                                id={`${id}-${name}-tab`}
                                className={styles.tab}
                                type="button"
                                role="tab"
                                aria-selected={tab === name}
                                aria-controls={`${id}-${name}`}
                                tabIndex={tab === name ? 0 : -1}
                                onClick={() => setTab(name)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                ) : null}
            </figcaption>

            {/* The preview stays mounted while hidden, so switching tabs keeps its state. */}
            <div className={`${styles.stage} vp-raw`} {...panel('preview')}>
                {children}
                {unsupported ? (
                    <div className={styles.unsupported} role="status">
                        {unsupported}
                    </div>
                ) : null}
            </div>
            {source ? (
                <>
                    <div className={styles.code} {...panel('code')}>
                        <CodeBlock {...source.code} />
                    </div>
                    <div className={styles.code} {...panel('css')}>
                        <CodeBlock {...source.styles} />
                    </div>
                </>
            ) : null}
            {hint && tab === 'preview' ? <p className={`${styles.hint} vp-raw`}>{hint}</p> : null}
        </figure>
    )
}
