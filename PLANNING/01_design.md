# PHASE 1 — DESIGN

> Taxonomy, data model, renderer architecture, repo layout, README wireframe, hosting plan, tooling design, contribution flow, verification plan. Phase 0 decisions ([00_think.md](00_think.md)) are inputs to this doc and not re-litigated here.

---

## 1. The roadmap taxonomy

Twelve areas. The spine moves from foundations → core mechanics → application concerns → cross-cutting concerns. Each area is a visual cluster in the diagram. Total: 84 nodes.

Per-node fields (defined in §2): `id`, `label`, `area`, `summary`, `competent_means`, `tier`, `depends_on[]`, `related[]`, `aliases[]`, `resources[]`.

### A. Foundations — the framing (4 nodes)
The reader needs the discipline's vocabulary before the diagram. Small cluster, gateway to everything else.

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `foundations.what-is-a-harness` | What is a harness? | core | `Agent = Model + Harness`; the harness is everything around the model. Competent: can name the six harness components (state, security, orchestration, memory, observability, evals) and explain why fixing the harness often beats switching the model. |
| `foundations.engineer-the-mistake-out` | "Engineer the mistake out" | core | Hashimoto's framing: every agent failure becomes a permanent fix to the harness, not a prompt retry. Competent: can identify three of their own past prompt-fixes that should have been harness-fixes. |
| `foundations.durable-vs-current` | Durable concepts vs current tools | core | The field churns monthly. Concepts (the agent loop, eval, memory) outlive tool names (LangChain, AutoGen, current MCP server X). Competent: when reading a new framework, can name which concept it implements. |
| `foundations.competence-rubric` | What "competent" looks like | recommended | The rubric for the whole roadmap: can you ship an agent that doesn't break in production? Competent: can score their own agent against the rubric. |

### B. The Agent Loop & Control Flow (8 nodes)
The mechanics of what an agent *is*. The most-asked sub-topic.

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `loop.basic-loop` | The basic agent loop | core | think → act → observe → repeat. Competent: can implement a working loop in ~50 lines without a framework. Depends on: `foundations.what-is-a-harness`. |
| `loop.react` | ReAct (reasoning + acting) | core | Interleaved reasoning and tool calls; the canonical pattern. Competent: can explain why interleaving beats reason-then-act-then-stop. Depends on: `loop.basic-loop`. |
| `loop.plan-execute` | Plan-and-execute | recommended | Generate a plan first, execute the plan, replan on failure. Competent: can identify when planning pays off vs ReAct's reactivity. Depends on: `loop.react`. |
| `loop.reflexion` | Reflexion / self-critique | recommended | The agent critiques its own output and retries with the critique in context. Competent: can implement a one-shot reflexion pass. Depends on: `loop.react`. |
| `loop.tree-search` | Tree-of-Thoughts & search-based loops | optional | LATS, ToT, MCTS-flavored agent search. Competent: can name the cost/latency cost and when it's worth it. Depends on: `loop.plan-execute`. |
| `loop.deterministic-skeleton` | Deterministic skeletons | core | Hard-code the deterministic backbone (state machine, DAG) and let the model fill flexible steps. The single biggest reliability lever. Competent: can refactor an open-ended agent into a skeleton+flexible-step design. Depends on: `loop.basic-loop`. |
| `loop.halting` | Halting conditions & loop budgets | core | Step budgets, time budgets, repeat-detection, termination conditions. Competent: knows three ways an agent fails to halt and how to detect each. Depends on: `loop.basic-loop`. |
| `loop.human-in-the-loop` | Human-in-the-loop checkpoints | recommended | Pause points, approval gates, ask-to-clarify. Competent: can design a HITL gate that doesn't kill latency. Depends on: `loop.deterministic-skeleton`. |

### C. Tools & Tool Layers (8 nodes)
How the agent reaches the world.

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `tools.tool-design` | Tool & function design | core | Naming, schemas, single-purpose vs swiss-army, return shapes. Competent: can audit a tool list and remove three. Depends on: `loop.react`. |
| `tools.schema-design` | Schema design for tool inputs/outputs | core | JSON Schema, descriptions as prompts, enums, structured outputs. Competent: can explain why over-permissive schemas degrade tool-use accuracy. Depends on: `tools.tool-design`. |
| `tools.mcp` | Model Context Protocol (MCP) | core | The 2025 protocol for standardizing tool access. Competent: can ship an MCP server in an afternoon and knows when it's overkill. Depends on: `tools.tool-design`. Aliases: `model context protocol`, `mcp servers`. |
| `tools.tool-errors` | Tool errors as model input | core | Structured error returns the model can read and act on. Competent: distinguishes "the tool errored" from "the model misused the tool" in traces. Depends on: `tools.schema-design`, `reliability.structured-errors`. |
| `tools.tool-selection` | Tool selection at scale | recommended | What happens when the agent has 50 tools — retrievers, tool-bench, dynamic tool-loading. Competent: knows the breakpoint where tool-count starts hurting accuracy. Depends on: `tools.tool-design`. |
| `tools.composition` | Tool composition & chaining | recommended | Pipelines, tool→tool data plumbing, structured handoffs. Competent: can decide between in-prompt chaining and in-code chaining. Depends on: `tools.tool-design`. |
| `tools.sandboxing` | Tool sandboxing & permission scopes | core | Code execution sandboxes, file-system permissions, network egress controls. Competent: knows three escape paths and how to close them. Depends on: `tools.tool-design`, `security.permissions`. |
| `tools.computer-use` | Computer-use tools (browsers, shells, IDEs) | recommended | Browser automation, shell tools, IDE plugin surface. Competent: knows the failure modes of pixel-level tool use vs API-level tool use. Depends on: `tools.tool-design`. |

