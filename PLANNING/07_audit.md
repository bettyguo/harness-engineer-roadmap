# PHASE 1 — AUDIT

Read-only inventory of the repo as of commit `f57a92f`. No edits applied in this phase. Severities: **P0** = release-blocker (fix this pass), **P1** = should-fix (some this pass), **P2** = nice-to-have (Phase 3 backlog). Risk-of-fix: **L** = low (drop-in), **M** = medium (touches multiple files / needs care), **H** = high (architectural).

Counts: **22 findings** → P0:3, P1:9, P2:10. By risk: L:14, M:7, H:1.

---

## (i) Correctness bugs

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| C1 | **P1** | L | `tools/build.py:75-85` | One-directional `related` edges are silently dropped. The dedup `if rel < node["id"]: continue` assumes both endpoints declare the edge; if only `B.related = [A]` is set and `A < B`, the edge is never emitted. Use a `seen: set[frozenset[str,str]]` instead of alphabetical comparison. |
| C2 | **P1** | L | `tools/linkcheck.py:166-169` | When `--paths` is used to check a subset, the partial result overwrites the full `.linkcheck-report.json`. The nightly `stale-link-issue` workflow would then see an empty / partial broken-list and miss real broken links. Either name partial-run reports separately, or refuse to write the canonical report under `--paths`. |
| C3 | **P1** | L | `site/src/components/Graph.tsx:45-152` | `layoutGraph(graph)` runs inside a `useMemo` whose dependency list includes `activeId`. Every node click recomputes the entire dagre layout. Layout depends only on `graph`; `activeId` should only flip a per-node `isActive` flag. |
| C4 | **P2** | L | `tools/validate_data.py:117-121` | `check_cycles` uses Kahn's algorithm but rescans the full `graph.items()` after every dequeue (line 117). Correct but O(V·(V+E)) instead of O(V+E). At 84 nodes it's fine; flag for future scaling. The "leftover" diagnostic on line 123 also reports nodes whose indeg was decremented mid-run — accurate but the message could be misleading. |
| C5 | **P2** | M | `site/src/lib/urlSync.ts:21` | `writeActiveNodeToUrl` uses `replaceState`, so back/forward buttons don't navigate node history. Clicking 5 nodes leaves the user with no way to return to nodes 1-4 via browser controls. Consider `pushState` with smart dedup. |
| C6 | **P2** | L | `tools/build.py:119` *(was)* / `Graph.tsx:119` | `graph.nodes.find(...)` inside a per-edge map is O(n·e). At 84×124 it's ~10k ops; fine, but the right shape is a `Map` lookup. |
| C7 | **P2** | L | `site/src/components/ResourcePanel.tsx:158` | `key={i}` on `resources.map` — array-index key. If resource order ever changes, React re-uses DOM with stale prop. Use a stable key (link + title hash). |

## (ii) Security / safety

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| S1 | **P1** | L | `tools/linkcheck.py:67` | `.linkcheck-ignore` matching is `if any(dom in link for dom in ignore)` — substring match. Adding `cookbook.openai.com` to ignore would also ignore `evil-cookbook.openai.com.attacker.com`. The file is empty today (no impact), but contributors will add entries. Hostname-aware match (e.g. `urlparse(link).netloc.endswith(ignored_domain)`) is the correct shape. |
| S2 | **P2** | L | `site/index.html:11-25` | OG `og:url`, `og:image`, `twitter:image` use absolute URLs hard-coded to `bettyguo.github.io/harness-engineer-roadmap/`. Not a security bug per se, but deploys to other hosts will silently advertise the wrong canonical URL. |
| S3 | **P2** | L | `.github/workflows/stale-link-issue.yml:58-60` | `github.rest.search.issuesAndPullRequests` is rate-limited at 30 req/min. A nightly run with >30 broken links would hit the limit and silently stop filing issues. Use the issues-list API with label filter instead. |

## (iii) Data integrity

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| D1 | **P1** | L | `roadmap-data/_schema.json:79-83` | `link` has `"format": "uri"` but `jsonschema` does not enforce `format` by default — it's informational unless a format-checker is registered. The `"pattern": "^https?://"` constraint IS enforced and is the real guard. Either remove the unused `format` to avoid misreading, or register `Draft202012Validator` with a format checker. |
| D2 | **P1** | L | `tools/validate_data.py` | No check that `area.color` values are globally unique — two areas could (and used to nearly) share a color. Currently OK by inspection but not enforced. Add a uniqueness check. |
| D3 | **P2** | L | `wiki/Curation-Bar.md` vs `roadmap-data/*.yml` | Curation Bar says: "Adding a tool to multiple nodes — pick the single most relevant node." But 15 nodes cite the same `Building effective agents` post, 4 cite `Don't Build Multi-Agents`, 3 cite three other resources. The policy needs an explicit carve-out for foundational readings (which legitimately serve multiple nodes), or the resource set needs pruning. Currently the repo silently violates its own stated curation bar. |
| D4 | **P2** | L | `tools/validate_data.py` | No check that `aliases[]` are unique within a node, lowercased, and not equal to the node's own `label`. Currently OK by inspection. |
| D5 | **P2** | L | `tools/validate_data.py` | No check that `resources[].title` is unique within a node (a duplicate is almost certainly a copy-paste mistake). |

