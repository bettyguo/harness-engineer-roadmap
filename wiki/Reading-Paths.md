# Reading paths

Three canonical paths through the map. Pick whichever matches your current situation. Each path is meant to be walked over weeks, not minutes — the rubric per node is the milestone, not the resource count.

## Path 1 — "My agent works in the demo and breaks in production"

You shipped something. It's working in the easy cases. It's silently failing in the messy ones and you're losing trust with your stakeholders.

1. [foundations.what-is-a-harness](https://bettyguo.github.io/harness-engineer-roadmap/#node/foundations.what-is-a-harness) — name the parts before fixing any of them.
2. [foundations.engineer-the-mistake-out](https://bettyguo.github.io/harness-engineer-roadmap/#node/foundations.engineer-the-mistake-out) — the rule that turns one failure into a permanent fix.
3. [reliability.failure-taxonomy](https://bettyguo.github.io/harness-engineer-roadmap/#node/reliability.failure-taxonomy) — name your current failures.
4. [reliability.structured-errors](https://bettyguo.github.io/harness-engineer-roadmap/#node/reliability.structured-errors) → [reliability.structured-output](https://bettyguo.github.io/harness-engineer-roadmap/#node/reliability.structured-output) → [reliability.retries-backoff](https://bettyguo.github.io/harness-engineer-roadmap/#node/reliability.retries-backoff) → [reliability.timeouts](https://bettyguo.github.io/harness-engineer-roadmap/#node/reliability.timeouts) — the core reliability quartet.
5. [evals.task-evals](https://bettyguo.github.io/harness-engineer-roadmap/#node/evals.task-evals) → [evals.regression](https://bettyguo.github.io/harness-engineer-roadmap/#node/evals.regression) → [patterns.eval-driven-loop](https://bettyguo.github.io/harness-engineer-roadmap/#node/patterns.eval-driven-loop) — without these, every "fix" is hope.
6. [patterns.skeleton-with-flex](https://bettyguo.github.io/harness-engineer-roadmap/#node/patterns.skeleton-with-flex) — the single biggest reliability lever you have.
7. [patterns.anti-patterns](https://bettyguo.github.io/harness-engineer-roadmap/#node/patterns.anti-patterns) — what you might already be doing wrong.

You're done with the path when you can: (a) name three failures of your current agent using the taxonomy, (b) have eval coverage that would catch a regression on any of them, (c) have refactored at least one open-ended step into a deterministic skeleton.

## Path 2 — "I'm scaling from one agent to many"

Your one agent works. The company wants ten. You're sitting in front of a multi-agent design and something feels expensive about it.

1. [orchestration.single-vs-multi](https://bettyguo.github.io/harness-engineer-roadmap/#node/orchestration.single-vs-multi) — the gate question.
2. [orchestration.anti-patterns](https://bettyguo.github.io/harness-engineer-roadmap/#node/orchestration.anti-patterns) — read this BEFORE you keep building.
3. [orchestration.supervisor-worker](https://bettyguo.github.io/harness-engineer-roadmap/#node/orchestration.supervisor-worker) → [orchestration.handoffs](https://bettyguo.github.io/harness-engineer-roadmap/#node/orchestration.handoffs) → [orchestration.routing](https://bettyguo.github.io/harness-engineer-roadmap/#node/orchestration.routing).
4. [memory.state-persistence](https://bettyguo.github.io/harness-engineer-roadmap/#node/memory.state-persistence) → [memory.shared-memory](https://bettyguo.github.io/harness-engineer-roadmap/#node/memory.shared-memory) — multi-agent without state-passing is a slot machine.
5. [cost.tracking](https://bettyguo.github.io/harness-engineer-roadmap/#node/cost.tracking) → [cost.parallelism](https://bettyguo.github.io/harness-engineer-roadmap/#node/cost.parallelism) → [cost.model-tiering](https://bettyguo.github.io/harness-engineer-roadmap/#node/cost.model-tiering) — orchestration without cost budgets goes bankrupt.
6. [security.permissions](https://bettyguo.github.io/harness-engineer-roadmap/#node/security.permissions) → [security.audit-trail](https://bettyguo.github.io/harness-engineer-roadmap/#node/security.audit-trail) — more agents = bigger blast radius.

Done when you can: defend the agent count in your design against a hostile reviewer, show per-agent cost attribution, and prove every action is reconstructible from logs.

## Path 3 — "I'm new to harness engineering"

You've called an LLM API and built a demo. You're hearing the word "agent" everywhere and want to learn the actual craft.

1. [foundations.what-is-a-harness](https://bettyguo.github.io/harness-engineer-roadmap/#node/foundations.what-is-a-harness) → [foundations.engineer-the-mistake-out](https://bettyguo.github.io/harness-engineer-roadmap/#node/foundations.engineer-the-mistake-out) → [foundations.durable-vs-current](https://bettyguo.github.io/harness-engineer-roadmap/#node/foundations.durable-vs-current).
2. [loop.basic-loop](https://bettyguo.github.io/harness-engineer-roadmap/#node/loop.basic-loop) — implement it yourself in 50 lines, then read [loop.react](https://bettyguo.github.io/harness-engineer-roadmap/#node/loop.react).
3. [tools.tool-design](https://bettyguo.github.io/harness-engineer-roadmap/#node/tools.tool-design) → [tools.schema-design](https://bettyguo.github.io/harness-engineer-roadmap/#node/tools.schema-design) → [tools.mcp](https://bettyguo.github.io/harness-engineer-roadmap/#node/tools.mcp).
4. [context.window-budget](https://bettyguo.github.io/harness-engineer-roadmap/#node/context.window-budget) → [context.system-prompts](https://bettyguo.github.io/harness-engineer-roadmap/#node/context.system-prompts) → [context.structured-context](https://bettyguo.github.io/harness-engineer-roadmap/#node/context.structured-context).
5. [evals.why-evals-are-hard](https://bettyguo.github.io/harness-engineer-roadmap/#node/evals.why-evals-are-hard) → [evals.task-evals](https://bettyguo.github.io/harness-engineer-roadmap/#node/evals.task-evals).
6. [patterns.skeleton-with-flex](https://bettyguo.github.io/harness-engineer-roadmap/#node/patterns.skeleton-with-flex) → [patterns.anti-patterns](https://bettyguo.github.io/harness-engineer-roadmap/#node/patterns.anti-patterns).

Done when you've shipped an agent loop you wrote yourself, with structured tools, with task-level evals, and you can name three durable concepts under whichever framework you eventually adopt.

## When the paths overlap

The maps are intentionally redundant — many nodes appear on more than one path. That's the right shape: an idea you encounter via reliability and again via patterns is one you actually need. Walk the paths slowly.
