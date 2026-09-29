---
title: Performance
description: Nook measured against Radix and Floating UI on the same screen.
---

# Performance

<p class="nk-lead">Native primitives move work from JavaScript into the browser. This page measures what that buys, and what it costs, against Radix and Floating UI.</p>

## What is measured

The same screen is built with each library: a list of items, each one button with a hover tooltip and a click popover, written the way each library documents it. Production builds; the shared app code is compiled by React Compiler for every library; same placements, 8px offsets, and a zero tooltip delay everywhere. "Click → placed" and "Hover → placed" stop only when the surface is visible **and** at its final position, so JavaScript positioning that lands after the first frame is counted.

The benchmark refuses to run unless every item compiles. Reading Floating UI's `refs.*` inline during render, as in its examples, makes React Compiler skip the component ("Cannot access refs during render"). The benchmark destructures the setters first, which compiles, so Floating UI is not penalized.

<BenchResults />

## Reading the results

- **Where Nook wins, and why.** Less JavaScript runs: no positioning code, no portals, no per-item state machines. That shows up in bundle size, mount and re-render time, heap, time to open, and script time during pointer and scroll activity.
- **Where Nook costs more.** Nook renders popover and tooltip content up front, hidden by `popover`, so the DOM is about three times larger. The other libraries mount content only when it opens. During the pointer sweep the browser does more style and layout work for native interest and the top layer, even though script time is lower.
- **Limits.** Chromium only, because Nook's tooltip needs `interestfor`. One machine, synthetic CPU slowdown, and a synthetic screen. Measure your own interface before relying on these numbers.

## Reproduce

```sh
pnpm bench            # prints tables; RUNS and CPU are environment variables
pnpm bench --publish  # also updates this page
```

The benchmark lives in `bench/` in the repository.