### D. Context Engineering (8 nodes)
Karpathy's term, well-established. Filling the context window with the right things.

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `context.window-budget` | Context-window budgeting | core | Token accounting, headroom, ceiling effects, the cost of "just put everything in." Competent: can sketch a budget for a real agent on the back of a napkin. Depends on: `foundations.what-is-a-harness`. |
| `context.system-prompts` | System-prompt design | core | Persona, rules, output shape, what *not* to put in the system prompt. Competent: can audit a system prompt and cut 30% without behavior loss. Depends on: `context.window-budget`. |
| `context.compaction` | Compaction & summarization | core | Auto-compact, sliding windows, hierarchical summaries, OpenHarness's auto-compaction. Competent: knows when compaction loses load-bearing signal. Depends on: `context.window-budget`. |
| `context.relevance-filtering` | Relevance filtering & pruning | recommended | Trim noisy tool outputs before they hit the next turn. Competent: can show a before/after where filtering raised accuracy. Depends on: `context.window-budget`. |
| `context.position-bias` | Position bias & ordering | recommended | Lost-in-the-middle, recency bias, why the order of context items matters. Competent: can demo position bias on a current model. Depends on: `context.window-budget`. |
| `context.structured-context` | Structured context (XML, tags, sections) | core | Anthropic-style XML, OpenAI-style sections, why structure boosts compliance. Competent: can refactor a flat prompt to structured and explain the gain. Depends on: `context.system-prompts`. |
| `context.long-context-pitfalls` | Long-context pitfalls | recommended | 1M-token windows aren't free: latency, attention dilution, cost. Competent: knows when *not* to use long context. Depends on: `context.window-budget`, `cost.caching`. |
| `context.context-poisoning` | Context poisoning | core | Bad data in context cascades. Competent: can name three ways context gets poisoned and the audit trace to catch it. Depends on: `context.window-budget`, `security.prompt-injection`. |

### E. Memory & State (7 nodes)

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `memory.working-vs-long-term` | Working memory vs long-term memory | core | What goes in context every turn vs what's recalled when needed. Competent: can draw the memory architecture of any agent they read about. Depends on: `context.window-budget`. |
| `memory.episodic-semantic` | Episodic vs semantic memory | recommended | "What happened last Tuesday" vs "what's true." Different retrieval strategies. Competent: knows which their agent actually needs. Depends on: `memory.working-vs-long-term`. |
| `memory.state-persistence` | State & session persistence | core | Where state lives across turns: in-process, KV store, database. Competent: can argue about the durability/latency tradeoff. Depends on: `memory.working-vs-long-term`. |
| `memory.knowledge-bases` | LLM knowledge bases (Karpathy pattern) | recommended | The "markdown library the LLM curates" pattern that replaces RAG for some use cases. Competent: knows when it beats RAG and when it's a toy. Depends on: `memory.working-vs-long-term`, `retrieval.rag-basics`. |
| `memory.vector-memory` | Vector-store memory | recommended | Embedding-based recall, eviction policies. Competent: can defend their chunking strategy. Depends on: `memory.long-term`, `retrieval.embeddings`. |
| `memory.forgetting` | Forgetting, decay, eviction | recommended | When old memory becomes a liability. Competent: has implemented a non-trivial eviction policy. Depends on: `memory.vector-memory`. |
| `memory.shared-memory` | Shared memory across agents | optional | Multi-agent memory blackboards, conflict resolution. Competent: knows the race conditions. Depends on: `memory.state-persistence`, `orchestration.handoffs`. |

### F. Retrieval Integration (6 nodes)
The "harness-layer" view of retrieval — not RAG-101.

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `retrieval.rag-basics` | RAG as a harness component | core | Just enough RAG to slot it into the harness — not from-scratch. Competent: can explain why most RAG is bad chunking, not bad embedding. Depends on: `foundations.what-is-a-harness`. |
| `retrieval.embeddings` | Embeddings & dense retrieval | core | Embedding choice, dimensionality, normalization. Competent: knows three embedding-choice failure modes. Depends on: `retrieval.rag-basics`. |
| `retrieval.hybrid` | Hybrid search (BM25 + dense + rerank) | recommended | Why pure dense loses on technical terms, when to add BM25, when to rerank. Competent: ships hybrid by default. Depends on: `retrieval.embeddings`. |
| `retrieval.query-rewriting` | Query rewriting & HyDE | recommended | Letting the model rewrite the query before retrieval. Competent: can show a query where rewriting matters. Depends on: `retrieval.rag-basics`. |
| `retrieval.citations` | Citations, attribution, grounding | core | Making the agent show its work — the antidote to hallucinated retrievals. Competent: can audit an agent's citations and find a fabricated one. Depends on: `retrieval.rag-basics`. |
| `retrieval.agentic-retrieval` | Agentic / iterative retrieval | recommended | The agent decides what to retrieve next based on what it just read. Competent: knows when it pays off vs single-shot retrieval. Depends on: `retrieval.query-rewriting`, `loop.react`. |

