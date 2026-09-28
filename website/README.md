# Nook website

Nook's documentation site, built with [VitePress](https://vitepress.dev) in a green, light-blue, and white theme. Live demos are React components that use `@nook/react` exactly as an application would. They mount as client-only islands through `ReactDemo.vue`, so the VitePress server build never imports React. Presentation code stays in this folder.

```text
.vitepress/
  config.ts              Site config, navigation, sidebar, search, aliases
  theme/
    index.ts             Registers HomePage, ReactDemo, SupportMatrix
    custom.css           Brand layer over the default theme
    demo.css             Demo styles (the "consumer CSS")
    components/          HomePage.vue, ReactDemo.vue (island host), SupportMatrix.vue
    react/               React demos on @nook/react, and the demo registry
index.md                 Home page
guide/                   Guides
api/                     API reference
examples/                Example gallery
tests/                   Playwright smoke tests
```

During development, `@nook/core` and `@nook/react` are aliased to their TypeScript sources.

From the repository root:

```sh
pnpm dev       # dev server
pnpm build     # build core, react, and the site
pnpm preview   # serve the built site on :4173
pnpm test      # build, then run the React and website test suites
```

Demos render only after JavaScript loads. Each island reserves its height to avoid layout shift. Behavior before hydration is demonstrated and tested in `packages/react`, not on this site.
