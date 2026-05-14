# Cost & Latency Engineering

> Making the agent affordable to run, and fast enough to be useful. Cost tracking, prompt caching, model tiering, parallelism, streaming, and the discipline of short context over long.


*Area id: `cost`*

---

## Cost & token tracking

`id: cost.tracking` · **core**

Per-task, per-user, per-feature attribution. Without it, every "cost optimization" is guesswork.

**Competent means:** Knows the $/task of their agent within ~10% accuracy. Can break that down by step.

**Depends on:** `evals.tracing`

**Related:** `evals.cost-latency-dashboards`

**Also known as:** cost attribution, token tracking, llm cost

**Resources:**

- [OpenTelemetry GenAI Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — OpenTelemetry, 2024 · `spec` · `intermediate` · `free` · ◆ durable
  - The emerging standard includes per-call token + cost attributes. Durable because the spec is the layer everyone implements against, vendor-neutral.

---

## Prompt caching

`id: cost.caching` · **core**

Anthropic prompt caching, OpenAI prefix caching, KV-cache reuse. The cheapest single optimization in modern agent design — design prompts cache-first.

**Competent means:** Their system prompt is cache-key-stable across requests. Knows their cache-hit rate within ~5%.

**Depends on:** `context.system-prompts`

**Related:** `cost.tracking`

**Also known as:** prompt cache, prefix cache, kv cache

**Resources:**

- [Prompt caching with Claude](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — Anthropic, 2024 · `spec` · `intermediate` · `free` · 🜂 current
  - Vendor docs (durability:current). The mechanism (prefix-stable caching with TTL) is now standard across providers; the durable lesson is "design your prompt as a cache key."

---

## Model tiering & routing

`id: cost.model-tiering` · *recommended*

Cheap model for simple steps, expensive model for hard. A router decides — either by a model call or by a rule.

**Competent means:** Can show a tier split with a quality plot — proof the cheap tier doesn't degrade outcomes for routed-cheap requests.

**Depends on:** `cost.tracking`

**Related:** `orchestration.routing`

**Also known as:** model routing, tiered models, mixture of models

**Resources:**

- [RouteLLM: Learning to Route LLMs with Preference Data](https://arxiv.org/abs/2406.18665) — Ong et al., 2024 · `paper` · `advanced` · `free` · ◆ durable
  - The clearest treatment of model routing as a learned policy. The framing (preference data, calibrated routing) is durable even as specific routers improve.

---

## Parallelism & batching

`id: cost.parallelism` · *recommended*

Concurrent tool calls, batched embeddings, async generation. The latency win is real; contention bugs are the tax.

**Competent means:** Knows when parallelism pays (independent tool calls, embedding batches) and when it doesn't (sequential dependencies, rate- limited APIs).

**Depends on:** `cost.tracking`

**Related:** `orchestration.parallel`

**Also known as:** parallel agents, concurrent tools, batched calls

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "parallelization" pattern split into sectioning vs voting is the cleanest framing — separates latency wins from ensemble wins.

---

## Streaming & partial outputs

`id: cost.streaming` · *recommended*

Streaming for perceived latency, partial-output UX, the ergonomics of "show progress without committing to it." A UX lever as much as an engineering one.

**Competent means:** Knows when streaming is a UX win (long generation, chat surface) vs a footgun (structured output that must be validated whole).

**Depends on:** `cost.tracking`

**Also known as:** streaming responses, sse, partial outputs

**Resources:**

- [How to stream completions](https://cookbook.openai.com/examples/how_to_stream_completions) — OpenAI Cookbook, 2024 · `post` · `beginner` · `free` · 🜂 current
  - Working code example, durably hosted on the official cookbook repo. The SSE / delta-event / terminal-marker pattern walks through cleanly and transfers across providers.

---

## Short-context discipline

`id: cost.short-vs-long-context` · *recommended*

A 4k well-shaped context often beats 100k everything-in. Long context is a tool, not a default. Both latency and quality often improve with less.

**Competent means:** Prefers short, structured context by default and can defend reaching for long context with a specific reason.

**Depends on:** `context.window-budget`

**Related:** `context.long-context-pitfalls`

**Also known as:** short context, minimal context

**Resources:**

- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) — Liu et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable
  - Empirical grounding for "less context, attended-to, beats more context, ignored." Cite this when arguing against everything-in defaults.

---
