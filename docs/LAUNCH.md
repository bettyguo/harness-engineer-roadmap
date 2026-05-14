# Launch playbook

Drafts and timing for the launch posts. The agent/harness wave is at peak attention in May–July 2026; this launch is timed into that wave.

## Pre-launch checklist (do this first)

- [ ] Live site reachable at https://bettyguo.github.io/harness-engineer-roadmap/ and the diagram renders
- [ ] Click 5 random nodes — every one opens a resource panel with at least one verified resource
- [ ] `assets/diagram-screenshot.png` captured at 1920×1080, dark mode, ~3–4 area clusters visible with edges (the launch asset — see [`assets/MAKE_BANNER.md`](../assets/MAKE_BANNER.md))
- [ ] `assets/banner.png` + `og-image.png` exist (the social card)
- [ ] CHANGELOG.md dated, last-updated badge green
- [ ] Sister-roadmap links work (or 404 gracefully — `[ai-engineer-roadmap]`, `[llm-interview-prep]`, `[build-your-own-ai]`)
- [ ] CI: validate.yml + linkcheck.yml + deploy.yml all green on the most recent push to main

## Show HN

**Title (max 80 chars):**
> `Show HN: harness-engineer-roadmap – an interactive roadmap for building reliable systems around LLMs`

**URL:** the live site, not the repo. (Show HN allows project URLs; the live diagram is the artifact.)

**Comment (the post body, written as a top-level comment immediately after submission):**

