# Failure Modes & Reliability

> The discipline that distinguishes a demo from production. A failure taxonomy, structured error returns, retries/timeouts, structured output enforcement, validation gates, fallbacks, and chaos testing.


*Area id: `reliability`*

---

## The failure taxonomy

`id: reliability.failure-taxonomy` · **core**

Hallucination, loop-fail, tool-misuse, context-drift, halt-fail, permission-fail. A vocabulary for naming what went wrong before you can fix it.

**Competent means:** Can label any agent failure with one of these categories and name the harness component that owns the fix.

**Depends on:** `foundations.what-is-a-harness`

**Related:** `foundations.engineer-the-mistake-out`

**Also known as:** agent failures, failure modes

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The "common failure modes" section is the closest thing to a canonical taxonomy in the field. Pairs well with Hashimoto's "engineer the mistake out" rule.

---

## Structured error returns

`id: reliability.structured-errors` · **core**

Errors as model-readable signals, not stack traces. A 400 with "expected ISO-8601 date" beats a raw exception every time.

**Competent means:** Distinguishes "raise" from "return-as-context" and has shaped at least one tool's error vocabulary so the model can recover.

**Depends on:** `tools.schema-design`

**Related:** `tools.tool-errors`

**Also known as:** error returns, recoverable errors

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The tool-design section covers error shapes as a model-input design problem — the durable framing.

---

## Retries, backoff, idempotency

`id: reliability.retries-backoff` · **core**

Standard reliability discipline applied to model + tool calls. Don't retry without backoff; don't retry without idempotency thinking.

**Competent means:** Can defend their retry budget per call type, and knows which of their tools are safe to retry vs which need an idempotency key.

**Depends on:** `reliability.structured-errors`

**Related:** `reliability.timeouts`

**Also known as:** retry logic, exponential backoff, idempotent tools

**Resources:**

- [Patterns of Distributed Systems — Retry](https://martinfowler.com/articles/patterns-of-distributed-systems/retry.html) — Martin Kleppmann / Unmesh Joshi, 2020 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The durable engineering treatment of retry/backoff/ idempotency. The lessons predate LLMs and survive them.

---

## Timeouts & deadlines

`id: reliability.timeouts` · **core**

Per-call, per-step, per-task. Every long-running agent has at least one un-bounded call hiding somewhere — find it before production does.

**Competent means:** Knows where their longest call lives, has a deadline on it, and has a fallback for when the deadline fires.

**Depends on:** `reliability.retries-backoff`

**Related:** `loop.halting`

**Also known as:** deadline, timeout, sla

**Resources:**

- [Latency Numbers Every Programmer Should Know](https://gist.github.com/jboner/2841832) — Peter Norvig / Jeff Dean (canonicalized by Jonas Bonér), 2012 · `post` · `beginner` · `free` · ◆ durable *(unverified)*
  - The reference frame for "what's an honest deadline?" — durable because it teaches you to budget time in milliseconds, not vibes.

---

## Structured output enforcement

`id: reliability.structured-output` · **core**

JSON Schema, function calling, constrained decoding, schema-fix loops. Never parse freeform model output in production.

**Competent means:** Their agent never relies on regex-parsing model text. Has a schema-fix retry path for malformed output.

**Depends on:** `tools.schema-design`

**Related:** `context.structured-context`

**Also known as:** json mode, structured outputs, constrained decoding

**Resources:**

- [Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs) — OpenAI, 2024 · `spec` · `intermediate` · `free` · 🜂 current *(unverified)*
  - Vendor docs (durability:current) — the clearest first-party guide to enforcing JSON-schema output at the API boundary. The mechanism is increasingly standard.

---

## Validation gates

`id: reliability.validation` · *recommended*

Post-conditions on tool output, sanity checks on plans, type- level guardrails. Rejecting a "successful" output is sometimes the right move.

**Competent means:** Has rejected a "successful" agent run that failed a validation gate, and can name what the gate caught.

**Depends on:** `reliability.structured-output`

**Related:** `loop.human-in-the-loop`

**Also known as:** output validation, postcondition, guard rails

**Resources:**

- [Guardrails for Large Language Models](https://www.guardrailsai.com/docs) — Guardrails AI, 2024 · `post` · `intermediate` · `free` · 🜂 current *(unverified)*
  - Current-tool example — concrete walkthrough of validation as a first-class harness layer. The principle (validate structurally, validate semantically, validate behaviorally) is durable.

---

## Fallbacks & degraded modes

`id: reliability.fallbacks` · *recommended*

What does the agent do when the model is down, the tool is unreachable, or the budget is exhausted? A documented degraded mode beats unexplained 500s.

**Competent means:** Their agent has a documented degraded mode that they have actually exercised (chaos-tested or observed in prod).

**Depends on:** `reliability.retries-backoff`

**Related:** `reliability.chaos`

**Also known as:** graceful degradation, fallback mode, circuit breaker

**Resources:**

- [Release It! (book) — Stability Patterns](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael T. Nygard, 2018 · `book` · `intermediate` · `paid` · ◆ durable *(unverified)*
  - Pre-LLM but the timeouts/bulkheads/circuit-breakers material transfers directly. The most durable reliability text in this area.

---

## Chaos testing for agents

`id: reliability.chaos` · _optional_

Inject tool failures, latency spikes, context truncation, model 503s. Most agents have never been observed under adversity until production.

**Competent means:** Has run a chaos test (manually injected failure) that found a real bug in their agent.

**Depends on:** `reliability.failure-taxonomy`

**Related:** `evals.regression`

**Also known as:** chaos engineering, failure injection

**Resources:**

- [Chaos Engineering — Principles](https://principlesofchaos.org/) — Principles of Chaos, 2019 · `post` · `advanced` · `free` · ◆ durable *(unverified)*
  - The canonical statement of the discipline. Pre-LLM but the principles (steady-state hypothesis, blast-radius, automate) transfer directly to agent chaos testing.

---
