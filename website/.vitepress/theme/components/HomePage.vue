<script setup lang="ts">
import { withBase } from 'vitepress'
import ReactDemo from './ReactDemo.vue'

const features = [
    {
        title: 'Works before hydration',
        text: 'Every relationship is an HTML attribute rendered on the server. Open, close, and Escape work before your JavaScript loads.'
    },
    {
        title: 'Attributes, not handlers',
        text: 'Hooks return plain attribute objects with no event handlers or trigger refs. Spread two hooks on one button: nothing to merge, nothing to override.'
    },
    {
        title: 'The browser owns the state',
        text: 'Open state is read from :popover-open with useSyncExternalStore. There is no second state machine to drift, and no effect ever sets state.'
    },
    {
        title: 'Top layer, not z-index',
        text: 'Open popovers render in the browser top layer, above overflow clipping and stacking contexts, without a portal.'
    },
    {
        title: 'Accessibility you can verify',
        text: 'Checked against Chromium’s own accessibility tree. The hooks add only what the platform leaves out, such as tooltip descriptions that exist before hover.'
    },
    {
        title: 'Compiled, and correct without it',
        text: 'Shipped compiled by React Compiler, tested compiled and uncompiled, and linted against the Rules of React.'
    }
]

const split = [
    ['Open and close on click', 'popovertarget', 'Nothing'],
    ['Light dismiss and Escape', 'popover="auto"', 'Reports the change to React'],
    ['Hover and focus tooltips', 'interestfor, interest-delay', 'An ARIA link that exists while closed'],
    ['Layering', 'Top layer', 'Nothing'],
    ['Placement and flipping', 'position-area, position-try', 'Nothing: it is your CSS'],
    ['Opening from code', 'showPopover()', 'Passes the trigger as source so it stays anchored'],
    ['React state', '—', 'useSyncExternalStore over native state']
]

const primitives = [
    {
        name: 'Popover',
        status: 'Available',
        link: '/guide/popover',
        text: 'usePopover(): click-triggered, light-dismissible surfaces.'
    },
    {
        name: 'Tooltip',
        status: 'Chromium',
        link: '/guide/tooltip',
        text: 'useTooltip(): hover and focus hints on interestfor.'
    },
    {
        name: 'Menu',
        status: 'Planned',
        link: '/guide/#status-and-roadmap',
        text: 'Menu semantics and keyboard model on native popovers.'
    },
    {
        name: 'Select',
        status: 'Planned',
        link: '/guide/#status-and-roadmap',
        text: 'Built on the customizable native select.'
    }
]
</script>

