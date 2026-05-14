# The Agent Loop & Control Flow

> The mechanics of think → act → observe → repeat, and the patterns that make the loop reliable instead of meandering.


*Area id: `loop`*

---

## The basic agent loop

`id: loop.basic-loop` · **core**

think → act → observe → repeat. The minimal viable agent. Most frameworks hide this; you should be able to write it yourself.

**Competent means:** Can implement a working agent loop in ~50 lines without a framework and name three things the framework was hiding from you.

**Depends on:** `foundations.what-is-a-harness`

**Also known as:** agent loop, observation loop, react loop

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `beginner` · `free` · ◆ durable *(unverified)*
  - The cleanest "build it yourself before you import a framework" guide in the field. Walks through the loop with code, not metaphors.

---

## ReAct (reasoning + acting)

`id: loop.react` · **core**

Interleaved reasoning and tool calls. The canonical "think out loud, then act, then read what happened" pattern.

**Competent means:** Can explain why interleaving beats plan-then-act-then-stop, and can identify when your traces show degenerate reasoning (reasoning that doesn't change the action).

**Depends on:** `loop.basic-loop`

**Related:** `loop.reflexion`

**Also known as:** react pattern, reasoning and acting

**Resources:**

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The canonical paper. Read sections 2 and 4; skim the rest. The framing has held up; the benchmark numbers are dated.

---

## Plan-and-execute

`id: loop.plan-execute` · *recommended*

Generate a plan first, execute the plan, replan on failure. Trades reactivity for explicitness and saves tokens on cheap models.

**Competent means:** Knows when planning pays off (long-horizon tasks, expensive tools) vs when ReAct's reactivity wins (uncertain environments, cheap tools).

**Depends on:** `loop.react`

**Related:** `loop.tree-search`

**Also known as:** planning, plan and execute, planner-executor

**Resources:**

- [Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models](https://arxiv.org/abs/2305.04091) — Wang et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The grounded version of "make a plan first." Treats planning as a prompt technique, not a separate architecture — saves you from over-engineering the planner role.

---

## Reflexion / self-critique

`id: loop.reflexion` · *recommended*

The agent critiques its own output, then retries with the critique in context. Cheap reliability win when verification is cheaper than generation.

**Competent means:** Can implement a one-shot reflexion pass and articulate the cost — when the second model call doesn't earn its tokens.

**Depends on:** `loop.react`

**Related:** `evals.llm-as-judge`

**Also known as:** self-critique, self-reflection

**Resources:**

- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) — Shinn et al., 2023 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The paper that formalized the pattern. The "verbal RL" framing is the durable insight; the specific benchmarks are dated.

---

## Tree-of-Thoughts & search-based loops

`id: loop.tree-search` · _optional_

LATS, ToT, MCTS-flavored agent search. Heavier than ReAct; sometimes worth the cost on hard, low-feedback tasks.

**Competent means:** Can name the cost/latency tax and articulate the small class of tasks where it actually pays off (deep reasoning, no environment feedback).

**Depends on:** `loop.plan-execute`

**Also known as:** tree of thoughts, tot, mcts agent, lats

**Resources:**

- [Tree of Thoughts: Deliberate Problem Solving with Large Language Models](https://arxiv.org/abs/2305.10601) — Yao et al., 2023 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The seminal paper. Read it for the framing of search-over-thought rather than the benchmark gains — the gains have closed.

---

## Deterministic skeletons

`id: loop.deterministic-skeleton` · **core**

Hard-code the deterministic backbone (state machine, DAG) and let the model fill flexible steps. The single biggest reliability lever you have.

**Competent means:** Can refactor an open-ended agent into a skeleton+flexible-step design and can name three steps that should never be left to the model.

**Depends on:** `loop.basic-loop`

**Related:** `patterns.skeleton-with-flex`

**Also known as:** agent skeleton, workflow agent, structured agent

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The "workflow vs agent" framing in this post is the clearest in the field — the case for deterministic backbones is made with worked examples.

---

## Halting conditions & loop budgets

`id: loop.halting` · **core**

Step budgets, time budgets, repeat-detection, termination conditions. Most production agent fails are halting failures, not reasoning failures.

**Competent means:** Knows three ways an agent fails to halt (oscillation, monotonic grind, false-success exit) and has implemented a detector for each.

**Depends on:** `loop.basic-loop`

**Related:** `reliability.timeouts`

**Also known as:** termination, step budget, infinite loop

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `beginner` · `free` · ◆ durable *(unverified)*
  - The "stopping criteria" guidance is the most actionable on the web — treats halting as a first-class design decision, not an afterthought.

---

## Human-in-the-loop checkpoints

`id: loop.human-in-the-loop` · *recommended*

Pause points, approval gates, ask-to-clarify. The escape hatch that keeps the agent useful when confidence is low.

**Competent means:** Can design a HITL gate that doesn't kill latency (asynchronous, batched approvals, well-chosen interruption points).

**Depends on:** `loop.deterministic-skeleton`

**Related:** `reliability.validation`

**Also known as:** hitl, approval gate, human review

**Resources:**

- [Human-in-the-loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/) — LangGraph, 2025 · `post` · `intermediate` · `free` · 🜂 current *(unverified)*
  - Current-tool example (durability:current) — the clearest implementation walkthrough for a HITL gate in a real framework; the principles transfer if LangGraph rotates out of fashion.

---
