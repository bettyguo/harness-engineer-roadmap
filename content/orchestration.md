# Multi-Agent Orchestration

> When one agent isn't enough — and the more important question of when one is. Single vs multi, supervisor/worker, handoffs, routing, parallelism, debate, and the anti-patterns that have cost the field the most.


*Area id: `orchestration`*

---

## Single vs multi-agent

`id: orchestration.single-vs-multi` · **core**

The gate question: do you actually need multiple agents? Most "multi-agent" systems are one agent split across files for organization, not capability.

**Competent means:** Can argue against multi-agent for a use case where it's a fad, and identify the small class where it's earned.

**Depends on:** `loop.basic-loop`

**Related:** `orchestration.anti-patterns`

**Also known as:** single agent, multi-agent, agent count

**Resources:**

- [Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents) — Cognition AI, 2025 · `post` · `intermediate` · `free` · ◆ durable
  - The strongest argument-from-experience against multi-agent as the default. Required reading before you ship a supervisor.

---

## Supervisor / worker patterns

`id: orchestration.supervisor-worker` · *recommended*

One agent dispatches, others execute. Useful when the dispatcher genuinely has different concerns from the executor — not just to look organized.

**Competent means:** Can sketch the supervisor's tool list and explain why each tool is a supervisor concern, not a worker concern.

**Depends on:** `orchestration.single-vs-multi`

**Related:** `orchestration.handoffs`

**Also known as:** supervisor agent, worker agent, dispatcher

**Resources:**

- [Multi-Agent Workflows](https://blog.langchain.com/langgraph-multi-agent-workflows/) — LangChain, 2024 · `post` · `intermediate` · `free` · 🜂 current
  - Current-tool example — the supervisor pattern walked through with code. The structural insight (dispatcher concerns vs worker concerns) is durable.

---

## Handoffs & state passing

`id: orchestration.handoffs` · **core**

What does the receiving agent actually need to know? Most multi- agent bugs are handoff bugs — re-reading the world, dropped context, conflicting state.

**Competent means:** Knows three handoff bugs (dropped context, redundant re-read, conflicting overwrite) and the trace pattern that surfaces each.

**Depends on:** `orchestration.supervisor-worker`

**Related:** `memory.shared-memory`

**Also known as:** agent handoff, state handoff, message passing

**Resources:**

- [OpenAI Agents SDK — Handoffs](https://platform.openai.com/docs/guides/agents) — OpenAI, 2025 · `spec` · `intermediate` · `free` · 🜂 current
  - Current-tool example — first-party docs on handoff as a first-class primitive. The framing (handoff = transferred intent + transferred context) is durable.

---

## Routing & specialization

`id: orchestration.routing` · *recommended*

Picking the right agent for the request. Often a model call, often a classifier, sometimes a hand-tuned regex.

**Competent means:** Can defend their routing policy (model vs classifier vs rules) against a concrete misroute example.

**Depends on:** `orchestration.supervisor-worker`

**Related:** `cost.model-tiering`

**Also known as:** agent routing, request routing

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "routing" pattern in this post is the cleanest treatment of when a router is a model and when it should be a rule.

---

## Parallelism & fan-out

`id: orchestration.parallel` · *recommended*

Running tool calls or subagents concurrently. The latency win is real; the cost and complexity wins less obvious.

**Competent means:** Knows the latency/cost tradeoff for a fan-out and has chosen one with eyes open (or chosen to keep it sequential and saved the complexity).

**Depends on:** `cost.parallelism`

**Also known as:** parallel agents, fan-out, concurrent tools

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "parallelization" pattern (sectioning vs voting) is the cleanest treatment — distinguishes "parallel for speed" from "parallel for ensemble" cleanly.

---

## Debate, voting, ensembles

`id: orchestration.debate` · _optional_

Multiple agents critique or vote. Theatrical wins are easy; real accuracy wins are rare and benchmark-specific.

**Competent means:** Knows when ensemble accuracy gains are real (uncertain domains, verifier-cheap-than-generator) vs theatrical (most cases).

**Depends on:** `orchestration.single-vs-multi`

**Also known as:** agent debate, voting, ensemble agents

**Resources:**

- [Improving Factuality and Reasoning in Language Models through Multiagent Debate](https://arxiv.org/abs/2305.14325) — Du et al., 2023 · `paper` · `advanced` · `free` · ◆ durable
  - The most-cited debate paper. Read the methodology; treat the gains skeptically — newer work has shown ensemble effects often dominate the "debate" framing.

---

## Multi-agent anti-patterns

`id: orchestration.anti-patterns` · **core**

"Two agents pretending to talk." "One supervisor that's secretly doing all the work." The most expensive failure mode in the field — multi-agent looking like progress while paying for nothing.

**Competent means:** Can spot a multi-agent design that should have been one agent and name the specific cost it's paying.

**Depends on:** `orchestration.single-vs-multi`

**Related:** `patterns.anti-patterns`

**Also known as:** multi-agent failure modes

**Resources:**

- [Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents) — Cognition AI, 2025 · `post` · `intermediate` · `free` · ◆ durable
  - The most thorough catalogue of multi-agent anti-patterns from a team that shipped both. Required reading.

---