<template>
    <div class="home">
        <section class="home-hero">
            <div class="home-hero__copy">
                <p class="home-eyebrow">
                    <span class="home-dot" aria-hidden="true" /> React 19 · Native HTML · Early preview
                </p>
                <h1 class="home-title">
                    Accessible primitives.<br />
                    <em>Built on the platform.</em>
                </h1>
                <p class="home-lead">
                    Nook is a set of headless React hooks for popovers and tooltips. The browser does the work:
                    <code>popovertarget</code>, <code>interestfor</code>, the top layer, and CSS anchor positioning.
                    Nook adds only what the platform leaves out.
                </p>
                <div class="home-actions">
                    <a class="home-button home-button--primary" :href="withBase('/guide/getting-started')">
                        Get started <span aria-hidden="true">→</span>
                    </a>
                    <a class="home-button home-button--ghost" :href="withBase('/examples/')">Browse examples</a>
                </div>
                <dl class="home-facts">
                    <div>
                        <dt>0</dt>
                        <dd>runtime dependencies</dd>
                    </div>
                    <div>
                        <dt>&lt; 2 KB</dt>
                        <dd>min + gzip, both hooks</dd>
                    </div>
                    <div>
                        <dt>0</dt>
                        <dd>lines of positioning JS</dd>
                    </div>
                </dl>
            </div>
            <div class="home-hero__demo">
                <ReactDemo name="hero" :height="360" />
                <p class="home-hero__caption">
                    Live, on <code>@nook/react</code>. Click <strong>Share</strong>, hover the icons, press
                    <kbd>Esc</kbd>.
                </p>
            </div>
        </section>

        <section class="home-section home-code">
            <div class="home-section__intro">
                <p class="home-kicker">How it works</p>
                <h2>Spread attributes. Let HTML do the rest.</h2>
                <p>
                    A hook gives you attribute objects for your own elements. What reaches the browser is plain HTML
                    that already knows how to open, close, dismiss, and anchor itself.
                </p>
                <ol class="home-steps">
                    <li>
                        <strong>Hook</strong> <code>usePopover()</code> returns trigger, content, title, and close
                        props.
                    </li>
                    <li>
                        <strong>Markup</strong> Spread them on your own <code>&lt;button&gt;</code> and panel. Keep your
                        handlers.
                    </li>
                    <li>
                        <strong>Style</strong> <code>position-area</code> anchors the panel with no measuring or scroll
                        listeners.
                    </li>
                </ol>
            </div>
            <div class="home-code__block vp-doc">
                <slot name="code" />
            </div>
        </section>

        <section class="home-section">
            <div class="home-section__intro home-section__intro--center">
                <p class="home-kicker">Why Nook</p>
                <h2>The platform already does most of the work.</h2>
            </div>
            <div class="home-features">
                <article v-for="feature in features" :key="feature.title" class="home-feature">
                    <h3>{{ feature.title }}</h3>
                    <p>{{ feature.text }}</p>
                </article>
            </div>
        </section>

        <section class="home-section home-compare">
            <div class="home-section__intro">
                <p class="home-kicker">Who does what</p>
                <h2>The browser first. Nook fills the gaps.</h2>
                <p>
                    Each row lists the native feature doing the job and the little that Nook adds on top. When the
                    platform grows, Nook shrinks.
                </p>
            </div>
            <div class="home-table">
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Job</th>
                            <th scope="col">The browser</th>
                            <th scope="col">Nook</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="[job, browser, nook] in split" :key="job">
                            <th scope="row">{{ job }}</th>
                            <td>
                                <code>{{ browser }}</code>
                            </td>
                            <td>{{ nook }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="home-section">
            <div class="home-section__intro home-section__intro--center">
                <p class="home-kicker">Primitives</p>
                <h2>Focused on the essentials.</h2>
            </div>
            <div class="home-primitives">
                <a
                    v-for="primitive in primitives"
                    :key="primitive.name"
                    class="home-primitive"
                    :href="withBase(primitive.link)"
                >
                    <span class="home-status" :data-status="primitive.status">{{ primitive.status }}</span>
                    <strong>{{ primitive.name }}</strong>
                    <span>{{ primitive.text }}</span>
                </a>
            </div>
        </section>

        <section class="home-cta">
            <h2>Build with the platform.</h2>
            <p>Read the quick start, then copy the examples into your own design system.</p>
            <div class="home-actions">
                <a class="home-button home-button--primary" :href="withBase('/guide/getting-started')">
                    Read the quick start <span aria-hidden="true">→</span>
                </a>
                <a class="home-button home-button--ghost" :href="withBase('/api/')">API reference</a>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 96px;
}

@media (min-width: 768px) {
    .home {
        padding: 0 48px 128px;
    }
}

/* Keep single-column grid tracks from growing to fit wide code blocks. */
.home-hero,
.home-code,
.home-compare,
.home-features,
.home-primitives {
    grid-template-columns: minmax(0, 1fr);
}

/* Hero */

.home-hero {
    display: grid;
    gap: 3.5rem;
    align-items: center;
    padding: 4rem 0 3rem;
}

@media (min-width: 1024px) {
    .home-hero {
        grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
        padding: 6rem 0 5rem;
    }
}

.home-eyebrow,
.home-kicker {
    margin: 0;
    color: var(--vp-c-brand-1);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.13em;
    text-transform: uppercase;
}

.home-dot {
    display: inline-block;
    width: 0.55rem;
    height: 0.55rem;
    margin-right: 0.4rem;
    border-radius: 50%;
    background: var(--nk-sky-400);
    box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.22);
}

