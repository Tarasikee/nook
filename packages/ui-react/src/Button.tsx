import * as ui from '@nook/ui'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { classNames } from './merge'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost'
    size?: 'medium' | 'small'
    icon?: boolean
    ref?: Ref<HTMLButtonElement>
}

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
