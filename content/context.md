# Context Engineering

> Karpathy's term for filling the context window with the right information for the next step. Window budgeting, structured prompts, compaction, position bias, long-context pitfalls, and the poisoning surface.


*Area id: `context`*

---

## Context-window budgeting

`id: context.window-budget` · **core**

Token accounting, headroom, ceiling effects. Most "I'll just put everything in" agents are bad budgets, not bad prompts.

**Competent means:** Can sketch a per-turn token budget for a real agent on the back of a napkin and identify which item is the worst-offending bloater.

**Depends on:** `foundations.what-is-a-harness`

**Related:** `cost.short-vs-long-context`

**Also known as:** context budget, token budget, context window

**Resources:**

- [Context engineering for agents](https://www.langchain.com/blog/context-engineering-for-agents) — LangChain, 2025 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The clearest practitioner-grade overview of context budgeting as a first-class design problem. Vendor-flavored but the concepts transfer.

---

## System-prompt design

`id: context.system-prompts` · **core**

Persona, rules, output shape, and what NOT to put in the system prompt. The system prompt is a cache-key in most production setups — design it accordingly.

**Competent means:** Can audit a system prompt and cut 30% without behavior loss; knows what should never live in the system prompt (per-user, per-task content).

**Depends on:** `context.window-budget`

**Related:** `cost.caching`

**Also known as:** system message, instructions, persona

**Resources:**

- [Prompt engineering — Anthropic docs](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Anthropic, 2024 · `spec` · `beginner` · `free` · 🜂 current *(unverified)*
  - Current-tool example — vendor docs, but the structural advice (be specific, use examples, define output shape) is durable and one of the few that addresses system-prompt design explicitly.

---

## Compaction & summarization

`id: context.compaction` · **core**

Auto-compact, sliding windows, hierarchical summaries. Lossy by design — the discipline is knowing which signal you're allowed to lose.

**Competent means:** Knows three things compaction can drop without harm and three things it can never drop. Has a metric for compaction-induced regression.

**Depends on:** `context.window-budget`

**Related:** `memory.forgetting`

**Also known as:** auto-compact, summarization, conversation compression

**Resources:**

- [Long-Context Window Engineering Patterns](https://docs.anthropic.com/en/docs/build-with-claude/context-windows) — Anthropic, 2025 · `post` · `intermediate` · `free` · 🜂 current *(unverified)*
  - Vendor docs, durable principles — covers compaction patterns and when they preserve vs destroy load-bearing context.

---

## Relevance filtering & pruning

`id: context.relevance-filtering` · *recommended*

Trim noisy tool outputs before they hit the next turn. Most context problems are too-much-noise, not too-little-signal.

**Competent means:** Can show a before/after where filtering tool returns raised accuracy without changing the model or the prompt.

**Depends on:** `context.window-budget`

**Related:** `context.position-bias`

**Also known as:** context pruning, output filtering

**Resources:**

- [Context engineering for agents](https://www.langchain.com/blog/context-engineering-for-agents) — LangChain, 2025 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - Discusses output-filtering as a routine harness practice — the framing of "prune what the model doesn't need" is durable even as the example tools rotate.

---

## Position bias & ordering

`id: context.position-bias` · *recommended*

Lost-in-the-middle, recency bias, primacy bias. Models attend to the start and the end of context more than the middle.

**Competent means:** Can demo position bias on a current model with a runnable example and design the prompt to put the load-bearing item where the model will attend.

**Depends on:** `context.window-budget`

**Also known as:** lost in the middle, attention bias

**Resources:**

- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) — Liu et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The paper that named the effect. Read sections 3–4; the U-shape attention curve is the durable insight, not the specific numbers (which improve with new models).

---

## Structured context (XML, tags, sections)

`id: context.structured-context` · **core**

Anthropic-style XML, OpenAI-style sections. Structure isn't cosmetic — it changes compliance with output and ordering rules.

**Competent means:** Can refactor a flat prompt to structured (named sections, explicit output schema) and explain the compliance gain.

**Depends on:** `context.system-prompts`

**Related:** `reliability.structured-output`

**Also known as:** xml prompts, structured prompts, prompt sections

**Resources:**

- [Use XML tags to structure your prompts](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags) — Anthropic, 2024 · `spec` · `beginner` · `free` · 🜂 current *(unverified)*
  - Vendor docs (durability:current), but the technique itself is durable and transfers to any model — XML, JSON-fenced sections, or markdown headers all work.

---

## Long-context pitfalls

`id: context.long-context-pitfalls` · *recommended*

1M-token windows aren't free: latency, attention dilution, cost. Long context is a tool, not a default.

**Competent means:** Knows when not to use long context (when retrieval would do; when attention dilution would dominate; when latency budget says no).

**Depends on:** `context.window-budget`

**Related:** `cost.caching`

**Also known as:** long context, million-token

**Resources:**

- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) — Liu et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The clearest empirical evidence that long context isn't a free win. Cite this in any "why don't we just put it all in?" argument.

---

## Context poisoning

`id: context.context-poisoning` · **core**

Bad data in context cascades. Untrusted text from tool outputs, retrieved docs, or user input can manipulate downstream reasoning.

**Competent means:** Can name three ways context gets poisoned (indirect injection, retrieved-doc takeover, error-loop poisoning) and the trace pattern to catch each.

**Depends on:** `context.window-budget`

**Related:** `security.prompt-injection`

**Also known as:** context contamination, indirect injection

**Resources:**

- [Prompt Injection: What's the worst that can happen?](https://simonwillison.net/2023/Apr/14/worst-that-can-happen/) — Simon Willison, 2023 · `post` · `beginner` · `free` · ◆ durable *(unverified)*
  - The clearest non-academic walk-through of the attack surface, including the context-poisoning angle. Required reading.

---