### G. Multi-Agent Orchestration (7 nodes)

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `orchestration.single-vs-multi` | Single vs multi-agent | core | The "do you actually need multiple agents?" gate. Competent: can argue against multi-agent for a use case where it's a fad. Depends on: `loop.basic-loop`. |
| `orchestration.supervisor-worker` | Supervisor / worker patterns | recommended | One agent dispatches, others execute. Competent: can sketch the supervisor's tool list. Depends on: `orchestration.single-vs-multi`. |
| `orchestration.handoffs` | Handoffs & state passing | core | What does each agent need to know? How do you avoid re-reading the world? Competent: knows three handoff bugs and how to detect them. Depends on: `orchestration.supervisor-worker`, `memory.shared-memory`. |
| `orchestration.routing` | Routing & specialization | recommended | When one agent is wrong for the job. Competent: can defend a routing policy. Depends on: `orchestration.supervisor-worker`. |
| `orchestration.parallel` | Parallelism & fan-out | recommended | Running tool calls or subagents concurrently. Competent: knows the latency/cost tradeoff. Depends on: `cost.parallelism`. |
| `orchestration.debate` | Debate, voting, ensembles | optional | Multiple agents critique or vote. Competent: knows when ensemble accuracy gains are real vs theatrical. Depends on: `orchestration.single-vs-multi`. |
| `orchestration.anti-patterns` | Multi-agent anti-patterns | core | "Two agents pretending to talk." The most expensive failure mode in the field. Competent: can spot a multi-agent design that should have been one agent. Depends on: `orchestration.single-vs-multi`, `patterns.anti-patterns`. |

### H. Evals & Observability (8 nodes)

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `evals.why-evals-are-hard` | Why agent evals are different | core | Non-determinism, multi-step, partial-credit, no clean labels. Competent: can explain why traditional ML eval doesn't transfer. Depends on: `foundations.what-is-a-harness`. |
| `evals.task-evals` | Task-level evals | core | End-to-end task success, scoring rubrics. Competent: has a scoring rubric for their agent. Depends on: `evals.why-evals-are-hard`. |
| `evals.trajectory-evals` | Trajectory / process evals | recommended | Scoring intermediate steps, not just outputs. Competent: has caught a regression that task-level eval missed. Depends on: `evals.task-evals`. |
| `evals.llm-as-judge` | LLM-as-judge | core | Using a model to grade a model — calibration, bias, when to trust it. Competent: knows three ways judges fail and the human spot-check rate. Depends on: `evals.task-evals`. |
| `evals.regression` | Regression eval & golden sets | core | Locking in behavior, the eval-set-as-test-suite mindset. Competent: their PR pipeline blocks on eval regressions. Depends on: `evals.task-evals`. |
| `obs.tracing` | Tracing & structured logs | core | Per-turn traces, OpenTelemetry-style spans, replay. Competent: can debug a failed agent run from traces alone. Depends on: `evals.why-evals-are-hard`. |
| `obs.observability-tools` | Observability tools (current) | recommended | Langfuse, AgentOps, LangSmith, Laminar — the current crop. Marked durable-vs-current: most names will rotate. Competent: knows what they want, can pick a tool. Depends on: `obs.tracing`. |
| `obs.cost-latency-dashboards` | Cost & latency dashboards | recommended | The "is this agent affordable to run" view. Competent: their agent has a $/task and p50/p99 latency dashboard. Depends on: `obs.tracing`, `cost.tracking`. |

### I. Failure Modes & Reliability (8 nodes)

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `reliability.failure-taxonomy` | The failure taxonomy | core | Hallucination, loop-fail, tool-misuse, context-drift, halt-fail, permission-fail. Competent: can label any agent failure with one of these. Depends on: `foundations.what-is-a-harness`. |
| `reliability.structured-errors` | Structured error returns | core | Errors the model can read and recover from. Competent: distinguishes "raise" from "return-as-context." Depends on: `tools.schema-design`. |
| `reliability.retries-backoff` | Retries, backoff, idempotency | core | Standard reliability discipline applied to model + tool calls. Competent: can defend the retry budget. Depends on: `reliability.structured-errors`. |
| `reliability.timeouts` | Timeouts & deadlines | core | Per-call, per-step, per-task. Competent: knows where their longest call lives. Depends on: `reliability.retries-backoff`. |
| `reliability.structured-output` | Structured output enforcement | core | JSON Schema, function calling, constrained decoding, schema-fix loops. Competent: never parses freeform model output in production. Depends on: `tools.schema-design`. |
| `reliability.validation` | Validation gates | recommended | Post-conditions on tool output, sanity checks on plans. Competent: has rejected a "successful" agent run that failed validation. Depends on: `reliability.structured-output`. |
| `reliability.fallbacks` | Fallbacks & degraded modes | recommended | What does the agent do when the model is down? Competent: their agent has a documented degraded mode. Depends on: `reliability.retries-backoff`. |
| `reliability.chaos` | Chaos testing for agents | optional | Inject tool failures, latency spikes, context truncation. Competent: has run a chaos test that found a real bug. Depends on: `reliability.failure-taxonomy`, `evals.regression`. |

