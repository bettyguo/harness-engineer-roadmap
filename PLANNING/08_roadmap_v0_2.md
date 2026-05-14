# PHASE 3 — Roadmap for v0.2

The current shipped version is `v0.1.0` (the launch). This roadmap sets the next release.

The audit (`PLANNING/07_audit.md`) found 22 issues; Phase 2 fixed 11 of them across 8 commits. This document plans the rest, lays out new-feature proposals, declares non-goals, and proposes a semver bump.

---

## (a) Deferred items from Phase 2

Items the audit flagged that were too risky or too costly for the P0 + low-risk-P1 scope of Phase 2. Each has an effort estimate (**S** ≤1 day, **M** 1–3 days, **L** >3 days).

| ID | Severity | Effort | Proposed remediation |
|----|----------|--------|----------------------|
| **C4** | P2 | S | Rewrite `check_cycles` in `validate_data.py` to use a proper Kahn's algorithm — keep a queue of zero-indegree nodes, decrement only neighbors actually adjacent to the dequeued node (cache `reverse_adj` once). At 84 nodes it's a non-issue; if the graph grows past ~500 nodes the current O(V·(V+E)) is visibly slow. Also clarify the "leftover nodes" diagnostic — emit one full Tarjan SCC per cycle for actionable error messages. |
| **C5** | P2 | M | Switch `urlSync.ts` from `replaceState` to `pushState`, with a guard against creating a history entry when re-selecting the already-active node. Add a `popstate` listener so back/forward navigates between previously-viewed nodes. Pair with a Vitest test that exercises mock history. Risk: interacts with browser history semantics on iOS Safari; needs manual smoke-test pass. |
| **C6** | P2 | S | Already partially addressed in the C3 fix (precomputed node→area map). One remaining O(n) sweep in `build.py` for graph-internal `find()` — replace with a dict lookup. Trivial. |
| **C7** | P2 | S | Replace `key={i}` on `ResourcePanel`'s `resources.map` with a stable composite key (e.g. `resource.link + '|' + resource.title`). One-line change; the test should cover reorder-preserves-DOM. |
| **S2** | P2 | M | Make OG/Twitter URLs configurable. Two reasonable shapes: (1) read from a `site/.env` and inject via Vite's `define`, or (2) compute at render time from `window.location.origin`. Pick (2) — no env config burden. Refactor `site/index.html` to use placeholders the build resolves. |
| **S3** | P2 | S | Replace the `search.issuesAndPullRequests` call in `stale-link-issue.yml` with `GET /repos/{owner}/{repo}/issues?labels=stale-link&state=open` paginated. The issues-list endpoint is rate-limited at 5000 req/hr, not 30/min. Loop and dedup client-side. |
| **D3** | P2 | S | Update `wiki/Curation-Bar.md` with an explicit foundational-reading carve-out: "A resource may cite multiple nodes if (a) it is durable, (b) the curator can write a *different* `why` per node, and (c) the resource genuinely covers each cited node." Then audit `roadmap-data/*` for resources cited >3× and either prune or fix their per-node `why` to match this rule. |
| **D4** | P2 | S | In `validate_data.py`: add a `check_aliases` pass — for each node, aliases must be lowercase, unique within the node, and not equal to `label` (case-insensitive). Add tests. |
| **D5** | P2 | S | In `validate_data.py`: add a `check_resource_titles` pass — `(title, author, year)` triple must be unique within a node. Catches copy-paste mistakes. Add tests. |
| **P2-perf** | P2 | S | Cache `load_yaml` in `validate_data.py` so each file is parsed once across all checks. ~50 LOC; tested by mocking `yaml.safe_load` and asserting call count == file count. |
| **Doc1** | P2 | S | Already partially done by the `.linkcheck-ignore` header rewrite in S1's commit. Mirror the same explanation into `CONTRIBUTING.md` so contributors find it without grepping. |
| **Doc2** | P2 | S | Folded into **D3**. |
| **Q1** | P2 / "behavior to confirm" | S | The `🜂` emoji in `tools/build.py` is "behavior to confirm" — Phase 2 left it untouched per the constraint. If the curator wants it gone, replace with a textual marker. If the aesthetic is intentional, document it. Open as a tracked issue rather than a silent change. |
| **Q3** | P1 | M | ResourcePanel focus management — when the panel opens, move focus to the close button (or first focusable inside the panel). Trap Tab/Shift-Tab within the panel like Q2 did for SearchOverlay. Add `aria-labelledby` pointing at the node's `<h2>`. Bigger lift than Q2 because the ResourcePanel slides in/out (not toggle-mounted), so the focus-move only happens when `node` transitions from `null` to a value. Add Vitest tests. |

