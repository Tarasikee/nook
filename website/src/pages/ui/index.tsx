import { Code } from '../../components/Code'

const items = [
    {
        name: 'Button',
        path: '/ui/button',
        detail: 'A native button with CVA variants, icon sizing, and utility overrides.'
    },
    { name: 'TooltipBody', path: '/ui/tooltip', detail: 'Browser-driven hover and focus hints, with grouped delays.' },
    {
        name: 'PopoverBody',
        path: '/ui/popover',
        detail: 'Native light dismissal, anchor positioning, and optional controlled state.'
    },
    {
        name: 'Dialog',
        path: '/ui/dialog',
        detail: 'Modal focus, an inert background, and declarative open and close buttons.'
    }
]

export default function UiIndexPage() {
    return (
        <>
            <p className="lead">
                Ready-made React components built on native elements. Copy the source, then change it in your app.
            </p>
            <div className="my-8 grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                    <a
                        key={item.path}
                        href={item.path}
                        className="rounded-xl border border-slate-200 p-5 hover:border-emerald-500 dark:border-slate-800"
                    >
                        <h2 className="mb-2 font-semibold text-slate-900 dark:text-white">{item.name} ↗</h2>
                        <p className="text-sm leading-relaxed text-slate-500">{item.detail}</p>
                    </a>
                ))}
            </div>
            <h2 id="installation">Installation</h2>
            <p>
                In a checkout with its registry built, point the CLI at a React 19.2+ app configured for Tailwind v4.3+
                and shadcn.
            </p>
            <Code language="sh" code={'pnpm build:registry\npnpm exec nook add button tooltip --cwd ../your-app'} />
            <Code
                code={
                    "import { Button } from '@/components/ui/Button'\nimport { TooltipBody } from '@/components/ui/Tooltip'\nimport { useTooltip } from '@/components/ui/use-tooltip'\n\nconst tooltip = useTooltip()\n\n<Button {...tooltip.triggerProps}>Save</Button>\n<TooltipBody {...tooltip.contentProps}>Save changes</TooltipBody>"
                }
            />
            <h2 id="styling">Styling</h2>
            <p>
                Styles live in Tailwind utility classes. There are no component CSS imports. Button variants use CVA;{' '}
                <code>className</code> overrides are merged with <code>tailwind-merge</code>. Change the copied source
                for a different palette or shape.
            </p>
            <h2 id="native-by-default">Native by default</h2>
            <p>
                Buttons remain buttons. Popovers and tooltips use native invokers, the top layer, and CSS anchor
                positioning. Dialogs use <code>commandfor</code> and <code>show-modal</code>. Opening and closing
                already work in server-rendered HTML.
            </p>
            <p>
                Tooltip descriptions are present before hover, popovers are labeled by their titles, and the components
                include focus indicators, dark variants, and reduced-motion handling.
            </p>
        </>
    )
}
