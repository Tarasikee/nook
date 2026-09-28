# Nook website

The website is Nook's documentation and interactive example application. It uses `@nook/core` through the same public source import and lifecycle that a consumer would use; its visual design is local to this folder.

From the repository root:

```sh
pnpm dev
pnpm build
pnpm preview
```

The site currently documents the implemented `createPopover()` and `createTooltip()` APIs, their native browser dependencies, and the project’s no-fallback support policy. See the detailed [browser API knowledge base](../docs/reference/README.md) for dated research and source links.
