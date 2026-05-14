# PHASE 0 — THINK

> Output of the THINK phase: noun validation, audience, competitive structural study, scope partition, interactive-format scoping, constellation map, risk log, open questions. The taxonomy and data model are NOT in this doc — they belong to Phase 1.

Date of research: 2026-05-14. All findings verified via web search; URLs preserved in the verification trail at the bottom of this file.

---

## 1. Noun validation — and the contingency

### Finding

"Harness engineering" / "agent harness" passes the validation bar. The noun is no longer nascent — it has been adopted by enough high-credibility sources, in enough independent venues, in the same ~90-day window, that landing a canonical roadmap *under exactly this name* is the right call rather than a gamble.

The convergent evidence:

| Source | Date | What it adds |
| --- | --- | --- |
| Mitchell Hashimoto, ["agent harness" essay](https://mitchellh.com/writing/my-ai-adoption-journey) | Feb 2026 | Formalized the noun + the formula `Agent = Model + Harness`. Treated as the canonical first reference by everyone since. |
| Birgitta Böckeler / Thoughtworks, [martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html) | 02 Apr 2026 (memo 17 Feb 2026) | "Harness engineering" as a *discipline*. Introduces guides/sensors, harnessability, behaviour vs maintainability harness — the first attempt at a vocabulary. |
| MongoDB tech blog, [The Agent Harness](https://www.mongodb.com/company/blog/technical/agent-harness-why-llm-is-smallest-part-of-your-agent-system) | May 2026 | Names the six-component harness (state, security, orchestration, memory, observability, evals). Major-vendor adoption. |
| Adnan Masood, ["Agent Harness Engineering — The Rise of the AI Control Plane"](https://medium.com/@adnanmasood/agent-harness-engineering-the-rise-of-the-ai-control-plane-938ead884b1d) | Apr 2026 | Frames harness engineering as the "control plane" for agentic AI — extends the vocabulary. |
| Addy Osmani, ["Agent Harness Engineering"](https://addyosmani.com/blog/agent-harness-engineering/) | 2026 | Engineering-influencer adoption — high search SEO surface. |
| Awesome lists: [ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering), [walkinglabs/awesome-harness-engineering](https://github.com/walkinglabs/awesome-harness-engineering) | 2026 | Two independent awesome lists, *both* using the exact phrase. |
| TechTimes, ["Harness Engineering Emerges as the Fourth Paradigm of AI Engineering"](https://www.techtimes.com/articles/316587/20260513/harness-engineering-emerges-fourth-paradigm-ai-engineering.htm) | 13 May 2026 | Mass-media positioning (the day before this research) — the term has crossed out of practitioner Twitter. |
| Preprints.org, ["Agent Harness for Large Language Model Agents: A Survey"](https://www.preprints.org/manuscript/202604.0428) | 2026 | First survey-paper attempt — academic legitimation, not yet peer-reviewed. |
| GitHub topic [`agent-harness`](https://github.com/topics/agent-harness) | active | Tag is in use by multiple repos. Discoverability tag exists. |

Counter-test: scanning for the noun *failing* to land. "Agentic engineer" / "agent engineer" job titles dominate ZipRecruiter, but `agent engineering` and `harness engineering` do NOT compete — the former is a job title, the latter is a craft within that job. Same with "AI engineer." The noun isn't being squeezed out; it's slotting into an empty layer.

### Decision

**Use "harness engineering" as the primary noun.** The title is `harness-engineer-roadmap`, the H1 reads "Harness Engineering Roadmap," and the repo description leads with the phrase.

But the noun is two months old and *will* contest space with adjacent terms for at least another year. So in parallel:

1. **The subtitle and meta description rank for adjacent terms.** Subtitle: *"An interactive roadmap for harness engineering — building the agent loop, tool layers, context engineering, memory, retrieval, eval harnesses, and the rest of the scaffolding around modern LLMs."* This single sentence picks up `context engineering`, `agent infrastructure`, `eval harness`, `tool layer` as supporting search-coverage.
2. **README explicitly defines harness engineering by enumerating its sub-disciplines** so a reader who arrived searching "context engineering" or "AgentOps" lands and immediately understands they're in the right place.
3. **GitHub topics include:** `harness-engineering`, `agent-harness`, `context-engineering`, `agent-infrastructure`, `agentops`, `llm-agents`, `agent-frameworks`, `roadmap`. Eight topics is the max; all chosen to claim the cluster.
4. **The data model carries `aliases` per node** so internal search and any future tag-cloud picks up adjacent terms.

The honest read: if the field consolidates on "agent engineering" instead, this repo's title becomes slightly off but the *content* is the index of the discipline — it survives a noun shift the same way `developer-roadmap` survived "full-stack" → "platform engineer."

---

## 2. Audience and anxiety map

The readers are not students. They are:

- **The AI engineer two years in** who can call an API, who has shipped a demo agent, and whose agent breaks in production in ways they can't diagnose. They search Twitter at 11pm.
- **The senior backend engineer** moving sideways into agent work because their company asked. They have ten years of distributed-systems instinct and are correctly suspicious that this domain has no playbook.
- **The applied-research engineer** at a small AI shop, sharp on models, light on production scaffolding.
- **The team lead** at a company with one production agent and a quarterly mandate for three more, looking for the literature.

The shared anxiety, in their words: *"my agent works in the demo and falls apart in the real world — how do I actually get good at this."* The MongoDB framing is the same anxiety from the buyer side: 88% of agent projects never make it to production, and it's not the model.

This anxiety is the repo's reason to exist. The opening two sentences of the README must speak it back to them word for word. The diagram must answer it visually within five seconds of landing.

What this audience does NOT need: an intro to LLMs, a glossary of tokens/embeddings, a "what is an agent" explainer. The repo assumes they know; the depth is the value.

---

## 3. Competitive structural study

### `developer-roadmap` (kamranahmedse / nilbuild) — 355k stars (verified May 2026)

Why it works as a *visual artifact*:

- **One landing page = one diagram.** The full discipline is visible at a glance. The screenshot itself is the marketing.
- **Clickable nodes.** Each box opens a panel of curated resources. Linear-fallback markdown exists but the diagram is the front door.
- **Tier markers.** Solid outline = core, dashed = recommended, dotted = optional. Reduces the "where do I start" paralysis.
- **Edges encode dependencies.** You can read order off the page.
- **Stack:** Astro + TypeScript (84.5%). Custom roadmap editor (`@roadmapsh/editor`) — they have factored the renderer into a private package. Not directly reusable.
- **Aesthetic:** distinctive flat-vector look with a deliberate palette; the diagram does not look like a generic Mermaid render. The look is part of the brand.

The takeaway for *this* project is structural, not stylistic. We need:

1. A single, full diagram on day one.
2. JSON-driven content / renderer split — exactly the data-model-first discipline Phase 1 demands.
3. A tier system per node (core/recommended/optional).
4. Edges as visible dependencies.
5. A click-to-resource-panel interaction.
6. A look distinct enough that the diagram is shareable on its own — and distinct from `developer-roadmap` so we're not derivative.

### Current agent / harness tooling landscape (May 2026 weekly star board)

A representative scan:

| Repo | What it is | Format |
| --- | --- | --- |
| [HKUDS/OpenHarness](https://github.com/HKUDS/OpenHarness) | "Open agent harness with built-in personal agent" — an executable harness framework. | **Code tool**, not a learning map. |
| [agentops-ai/agentops](https://github.com/AgentOps-AI/agentops) | Observability/monitoring SDK for agents. | **Code tool.** |
| [raphaelchristi/harness-evolver](https://github.com/raphaelchristi/harness-evolver) | Claude Code plugin that iteratively optimizes the harness. | **Code tool.** |
| [revfactory/harness](https://github.com/revfactory/harness) | 100 production agent-team harnesses (orchestrator + specialist skills). | **Code tool.** |
| [ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) | Awesome list. | **Static markdown list.** Long but flat. |
| [walkinglabs/awesome-harness-engineering](https://github.com/walkinglabs/awesome-harness-engineering) | Awesome list (smaller). | **Static markdown list.** |
| [VoltAgent/awesome-ai-agent-papers](https://github.com/VoltAgent/awesome-ai-agent-papers) | Curated 2026 agent papers. | **Static markdown list.** |
| [langroid/langroid](https://github.com/langroid/langroid) | Multi-agent framework. | **Framework.** |
| [davidkimai/Context-Engineering](https://github.com/davidkimai/Context-Engineering) | Context-engineering handbook. | **Static markdown handbook** — closest to a learning artifact, but linear, no map. |

The structural gap is clean. Every existing artifact in this category is either (a) a tool, (b) a flat awesome list, or (c) a linear handbook. **There is no interactive visual roadmap.** The `developer-roadmap` format applied to harness engineering is an open category.

### Why this is the right wave to ride

The weekly star board on the day of this research is dominated by agent/harness infra: OpenHarness, Harness Evolver, AgentOps, agent papers, awesome lists. The wave is at peak attention. Mass-media coverage ("Fourth Paradigm of AI Engineering", TechTimes, 13 May 2026) lands one day before this research, which usually marks the start — not the end — of the discovery curve. Launch window is open and probably stays open through summer 2026.

---

## 4. The scope partition (critical)

There is an adjacent peer repo, `bettyguo/ai-engineer-roadmap`, building the **breadth** map of the whole AI-engineer career path. This repo is the **depth** map of one craft. The partition is enforced everywhere or the two repos will be read as duplicates and the stars will split.

| | `harness-engineer-roadmap` (this repo) | `ai-engineer-roadmap` (peer) |
| --- | --- | --- |
| **Scope** | One craft, fully detailed. | One career path, breadth-first. |
| **Assumes** | Reader knows where harness engineering sits. | Reader is figuring out the field. |
| **Covers** | Agent loop, tool design, context engineering, memory, retrieval, multi-agent, evals, failure modes, cost/latency, security, patterns. | Model fundamentals → prompting → fine-tuning → eval → deployment → **harnesses (one stage)** → multimodal → etc. |
| **Does NOT cover** | Model training, internals, prompt engineering 101, RAG-from-scratch, the broader career path. | Any individual stage in full depth — including this one. |
| **Reading time** | "I will return to this every week for a year." | "I will read this once to map the field." |
| **Relationship** | Sideways peer. "For the broader career path this fits into, see `ai-engineer-roadmap`." | Sideways peer. "For the harness-engineering craft in full depth, see `harness-engineer-roadmap`." |

### Mechanical rules to keep them apart

1. **No node in `harness-engineer-roadmap` re-explains what an LLM is, what a token is, what RAG is at a 101 level.** Where a basic concept is needed, link out to `ai-engineer-roadmap` for breadth — never re-teach it here.
2. **No node in `ai-engineer-roadmap` goes more than one card deep on a harness sub-topic.** Where depth is needed, link in to this repo.
3. **The two repos commit to visually distinct aesthetics.** Not a matched set. The peer link is sideways, not branded as a family.
4. **One sentence in each README spells the partition out** so a reader who lands on the wrong one knows which to read.

This partition is the single most important framing decision in Phase 0. Violating it produces the "two roadmaps look like duplicates" failure mode, which would harm both.

---

## 5. Interactive-format scoping

### Decisions (locked unless Phase 1 finds a blocker)

**Rendering library:** React Flow (xyflow). Reasoning:

- Mature, actively maintained, ~30k stars, MIT-licensed.
- Pan, zoom, fit-to-view, minimap, controls — all built in. We don't reinvent input handling.
- Fully customizable node and edge components. We can paint our own visual language on top — distinctive look is on us, not on the library.
- Renders SVG; screenshots are crisp at any resolution (critical for the launch screenshot).
- Comparable hand-built SVG would take 2–3× the effort with worse pan/zoom polish, and end up looking generic anyway.

**Stack:**

- React 18 + TypeScript + Vite (fast dev, fast static build).
- Tailwind for utility classes; a hand-tuned color/typography theme on top so it is *not* the generic shadcn-default look.
- React Flow for the graph.
- Markdown rendering inside the resource panel via `marked` or `remark` — no MDX required.
- Static site, no backend. JSON content is bundled at build time.

**Data flow:** `roadmap-data/<area>/*.yml` is the source of truth. A build step (`tools/build.py`) walks it, validates, and writes a single `site/src/data/graph.json` consumed by the React app. Content authors never touch the renderer.

**Click → resource panel:** Slide-in side panel (right side, ~480px), pinned, with a back-to-graph affordance. Mobile: full-screen modal.

**Visual tiering:** Core nodes filled; recommended nodes outlined; optional nodes dashed. Mirrors the `developer-roadmap` convention so the visual grammar is familiar.

**Hosting:** GitHub Pages from a `gh-pages` branch or `/docs` folder. CI builds, deploys on push to `main`. Cloudflare Pages as a fallback if GH Pages does not handle a large static bundle. A precise `docs/DEPLOY.md` recipe is mandatory in case the in-loop deploy step cannot run (it likely cannot run from this Windows host without manual GitHub repo creation).

**Static-markdown fallback:** `build.py` also emits a generated `content/*.md` per area so the repo is browsable on GitHub without the live site. Linked from the README as "prefer the live site, but a static fallback is here."

### What is explicitly out of scope for v1

- User accounts, progress tracking ("mark as done" persisted across visits). Maybe v2.
- Search inside the diagram. Browser Cmd-F over the static fallback is enough for v1.
- Mobile-first interactions. The diagram is desktop-first; mobile shows the area list + per-area cards.
- Editor UI for contributors. Contributors edit YAML and submit PRs.

---

## 6. Constellation map

This repo lives in a four-repo constellation, all standalone peers under `bettyguo`. None nests under another.

| Peer | Role | Cross-link wording (from this repo) |
| --- | --- | --- |
| `bettyguo/ai-engineer-roadmap` | Breadth — the full AI-engineer career path. | "For the broader AI-engineer career path this fits into, see [ai-engineer-roadmap](https://github.com/bettyguo/ai-engineer-roadmap)." |
| `bettyguo/llm-interview-prep` | Interview prep, agent/harness depth on the questioning side. | "Going on the job market? [llm-interview-prep](https://github.com/bettyguo/llm-interview-prep) drills the agent/harness questions that come up in interviews." |
| `bettyguo/build-your-own-ai` | Hands-on agent-loop-from-scratch exercises. | "Want to build the agent loop yourself? [build-your-own-ai](https://github.com/bettyguo/build-your-own-ai) is the practical companion." |

### Placement

- Three sideways links live in a "**Sister roadmaps**" block in the README between the live-site link and "How to use this." Not in the footer (too easy to miss), not in the diagram (clutters the visual).
- The site footer carries the same three links in a smaller, repeated form.
- The peer repos receive a reciprocal link in their own READMEs (coordination noted as a manual cross-repo step in `docs/LAUNCH.md`).

### Assumption logged

The three peer repos may or may not exist publicly on GitHub by the time this repo ships. If they don't yet, the README links still work — they 404 and the user gets a normal GitHub 404 page — and a launch-day cross-link audit will replace dead links with "coming soon" badges if needed. Logged in the risk section.

---

## 7. Risk log

| # | Risk | Likelihood | Severity | Mitigation |
| --- | --- | --- | --- | --- |
| R1 | The noun shifts to "agent engineering" or folds into "AI engineer." Title becomes mildly off. | Medium | Medium | Subtitle, meta description, and GitHub topics also rank for adjacent terms (§1). Content is the moat — title is recoverable later via a single rename + README edit. |
| R2 | Fast staleness — harness tooling churns monthly. Tool names go stale faster than concept-level content. | **High** | High | Every node distinguishes **durable concepts** (long-life) from **current examples** (tool churn expected). The `durable_vs_current` flag is in the resource schema. README states a maintenance cadence (monthly link-check, quarterly content sweep). A `Last updated` badge is visible. |
| R3 | "Two roadmaps look like duplicates" — `ai-engineer-roadmap` and this one read as the same artifact. | Medium | **High** | The scope partition (§4) is enforced via the README's one-sentence boundary statement, distinct visual aesthetic, sideways peer link wording, and a Phase 6 hostile-reviewer pass dedicated to this exact question. |
| R4 | Thin-launch — visitor lands and sees stub nodes, concludes the repo is unfinished. | Medium | **High** | Phase 2 builds the **complete skeleton**; Phase 4 backfills resources. Every node has at least 1 resource before launch — minimum bar enforced by `validate_data.py`. |
| R5 | Wrong/dead links — destroy the "canonical" property under a real academic identity. | Medium (~10% per first draft) | **High** | `linkcheck.py` runs on every PR + on a daily schedule via CI. Every Phase 4 resource is web-verified and logged in `PLANNING/04_verification_log.md`. Unverifiable resources are dropped. |
| R6 | Renderer takes longer than markdown — Phase 3 blows up. | Medium | Medium | React Flow does the heavy lifting; we ship a YAML→JSON build + a render of nodes/edges + a click-panel. ~600 LOC ceiling. If Phase 3 stalls, the markdown fallback ships first and the diagram lands as a follow-up — repo is not blocked. |
| R7 | Frontend looks like generic-AI-slop — the launch screenshot is bad. | Medium | High | The `frontend-design` skill referenced in the prompt is at a Linux path unavailable on this host (logged as assumption A1). In its absence: commit to a deliberate aesthetic direction (typography-first, distinctive palette, hand-tuned spacing) in Phase 1; verify visually in Phase 3; redo if it reads as generic during Phase 6. |
| R8 | Abandonment risk — repo goes stale under a real name. | Medium | Medium | Maintenance cadence stated upfront. Issue templates make contributor PRs easy. "Recent additions" section gives visible signal of activity. |
| R9 | Live-site deploy can't run from this Windows host (no GitHub auth in the loop, possibly no `gh` configured). | **High** | Medium | Mitigation baked into Phase 3: write the renderer + build + a precise `docs/DEPLOY.md` recipe; verify the local dev server runs; defer the actual `git push` + GH Pages enablement to the human as one explicit manual step. |
| R10 | HKU has a competing artifact under the same university — [HKUDS/OpenHarness](https://github.com/HKUDS/OpenHarness). Awkward optics. | Low | Low | OpenHarness is a *code tool*, not a roadmap. Different artifact, different audience. Reference it positively as a tool worth knowing in the relevant node, attribution intact. No conflict. |
| R11 | Two competing awesome lists already exist (`ai-boost`, `walkinglabs`). They could be perceived as the canonical reference. | Medium | Medium | Differentiate on format: interactive visual roadmap with dependency edges, tier system, "competent" criteria per node — none of which an awesome list provides. The launch story explicitly contrasts "flat awesome list" vs "navigable map." |

---

## 8. Open questions

1. **Do `ai-engineer-roadmap`, `llm-interview-prep`, `build-your-own-ai` exist on GitHub yet?** Cross-links assume they will. If not at launch, do they get "coming soon" badges or no link? — **Assumption A2: link anyway; if they 404 at launch we patch on the day.**
2. **Live deploy URL.** GH Pages default would be `bettyguo.github.io/harness-engineer-roadmap` — confirm Betty's GH handle is `bettyguo` (the prompt states this) and that GH Pages is enabled. — **Assumption A3: assumed, captured as a manual step in `docs/LAUNCH.md`.**
3. **Banner/social card image.** Phase 5 says "if image generation unavailable here, `assets/MAKE_BANNER.md` with the spec." Image generation is not configured in this environment. — **Plan: ship `assets/MAKE_BANNER.md` with a precise visual spec; the diagram screenshot itself is the primary launch asset, banner is a secondary nice-to-have.**
4. **License confirmation.** Prompt says CC-BY-4.0 (content) / MIT (code). Confirmed used as-is.
5. **Patterns area depth.** Should "Patterns & Anti-Patterns" be its own first-class area in the graph, or a separate dedicated page? — **Decision: first-class area in the graph AND a long-form markdown companion page that the area links into; the page is shareable standalone.**
6. **The HKU Prof. Yiu attribution.** Should this list Prof. Yiu's lab page or just his name? — **Decision: name + faculty page in the README footer; ORCID for Betty Guo; no specific lab page unless one exists. Captured as a manual confirmation step.**

### Assumptions logged (proceeding without confirmation per the user's directive to work autonomously)

- **A1.** The `frontend-design` skill at `/mnt/skills/public/frontend-design/SKILL.md` is unavailable on this Windows host (verified by `ls`). In its absence, follow general distinctive-design principles: deliberate color palette (custom, not Tailwind-default), real typography (Inter Display or similar for the H1, a monospace for technical labels), generous whitespace, no emoji decoration, one decisive accent color. Verify the result by hostile-review screenshot in Phase 6.
- **A2.** Peer repo URLs (`bettyguo/ai-engineer-roadmap`, `bettyguo/llm-interview-prep`, `bettyguo/build-your-own-ai`) are linked even if not yet public. A launch-day cross-link audit is in `docs/LAUNCH.md`.
- **A3.** Live URL planned as `https://bettyguo.github.io/harness-engineer-roadmap/`. README and CI configured for this. If Betty chooses a different host (Vercel/Cloudflare/custom), the deploy step changes but the build artifacts do not.
- **A4.** Verification at ~10% first-draft error rate is the planning baseline; Phase 4 audits all links and `linkcheck.py` enforces zero unverified at launch.
- **A5.** "harness engineering" is the locked primary noun; the title does not pivot mid-build.

---

## Verification trail (sources cited above)

- [martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html) — Birgitta Böckeler, 02 Apr 2026 — verified via WebFetch, author/date/contents confirmed.
- [Mitchell Hashimoto, my AI adoption journey](https://mitchellh.com/writing/my-ai-adoption-journey) — Feb 2026 — referenced via secondary sources; first-hand fetch deferred to Phase 4 verification log.
- [MongoDB blog: The Agent Harness](https://www.mongodb.com/company/blog/technical/agent-harness-why-llm-is-smallest-part-of-your-agent-system) — May 2026 — referenced.
- [TechTimes: Harness Engineering Emerges as the Fourth Paradigm of AI Engineering](https://www.techtimes.com/articles/316587/20260513/harness-engineering-emerges-fourth-paradigm-ai-engineering.htm) — 13 May 2026 — referenced.
- [Preprints.org: Agent Harness for Large Language Model Agents: A Survey](https://www.preprints.org/manuscript/202604.0428) — 2026 — referenced.
- [ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering) — referenced.
- [walkinglabs/awesome-harness-engineering](https://github.com/walkinglabs/awesome-harness-engineering) — referenced.
- [HKUDS/OpenHarness](https://github.com/HKUDS/OpenHarness) — referenced.
- [GitHub topic: agent-harness](https://github.com/topics/agent-harness) — referenced.
- [Andrej Karpathy: "+1 for 'context engineering'"](https://x.com/karpathy/status/1937902205765607626) — referenced for adjacent-term coverage.
- [davidkimai/Context-Engineering](https://github.com/davidkimai/Context-Engineering) — referenced as the closest existing learning artifact, structurally distinct (handbook, linear).
- [kamranahmedse/developer-roadmap](https://github.com/kamranahmedse/developer-roadmap) — 355k stars confirmed via WebFetch — referenced as the structural reference.
- [Yao et al. 2023, ReAct (ICLR 2023)](https://arxiv.org/abs/2210.03629) — referenced for foundational agent-loop work.
- [agentops-ai/agentops](https://github.com/AgentOps-AI/agentops) — referenced for the AgentOps category.

---

## CHECKPOINT 0 — RESULT

- **Noun decision:** Use "harness engineering" as primary. Validated as established (Feb–May 2026 adoption wave, multiple high-credibility independent sources, no successful adjacent term squeezing it out). Subtitle and topics also rank for `agent harness`, `context engineering`, `agent infrastructure`, `AgentOps`.
- **Scope partition:** Hard boundary with `ai-engineer-roadmap`. This repo = depth on one craft. That repo = breadth on the career. Sideways peers, distinct aesthetics, one-sentence boundary in each README.
- **Format:** Interactive node-graph site (React + Vite + React Flow + Tailwind), JSON-driven, GitHub Pages hosted, with static markdown fallback.
- **Top risks:** staleness (mitigated by durable-vs-current flagging + maintenance cadence), duplicate-perception (mitigated by partition + visual differentiation), generic-AI-slop look (mitigated by deliberate aesthetic direction in Phase 1).
- **Assumptions logged:** A1–A5 above. Proceeding to Phase 1 without waiting for confirmation per the user's directive.
