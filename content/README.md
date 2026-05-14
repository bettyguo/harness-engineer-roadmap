# Static markdown fallback

This directory is **auto-generated** by `tools/build.py` from
`roadmap-data/*.yml`. Don't edit by hand — your changes will be
overwritten on the next build.

For the full interactive experience, use the live site:
https://bettyguo.github.io/harness-engineer-roadmap

## Areas

- [Foundations](foundations.md) — The framing every harness engineer needs before the rest of the map clicks. Agent = Model + Harness, the engineer-the-mistake-out rule, and the durable-vs-current distinction that survives this field's monthly churn.

- [The Agent Loop & Control Flow](loop.md) — The mechanics of think → act → observe → repeat, and the patterns that make the loop reliable instead of meandering.

- [Tools & Tool Layers](tools.md) — How the agent reaches the world: tool design, schemas, the MCP layer, error handling, selection at scale, composition, sandboxing, and the new computer-use surface.

- [Context Engineering](context.md) — Karpathy's term for filling the context window with the right information for the next step. Window budgeting, structured prompts, compaction, position bias, long-context pitfalls, and the poisoning surface.

- [Memory & State](memory.md) — What the agent remembers across turns and sessions. Working vs long-term, episodic vs semantic, state persistence, the knowledge-base pattern, vector memory, forgetting policies, and shared memory across agents.

- [Retrieval Integration](retrieval.md) — Retrieval from the harness-layer perspective — not RAG 101. How RAG plugs into the agent loop, embeddings, hybrid search, query rewriting, citations, and agentic / iterative retrieval.

- [Multi-Agent Orchestration](orchestration.md) — When one agent isn't enough — and the more important question of when one is. Single vs multi, supervisor/worker, handoffs, routing, parallelism, debate, and the anti-patterns that have cost the field the most.

- [Evals & Observability](evals.md) — How you know whether the agent is working. Task evals, trajectory evals, LLM-as-judge, regression discipline, tracing, the current observability tools, and the cost/latency dashboards that surface problems before users do.

- [Failure Modes & Reliability](reliability.md) — The discipline that distinguishes a demo from production. A failure taxonomy, structured error returns, retries/timeouts, structured output enforcement, validation gates, fallbacks, and chaos testing.

- [Cost & Latency Engineering](cost.md) — Making the agent affordable to run, and fast enough to be useful. Cost tracking, prompt caching, model tiering, parallelism, streaming, and the discipline of short context over long.

- [Security & the Agent Threat Surface](security.md) — The new attack surface that agents create. Prompt injection, capability gating, data exfiltration, confidentiality, tool-output poisoning, audit trails, and red-teaming as a continuous practice.

- [Patterns & Anti-Patterns](patterns.md) — Concrete, named patterns and anti-patterns. The shareable-on-its-own area — the kind of content readers send to teammates. Skeleton with flex, guarded tools, context recipes, eval-driven loops, the named anti-patterns, and the recipe templates for coding and research agents.

