import { Code } from '../components/Code'
import { HeroDemo } from '../demos/HeroDemo'

const components = [
    { name: 'Button', path: '/ui/button', detail: 'A native button with CVA variants.' },
    { name: 'Popover', path: '/ui/popover', detail: 'Click to open. Escape to close. The browser handles it.' },
    { name: 'Tooltip', path: '/ui/tooltip', detail: 'Hover and focus hints through interest invokers.' },
    { name: 'Dialog', path: '/ui/dialog', detail: 'Native modal focus, dismissal, and an inert background.' }
]

export default function HomePage() {
    return (
        <>
            <section className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
                <div>
                    <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-[10px] tracking-wide text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        React 19 · Tailwind 4 · Native HTML
                    </p>
                    <h1 className="text-5xl font-semibold leading-[1.06] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                        Native HTML.
                        <br />
                        <span className="text-emerald-700 dark:text-emerald-400">
                            Components
                            <br />
                            you own.
                        </span>
                    </h1>
                    <p className="mb-8 mt-6 max-w-md text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                        Accessible React components built on the browser. Copy the source into your app, style it with
                        Tailwind, and make it yours.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800"
                            href="/guide/getting-started"
                        >
                            Get started →
                        </a>
                        <a
                            className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium hover:border-slate-400 dark:border-slate-700"
                            href="/ui/"
                        >
                            Browse components
                        </a>
                    </div>
                    <p className="mt-5 font-mono text-[10px] text-slate-400">
                        No positioning library. No portal. No Nook runtime package.
                    </p>
                </div>
                <div className="min-w-0">
                    <HeroDemo />
                    <p className="mt-4 text-center text-xs text-slate-400">
                        Click Share. Hover the icons. These are the real components.
                    </p>
                </div>
            </section>
            <section className="mt-24 grid gap-6 border-y border-slate-200 py-10 sm:grid-cols-3 dark:border-slate-800">
                {[
                    ['HTML comes first', 'Popover invokers and dialog commands work before React hydrates.'],
                    [
                        'Source, not a dependency',
                        'Install individual components with the CLI. Every file becomes yours.'
                    ],
                    [
                        'The browser does the work',
                        'Native top-layer rendering, dismissal, focus, and CSS anchor positioning.'
                    ]
                ].map(([title, detail]) => (
                    <div key={title}>
                        <h2 className="mb-2 text-sm font-semibold">{title}</h2>
                        <p className="text-sm leading-relaxed text-slate-500">{detail}</p>
                    </div>
                ))}
            </section>
            <section className="mt-16">
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                            Start with one
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight">Small pieces. Real behavior.</h2>
                    </div>
                    <a href="/examples/" className="text-sm text-slate-500 hover:text-emerald-700">
                        See examples ↗
                    </a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {components.map((component, index) => (
                        <a
                            key={component.path}
                            href={component.path}
                            className="group rounded-xl border border-slate-200 p-5 transition-colors hover:border-emerald-500 dark:border-slate-800"
                        >
                            <div className="mb-7 grid h-20 place-items-center rounded-lg bg-slate-50 font-mono text-sm text-slate-400 dark:bg-slate-900">
                                {index === 0 ? (
                                    <span className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                                        Continue
                                    </span>
                                ) : (
                                    <span>&lt;{component.name} /&gt;</span>
                                )}
                            </div>
                            <h3 className="mb-2 text-sm font-semibold group-hover:text-emerald-700">
                                {component.name} ↗
                            </h3>
                            <p className="text-xs leading-relaxed text-slate-500">{component.detail}</p>
                        </a>
                    ))}
                </div>
            </section>
            <section className="mt-16 grid items-center gap-8 sm:grid-cols-2">
                <div>
                    <h2 className="mb-3 text-2xl font-semibold tracking-tight">Add a component. Keep the source.</h2>
                    <p className="text-sm leading-relaxed text-slate-500">
                        Build the registry from this checkout, then point the CLI at your Tailwind app. Only the
                        selected component and its local helpers are copied.
                    </p>
                </div>
                <Code language="sh" code={'pnpm build:registry\npnpm exec nook add popover --cwd ../your-app'} />
            </section>
        </>
    )
}