### J. Cost & Latency (6 nodes)

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `cost.tracking` | Cost & token tracking | core | Per-task, per-user, per-feature attribution. Competent: knows the $/task of their agent. Depends on: `obs.tracing`. |
| `cost.caching` | Prompt caching | core | Anthropic prompt caching, OpenAI prefix caching, KV-cache reuse. Competent: their prompts are designed cache-first. Depends on: `context.system-prompts`. |
| `cost.model-tiering` | Model tiering & routing | recommended | Cheap model for simple steps, expensive for hard. Competent: can show a tier split with a quality plot. Depends on: `cost.tracking`. |
| `cost.parallelism` | Parallelism & batching | recommended | Concurrent tool calls, batched embeddings, async patterns. Competent: knows the latency wins and the contention bugs. Depends on: `cost.tracking`. |
| `cost.streaming` | Streaming & partial outputs | recommended | Streaming for perceived latency; partial-output UX. Competent: knows when streaming is a UX win vs a footgun. Depends on: `cost.tracking`. |
| `cost.short-vs-long-context` | Short-context discipline | recommended | Why a 4k well-shaped context often beats 100k everything-in. Competent: prefers short context until proven otherwise. Depends on: `context.window-budget`. |

### K. Security & The Agent Threat Surface (7 nodes)

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `security.prompt-injection` | Prompt injection | core | Direct + indirect injection, the agent-tool-data attack surface. Competent: can attack their own agent in three ways. Depends on: `context.context-poisoning`. |
| `security.permissions` | Capability gating & permissions | core | What can the agent do, and on whose behalf? Competent: agent runs least-privilege by default. Depends on: `tools.sandboxing`. |
| `security.data-exfiltration` | Data exfiltration | core | Side-channel leaks via tool calls, URLs, embeddings. Competent: their agent's egress is enumerable. Depends on: `security.permissions`. |
| `security.confidentiality` | Confidentiality & PII | recommended | Redaction, secrets handling, prompt-leak hygiene. Competent: has a redactor in the trace pipeline. Depends on: `obs.tracing`. |
| `security.tool-poisoning` | Tool-output poisoning | recommended | Adversarial content in retrieved docs or tool returns. Competent: distinguishes trusted from untrusted tool outputs. Depends on: `security.prompt-injection`, `tools.tool-errors`. |
| `security.audit-trail` | Audit trails | recommended | Who did what, when, why — provable from logs. Competent: their agent's actions are reconstructible months later. Depends on: `obs.tracing`. |
| `security.red-team` | Red-teaming agents | optional | Adversarial eval as discipline. Competent: runs a red-team eval on their agent monthly. Depends on: `security.prompt-injection`, `evals.regression`. |

### L. Patterns & Anti-Patterns (7 nodes)
The shareable-on-its-own area. Concrete names, concrete examples.

| id | label | tier | what it covers / "competent" means |
| --- | --- | --- | --- |
| `patterns.skeleton-with-flex` | Skeleton with flexible steps | core | Deterministic backbone, model fills gaps. The #1 reliability pattern. Depends on: `loop.deterministic-skeleton`. |
| `patterns.guarded-tool` | Guarded tool pattern | core | Every tool has a precondition + postcondition checker. Depends on: `tools.tool-design`, `reliability.validation`. |
| `patterns.context-recipes` | Context recipes (system + user + retrieved) | core | Named slot layouts that have been shown to work. Depends on: `context.structured-context`. |
| `patterns.eval-driven-loop` | Eval-driven loop | recommended | Every change has an eval. No exceptions. Depends on: `evals.regression`. |
| `patterns.anti-patterns` | Named anti-patterns | core | "Prompt the bug away," "Add another agent," "More context = more correct," "Fancy retriever, broken chunking." Each named, each with an example. Depends on: `foundations.engineer-the-mistake-out`. |
| `patterns.coding-agent-recipes` | Coding-agent recipes | recommended | The Claude Code / Cursor / Aider class of harness: file-edit tool, test runner, plan-mode. Depends on: `tools.computer-use`, `loop.deterministic-skeleton`. |
| `patterns.research-agent-recipes` | Research-agent recipes | recommended | Browse → read → cite → summarize loops. The OpenAI-DeepResearch class. Depends on: `loop.plan-execute`, `retrieval.agentic-retrieval`. |

### Edges (dependencies = the graph)

Encoded as `depends_on[]` in each node spec above. Cross-area dependencies are intentional — they tie the diagram together (e.g., `tools.tool-errors → reliability.structured-errors`, `obs.tracing → cost.tracking`, `security.prompt-injection → context.context-poisoning`). `related[]` (lighter edge style) marks non-prereq affinities like `patterns.coding-agent-recipes ↔ tools.computer-use`.

### Why this taxonomy and not the prompt's candidate spine

The candidate in the master prompt is close. Refinements made here, with rationale:

1. **Added "Foundations" (A) as a tiny gateway cluster.** The reader needs the `Agent = Model + Harness` framing and the "engineer the mistake out" rule before everything else clicks. Four nodes only — does not bloat the visual.
2. **Renamed "Eval Harnesses & Observability" → keeping the meaning but two areas behave better visually** if I were to split. Kept as one (H) for cohesion; observability sub-cluster is grouped at the bottom.
3. **Promoted "Patterns & Anti-Patterns" (L) to the headline shareable area** with seven concrete named patterns instead of vague "patterns/anti-patterns." This is the area meant to break out on social.
4. **Added a `Failure Modes` cluster opener** (`reliability.failure-taxonomy`) so the area has a single canonical entry node.
5. **Added durable-vs-current flagging at the resource level**, not the node level — the *concepts* are durable; only some *resources* (specific tool names) churn.

---

## 2. The structured data model (schema for `roadmap-data/`)

YAML, one file per area: `roadmap-data/<area>.yml`. Twelve files total, mirroring §1.