### Carry-over total
13 deferred items: 8 **S** · 4 **M** · 0 **L** · 1 "behavior to confirm".

---

## (b) New feature proposals

Each captures motivation, user-visible behavior, acceptance criteria, effort, and dependencies. None of these were in scope for Phase 2; they belong to v0.2.

### F1 — Reading-paths overlay on first visit
- **Motivation.** Hostile-review finding G3 from `PLANNING/06_review.md`. A stuck practitioner lands on the diagram and sees 12 areas at once; the three reading paths exist only in the README and wiki. Surfacing them on the live site removes one click between "I'm stuck" and "here's where to start."
- **User-visible behavior.** On first visit (localStorage flag), a centered card appears over the diagram with three buttons: *"My agent breaks in prod" / "I'm scaling beyond one agent" / "I'm new to harness engineering."* Picking one pans/zooms the diagram to highlight that path's first node and opens its resource panel. Dismissable with Esc or an "explore freely" button. A `?` icon in the header re-opens the overlay on demand.
- **Acceptance.**
  - localStorage key `hr-reading-paths-seen` set on first dismissal.
  - `?` button in header opens overlay regardless of localStorage.
  - Path-pick deep-links via existing `#node/<id>` URL fragment.
  - Vitest test covers: localStorage gating, dismiss-to-Esc, pick-emits-node-id.
- **Effort.** M (1–2 days). Reuses existing URL sync + panel-open logic.
- **Dependencies.** None.

### F2 — Per-node URL deep-link via `pushState` (subsumes C5)
- **Motivation.** Today clicking 5 nodes leaves no browser history; back button drops the user out of the site. Power users and link-sharers benefit from real history entries.
- **User-visible behavior.** Clicking a node updates the URL with `pushState` (was `replaceState`). Back / forward buttons navigate node history. Clicking the same node twice does not push.
- **Acceptance.**
  - Browser back after viewing nodes A→B→C returns to B, then A, then the homepage state.
  - No duplicate history entries when re-selecting the active node.
  - Mobile Safari + Chrome + Firefox smoke-tested manually.
- **Effort.** S (~½ day for the code, M with the manual cross-browser pass).
- **Dependencies.** None.

### F3 — "Mark as competent" progress tracking
- **Motivation.** Every node has a `competent_means` rubric. Readers want to self-track which they've met. Today they have no UI for it.
- **User-visible behavior.** A checkbox in the resource panel: *"I can pass this rubric."* Toggle persisted to localStorage (no account, no server). A progress meter in the footer: "23 / 84 nodes." Diagram nodes the user has marked get a subtle ✓ overlay (or a small dot in their corner). Export/import via JSON for users who switch devices.
- **Acceptance.**
  - State persisted in `hr-progress` localStorage key as `{ "<node-id>": "yes" | "no" }`.
  - Diagram refresh reflects state without reload.
  - Vitest tests for the persistence layer and the meter math.
- **Effort.** M (2–3 days). The visual overlay on diagram nodes needs care to not fight the tier styling.
- **Dependencies.** None for the basic version. A future "share my map" feature would require an account/server — explicitly out of scope here.

### F4 — Node search → graph-pan animation
- **Motivation.** Cmd-K search picks a node and opens its panel, but the diagram doesn't move. The user loses spatial context — "where on the map was that?"
- **User-visible behavior.** Picking a result animates the React Flow viewport to center on the picked node at zoom 1.0 (configurable), with a brief flash of the mint accent ring.
- **Acceptance.**
  - `fitView` style animation, ~300ms duration.
  - Works for nodes already in viewport (a no-op pan, just zoom adjust + flash).
  - Vitest test covers the pan-target calculation.
- **Effort.** S (~½ day). React Flow exposes `useReactFlow().setCenter()` for exactly this.
- **Dependencies.** None.

### F5 — Light-mode polish + "screenshot mode"
- **Motivation.** Light mode exists via the theme toggle but the palette wasn't tuned for it; dark is the launch screenshot. Some readers prefer light; some launch artifacts need light-mode versions.
- **User-visible behavior.** Light mode gets its own palette (currently shares the dark palette with washed-out contrast). A "screenshot mode" toggle hides the UI chrome (header, footer, controls, minimap) for clean exports.
- **Acceptance.**
  - WCAG AA contrast across all 12 area colors against the light canvas.
  - Screenshot mode reachable via `?chrome=off` URL query OR a hidden keyboard shortcut.
  - Manual screenshot at 1920×1080 in both modes for the README assets.
