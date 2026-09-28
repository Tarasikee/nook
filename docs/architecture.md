# Architecture direction

Nook starts with core, framework bindings, and a website that carries its documentation and runnable examples. This document sets their boundaries without prescribing an API or internal file layout.

## Core

`packages/core` will own framework-independent browser behavior for popovers, tooltips, and selects. It must be usable without React and have no third-party runtime dependencies.

Start with native capabilities such as the Popover API, CSS anchor positioning, and native form controls where appropriate. Add JavaScript only where the desired interaction needs it. These are directions to evaluate, not a browser-support promise or a requirement that every feature use the same primitive.

## Framework bindings

`packages/react` will adapt core to React's rendering, lifecycle, and composition model. Shared browser behavior belongs in core; React-specific integration belongs here. Core must never depend on a binding package.

The intended dependency direction is React bindings → core → browser capabilities. Future framework bindings can sit alongside these packages when needed.

## Website

`website` is the root-level home for Nook's documentation, interactive examples, and project site. It consumes `@nook/core` as an application would, while keeping presentation code out of the published core. It is a workspace so the site can run and build from the repository root.

## Browser support approach

Implement the main features using native browser capabilities first. Support in only a few browsers is acceptable and does not by itself justify an alternative implementation. Compatibility fixes, polyfills, and fallbacks for missing or partial browser support are deferred for now.

Record the capabilities each feature uses, their browser availability, and known limitations in the reference documentation. Verify behavior in supporting browsers. This approach does not defer correctness or accessibility work for the interactions we implement.

## Keep open

Public APIs, internal modules, CSS delivery, and build and release tooling are not decided yet. Establish them incrementally around working interactions. Add examples and tests with implementation rather than reserving a large directory tree now.

Small JavaScript payloads and a focused feature set are goals. Keyboard behavior, focus management, and accessible semantics remain part of correctness.

The [browser API knowledge base](reference/README.md) supplies research for these decisions without fixing the architecture or public API.

The [implementation direction](implementation-direction.md) captures initial guidance for styleless primitives, React integration, and event composition.