```yaml
# roadmap-data/loop.yml — example shape
area:
  id: loop
  label: "The Agent Loop & Control Flow"
  color: "violet"             # area-tier palette key, NOT a hex
  order: 2                    # visual ordering in the graph (left-to-right cluster index)
  blurb: >
    The mechanics of think → act → observe → repeat, and the patterns that
    make the loop reliable instead of meandering.

nodes:
  - id: loop.basic-loop
    label: "The basic agent loop"
    tier: core                 # core | recommended | optional
    summary: >
      think → act → observe → repeat. The minimal viable agent.
    competent_means: >
      Can implement a working agent loop in ~50 lines without a framework,
      and can name three things the framework was hiding.
    depends_on: [foundations.what-is-a-harness]
    related: []
    aliases: [agent loop, react loop, observation loop]
    resources:
      - title: "ReAct: Synergizing Reasoning and Acting in Language Models"
        author: "Yao et al."
        year: 2023
        type: paper              # paper | repo | tool | post | talk | spec | book | course
        link: "https://arxiv.org/abs/2210.03629"
        why: >
          The canonical paper. Read sections 2 and 4; skim the rest. The
          framing is more useful than the benchmark numbers.
        difficulty: intermediate  # beginner | intermediate | advanced
        cost: free                # free | paid | freemium
        durability: durable       # durable | current
        verified: pending         # pending | yes | no — flipped to yes in Phase 4 only
        verified_at: null         # ISO date string when verified

  # ... more nodes
```

### Field-by-field contract

**Area (one per file):**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string, lowercase, kebab-case | yes | Matches filename. |
| `label` | string | yes | Human-readable. |
| `color` | enum (palette key) | yes | Drives node + edge color. Palette in §4. |
| `order` | int | yes | Visual left-to-right order. |
| `blurb` | string | yes | 1–2 sentences. Shown in the area-cluster header. |

**Node:**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string, kebab-case, namespaced `<area>.<node>` | yes | Globally unique. |
| `label` | string | yes | Shown in the diagram. |
| `tier` | enum: `core` / `recommended` / `optional` | yes | Drives node visual style. |
| `summary` | string | yes | 1–2 sentences, shown in the panel. |
| `competent_means` | string | yes | What it looks like to be competent — the rubric. |
| `depends_on` | string[] | yes (may be empty) | Strict prerequisites. Drives solid edges. |
| `related` | string[] | no | Non-prereq affinity. Drives dashed edges. |
| `aliases` | string[] | no | For search and adjacent-term discoverability. |
| `resources` | resource[] | yes (≥1 to publish) | See below. |

**Resource:**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | yes | Verbatim. |
| `author` | string | yes | "Et al." OK for >3 authors. |
| `year` | int | yes | First-publish year. |
| `type` | enum | yes | `paper` / `repo` / `tool` / `post` / `talk` / `spec` / `book` / `course` |
| `link` | URL | yes | Resolves at verification time. |
| `why` | string | yes | The curatorial note — *why this resource and not another*. ≤2 sentences. |
| `difficulty` | enum | yes | `beginner` / `intermediate` / `advanced` |
| `cost` | enum | yes | `free` / `paid` / `freemium` |
| `durability` | enum | yes | `durable` (concept-level, ≥3yr shelf) / `current` (tool-name, expect rotation) |
| `verified` | enum | yes | `pending` / `yes` / `no`. **No node ships with all-`pending` resources** (Phase 4 gate). |
| `verified_at` | ISO date | no | Set by `validate_data.py` when `verified` flips to `yes`. |

### Constraints enforced by `tools/validate_data.py`

1. All node ids unique and namespaced.
2. All `depends_on` and `related` ids resolve to an existing node.
3. No orphan nodes (every non-foundation node has at least one incoming or outgoing edge).
4. No cyclic `depends_on` (cycles allowed in `related` only).
5. Every published node has ≥1 resource where `verified == yes`.
6. Every resource has all required fields.
7. Every `durability == current` resource has a `why` that explicitly addresses staleness risk.

---

## 3. Resource entry schema

Defined in §2 above. Repeated here as a quick reference for contributors:

```yaml
- title: ...
  author: ...
  year: ...
  type: paper|repo|tool|post|talk|spec|book|course
  link: https://...
  why: "One or two sentences on why this resource specifically."
  difficulty: beginner|intermediate|advanced
  cost: free|paid|freemium
  durability: durable|current
  verified: pending|yes|no
```

---

## 4. The renderer architecture

### Stack (locked)

- **React 18** + **TypeScript** + **Vite** — fast dev, fast static build, easy SPA.
- **React Flow (xyflow)** — pan, zoom, custom node + edge components, minimap, fit-view.
- **ELK.js** — auto-layout layered left-to-right. Manual position overrides in YAML per node when needed.
- **Tailwind v3** — utility classes. A custom theme on top, not stock.
- **`marked`** — render the resource panel's markdown bits (the `why` and `summary`).

### Visual identity

This is where the diagram earns its launch screenshot. The decisions:

- **Theme:** dark mode default; light mode available via toggle. Dark is the launch screenshot.
- **Palette:** deliberately desaturated. Twelve area colors chosen so adjacent clusters never share hue. Background: near-black with a faint dot grid. Single signature accent: **electric mint** (`#5EEAD4`-ish) used only for the active node and focus rings — sparingly, so it pops.
- **Typography:** Inter Display 700 for the H1 ("Harness Engineering Roadmap"), Inter 500/400 for area labels and node labels, **JetBrains Mono** for technical labels and node IDs in the panel. Generous line-height. No body text below 14px.
- **Node shapes:**
  - **Core:** filled rectangle, area color fill, white-ish text. Solid 1.5px border.
  - **Recommended:** transparent fill, area-color border 1.5px, area-color text.
  - **Optional:** transparent fill, area-color border 1px dashed, area-color text at 70% opacity.
  - Hover: subtle 4–6px outer glow in area color.
  - Active (clicked / panel-open): mint accent border + light area-color background tint.
