# Patterns & Anti-Patterns

> Concrete, named patterns and anti-patterns. The shareable-on-its-own area — the kind of content readers send to teammates. Skeleton with flex, guarded tools, context recipes, eval-driven loops, the named anti-patterns, and the recipe templates for coding and research agents.


*Area id: `patterns`*

---

## Skeleton with flexible steps

`id: patterns.skeleton-with-flex` · **core**

Deterministic backbone, model fills the gaps. The #1 reliability pattern — the single biggest leverage point most agents miss.

**Competent means:** Has refactored at least one open-ended agent into a skeleton design and can describe the reliability gain it produced.

**Depends on:** `loop.deterministic-skeleton`

**Related:** `patterns.eval-driven-loop`

**Also known as:** structured agent, workflow with model gaps

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "workflow vs agent" framing is the cleanest treatment of the pattern. The case for backbones with flex steps is worked through with examples.

---

## Guarded tool pattern

`id: patterns.guarded-tool` · **core**

Every tool has a precondition and a postcondition checker. The model can call it; the harness decides whether the call's results count.

**Competent means:** Has shipped a tool with both a precondition (refuses bad inputs with a structured error) and a postcondition (validates the output before returning).

**Depends on:** `tools.tool-design`, `reliability.validation`

**Also known as:** tool guards, pre/post checks, validated tool

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - Treats tool design with pre/post validation as a first-class harness concern. The structural lesson is durable.

---

## Context recipes (system + user + retrieved)

`id: patterns.context-recipes` · **core**

Named slot layouts that have been shown to work. System prompt (stable, cached), retrieved context (untrusted, sanitized), user input (untrusted, sanitized), output schema (enforced).

**Competent means:** Can describe their agent's context layout as a recipe with named slots and trust levels. Hasn't mixed trust levels into a single slot.

**Depends on:** `context.structured-context`

**Related:** `security.prompt-injection`

**Also known as:** prompt recipe, context layout

**Resources:**

- [Context engineering for agents](https://www.langchain.com/blog/context-engineering-for-agents) — LangChain, 2025 · `post` · `intermediate` · `free` · ◆ durable
  - The clearest practitioner-grade taxonomy of context slots and their roles. The recipe framing is the durable contribution.

---

## Eval-driven loop

`id: patterns.eval-driven-loop` · *recommended*

Every change has an eval. Every regression blocks the change. The discipline that lets you move fast without breaking the agent.

**Competent means:** Their PR cycle includes an eval run, and the team has aborted at least one promising change because the eval went red.

**Depends on:** `evals.regression`

**Related:** `patterns.skeleton-with-flex`

**Also known as:** eval-driven development, agent tdd

**Resources:**

- [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/) — Hamel Husain, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The case for eval-as-the-flywheel is made with worked examples. The discipline — write the eval, run it on every change — is durable.

---

## Named anti-patterns

`id: patterns.anti-patterns` · **core**

The recurring failures, given names. "Prompt the bug away." "Add another agent." "More context = more correct." "Fancy retriever, broken chunking." Each with an example.

**Competent means:** Can name three of their own past anti-patterns from production, with what they cost and what fixed each.

**Depends on:** `foundations.engineer-the-mistake-out`

**Related:** `orchestration.anti-patterns`

**Also known as:** anti-patterns, agent anti-patterns, failure patterns

**Resources:**

- [Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents) — Cognition AI, 2025 · `post` · `intermediate` · `free` · ◆ durable
  - The canonical "this isn't progress, it's complexity" case. The named anti-patterns survive the specific framework critique.

---

## Coding-agent recipes

`id: patterns.coding-agent-recipes` · *recommended*

The Claude Code / Cursor / Aider class: file-edit tool, test runner, plan-mode, repo-scoped context. The most-shipped agent shape of 2026, with reusable design choices.

**Competent means:** Can describe the canonical coding-agent loop (read → plan → edit → run → check) and the harness pieces that make it work (read-only tools, sandboxed edits, eval-as-tests).

**Depends on:** `tools.computer-use`, `loop.deterministic-skeleton`

**Related:** `patterns.skeleton-with-flex`

**Also known as:** code agent, swe agent

**Resources:**

- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — Yang et al., 2024 · `paper` · `advanced` · `free` · ◆ durable
  - The clearest paper-treatment of "design the agent-computer interface, not the agent." The framing transfers across every coding-agent product.

---

## Research-agent recipes

`id: patterns.research-agent-recipes` · *recommended*

The OpenAI-DeepResearch / Anthropic Research / Gemini Deep Research class: browse → read → cite → summarize loops, with careful citation and abstention discipline.

**Competent means:** Can describe the research-agent harness (search tool, reader/extractor, citation tracker, abstention rule) and the eval that catches fabricated citations.

**Depends on:** `loop.plan-execute`, `retrieval.agentic-retrieval`

**Related:** `retrieval.citations`

**Also known as:** research agent, deep research, browsing agent

**Resources:**

- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511) — Asai et al., 2023 · `paper` · `advanced` · `free` · ◆ durable
  - Cited here as adjacent rather than central — the "abstain when you can't ground" mechanism is what research agents import. The browse→read→cite loop itself doesn't yet have a canonical paper; revisit when one lands.

---
