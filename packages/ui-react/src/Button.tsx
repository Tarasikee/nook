import * as ui from '@nook/ui'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { classNames } from './merge.js'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** `'secondary'` by default. */
    variant?: 'primary' | 'secondary' | 'ghost'
    /** `'medium'` by default. */
    size?: 'medium' | 'small'
    /** Square, for a single icon. Name it with `aria-label` or a `Tooltip` with `asLabel`. */
    icon?: boolean
    ref?: Ref<HTMLButtonElement>
}

/** A native `<button>` in Nook's style. Defaults to `type="button"`; every other prop is passed through. */
export function Button({
    variant = 'secondary',
    size = 'medium',
    icon = false,
    type = 'button',
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            {...props}
            className={classNames(ui.button, className)}
            data-variant={variant}
            data-size={size}
            data-icon={icon ? '' : undefined}
        />
    )
}
