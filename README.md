# Nook

Popovers, tooltips, and selects built around native browser capabilities, with as little JavaScript as practical.

Nook aims to be a small, framework-agnostic library with no third-party runtime dependencies in its core. Native HTML, CSS, and browser APIs should do the heavy lifting; JavaScript should fill the gaps. React bindings will make the same primitives convenient to use in React applications.

The scope is deliberately focused. Nook aims to offer an alternative to broader floating-element libraries without pursuing feature parity or building a general-purpose positioning engine.

## Status

Early implementation. `@nook/core` provides small DOM helpers that observe and drive native popover state. `@nook/react` provides `usePopover()` and `useTooltip()`, React 19.2+ hooks shipped compiled by React Compiler and built on `popovertarget` and `interestfor`. The tooltip relies on interest invokers, currently Chromium-only. The website runs on VitePress, and its live demos use the React hooks. Select is not implemented. Package names are provisional and all workspace packages are private.

## Repository

```text
packages/
  core/           Framework-independent browser primitives
  react/          React bindings for core
website/          Documentation, interactive examples, and project site
docs/
  architecture.md Shared direction and package boundaries
AGENTS.md         Guidance for coding agents
CONTRIBUTING.md   Guidance for contributors
```

Start with the [architecture](docs/architecture.md), [core README](packages/core/README.md), [React README](packages/react/README.md), or [website README](website/README.md). See [CONTRIBUTING.md](CONTRIBUTING.md) for workspace setup.

See the [implementation direction](docs/implementation-direction.md) for the proposed styleless primitives and event composition model.

The initial structure is intentionally small. Public APIs, tooling, and release details will be decided as implementation begins.

## Browser support approach

Build the main features around native browser capabilities first, even when support is limited to a few browsers. For now, compatibility fixes, polyfills, and fallback implementations are deferred. Document which capabilities each feature requires and where support is limited as work progresses.

## Browser API reference

The [browser API knowledge base](docs/reference/README.md) records researched behavior, compatibility, and implementation questions for contributors and coding agents. It is dated research, not a Nook browser-support commitment.

## License

[MIT](LICENSE), copyright Nook contributors.