- **Edges:**
  - `depends_on`: solid, 1.5px, area color of the *source* area, with a faint arrowhead.
  - `related`: dashed, 1px, neutral gray.
- **Clusters:** each area gets a labeled, faintly-bordered group container (React Flow group nodes). The cluster header carries the area label in larger Inter Display, plus the area blurb (smaller).
- **Background:** dot grid, very subtle, 24px spacing. Adds depth without competing.
- **No icons inside nodes.** Text-only. Icons add visual noise and lock the look into a specific aesthetic era. Typography is the look.

### Why this is not generic-AI-slop

The Phase 5/6 self-check is: would a reader say "this looks like a real designed thing" or "looks AI-generated"? The defenses:

1. **No stock palette.** Tailwind defaults are visible from a mile away. Custom palette designed cluster-by-cluster.
2. **No emoji-as-decoration.** Modal panels are typography.
3. **Real type, real hierarchy.** Big H1, real area headers, mono for technical labels.
4. **One accent.** Single signature color, used rarely.
5. **Distinct from `ai-engineer-roadmap`** — that repo's choice (per separate planning) trends warmer / lighter; this one is darker and cooler. Side-by-side, they read as siblings with different personalities, not as a matched set.

The aesthetic direction is recorded here so Phase 3 implements it concretely and Phase 6 hostile-review can score it.

### Interactions (locked for v1)

| Interaction | Behavior |
| --- | --- |
| Pan | Drag empty canvas. |
| Zoom | Wheel; pinch on touchpad; +/- keys; fit-view button (top right). |
| Click node | Right side panel slides in (480px desktop, full screen mobile). |
| Panel close | `Esc` key, click outside, or close button. |
| Hover edge | Faint highlight, source + target nodes also subtly highlight (helps trace dependencies). |
| URL fragment | `#node/<id>` opens that node's panel directly on load — shareable links. |
| Theme toggle | Top-right corner. Persists to `localStorage`. |
| Search | `Cmd-K` / `Ctrl-K` opens a small overlay that searches `label + aliases`. Selecting a result pans + zooms + opens panel. |

Search and theme toggle are stretch goals — the diagram + panel + pan/zoom are the must-haves for v1.

### Out of scope for v1 (logged)

- Progress tracking ("mark as done").
- Per-user accounts.
- Commenting on nodes.
- Editing in the UI.

---

## 5. Repo architecture

```
harness-engineer-roadmap/
  README.md
  LICENSE                          # MIT for code
  LICENSE-content                  # CC-BY-4.0 for roadmap-data/, content/, assets/
  CONTRIBUTING.md
  CHANGELOG.md
  .gitignore
  .gitattributes
  .editorconfig
  .nvmrc                           # node version pin
  package.json                     # workspaces if needed; otherwise just site/
  PLANNING/
    00_think.md
    01_design.md
    04_verification_log.md         # written in Phase 4
    06_review.md                   # written in Phase 6
  roadmap-data/                    # source of truth (YAML, one file per area)
    foundations.yml
    loop.yml
    tools.yml
    context.yml
    memory.yml
    retrieval.yml
    orchestration.yml
    evals.yml
    reliability.yml
    cost.yml
    security.yml
    patterns.yml
    _schema.json                   # JSON Schema for validation
  site/                            # the React + Vite app (the live site)
    package.json
    tsconfig.json
    vite.config.ts
    tailwind.config.ts
    postcss.config.cjs
    index.html
    public/
      favicon.svg
      og-image.png
    src/
      main.tsx
      App.tsx
      data/
        graph.json                 # GENERATED — do not edit
      components/
        Graph.tsx                  # React Flow setup
        NodeCard.tsx               # custom node component
        AreaCluster.tsx            # group / cluster header
        ResourcePanel.tsx          # right-side slide-in
        SearchOverlay.tsx          # Cmd-K
        ThemeToggle.tsx
        Footer.tsx
      lib/
        layout.ts                  # ELK config + manual override merging
        colors.ts                  # palette
        urlSync.ts                 # #node/<id> deep-linking
      styles/
        globals.css
        theme.css
  content/                         # GENERATED static markdown fallback (do not hand-edit)
    README.md                      # "this is generated; edit roadmap-data/ instead"
    <area>.md                      # one per area, mirroring the diagram
  tools/
    linkcheck.py                   # CI scheduled + on PR
    validate_data.py               # YAML→schema; edges resolve; ≥1 verified resource per node
    build.py                       # YAML → site/src/data/graph.json AND content/*.md
    requirements.txt               # pyyaml, jsonschema, requests, beautifulsoup4
  assets/
    diagram-screenshot.png         # the launch asset (placeholder until Phase 6)
    banner.svg                     # social card (or MAKE_BANNER.md spec)
    MAKE_BANNER.md                 # exact spec for designer / image gen tool
  docs/
    DEPLOY.md                      # GH Pages recipe (and Cloudflare Pages fallback)
    LAUNCH.md                      # written in Phase 5
    PROFILE_SNIPPET.md             # written in Phase 5
    NODE_AUTHORING.md              # for contributors writing new roadmap nodes
  .github/
    PULL_REQUEST_TEMPLATE.md
    ISSUE_TEMPLATE/
      bug.yml
      new_resource.yml
      new_node.yml
      stale_link.yml
    workflows/
      validate.yml                 # runs validate_data.py + tsc + build on PR
      linkcheck.yml                # nightly + on PR
      deploy.yml                   # build site/ + publish to gh-pages on main
```

