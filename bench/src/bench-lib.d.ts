declare module 'bench-lib' {
    import type { ReactNode } from 'react'

    export function Item(props: { index: number; label: string }): ReactNode
    export function Provider(props: { children: ReactNode }): ReactNode
}
