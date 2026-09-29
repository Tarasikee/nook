/// <reference types="vite/client" />

// Lets plain TypeScript (the IDE, tsc) resolve Vue components; vue-tsc reads the real types.
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent
    export default component
}

// `import source from './File.tsx?source'`: that file's highlighted source, from `source-plugin.ts`.
declare module '*?source' {
    const source: { lang: string; html: string }
    export default source
}
