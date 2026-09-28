# Nook React

The future React bindings for [Nook core](../core/README.md).

This package will adapt core behavior to React's rendering and lifecycle, keeping the framework-specific layer thin. Shared browser behavior belongs in core rather than being duplicated here.

This package is a placeholder with no source files or exports. Its workspace name, `@nook/react`, is provisional and private. The core dependency and React peer dependency will be declared when implementation begins; no React version or public API is chosen yet.

React code assumes React Compiler. Do not use `useMemo`, `useCallback`, or `memo`.

See the [architecture direction](../../docs/architecture.md) and [contributor guide](../../CONTRIBUTING.md).