.home-title {
    margin: 1rem 0 1.25rem;
    color: var(--vp-c-text-1);
    font-size: clamp(2.6rem, 6vw, 4.6rem);
    font-weight: 800;
    line-height: 1.02;
    letter-spacing: -0.06em;
}

.home-title em {
    font-style: normal;
    background: var(--nk-accent-gradient);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.home-lead {
    max-width: 580px;
    margin: 0;
    color: var(--vp-c-text-2);
    font-size: 1.1rem;
    line-height: 1.7;
}

.home-lead code,
.home-steps code,
.home-hero__caption code,
.home-table td code {
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    color: var(--vp-code-color);
    background: var(--vp-code-bg);
    font-family: var(--vp-font-family-mono);
    font-size: 0.85em;
}

.home-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    margin-top: 2rem;
}

.home-button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.8rem 1.2rem;
    border: 1px solid transparent;
    border-radius: 11px;
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: none;
    transition:
        background-color 0.2s,
        border-color 0.2s,
        transform 0.2s;
}

.home-button--primary {
    color: #fff;
    background: var(--nk-green-700);
    box-shadow: 0 10px 24px rgba(4, 120, 87, 0.25);
}

.home-button--primary:hover {
    background: var(--nk-green-800);
    transform: translateY(-1px);
}

.home-button--ghost {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-border);
    background: var(--vp-c-bg);
}

.home-button--ghost:hover {
    border-color: var(--nk-sky-400);
    color: var(--nk-sky-600);
}

.dark .home-button--ghost:hover {
    color: #7dd3fc;
}

.home-facts {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem 2.6rem;
    margin: 3rem 0 0;
    padding: 1.2rem 0 0;
    border-top: 1px solid var(--vp-c-divider);
}

.home-facts div {
    display: grid;
    gap: 0.15rem;
}

.home-facts dt {
    color: var(--vp-c-text-1);
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
}

.home-facts dd {
    margin: 0;
    color: var(--vp-c-text-3);
    font-size: 0.78rem;
}

.home-hero__caption {
    margin: 1rem 0 0;
    color: var(--vp-c-text-3);
    font-size: 0.82rem;
    text-align: center;
}

.home-hero__caption kbd {
    padding: 0.05rem 0.35rem;
    border: 1px solid var(--vp-c-border);
    border-bottom-width: 2px;
    border-radius: 4px;
    font-family: var(--vp-font-family-mono);
    font-size: 0.74rem;
}

/* Sections */

.home-section {
    padding-top: 6rem;
}

.home-section__intro {
    max-width: 620px;
}

.home-section__intro--center {
    margin: 0 auto 2.5rem;
    text-align: center;
}

.home-section h2,
.home-cta h2 {
    margin: 0.6rem 0 0.8rem;
    color: var(--vp-c-text-1);
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    font-weight: 800;
    line-height: 1.12;
    letter-spacing: -0.045em;
}

.home-section__intro > p:not(.home-kicker) {
    margin: 0;
    color: var(--vp-c-text-2);
    line-height: 1.7;
}

/* Code */

.home-code {
    display: grid;
    gap: 2.5rem;
    align-items: center;
}

@media (min-width: 1024px) {
    .home-code {
        grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
        gap: 4rem;
    }
}

.home-steps {
    display: grid;
    gap: 0.8rem;
    margin: 1.8rem 0 0;
    padding: 0;
    counter-reset: step;
    list-style: none;
}

.home-steps li {
    position: relative;
    padding-left: 2.4rem;
    color: var(--vp-c-text-2);
    font-size: 0.93rem;
    line-height: 1.6;
    counter-increment: step;
}

.home-steps li::before {
    content: counter(step);
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
    font-size: 0.78rem;
    font-weight: 800;
}

.home-steps strong {
    display: block;
    color: var(--vp-c-text-1);
}

.home-code__block :deep(.vp-code-group) {
    margin: 0;
}

.home-code__block :deep(div[class*='language-']) {
    border-radius: 0 0 14px 14px;
}

