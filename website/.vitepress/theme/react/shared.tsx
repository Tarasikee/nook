import { useSyncExternalStore, type ReactNode } from 'react'

type Requirement = 'popover' | 'interest'

const messages: Record<Requirement, string> = {
    popover: 'This demo needs the native Popover API, which this browser does not provide.',
    interest: 'Tooltips use the interestfor attribute, currently available only in Chromium 142 and later.'
}

const supported: Record<Requirement, () => boolean> = {
    popover: () => 'showPopover' in HTMLElement.prototype,
    interest: () => Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement')
}

// Feature support never changes during a session, so there is nothing to subscribe to.
const subscribeNever = () => () => {}

/** Returns a message when the browser lacks something a demo needs, or an empty string. */
export function useUnsupported(requirements: Requirement[]): string {
    return useSyncExternalStore(
        subscribeNever,
        () =>
            requirements.map((requirement) => (supported[requirement]() ? '' : messages[requirement])).find(Boolean) ??
            '',
        () => ''
    )
}

/** Whether the browser supports CSS anchor positioning with `position-area`. */
export function useAnchorPositioning(): boolean {
    return useSyncExternalStore(
        subscribeNever,
        () => CSS.supports('position-area', 'top'),
        () => true
    )
}

type DemoProps = {
    title: string
    badge?: string
    hint?: string
    unsupported?: string
    children: ReactNode
}

export function Demo({ title, badge, hint, unsupported, children }: DemoProps) {
    return (
        <figure className="nk-demo vp-raw">
            <figcaption className="nk-demo__bar">
                <span className="nk-demo__title">{title}</span>
                {badge ? <code className="nk-demo__badge">{badge}</code> : null}
            </figcaption>
            <div className="nk-stage">
                {children}
                {unsupported ? (
                    <div className="nk-demo__unsupported" role="status">
                        {unsupported}
                    </div>
                ) : null}
            </div>
            {hint ? <p className="nk-demo__hint">{hint}</p> : null}
        </figure>
    )
}

const paths = {
    archive: 'M3 4h18v5H3zM5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4',
    bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
    bold: 'M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z',
    italic: 'M19 4h-9M14 20H5M15 4 9 20',
    link: 'M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v12M7 8l5-5 5 5',
    star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z'
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={name === 'more' ? 3 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d={paths[name]} />
        </svg>
    )
}
