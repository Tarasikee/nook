// Install before loading React. Keep this hook out of timing and heap measurement pages.
export function installReactTreeProbe() {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        inject: () => 1,
        onCommitFiberRoot(_rendererId, root) {
            window.benchReactRoot = root
        }
    }
}

// Count only the current committed tree, including portal children, never alternate work trees.
export function countReactFibers() {
    const root = window.benchReactRoot
    if (!root?.current) throw new Error('React did not expose a committed Fiber root')

    let count = 0
    const pending = root.current.child ? [root.current.child] : []
    while (pending.length) {
        const fiber = pending.pop()
        count++
        if (fiber.sibling) pending.push(fiber.sibling)
        if (fiber.child) pending.push(fiber.child)
    }
    return count
}