> The agent/harness wave broke into the engineering-press in February (Hashimoto), April (Böckeler/ThoughtWorks), and into mass media this week (TechTimes named it "the fourth paradigm of AI engineering"). The literature is exploding; what nobody has shipped is an interactive map.
>
> This is a node-graph of 12 areas and 84 nodes — the agent loop, tool layers, context engineering, memory, retrieval, multi-agent orchestration, eval harnesses, failure modes, cost & latency, security, and named patterns/anti-patterns. Click any node and you get a curated, web-verified resource panel with a "competent means" rubric — what being good at this specific thing looks like in production.
>
> Two design choices I'd appreciate sharp feedback on:
>
> 1. Every resource is tagged `durable` (concept-level, ≥3yr shelf) or `current` (tool-name, expect rotation). The flag is mechanically enforced — `current` resources have to address their staleness risk in the `why` field. The hope is the map survives this field's monthly churn.
>
> 2. The map is positioned as **depth** on one craft, alongside a peer breadth-map I'm shipping in parallel ([ai-engineer-roadmap](https://github.com/bettyguo/ai-engineer-roadmap)). They reference each other sideways. This roadmap assumes you already know where harness engineering sits.
>
> Curated under my real name (PhD candidate at HKU, advised by Prof. Siu-Ming Yiu) — the verification log is public ([PLANNING/04_verification_log.md](https://github.com/bettyguo/harness-engineer-roadmap/blob/main/PLANNING/04_verification_log.md)). Nightly CI link-checks; quarterly content sweeps stated upfront. Static markdown fallback at [`content/`](https://github.com/bettyguo/harness-engineer-roadmap/tree/main/content) if you prefer reading on GitHub.
>
> If you've built an agent that broke in production in a way you couldn't categorize — please tell me which node would have caught it. Gaps go into the issue tracker.

**Timing:** US Tuesday or Wednesday, 8–10am Pacific. Avoid Monday (busy queue), Friday (low traffic), and any major AI launch day.

## X / Twitter thread

Lead with the diagram screenshot, not text. The screenshot does 60% of the work.

> **1/** I built an interactive roadmap for **harness engineering** — the discipline of everything around the LLM. 12 areas, 84 nodes, each clickable with curated, web-verified resources.
>
> 🔗 https://bettyguo.github.io/harness-engineer-roadmap/
>
> [diagram screenshot]
>
> **2/** Why now: "harness engineering" was named by @mitchellh in Feb, given a vocabulary by @bgklr at ThoughtWorks in Apr, and hit mass media this week. The wave is real. What nobody had shipped: a navigable map of the discipline.
>
> **3/** Every node carries a "**competent means**" rubric — what being good at this specific thing looks like in production. Falsifiable. Self-scorable. Specific. The opposite of "understands the concepts."
>
> **4/** Every resource is tagged `durable` (concept, ≥3yr shelf) or `current` (tool-name, expect rotation). The flag is mechanically enforced. Tool churn is a feature of this field; the map shows you which parts of itself to trust longer-term.
>
> **5/** My favorite area: **Patterns & Anti-Patterns**. Seven concrete, named patterns — skeleton-with-flex, guarded-tool, context-recipes, eval-driven-loop, named anti-patterns, coding-agent-recipes, research-agent-recipes. Shareable on its own.
>
> [zoomed-in screenshot of the Patterns cluster]
>
> **6/** It's a peer to @bettyguo/ai-engineer-roadmap (the breadth map of the AI-engineer career path). Standalone equals — neither nests under the other. One sentence in each README defines the boundary so they don't read as duplicates.
>
> **7/** CC-BY-4.0 content / MIT code. Open to issues, PRs, and "this node is wrong" calls. The map's value is the curation — keep it sharp.
>
> If your agent works in the demo and breaks in production: this is where to read for an afternoon. 🧵 done.

**Notes:**
- Replace `@bgklr` if Böckeler's handle is different — verify before posting.
- Replace `@bettyguo` placeholder with the actual handle.
- Schedule a follow-up the same week pointing at the Patterns area separately — it's the most shareable standalone content.

## r/MachineLearning — [D] post

**Title:**
> [D] Interactive roadmap for agent harness engineering — 12 areas, 84 nodes, every resource web-verified

**Body:**

> Long-time r/ML lurker. I've been curating an interactive node-graph for "harness engineering" (the term Hashimoto coined in February to describe everything in an agent except the model itself) and I'd appreciate sharp eyes on the taxonomy and resource curation.
>
> Live site: https://bettyguo.github.io/harness-engineer-roadmap/
> Repo: https://github.com/bettyguo/harness-engineer-roadmap
>
> Why the format: existing artifacts in this category are either tools, framework SDKs, or flat awesome lists. None of them is a structured *learning map*. I borrowed the format from kamranahmedse/developer-roadmap (the #7 all-time GitHub repo) and applied it to one craft in depth.
>
> The areas: agent loop & control flow, tools & tool layers, context engineering, memory & state, retrieval integration, multi-agent orchestration, evals & observability, failure modes & reliability, cost & latency, security, patterns & anti-patterns.
>
> Specifically helpful feedback for me:
>
> 1. Is the foundational-concepts cluster the right entry point, or should the agent loop come first?
> 2. Did I overweight or underweight any area? The patterns/anti-patterns area in particular — too much, too little?
> 3. Any node where you'd flag the recommended resource as not the best one?
>
> Honest pushback welcome. Curated under my real name (PhD at HKU); the verification log is in the repo.

## r/LocalLLaMA + r/AI_Agents — same body, different framing in the title

**r/LocalLLaMA title:**
> Interactive roadmap for harness engineering — 84 nodes, every resource web-verified, free / CC-BY

**r/AI_Agents title:**
> A 12-area map of harness engineering: 84 clickable nodes, "competent means" rubric per node

Use the r/ML body for both (lightly trimmed) — keep the asks specific.

## Newsletter outreach paragraph

For include-in-the-newsletter pitches to: Latent Space, The Sequence, Ben's Bites, Last Week in AI, Import AI, Bens AI Newsletter, Latent Space (Swyx), TLDR AI.

> Hi —
>
> I just shipped harness-engineer-roadmap (https://bettyguo.github.io/harness-engineer-roadmap/), an interactive node-graph map of harness engineering — the discipline of everything in an AI agent except the model itself. 12 areas, 84 nodes, each with a "competent means" rubric and curated, web-verified resources. Tagged `durable` vs `current` so tool churn is visible.
>
> It's the depth companion to my AI-engineer-roadmap (the breadth one), launching the same week. The agent/harness wave is at peak attention; no canonical interactive learning artifact owned the category until now.
>
> Curated under my real name (PhD candidate at HKU). CC-BY-4.0. Open-source code, open-source data, link-checking CI.
>
> If it fits the newsletter, I'd love to be included. Happy to share whatever framing helps.
>
> — Betty Guo

## After the launch

- [ ] Pin the repo on `bettyguo`'s GitHub profile.
- [ ] Add a star-history badge to README once at ~500 stars (https://star-history.com/).
- [ ] Watch the issue tracker for "this node is wrong" reports; respond within 24h for the first week.
- [ ] Track GitHub traffic (Insights → Traffic) for two weeks.
- [ ] If the wave is still cresting at week 3, do a Patterns-area-as-standalone post.

## Don't

- Don't post to /r/programming or /r/coding — wrong audience.
- Don't post on a major OpenAI / Anthropic launch day — your post gets buried.
- Don't engage with bad-faith HN replies. Engage hard with sharp ones.
- Don't claim "the canonical map" in the post text — that's for the audience to decide. The phrase belongs in the META description, not the pitch.