- **Effort.** M (2 days). 12 colors × 2 modes = real design work, not just CSS.
- **Dependencies.** None.

### F6 — Mobile diagram experience
- **Motivation.** The current site is desktop-first; mobile shows a tiny diagram with hard-to-tap nodes. About 30% of share-link traffic on launch day will be mobile.
- **User-visible behavior.** Below 768px, switch from the node graph to an area-list view: 12 vertical cards (area title + blurb + per-tier counts). Tapping an area opens an area-detail view with the nodes as a list (not a graph). Resource panel still slides as full-screen modal as it does today.
- **Acceptance.**
  - Lighthouse mobile score ≥ 90.
  - Vitest tests for the area-list rendering and area-detail navigation.
  - Manual smoke pass on iOS Safari and Android Chrome.
- **Effort.** L (4–5 days). A genuine second view; not just CSS.
- **Dependencies.** None.

### F7 — Static OpenGraph image generator
- **Motivation.** Today `assets/og-image.png` is a TODO with a `MAKE_BANNER.md` spec. Real OG images get 4× the social-link click-through. Manually generating one per release is fragile.
- **User-visible behavior.** A Node script in `tools/og-image.ts` renders a 1280×640 PNG from the current `graph.json`: title at left, mini-diagram silhouette at right with cluster names. Wired into `deploy.yml` so every deploy includes a fresh card.
- **Acceptance.**
  - Generates a valid PNG with embedded text (use `@vercel/og` or `satori` + `resvg`).
  - The PNG appears at `site/dist/og-image.png` after `npm run build`.
  - Slack / Discord / Twitter unfurls show it correctly (manual smoke).
- **Effort.** M (1–2 days). Adds one runtime dep — `satori` + `@resvg/resvg-js`.
- **Dependencies.** Yes — proposed new deps: **satori** (~50KB) and **@resvg/resvg-js** (native). Both MIT. Justify: zero alternative produces a generated OG image from JSX without a browser; image-magick / Puppeteer are bigger dependencies. **Proposed in Phase 3 per the constraint that no new deps are introduced in Phase 2.**

### F8 — Resource panel: jump-to-citation in body
- **Motivation.** Many resources cite section numbers / specific pages of papers. Today the `why` field includes guidance like "Read sections 2 and 4" as plain text. Power users want anchor links.
- **User-visible behavior.** Optional `anchor` field on resources (`anchor: "#section-2"` or page numbers for PDFs that support them). Panel renders the link with the anchor when present.
- **Acceptance.**
  - Schema gains optional `anchor` string.
  - Validator allows empty / missing.
  - Vitest test exercises a resource with and without an anchor.
- **Effort.** S (½ day).
- **Dependencies.** None.

---

## (c) Explicit non-goals for v0.2

Things we are choosing not to do this release, with reason — so contributors don't spend time on them and the curator doesn't get distracted.

- **Server-side anything.** No accounts, no shared progress, no comment storage on nodes. The artifact stays static; user state stays in localStorage. Adding a server compromises the maintenance story (one researcher, no infra team).
- **An editor UI for `roadmap-data/`.** Contributors edit YAML through PRs. An in-browser editor is 4× the surface area for less than 2× the contributor benefit, and centralizes review work.
- **Multi-language content.** Not until the English version stabilizes for two quarters minimum. Translation infrastructure is a project of its own.
- **Embedding / "iframe me on your site."** Asked sometimes; rejected. The aesthetic depends on the surrounding chrome.
- **Generative summarization of resources** ("AI summary of this paper"). Slop-amplifying; would dilute the curation bar that's the entire point.
- **An RSS / changelog feed.** CHANGELOG.md plus the GitHub Atom feed is enough. Don't reinvent.
- **Per-node comments / Disqus.** Use GitHub Discussions for that — the templates exist already.

---

## (d) Suggested semver bump → **v0.2.0**