No source file >500 lines, per the operating contract.

---

## 6. README wireframe

```
# Harness Engineering Roadmap

> An interactive roadmap for harness engineering — building the agent loop,
> tool layers, context engineering, memory, retrieval, eval harnesses, and
> the rest of the scaffolding around modern LLMs.

[ Live site → bettyguo.github.io/harness-engineer-roadmap ]

[ ──────────  diagram screenshot  ────────── ]

Your agent works in the demo and breaks in production. This is the map for
getting good at the engineering around the model — the discipline most
agent projects skip and then die from. Curated by an active AI researcher,
verified link by link, updated on a published cadence.

## Why this exists
- 88% of agent projects don't reach production. The model is rarely the
  reason. The harness — everything around the model — is.
- "Harness engineering" was named in February 2026 (Mitchell Hashimoto,
  Birgitta Böckeler at ThoughtWorks). The work has been around for years;
  the noun for it is new. This is the canonical map.
- You can read it in two passes (~30 min for the overview, ~weeks for the
  resources behind every node). Click any node for the curated list.

## How to use this
- Land on the live site → use the diagram.
- Or browse the static markdown fallback in `content/`.
- Three suggested reading paths:
  - **"My agent breaks in prod"**: foundations → reliability → evals → patterns.
  - **"I'm scaling beyond one agent"**: orchestration → memory → cost → security.
  - **"I'm new to this"**: foundations → agent loop → tools → context → patterns.

## Scope — depth, not breadth
This is the **depth** map of one craft. For the broader AI-engineer
career path (where harness engineering is one stage), see
[ai-engineer-roadmap](https://github.com/bettyguo/ai-engineer-roadmap).
This roadmap assumes you already know where harness engineering sits.

## Sister roadmaps
- [ai-engineer-roadmap](https://github.com/bettyguo/ai-engineer-roadmap) — the breadth map of the whole AI-engineer career path.
- [llm-interview-prep](https://github.com/bettyguo/llm-interview-prep) — agent/harness depth on the questioning side.
- [build-your-own-ai](https://github.com/bettyguo/build-your-own-ai) — practical agent-loop-from-scratch exercises.

## Maintenance & freshness
This field changes monthly. To keep the map trustworthy:
- Every resource is tagged **durable** (concept-level) or **current** (tool-name, expect rotation).
- Links are checked nightly by CI. Broken links open issues automatically.
- Quarterly content sweep (next: Aug 2026).
- "Last updated" badge: <auto>

## Contribute
See [CONTRIBUTING.md](CONTRIBUTING.md). New resources require a verification
link, a "why this one" annotation, the durable-vs-current flag, and a
passing `tools/validate_data.py`.

## Curator
**Betty Guo** (Dongxin Guo / 郭东欣)
Final-year PhD candidate, Computer Science, University of Hong Kong.
Advised by Prof. Siu-Ming Yiu.
- GitHub: [@bettyguo](https://github.com/bettyguo)
- ORCID: [0009-0000-2388-1072](https://orcid.org/0009-0000-2388-1072)

## License
- Code (everything in `site/`, `tools/`, root configs): MIT.
- Content (`roadmap-data/`, generated `content/`, `assets/`): CC-BY-4.0.

[ star-history badge ]
```

---

## 7. Hosting plan

### Primary: GitHub Pages

1. **Build:** `python tools/build.py` regenerates `site/src/data/graph.json` and `content/*.md`. Then `cd site && npm ci && npm run build` produces `site/dist/`.
2. **Deploy:** GitHub Actions workflow `.github/workflows/deploy.yml` runs the build on push to `main`, then publishes `site/dist/` to the `gh-pages` branch via `peaceiris/actions-gh-pages`.
3. **DNS:** default `bettyguo.github.io/harness-engineer-roadmap`. Custom domain optional, not required for launch.
4. **Vite base path:** configured to `/harness-engineer-roadmap/` so all asset paths resolve under the Pages subpath.

### Fallback: Cloudflare Pages

If GH Pages can't take the bundle size or the user wants a custom domain, the same `site/dist/` deploys to Cloudflare Pages with the same workflow swapped to `cloudflare/pages-action`. The build is identical.

### Manual deploy steps for the human

Captured in `docs/DEPLOY.md` (written in Phase 3):

1. Create the GitHub repo `bettyguo/harness-engineer-roadmap` (the directory exists locally; the remote needs to be created).
2. Push.
3. In repo settings → Pages → source: GitHub Actions.
4. The first push to `main` triggers `deploy.yml`.
5. ~3 minutes later, live at `bettyguo.github.io/harness-engineer-roadmap`.

These steps cannot be automated from this Windows host (no authenticated `gh` configured) and are flagged as the explicit manual step in the final checkpoint.

---

## 8. Tooling design

### `tools/validate_data.py` (≤200 LOC)

