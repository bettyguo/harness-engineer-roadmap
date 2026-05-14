# Tools & Tool Layers

> How the agent reaches the world: tool design, schemas, the MCP layer, error handling, selection at scale, composition, sandboxing, and the new computer-use surface.


*Area id: `tools`*

---

## Tool & function design

`id: tools.tool-design` · **core**

Naming, single-purpose vs swiss-army, return shapes, descriptions as prompts. The model only succeeds at tool use if the tools are well-named and well-described.

**Competent means:** Can audit a tool list and remove three tools without losing capability. Knows that the tool description is part of the prompt.

**Depends on:** `loop.react`

**Related:** `tools.schema-design`, `tools.tool-selection`

**Also known as:** function design, tool definitions, function calling

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The tool-design section is the single best practitioner-grade treatment; calls out the descriptions-as-prompts insight explicitly.

---

## Schema design for tool I/O

`id: tools.schema-design` · **core**

JSON Schema, descriptions as prompts, enums, structured outputs. Over-permissive schemas degrade tool-use accuracy by silently inviting bad inputs.

**Competent means:** Can show a before/after where tightening a tool schema raised accuracy without changing the model.

**Depends on:** `tools.tool-design`

**Related:** `reliability.structured-output`

**Also known as:** function schemas, json schema, tool schemas

**Resources:**

- [JSON Schema for OpenAPI](https://platform.openai.com/docs/guides/structured-outputs) — OpenAI, 2024 · `spec` · `intermediate` · `free` · 🜂 current
  - The reference for structured-output enforcement at the model boundary — durable because schemas-as-contracts is a permanent pattern, even as specific platform APIs evolve.

---

## Model Context Protocol (MCP)

`id: tools.mcp` · **core**

The 2025 protocol for standardizing tool access across models and clients. Replaces bespoke tool-wiring with a shared interface.

**Competent means:** Can ship an MCP server in an afternoon and knows when MCP is overkill (one local tool, no client diversity).

**Depends on:** `tools.tool-design`

**Related:** `tools.sandboxing`

**Also known as:** model context protocol, mcp servers, mcp client

**Resources:**

- [Model Context Protocol — specification](https://modelcontextprotocol.io/) — Anthropic, 2024 · `spec` · `intermediate` · `free` · ◆ durable
  - The canonical spec. Read the overview + transports; skim the rest until you need it. Mandatory reading once you have more than one tool client.

---

## Tool errors as model input

`id: tools.tool-errors` · **core**

Errors are signals the model can read and act on. A 400 stack trace back into the prompt is usually worse than a structured "you passed an invalid date; expected ISO-8601."

**Competent means:** Distinguishes "the tool errored" from "the model misused the tool" in traces, and shapes error returns so the model can recover.

**Depends on:** `tools.schema-design`

**Related:** `reliability.structured-errors`

**Also known as:** tool error handling, error returns

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "tools-as-API-surface" guidance covers error shapes explicitly — the only post that treats them as a model-input design problem, not a logging concern.

---

## Tool selection at scale

`id: tools.tool-selection` · *recommended*

What happens when the agent has 50 tools — retrieval-based tool selection, tool-bench-style filtering, dynamic tool loading.

**Competent means:** Knows the breakpoint where tool count starts hurting accuracy (varies by model) and has a strategy for crossing it.

**Depends on:** `tools.tool-design`

**Related:** `retrieval.embeddings`

**Also known as:** tool retrieval, many tools

**Resources:**

- [ToolBench / ToolLLM](https://arxiv.org/abs/2307.16789) — Qin et al., 2023 · `paper` · `advanced` · `free` · ◆ durable
  - The clearest benchmark for "what happens when you scale tool counts" — the framing has held even as models have improved on the absolute scores.

---

## Tool composition & chaining

`id: tools.composition` · *recommended*

Pipelines and tool-to-tool data plumbing. When the model shouldn't be involved in mechanical handoffs.

**Competent means:** Can decide between in-prompt chaining (model decides next tool) and in-code chaining (deterministic pipeline) for a given task.

**Depends on:** `tools.tool-design`

**Related:** `loop.deterministic-skeleton`

**Also known as:** tool chaining, tool pipelines

**Resources:**

- [Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The "prompt chaining" pattern in this post is the cleanest treatment of in-code vs in-prompt composition.

---

## Tool sandboxing & permission scopes

`id: tools.sandboxing` · **core**

Code-execution sandboxes, file-system permissions, network egress controls. Every tool you give the model is also a tool you give anyone who can prompt the model.

**Competent means:** Knows three escape paths (shell, network, file-system) and has closed each with a default-deny posture.

**Depends on:** `tools.tool-design`

**Related:** `security.permissions`

**Also known as:** tool sandbox, execution sandbox, permissions

**Resources:**

- [E2B — Sandboxes for AI agents (blog index)](https://e2b.dev/blog) — E2B, 2025 · `post` · `intermediate` · `free` · 🜂 current
  - Current-tool example — running index of sandbox-design posts (microVM isolation, egress limits, ephemeral filesystems). The architectural principles outlast the specific platform.

---

## Computer-use tools

`id: tools.computer-use` · *recommended*

Browser automation, shell tools, IDE plugin surface. Pixel-level vs API-level tool use, and the failure modes specific to each.

**Competent means:** Knows the failure modes of pixel-level tool use (drift, layout churn, screenshot cost) vs API-level (auth, schema rot) and picks accordingly.

**Depends on:** `tools.tool-design`

**Related:** `patterns.coding-agent-recipes`

**Also known as:** browser use, shell agent, computer use api

**Resources:**

- [Introducing computer use](https://www.anthropic.com/news/3-5-models-and-computer-use) — Anthropic, 2024 · `post` · `intermediate` · `free` · ◆ durable
  - The clearest first-party explanation of pixel-level computer use, including the honest failure modes. Durable because the tradeoffs are intrinsic, not implementation details.

---
