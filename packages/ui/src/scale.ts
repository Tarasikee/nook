/*
 * Tailwind CSS v4 default theme values, copied so @nook/ui needs no Tailwind. Internal: styles build on
 * these, and only the themeable values in `tokens.css.ts` become custom properties.
 */

/** Tailwind's spacing scale: `space(4)` is `p-4`, 1rem. */
export const space = (step: number) => `${step * 0.25}rem`

/** Font sizes with their paired line heights, as `text-xs`, `text-sm`, … set them. */
export const text = {
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    base: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' }
} as const

export const weight = { medium: 500, semibold: 600 } as const

export const trackingTight = '-0.025em'

export const fontSans =
    "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"

export const radius = { md: '0.375rem', lg: '0.5rem' } as const

export const shadowLg = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'

/** `max-w-lg`. */
export const containerLg = '32rem'

/** The default transition duration and timing function. */
export const duration = '150ms'
export const ease = 'cubic-bezier(0.4, 0, 0.2, 1)'
