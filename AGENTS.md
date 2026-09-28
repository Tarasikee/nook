# Agent guidance

Read `README.md`. For browser-facing work, also read `docs/research.md`.

- Rules are in tools: run `pnpm format` and `pnpm check` instead of re-deriving style or React rules. To change a rule, change `eslint.config.js` or `.prettierrc.json`.
- Verify browser behavior the design depends on with a test, and record it in `docs/research.md` with the date and browser version.
- Do what the task asks. Avoid speculative abstractions, packages, and dependencies.
- Prefer code, config, and tests over new markdown. State each fact in one place.