Per [semver.org](https://semver.org/) the project is in `0.x` so the leading zero says "API may change." The proposal is **v0.1.0 → v0.2.0**, justified as follows:

- The released artifact is the live site, the `graph.json` shape, and the YAML schema. None of those has a *broken* API in Phase 2 — but the `graph.json` content changes (29 new edges from C1) and the schema's `format: uri` is removed (D1). Consumers (none today, but a future "import my graph" tool) would notice both.
- Phase 2's changes are entirely **additive in behavior**:
  - Validator now rejects duplicate colors (D2), unique-link patterns (D1) — these don't break existing valid data.
  - Build adds 29 previously-missing edges (C1) — additive.
  - Linkcheck `--paths` writes to a new file (C2) — backward-compatible; full runs still write the canonical file.
  - `should_ignore` change (S1) tightens semantics; entries in `.linkcheck-ignore` that *relied on substring matching* would now miss, but the file is empty so impact is zero.
  - Site renderer fix (C3/P1) is an internal perf change; no UI behavior change.
  - SearchOverlay a11y attrs (Q2) are additive.
- No public API is broken. We could justify staying at v0.1.x (just patch bumps). The reason to go to v0.2.0 instead:
  - Adding the test suite is a **substantive new capability for downstream forks** (the contract for what passing CI means changes).
  - The data recovery (29 edges) is **user-visible** — anyone visiting the live site sees a noticeably richer graph.
  - Semantically: v0.1.x is the launched-but-untested-tools era. v0.2.x starts the tested-tools era.
- If the upcoming v0.2 release ships **F1 + F2 + F4 + F8** (a reading-paths overlay, real history, search-pan, anchors), those are also additive features; still 0.2.0 not 0.3.0.
- **Reserved for a future v0.3.0 / v1.0.0:** F6 (mobile redesign — UX-breaking for anyone who'd hard-coded a desktop expectation). F3 (progress tracking — adds a localStorage contract worth a minor bump).

**Therefore: release the Phase-2 fixes as `v0.2.0`. Apply via `git tag v0.2.0 && git push --tags`. Update `CHANGELOG.md` with a v0.2.0 entry that catalogs the eight fix commits and the test-infrastructure addition.**

---

## (e) Priority ordering — across deferred items and new features

Not a flat list. Each row has a one-line rationale. Top of the list ships first in v0.2.

| Rank | Item | Class | Effort | Rationale |
|------|------|-------|--------|-----------|
| 1 | **D3** — foundational-reading carve-out in Curation Bar | deferred | S | Closes the visible policy/data contradiction (15 nodes cite the same Anthropic post). Cheap. Should land before anyone reads the Curation Bar page in earnest. |
| 2 | **Q3** — ResourcePanel focus management + Tab trap | deferred | M | Real a11y gap. Q2 in Phase 2 fixed the SearchOverlay; ResourcePanel is the *primary* modal users hit. Should match. |
| 3 | **F4** — search-pick animates viewport to node | new | S | Highest UX-per-effort ratio of the new features. Tiny code, big "wow." |
| 4 | **F2** — pushState history (subsumes C5) | new+deferred | S–M | Power users notice; cheap; addresses an audit P2 (C5) and gives the site real "shareable / navigable" semantics. |
| 5 | **F8** — resource anchors | new | S | Small, additive, useful for paper-citation entries that already say "read section 3." |
| 6 | **F1** — reading-paths overlay | new | M | Solves the "where do I start" UX gap that Phase 6 hostile review flagged. Bigger surface than F2/F4 but visible value. |
| 7 | **C4 / D4 / D5 / P2-perf / Doc1 / C6 / C7** — small validator hygiene | deferred | 6× S | Batch these as a single "validator hardening" PR. Each is ½ day; together they raise the quality bar of `roadmap-data` and catch real classes of contributor mistakes. |
| 8 | **F5** — light-mode polish | new | M | Worth doing but doesn't unblock anyone. Schedule after F1–F4 so the UI surface stabilizes before re-theming. |
| 9 | **S2** — relative OG URLs | deferred | M | Only matters if/when the site moves off GH Pages. No live blocker. |
| 10 | **S3** — issues-list API for stale-link | deferred | S | Only fires if a single night produces >30 broken links — unlikely but cheap insurance. |
| 11 | **F7** — generated OG image | new | M | Adds two dependencies; valuable but not blocking. Visible at launch-time, but the social-card spec (`assets/MAKE_BANNER.md`) already exists for manual generation. |
| 12 | **Q1** — `🜂` emoji in build.py | deferred / "behavior to confirm" | S | Lowest priority. File an issue; let the curator decide; don't change silently. |
| 13 | **F3** — progress tracking | new | M | Genuinely useful; but it's the largest "surface area expansion" of the proposals. Defer until F1–F8 (smaller features) have landed and the team can absorb its testing burden. |
| 14 | **F6** — mobile redesign | new | L | The biggest item. Real second view. Deserves its own release (v0.3.0 likely). Don't bundle. |

### What ships in v0.2.0 specifically (suggested cut)

Ranks 1–6 above: D3, Q3, F4, F2, F8, F1. That's ~5–7 working days of effort.

Rank 7 (the small-validator-hygiene batch) is a stretch goal — ship if v0.2 takes <2 weeks, defer to v0.2.1 otherwise.

Everything from rank 8 onward is **v0.3+** territory.
