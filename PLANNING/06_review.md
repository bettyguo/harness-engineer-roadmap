# PHASE 6 — Hostile review

Re-reading the repo and clicking through the site as (a) a senior agent-systems engineer, (b) a stuck practitioner, (c) a skeptical HN commenter. The point of this doc is to find the things that would lose trust on the launch day, then fix the cheap ones now and convert the rest into a "roadmap gaps" issue list.

## Reviewer A — Senior agent-systems engineer

> "I've shipped three production agents. I'm scanning this for the things you got wrong."

**Sharp criticisms:**

1. **"Multi-agent orchestration is 7 nodes for a discipline most practitioners shouldn't be doing."**
   Looking at the area, 4 of the 7 nodes are "don't do this" or "do this carefully." That's correct — but the area count makes multi-agent *feel* more central than it deserves. **Mitigation:** the `orchestration.single-vs-multi` and `orchestration.anti-patterns` core-tier nodes plus the cross-link to `patterns.anti-patterns` already steer readers away. The framing in the area blurb ("...and the more important question of when one is.") makes the position explicit.
   **Verdict:** no change. The framing carries.

2. **"You don't have a `prompting fundamentals` node anywhere."**
   This was a deliberate Phase 0 partition: prompting 101 lives in `ai-engineer-roadmap` (breadth). Re-teaching it here would violate the scope partition. The closest nodes — `context.system-prompts`, `context.structured-context` — are correctly *not* prompting basics.
   **Verdict:** keep. Document the partition more loudly? See gap G1 below.

3. **"Where's `function calling` as its own node?"**
   It's distributed across `tools.tool-design`, `tools.schema-design`, and `reliability.structured-output`. The argument for splitting it out: it has its own well-known name, and many practitioners would search for it directly.
   **Verdict:** add `function calling` as an alias on `tools.schema-design`. Done below.

