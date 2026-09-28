# Contributing

Nook is in early implementation. Keep changes small and let concrete use cases guide the structure.

## Getting started

Use Node.js and pnpm; the existing `mise.toml` provides a local environment option. Run `pnpm install` from the repository root to initialize the workspace. Run `pnpm dev` for the documentation site and interactive examples, or `pnpm build` to build core and the site.

Read the [project overview](README.md) and [architecture](docs/architecture.md) before making changes. Each package README describes its intended responsibility; the root-level `website/` folder has its own README.

## Development direction

- Prefer native browser behavior and minimal JavaScript. Keep core free of framework and third-party runtime dependencies.
- Keep React integration in `packages/react` and shared browser behavior in `packages/core`.
- Treat keyboard interaction, focus, and accessibility as part of each feature. Native primitives are a starting point, not proof that a complete interaction is accessible.
- When implementation starts, verify the relevant behavior in real browsers and document support limits alongside it.
- Limited browser support is acceptable at this stage. Prioritize the main features and record missing or partial support; defer compatibility fixes, polyfills, and fallback implementations.
- Add tools, tests, examples, and internal folders when actual work needs them.
- React code assumes React Compiler. Do not use `useMemo`, `useCallback`, or `memo`.

Public APIs, build and test tools, and package publishing remain open decisions. Describe proposed decisions briefly before expanding the architecture around them.

Consult the [browser API knowledge base](docs/reference/README.md) before implementing browser interactions. Recheck time-sensitive compatibility claims and record the date and source when updating the notes.

Nook is licensed under the [MIT License](LICENSE).
