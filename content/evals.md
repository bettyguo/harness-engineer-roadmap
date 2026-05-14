# Evals & Observability

> How you know whether the agent is working. Task evals, trajectory evals, LLM-as-judge, regression discipline, tracing, the current observability tools, and the cost/latency dashboards that surface problems before users do.


*Area id: `evals`*

---

## Why agent evals are different

`id: evals.why-evals-are-hard` · **core**

Non-determinism, multi-step trajectories, partial credit, no clean labels. Most traditional ML eval intuition is wrong for agents.

**Competent means:** Can explain to a backend engineer why a unit-test mindset doesn't transfer, and name three properties of agent eval that need to be designed for.

**Depends on:** `foundations.what-is-a-harness`

**Also known as:** agent eval, llm eval, evaluation

**Resources:**

- [Evaluating LLM Agents: A Deep Dive](https://hamel.dev/blog/posts/evals/) — Hamel Husain, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The most practitioner-grade essay on agent eval — frames it as a discipline rather than a metric. The "look at your data" framing is durable.

---

## Task-level evals

`id: evals.task-evals` · **core**

End-to-end task success. A rubric, a held-out set, a pass rate. The eval you need before any of the fancier ones.

**Competent means:** Has a written rubric for their agent's primary task and a held-out set they didn't pick from training prompts.

**Depends on:** `evals.why-evals-are-hard`

**Related:** `evals.regression`

**Also known as:** end-to-end eval, task success

**Resources:**

- [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/) — Hamel Husain, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The clearest "build the eval before you build the feature" discipline in the literature. Walks through task-level eval design with worked examples.

---

## Trajectory / process evals

`id: evals.trajectory-evals` · *recommended*

Scoring intermediate steps, not just final outputs. Catches the regression where the agent gets the right answer for the wrong reason.

**Competent means:** Has caught at least one regression that task-level eval missed because the agent reached the answer via a broken path.

**Depends on:** `evals.task-evals`

**Related:** `evals.tracing`

**Also known as:** process eval, step eval, intermediate eval

**Resources:**

- [Tau-Bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045) — Yao et al., 2024 · `paper` · `advanced` · `free` · ◆ durable
  - The clearest example of trajectory-aware benchmarking. The design (multi-step, tool-use, partial credit) sets the template for how to think about trajectory evals.

---

## LLM-as-judge

`id: evals.llm-as-judge` · **core**

Using a model to grade a model. Cheap and scalable; calibration and bias are the catches. A judge is a model — eval it.

**Competent means:** Knows three ways judges fail (position bias, verbosity bias, self-preference) and the human spot-check rate they use to keep the judge honest.

**Depends on:** `evals.task-evals`

**Related:** `loop.reflexion`

**Also known as:** llm judge, model as judge, judge model

**Resources:**

- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) — Zheng et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable
  - The paper that established LLM-as-judge as a discipline. Section 3 is required reading on the bias catalogue.

---

## Regression eval & golden sets

`id: evals.regression` · **core**

Locking in behavior. Your eval set is your test suite — every PR runs it; regressions block merges.

**Competent means:** Their PR pipeline blocks on agent eval regressions. Has caught a regression in CI rather than in production.

**Depends on:** `evals.task-evals`

**Related:** `patterns.eval-driven-loop`

**Also known as:** golden set, regression suite, eval ci

**Resources:**

- [Evaluating LLM Agents: A Deep Dive](https://hamel.dev/blog/posts/evals/) — Hamel Husain, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - Treats regression discipline as the single biggest reliability lever for agents. The framing transfers directly to a PR pipeline.

---

## Tracing & structured logs

`id: evals.tracing` · **core**

Per-turn traces, OpenTelemetry-style spans, replayable runs. The observability surface that makes everything else debuggable.

**Competent means:** Can debug a failed agent run from traces alone, without having seen it happen in real time.

**Depends on:** `evals.why-evals-are-hard`

**Related:** `evals.observability-tools`

**Also known as:** agent tracing, observability, telemetry

**Resources:**

- [OpenTelemetry GenAI Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — OpenTelemetry, 2024 · `spec` · `intermediate` · `free` · ◆ durable
  - The emerging standard for instrumenting agent calls. Durable even as specific vendors come and go — the spec is the layer everyone implements against.

---

## Observability tools (current)

`id: evals.observability-tools` · *recommended*

Langfuse, AgentOps, LangSmith, Laminar — the current crop. durability:current because most of these names will rotate; the capabilities they offer will not.

**Competent means:** Knows the four capabilities they actually want (trace search, replay, eval integration, cost dashboard) and can pick a tool by capability, not by brand.

**Depends on:** `evals.tracing`

**Related:** `evals.cost-latency-dashboards`

**Also known as:** langfuse, agentops, langsmith, observability vendors

**Resources:**

- [AgentOps](https://github.com/AgentOps-AI/agentops) — AgentOps team, 2024 · `repo` · `intermediate` · `freemium` · 🜂 current
  - One representative current tool. Open-source, integrates with most agent frameworks. Listed as example of the category, not a recommendation against alternatives.

---

## Cost & latency dashboards

`id: evals.cost-latency-dashboards` · *recommended*

The "is this agent affordable to run" view. $ per task, p50/p99 latency, cache-hit rate.

**Competent means:** Their agent has a $/task dashboard and a p50/p99 latency dashboard — both updated on every deploy.

**Depends on:** `evals.tracing`, `cost.tracking`

**Also known as:** cost dashboard, latency monitoring, agent metrics

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "measure cost and latency from day one" guidance is unusually direct — most agent posts skip this. Durable.

---
