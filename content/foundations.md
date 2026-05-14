# Foundations

> The framing every harness engineer needs before the rest of the map clicks. Agent = Model + Harness, the engineer-the-mistake-out rule, and the durable-vs-current distinction that survives this field's monthly churn.


*Area id: `foundations`*

---

## What is a harness?

`id: foundations.what-is-a-harness` · **core**

"Agent = Model + Harness." The harness is everything around the model: state, security, orchestration, memory, observability, evals. Fixing the harness often beats switching the model.

**Competent means:** Can name the six harness components and explain why teams routinely ship better systems on a worse model by improving the harness.

**Related:** `foundations.engineer-the-mistake-out`, `foundations.durable-vs-current`

**Also known as:** agent harness, model + harness, llm scaffolding, the harness

**Resources:**

- [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html) — Birgitta Böckeler, 2026 · `post` · `intermediate` · `free` · ◆ durable
  - The canonical vocabulary for the discipline — guides, sensors, harnessability, behaviour vs maintainability harness. Read this first; everything since builds on it.
- [The Agent Harness: Why the LLM Is the Smallest Part of Your Agent System](https://www.mongodb.com/company/blog/technical/agent-harness-why-llm-is-smallest-part-of-your-agent-system) — MongoDB, 2026 · `post` · `beginner` · `free` · ◆ durable
  - The six-component view (state, security, orchestration, memory, observability, evals). Useful as the working mental model when auditing an existing system.

---

## Engineer the mistake out

`id: foundations.engineer-the-mistake-out` · **core**

Hashimoto's rule: every time the agent makes a mistake, you engineer the harness so it physically cannot make that mistake again — instead of prompt-fixing and hoping.

**Competent means:** Can identify three of their own recent "fixed it with a prompt tweak" moments and re-describe what the proper harness-level fix would have been.

**Depends on:** `foundations.what-is-a-harness`

**Related:** `patterns.anti-patterns`, `reliability.failure-taxonomy`

**Also known as:** hashimoto rule, agent = model + harness

**Resources:**

- [My AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey) — Mitchell Hashimoto, 2026 · `post` · `beginner` · `free` · ◆ durable
  - The essay that named the discipline. Read the section formalizing "agent = model + harness" and the "engineer the mistake out" philosophy — short, opinionated, foundational.

---

## Durable concepts vs current tools

`id: foundations.durable-vs-current` · **core**

The field churns monthly. Concepts (the agent loop, eval discipline, memory architecture) outlive tool names (the framework du jour, the MCP server you ship today). Learn to tell them apart.

**Competent means:** When reading a new framework's docs, can name which durable concept each feature implements, and can argue when a new tool is meaningful progress vs a rename.

**Depends on:** `foundations.what-is-a-harness`

**Also known as:** concepts over tools, framework churn

**Resources:**

- [Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents) — Cognition AI, 2025 · `post` · `intermediate` · `free` · ◆ durable
  - A model of separating durable principle (context shapes behavior) from the current-tool fashion (multi-agent frameworks). Read it for the framing more than the conclusion.

---

## What 'competent' looks like

`id: foundations.competence-rubric` · *recommended*

Every node in this roadmap carries a behavioural rubric — what being competent at this thing actually looks like — instead of "understands X." Use the rubrics to self-score honestly.

**Competent means:** Can score themselves on at least three recent nodes and identify where they would actually fail the rubric in production.

**Depends on:** `foundations.what-is-a-harness`

**Related:** `evals.why-evals-are-hard`

**Also known as:** rubric, self-assessment

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - Frames agent competence behaviorally — what a working system does, not what it knows. Pairs well with the rubric mindset this node captures.

---