4. **"`patterns.research-agent-recipes` cites Self-RAG. Self-RAG isn't research-agent."**
   Fair. Self-RAG is about generation + retrieval + self-critique, not the browse→read→cite loop. Better citations exist (e.g. STORM, ReSearch, or Anthropic's deep-research blog when it lands). For Phase 6 the resource stays — Self-RAG's "abstain when you don't know" mechanism *is* the load-bearing transfer to research agents — but the `why` should reflect that more precisely.
   **Verdict:** sharpened the `why` text. Logged as gap G2 (find a better primary citation when one lands).

5. **"Cost tracking depends on `evals.tracing`. That's backwards — you can do cost tracking without tracing."**
   Technically true but operationally false. Per-call cost attribution without a trace structure is a tax-on-yourself; the dependency models the realistic adoption path.
   **Verdict:** no change. The edge is defensible.

6. **"`reliability.fallbacks` recommends a book (Nygard's Release It!). That's a cost: paid resource — does it earn its place?"**
   Yes. There is no equivalent open-source long-form on stability patterns at the same depth. The `cost: paid` flag is honest; the resource is durable for a decade.
   **Verdict:** no change.

7. **"`evals.observability-tools` is a moving target. By 2027 half these names will rotate."**
   That's exactly why the node is `tier: recommended` and the resource is `durability: current` with a `why` that addresses staleness. The framing here is: know the *capabilities* (trace search, replay, eval integration, cost dashboard) so you can pick a tool by capability, not by brand.
   **Verdict:** no change.

## Reviewer B — Stuck practitioner

> "My agent works in the demo and breaks in production. I came here to get unstuck."

**Where would they land first?** README → live site. The live site opens to the diagram fitView. Their natural action: scan for something they recognize, click it.

**Pain points:**

8. **"The first thing I see is 12 areas at once. Where do I start?"**
   The README has three reading paths, but they don't appear on the live site landing. **Mitigation:** the header subtitle reads "the depth map for building reliable systems around LLMs" and the Foundations cluster is positioned far-left as the natural entry. The Cmd-K search is one keystroke away. Reading paths are also in `wiki/Reading-Paths.md`.
   **Verdict:** good for v1. Gap G3: consider a "Start here" overlay on first visit (localStorage flag) for v2.

9. **"The competent_means rubrics are great but I can't see them at a glance."**
   Right — they're only visible after clicking the node. The compromise: the diagram stays readable because rubrics are long-form. **Verdict:** no change for v1. Gap G4: optional rubric tooltip on hover for v2.

10. **"I'm a stuck practitioner. The reading-paths page is in the wiki, not on the site."**
    The wiki is one click from the README; not zero clicks from the diagram. **Mitigation:** Add reading-paths links to the header? Probably too crowded. The Cmd-K search hint + the three-area-cluster Foundations group functions as the entry rail.
    **Verdict:** Gap G5: add a small "?" / help button in the site header that opens an overlay with the three reading paths. Not critical for launch.

11. **"I don't know what `core` vs `recommended` vs `optional` means at first glance."**
    Tier shows in the node label (`tier` displayed in mono caps lower-right of each node). But the legend isn't visible. **Mitigation:** the resource panel shows it explicitly; the visual styling (filled / outlined / dashed) is the legend itself.
    **Verdict:** Gap G6: optional one-line legend in the header bar, low priority.

## Reviewer C — Skeptical HN commenter

> "'Harness engineering' isn't a real thing / this is just an agent-frameworks list / why are there two of these roadmaps?"

**Three predictable attacks, and the defense for each:**

12. **"'Harness engineering' isn't a real noun."**
    Defense: the Phase 0 validation cites Hashimoto Feb 2026, Böckeler Apr 2026, MongoDB May 2026, two awesome-list repos, a preprints.org survey, and TechTimes mass-media coverage on May 13 2026 — the day before this research. The README opener mentions all the founding citations by name. The "Why this exists" section walks the reader through the timeline.
    **Verdict:** Already defended. The Phase 0 contingency (subtitle, GitHub topics covering adjacent terms) is the backstop if the field consolidates on a different noun.

13. **"This is just an agent-frameworks awesome list."**
    Defense: the structural contrast section in PLANNING/00_think.md addresses this directly. The map has dependency edges, a tier system, a "competent means" rubric per node, an interactive renderer, and a durable-vs-current flag on every resource — none of which an awesome list has. The Patterns & Anti-Patterns area especially is structured around named patterns with criteria, not link dumps.
    **Verdict:** Already defended.

14. **"Why are there two of these roadmaps?"**
    Defense: Phase 0 scope-partition table is explicit. The README leads with the partition statement. The sister-roadmaps section names all four peers and what each is for. The visual aesthetics are deliberately distinct (Phase 1 design rule: this repo is darker/cooler; ai-engineer-roadmap trends warmer/lighter).
    **Verdict:** Already defended. The single most important framing decision; verified the partition holds in every artifact.

15. **"PhD-curated content is overrated. Why should I trust this over the awesome list?"**
    Defense: the verification log (PLANNING/04_verification_log.md) is public — every link, every fix, every decision. The CI workflows are open. The curation bar is documented. The wiki Curation-Bar page explains why specific things get rejected. *Show, don't tell.*
    **Verdict:** strongly defended by transparency. Don't argue this in the launch posts — let the artifacts do it.

## Fixes applied during this review

- **(F1)** Added `function calling` to `tools.schema-design` aliases (Reviewer A #3).
- **(F2)** Sharpened the `why` on the Self-RAG citation in `patterns.research-agent-recipes` (Reviewer A #4).

## Roadmap gaps — issue list (for after launch)

These are NOT blockers for launch. They go into the issue tracker post-launch.

- **G1:** Add a small "Why two roadmaps?" callout near the README "Scope" section that links to the [Standalone-equal positioning doc on the wiki].
- **G2:** Find a better primary citation for `patterns.research-agent-recipes` (the OpenAI Deep Research / Anthropic Research / Gemini Deep Research class). Currently citing Self-RAG, which is adjacent.
- **G3:** Consider a first-visit "Start here" overlay on the live site (3 reading paths, localStorage-gated).
- **G4:** Hover-tooltip showing the `competent_means` rubric without opening the panel.
- **G5:** "?" help button in the site header that opens reading-paths overlay.
- **G6:** Optional one-line legend ("core / recommended / optional") in the site header.
- **G7:** When `ai-engineer-roadmap` ships, double-check the sideways links work and the aesthetic-distinctness is visible side-by-side.
- **G8:** When a Hashimoto follow-up / Böckeler v2 / a real survey paper lands, swap into `foundations.what-is-a-harness`.
- **G9:** Add a `cost.kv-cache-discipline` node if KV-cache reuse becomes a distinct enough practice (currently bundled into `cost.caching`).
- **G10:** Quarterly: audit every `durability: current` resource. Next: August 2026.

## CHECKPOINT 6 — RESULT

- All three reviewer personas have been simulated and their hardest critiques have a defense or a logged gap.
- Two cheap fixes applied (F1, F2).
- Ten roadmap gaps logged for post-launch. None block launch.
- The scope partition with `ai-engineer-roadmap`, the noun-validation argument, and the "this is curated not bulk" defense all hold under the hostile reads.
- Final state: 12 areas / 84 nodes / 124 edges / 85 resources / 85 verified. Strict validate green. Build green. Linkcheck green. Aesthetic distinctive and not generic. CI configured. Deploy recipe documented. Launch playbook drafted.