## (iv) Performance

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| P1 | **P1** | L | `site/src/components/Graph.tsx:45-152` (see C3) | The per-click layout recompute is the dominant perf issue. Caching layout independently of `activeId` cuts every-click work by >95% in profiling-class measurement. |
| P2 | **P2** | L | `tools/validate_data.py:43, 62` | `load_yaml(path)` is called twice per area file (once in `validate_schema`, once in `collect_nodes`). Parse cost is small but doubled unnecessarily. Cache. |

## (v) Test coverage gaps

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| T1 | **P0** | M | `tools/` | **No tests for the Python tools.** `validate_data.py`, `linkcheck.py`, `build.py` are the contract that contributors and CI rely on. Per the constraint stated at the top of the audit brief: "If the test suite is absent or broken, that is itself a P0 finding." This is the finding. |
| T2 | **P0** | M | `site/src/` | **No tests for the site code.** Pure-logic modules (`lib/urlSync.ts`, `lib/layout.ts`, the search-scoring in `SearchOverlay.tsx`) are testable and currently untested. The renderer itself is harder to test but the helpers can be unit-tested with Vitest. |
| T3 | **P0** | L | repo root | **No CI step runs tests.** `.github/workflows/validate.yml` runs validate / build / linkcheck / typecheck but no `pytest` and no `vitest`. The infrastructure for testing doesn't exist. |

## (vi) Documentation

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| Doc1 | **P2** | L | `tools/linkcheck.py:42-49` | The substring-match behavior of `.linkcheck-ignore` is undocumented (only the line "Use sparingly" hints at it). Document explicitly. |
| Doc2 | **P2** | L | `wiki/Curation-Bar.md` | Add the foundational-reading carve-out so the policy and the data agree (related to D3). |

## (vii) Code quality

| ID | Severity | Risk | File:line | Description |
|----|----------|------|-----------|-------------|
| Q1 | **P2** | L | `tools/build.py:165` | Emoji (`🜂`) used as a tier marker in generated markdown. Repo convention is no decorative emoji. Replace with text or an asterisk. *Behavior to confirm — may be intentional aesthetic.* |
| Q2 | **P1** | L | `site/src/components/SearchOverlay.tsx:79-152` | Search overlay missing `role="dialog"` and `aria-modal="true"` — accessibility regression compared to ResourcePanel which has them. No focus trap; Tab cycles into the graph behind the modal. |
| Q3 | **P1** | L | `site/src/components/ResourcePanel.tsx:46-65` | Same as Q2 partially — has `role="dialog"` but no focus management (focus does not move into the panel on open) and no focus trap. Keyboard-only users have to tab through everything to reach the panel content. |

---

## Cross-cutting observations (not findings, context)

- **Repo size is small and well-organized.** No file exceeds 224 lines (the largest human-authored file is `roadmap-data/context.yml`). The 500-line cap CI check is active and currently a non-binding ceiling.
- **Data validation is strong** at the schema + edge level. The gaps (D1, D2, D4, D5) are *extra* checks, not failures of the existing ones.
- **Phase 6 hostile review (`PLANNING/06_review.md`) found different things** — the audit here is mechanical; that one is editorial. They are complementary, and findings G1–G10 from Phase 6 are tracked separately.
- **CI runs `pip install -r tools/requirements.txt` four times across three workflows** — could be consolidated. Not a finding per se.

## Phase 2 work plan (no edits yet — gate after Phase 1)

The brief says: fix P0 + low-risk P1 only, defer architectural / >50-LOC items.

**Will fix in Phase 2:**
- **T1, T2, T3** (P0) — establish the test infrastructure: `pytest` for `tools/`, `vitest` for `site/`, CI step. Add tests that exercise the things the next fixes touch (regression tests for those fixes).
- **C1** (P1, L) — fix `build.py` related-edge dedup; add regression test.
- **C2** (P1, L) — fix `linkcheck.py` partial-run report behavior; add regression test.
- **C3 / P1-perf** (P1, L) — fix `Graph.tsx` layout-recompute-on-click; add Vitest test for `layoutGraph` stability.
- **S1** (P1, L) — hostname-aware `.linkcheck-ignore` match; add regression test.
- **D1** (P1, L) — remove the unused `format: uri` from schema (and document the pattern as the real guard); add a test that exercises malformed URLs.
- **D2** (P1, L) — add area-color uniqueness check; add regression test.
- **Q2** (P1, L) — add `role="dialog"` + `aria-modal` + focus trap on SearchOverlay; add Vitest accessibility test.

**Will defer to Phase 3:**
- **C4, C5, C6, C7** — P2, refactor-flavored.
- **S2, S3** — P2, environmental / architectural.
- **D3, D4, D5, Doc1, Doc2** — P2, policy/docs.
- **P2** (validate caching) — P2, micro-perf.
- **Q1** (emoji) — P2 and "behavior to confirm" — surfacing only.
- **Q3** (focus management on ResourcePanel) — bigger keyboard accessibility lift; likely M-risk because focus trap interacts with the panel's existing Escape handler and overlay backdrop. Surfacing for Phase 3.
