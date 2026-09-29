---
title: Performance
description: Nook measured against Radix and Floating UI on the same screen.
---

# Performance

<p class="nk-lead">Native primitives move work from JavaScript into the browser. This page measures the gain and the cost against Radix and Floating UI.</p>

Each library builds the same screen: items with a hover tooltip and a click popover, written as each library documents. Production builds, React Compiler for every library's app code, equal placements, offsets, and zero tooltip delay. Open and hover times stop only when the surface is visible **and** in its final position.

<BenchResults />

## Reading the results

- **Nook runs less JavaScript:** no positioning code, portals, or per-item state machines. That shows in bundle size, mount, re-render, heap, open and hover time, and script time while moving the pointer or scrolling.
- **Nook costs more DOM:** it renders hidden content up front, while the others mount it on open. It also does more browser style and layout work during a pointer sweep.
- **Limits:** Chromium only, one machine, a synthetic screen with slowed CPU. Measure your own interface.
- **Fairness note:** reading Floating UI's `refs.*` inline during render makes React Compiler skip the component, so the benchmark destructures the setters first. The run refuses to start unless every item compiles.

Reproduce with `pnpm bench`; `pnpm bench --publish` updates this page. The code is in `bench/`.