- Loads every `roadmap-data/*.yml`.
- Validates against `roadmap-data/_schema.json` (JSON Schema, fields per §2).
- Checks: unique node ids, all `depends_on` / `related` resolve, no cycles in `depends_on`, every node has ≥1 resource (if `--strict`, ≥1 with `verified == yes`).
- Output: human-readable summary + exit code (0 ok / 1 error). Counts per area, list of problems with line numbers.
- Run: `python tools/validate_data.py [--strict]`. CI uses `--strict` on `main`, non-strict on PRs.

### `tools/linkcheck.py` (≤250 LOC)

- Walks every resource link in `roadmap-data/`.
- HEAD → falls back to GET on 405. Treats 200/301/302 as OK; 4xx/5xx as broken; timeout as warn.
- Honors a `.linkcheck-ignore` for known-flaky domains (e.g. arxiv mirror outages).
- Polite: ≤4 concurrent requests, 1-second jitter, fakes a Mozilla UA.
- On broken link: opens (or updates) a GitHub issue tagged `stale-link` with the area, node, title, and HTTP status.
- Run: `python tools/linkcheck.py [--ci-issue]`. CI runs nightly with `--ci-issue`; PRs run without (just report).

### `tools/build.py` (≤200 LOC)

- Loads validated YAML.
- Computes layout hints (clusters from area `order`, edge bundling).
- Writes `site/src/data/graph.json` — a single bundled blob the React app imports at build time.
- Writes `content/<area>.md` — a generated static markdown fallback per area with H2 per node, the summary, competent rubric, and the resource list.
- Writes `content/README.md` — "this is the static fallback for the live diagram at <link>; do not edit by hand."
- Run: `python tools/build.py`. CI runs before `npm run build` in `site/`.

Total Python: ~650 LOC across three files. Each file <300 LOC, well under the 500-line ceiling.

---

## 9. Contribution flow

### PR template `.github/PULL_REQUEST_TEMPLATE.md`

```
## Change type
- [ ] New node
- [ ] New resource on an existing node
- [ ] Edit to an existing node
- [ ] Tooling / site / docs
- [ ] Link rot fix

## For new resources / nodes
- [ ] Verification link verified resolves
- [ ] "why this one" annotation present (≤2 sentences)
- [ ] durable-vs-current flag set
- [ ] difficulty + cost set
- [ ] tools/validate_data.py passes locally
- [ ] tools/linkcheck.py passes for changed entries

## For tooling / site / docs
- [ ] tsc passes
- [ ] vite build passes
- [ ] no source file >500 lines
```

### Issue templates

- `bug.yml` — site/renderer bugs.
- `new_resource.yml` — propose a resource for a node.
- `new_node.yml` — propose a whole new node (rare, requires curator review).
- `stale_link.yml` — flag a dead link. Auto-filed by `linkcheck.py`.

### CONTRIBUTING.md (≤300 lines)

Covers: how to run validate/linkcheck/build locally, how to edit YAML, the curation bar ("would you send this resource to a colleague?"), the durable-vs-current rule, the verification rule, the size ceiling per file. Code of Conduct is included by reference.

---

## 10. Test/verification plan

| Item | Verified by | When |
| --- | --- | --- |
| Every link resolves | `tools/linkcheck.py` | CI nightly + on PR; Phase 4 audit; Phase 5 hardening pass. |
| Data model validates | `tools/validate_data.py` | CI on every PR; Phase 2 checkpoint; Phase 4 strict run. |
| Build is reproducible | `npm ci && npm run build` from clean checkout | CI on every PR. |
| Site renders | Local `npm run dev`; CI build artifact preview | Phase 3 checkpoint; Phase 5 hardening. |
| Interactions work (pan/zoom/click) | Manual smoke test in browser; documented in DEPLOY.md | Phase 3 checkpoint; Phase 5; Phase 6 hostile review. |
| All resources web-verified | `PLANNING/04_verification_log.md` shows zero published `verified: no` | Phase 4 checkpoint; Phase 5 hardening. |
| No source file >500 lines | `wc -l` check in CI | Every PR. |
| Scope partition holds | Phase 6 hostile-reviewer doc | Phase 6. |
| Aesthetic isn't generic | Phase 6 hostile-reviewer doc + side-by-side with `ai-engineer-roadmap` | Phase 6. |

---

## CHECKPOINT 1 — RESULT

- **Taxonomy:** 12 areas, 84 nodes, with explicit dependencies feeding the edges. Each node has `summary`, `competent_means`, `tier`, dependencies, aliases, and a resource list. Refined from the master-prompt spine: added Foundations gateway, promoted Patterns & Anti-Patterns, kept Evals & Observability merged.
- **Data model:** YAML, one file per area, JSON-Schema-validated, with a `durability` flag at the resource level so tool churn is visible. Validation rules enforced in `tools/validate_data.py`.
- **Renderer:** React + Vite + React Flow + Tailwind, JSON-driven, dark-default with a specific palette and typography spec. Side panel, deep-linkable, search overlay (Cmd-K).
- **Repo layout:** 12-area YAML in `roadmap-data/`, React app in `site/`, generated markdown fallback in `content/`, Python tools in `tools/`, GH Actions in `.github/workflows/`.
- **Hosting:** GitHub Pages via `deploy.yml`. Cloudflare Pages as the documented fallback. Manual steps captured in `docs/DEPLOY.md`.
- **Tooling:** three Python scripts, ~650 LOC total, each well under 500.
- **README wireframe:** anxiety-framed, screenshot-near-top, live-link-prominent, scope-partition stated, sister roadmaps linked, attribution complete.

Proceeding to Phase 2 (scaffold + tooling + complete data-model skeleton) without waiting for confirmation per the user's directive.
