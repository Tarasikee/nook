import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function useHydrated(): boolean {
    return useSyncExternalStore(subscribeNever, clientSnapshot, serverSnapshot)
}
