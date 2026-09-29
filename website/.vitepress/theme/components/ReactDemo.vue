<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { DemoName } from '../react/index'

const props = defineProps<{
    /** A key of the demo registry in `../react/index.tsx`. */
    name: string
    /** Height reserved while the demo loads, to avoid layout shift. */
    height?: number
}>()

const host = ref<HTMLElement>()
const pending = ref(true)
let unmount: (() => void) | undefined
let disposed = false

onMounted(async () => {
    // React loads only in the browser, so the VitePress server build never imports it.
    const { mountDemo } = await import('../react/index')
    if (disposed || !host.value) {
        return
    }
    unmount = mountDemo(host.value, props.name as DemoName)
    pending.value = false
})

onBeforeUnmount(() => {
    disposed = true
    unmount?.()
})
</script>

<template>
    <div
        ref="host"
        class="nk-island"
        :data-pending="pending ? '' : undefined"
        :data-demo="name"
        :style="{ '--nk-island-height': `${height ?? 300}px` }"
    />
</template>

<style scoped>
/* A dotted placeholder that reserves the demo's height until React mounts it. */
.nk-island {
    display: block;

    &:empty,
    &[data-pending] {
        border: 1px solid var(--vp-c-border);
        border-radius: 14px;
        background:
            radial-gradient(var(--vp-c-divider) 1px, transparent 1px) 0 0 / 16px 16px,
            var(--vp-c-bg);
    }

    &[data-pending] {
        min-height: var(--nk-island-height);
        margin: 1.5rem 0;
    }
}
</style>