.home-code__block :deep(.vp-code-group .tabs) {
    border-radius: 14px 14px 0 0;
}

/* Features */

.home-features {
    display: grid;
    gap: 1px;
    overflow: hidden;
    border: 1px solid var(--vp-c-border);
    border-radius: 18px;
    background: var(--vp-c-border);
}

@media (min-width: 640px) {
    .home-features {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 960px) {
    .home-features {
        grid-template-columns: repeat(3, 1fr);
    }
}

.home-feature {
    padding: 1.8rem;
    background: var(--vp-c-bg);
}

.home-feature:nth-child(3n + 2) {
    background: var(--nk-surface-gradient);
}

.home-feature h3 {
    margin: 0 0 0.5rem;
    color: var(--vp-c-text-1);
    font-size: 1.05rem;
    font-weight: 750;
    letter-spacing: -0.02em;
}

.home-feature p {
    margin: 0;
    color: var(--vp-c-text-2);
    font-size: 0.9rem;
    line-height: 1.65;
}

/* Who does what */

.home-compare {
    display: grid;
    gap: 2.5rem;
    align-items: start;
}

@media (min-width: 1024px) {
    .home-compare {
        grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
        gap: 4rem;
    }
}

.home-table {
    overflow-x: auto;
    border: 1px solid var(--vp-c-border);
    border-radius: 16px;
}

.home-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
}

.home-table th,
.home-table td {
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--vp-c-divider);
    text-align: left;
    vertical-align: top;
}

.home-table tbody tr:last-child > * {
    border-bottom: 0;
}

.home-table thead th {
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-alt);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.home-table tbody th {
    color: var(--vp-c-text-1);
    font-weight: 700;
    white-space: nowrap;
}

.home-table td {
    color: var(--vp-c-text-2);
}

.home-table td:last-child {
    color: var(--vp-c-brand-1);
    font-weight: 600;
}

/* Primitives */

.home-primitives {
    display: grid;
    gap: 0.9rem;
}

@media (min-width: 640px) {
    .home-primitives {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 960px) {
    .home-primitives {
        grid-template-columns: repeat(4, 1fr);
    }
}

.home-primitive {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1.4rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 16px;
    background: var(--nk-surface-gradient);
    color: var(--vp-c-text-2);
    font-size: 0.88rem;
    line-height: 1.55;
    text-decoration: none;
    transition:
        border-color 0.2s,
        box-shadow 0.2s,
        transform 0.2s;
}

.home-primitive:hover {
    border-color: var(--vp-c-brand-3);
    box-shadow: 0 14px 34px rgba(5, 150, 105, 0.14);
    transform: translateY(-2px);
}

.home-primitive strong {
    color: var(--vp-c-text-1);
    font-size: 1.15rem;
    letter-spacing: -0.02em;
}

.home-status {
    align-self: flex-start;
    margin-bottom: 0.5rem;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.home-status[data-status='Available'] {
    color: var(--nk-green-700);
    background: rgba(16, 185, 129, 0.14);
}

.home-status[data-status='Chromium'] {
    color: var(--nk-sky-600);
    background: rgba(56, 189, 248, 0.16);
}

.dark .home-status[data-status='Available'] {
    color: #34d399;
}

.dark .home-status[data-status='Chromium'] {
    color: #7dd3fc;
}

.home-status[data-status='Planned'] {
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft);
}

/* Call to action */

.home-cta {
    margin-top: 6rem;
    padding: 3.5rem 2rem;
    border: 1px solid var(--vp-c-border);
    border-radius: 22px;
    background:
        radial-gradient(circle at 85% 0%, rgba(56, 189, 248, 0.2), transparent 55%),
        radial-gradient(circle at 10% 100%, rgba(16, 185, 129, 0.16), transparent 50%), var(--vp-c-bg-alt);
    text-align: center;
}

.home-cta p {
    margin: 0 auto;
    max-width: 520px;
    color: var(--vp-c-text-2);
}

.home-cta .home-actions {
    justify-content: center;
}
</style>
