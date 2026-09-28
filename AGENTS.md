# Agent guidance

Read `README.md`, `docs/architecture.md`, and the relevant package README before making changes.

When implementation planning begins, also read `docs/implementation-direction.md`. Treat its component and event examples as design guidance, not an approved API.

For popover, tooltip, select, positioning, or browser-support work, also read `docs/reference/README.md` and the relevant topic notes. These are dated research, not a support policy. Recheck the linked MDN compatibility records and standards before relying on newer features; keep source links, verification dates, and unresolved discrepancies current.

- Add implementation, API stubs, or tooling only when the task asks for it.
- Keep the architecture lightweight. Avoid speculative abstractions, package splits, and dependencies.
- Prefer native HTML, CSS, and browser APIs, adding only the JavaScript needed for the intended behavior.
- Prioritize the main features using native capabilities, even when available in only a few browsers. For now, do not add compatibility fixes, polyfills, or fallback implementations for unsupported or partially supported browser features. Record support gaps in the documentation; limited support alone must not block feature development.
- Keep core framework-independent and free of third-party runtime dependencies. Framework bindings belong in sibling packages and should reuse core behavior.
- Keep feature demonstrations in the root-level `website/` folder with the project documentation; do not add a separate examples package unless it has a distinct distribution need.
- Preserve accessibility requirements when minimizing JavaScript.
- When writing React, never use `useMemo`, `useCallback`, or `memo`; this project assumes React Compiler.
- Keep documentation aligned with what exists. Distinguish intended behavior from implemented and verified behavior.
- Add and run checks appropriate to implemented changes.
