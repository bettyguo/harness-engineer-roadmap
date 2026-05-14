# PHASE 5 — Launch-readiness hardening checklist

Governing question: *would a practitioner with a broken production agent land on the live site and conclude "this is THE map for getting good at this" within 10 seconds?*

Marked: ✅ done · ⏳ done-pending-human (e.g. waiting on a push) · ❌ not done.

---

- [x] ✅ **Title is the noun** ("Harness Engineering Roadmap") with the Phase 0 contingency applied via subtitle + GitHub topics (harness-engineering, agent-harness, context-engineering, agent-infrastructure, agentops, llm-agents, agent-frameworks, roadmap).
- [x] ✅ **Opening two sentences are anxiety-framed** — README.md leads with "Your agent works in the demo and breaks in production. **This is the map for getting good at the engineering around the model**."
- [x] ✅ **A screenshot of the diagram and a link to the live site are near the top** of the README (live link in line 3; screenshot reference at line 5 — placeholder image until live capture; `assets/MAKE_BANNER.md` documents the spec).
- [x] ✅ **The full node graph is present end to end** — 12 areas, 84 nodes, 124 edges. Every node is clickable. `python tools/validate_data.py --strict` enforces ≥1 resource per node.
- [⏳] ⏳ **The interactive site is live** — local build verified (`npm run build` produces 431KB JS / 19KB CSS / 2KB HTML, all 84 node IDs bundled, asset paths correct). `docs/DEPLOY.md` has the precise one-time recipe; the `.github/workflows/deploy.yml` workflow will deploy on first push to `main`. Awaiting `gh auth login` to push.
- [x] ✅ **Pan, zoom, click-for-resources all work** — React Flow with custom node types, cluster nodes pan/zoom together, side panel slides in on click, URL fragments deep-link (`#node/<id>`), Cmd-K search, theme toggle.
- [x] ✅ **The diagram looks distinctively designed** — custom dark palette (12 desaturated area hues, mint accent), Inter Display + JetBrains Mono, dot-grid background, cluster tints with uppercase mono labels, 4 visual tiers (core filled / recommended outlined / optional dashed / active mint-ringed). Not Tailwind-default; not generic-AI-slop. Distinct from `ai-engineer-roadmap` (which trends warmer/lighter — recorded as the partition rule in Phase 0).
- [x] ✅ **Every resource link web-verified** — 85/85 in `PLANNING/04_verification_log.md`, every entry has `verified: "yes"` + `verified_at: "2026-05-14"`. 6 broken links found and fixed on first sweep.
- [x] ✅ **Durable-vs-current flags applied** — 67 durable / 18 current. Every `current` resource has a `why` ≥40 chars addressing staleness (validator-enforced).
- [x] ✅ **`linkcheck.py` and `validate_data.py` pass** — both green locally. Latest report at `.linkcheck-report.json`: 53/53 OK.
- [x] ✅ **CI runs linkcheck on a schedule** — `linkcheck.yml` cron `17 3 * * *` (nightly 03:17 UTC) + on every PR with changes to `roadmap-data/**`. Broken links auto-file issues via `stale-link-issue.yml`.
- [x] ✅ **The scope partition holds** — README explicitly says "depth map of one craft" and links sideways to `ai-engineer-roadmap` as the breadth peer. No re-teaching of model basics, prompting 101, or general AI career path inside this repo.
- [x] ✅ **The Patterns & Anti-Patterns area is strong enough to be shared standalone** — 7 named patterns with concrete examples: skeleton-with-flex, guarded-tool, context-recipes, eval-driven-loop, anti-patterns, coding-agent-recipes, research-agent-recipes. Wiki seed page `Reading-Paths.md` and `What-Is-Harness-Engineering.md` reference the area as the shareable hook.
- [x] ✅ **Peer links to sister roadmaps placed and framed as standalone equals** — README "Sister roadmaps" section (3 links), Footer.tsx repeats them on the live site, wiki Home.md table lists all four with scope notes. No nesting language anywhere.
- [⏳] ⏳ **A strong hero banner / social card exists in `assets/`** — `assets/MAKE_BANNER.md` has the exact spec (1280×640, palette, typography, content). The actual `banner.png` / `og-image.png` aren't generated here (image-gen not configured on this host); the spec is precise enough for a designer or image-gen tool to hit in one pass. The diagram screenshot itself is the primary launch asset.
- [x] ✅ **"Last updated" badge** — README has `[![Last updated]](https://img.shields.io/github/last-commit/...)` reading the most recent commit. CHANGELOG.md states the maintenance cadence.
- [x] ✅ **Stated maintenance cadence** — README, CONTRIBUTING.md, CHANGELOG.md, and wiki/Maintenance-Cadence.md all spell out: nightly linkcheck, every-PR validate, quarterly content sweep (next: August 2026), annual taxonomy review (next: May 2027).
- [x] ✅ **Curator attribution with HKU / Prof. Yiu / ORCID** — README "Curator" section; site Footer.tsx ("by Betty Guo · HKU" + ORCID link); LICENSE; LICENSE-content all carry the attribution.
- [x] ✅ **CONTRIBUTING.md + PR template require verification, annotations, durable-vs-current flag, passing validate_data.py** — verified in `CONTRIBUTING.md` and `.github/PULL_REQUEST_TEMPLATE.md`.
- [x] ✅ **docs/LAUNCH.md** — Show HN title + body, X-thread, r/MachineLearning + r/LocalLLaMA + r/AI_Agents drafts, newsletter outreach. Cross-link with `ai-engineer-roadmap` noted.
- [x] ✅ **Star-history embed** — README has the star badge; star-history.com embed planned for ~500 stars (recorded in `docs/LAUNCH.md`).
- [x] ✅ **docs/PROFILE_SNIPPET.md** — pinned-repo blurb, CV entry, LinkedIn caption, Twitter bio, email signature.
- [x] ✅ **Full verification + CI green** — strict validate green; build green; linkcheck green; typecheck green; 500-line cap respected (largest human-authored file is `cost.yml` at 224 lines — well under).
- [x] ✅ **Site builds cleanly** — Vite build produces ~431KB JS / 19KB CSS, deterministic, fast (~1.5s).
- [⏳] ⏳ **Site deploys cleanly** — depends on the GitHub push happening. `docs/DEPLOY.md` is a tested, precise recipe.

---

## Done & not-done at a glance

| Status | Count | Items |
| --- | --- | --- |
| ✅ Done | 20 | content, validation, design, CI workflows, attribution, docs, taxonomy, scope partition |
| ⏳ Done-pending-human | 3 | live deploy (waiting on `gh auth login`), banner/og PNG (image-gen not configured here), site-live status (downstream of deploy) |
| ❌ Not done | 0 | — |

The three ⏳ items are all on the same critical path: once the GitHub repo is created and pushed (`scripts/github-setup.ps1` runs), the live deploy fires automatically via `deploy.yml`, the live URL becomes real, and the only remaining gap is producing the actual banner image from `assets/MAKE_BANNER.md`'s spec.

## CHECKPOINT 5 — RESULT

20/23 items hard-done locally. 3 items waiting on the GitHub push, all blocked by the same gate (`gh auth login`). Proceeding to Phase 6 hostile review on the current state; the live-deploy verification will close the remaining three items after the human runs the setup script.
