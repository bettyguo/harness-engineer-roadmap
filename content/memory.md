# Memory & State

> What the agent remembers across turns and sessions. Working vs long-term, episodic vs semantic, state persistence, the knowledge-base pattern, vector memory, forgetting policies, and shared memory across agents.


*Area id: `memory`*

---

## Working memory vs long-term memory

`id: memory.working-vs-long-term` · **core**

What goes in context every turn (working) vs what's recalled when needed (long-term). Different access patterns, different storage, different failure modes.

**Competent means:** Can draw the memory architecture of any agent they read about and identify which memory type is doing the load-bearing work.

**Depends on:** `context.window-budget`

**Related:** `memory.state-persistence`

**Also known as:** short-term memory, persistent memory, agent memory

**Resources:**

- [Memory in Agents](https://www.letta.com/blog/memory) — Letta, 2024 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The clearest taxonomy of memory types in modern agents, including the working/long-term split as a first-class design decision rather than an implementation detail.

---

## Episodic vs semantic memory

`id: memory.episodic-semantic` · *recommended*

"What happened last Tuesday" vs "what's true." Different retrieval strategies, different freshness needs.

**Competent means:** Knows which their agent actually needs (often: only one) and can defend the choice against the temptation to ship both.

**Depends on:** `memory.working-vs-long-term`

**Also known as:** episodic memory, semantic memory

**Resources:**

- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Packer et al., 2023 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - Treats memory as a tiered storage problem (RAM/disk analogue). The taxonomy survives the specific MemGPT implementation.

---

## State & session persistence

`id: memory.state-persistence` · **core**

Where state lives across turns: in-process, KV store, database, blob store. The durability/latency tradeoff lives here.

**Competent means:** Can argue the durability/latency/cost tradeoffs for their agent's state store with a specific failure case in mind.

**Depends on:** `memory.working-vs-long-term`

**Related:** `reliability.fallbacks`

**Also known as:** state store, session state, agent state

**Resources:**

- [Building Stateful Agents](https://blog.langchain.com/langgraph-multi-agent-workflows/) — LangChain, 2024 · `post` · `intermediate` · `free` · 🜂 current *(unverified)*
  - Current-tool example — concrete walkthrough of state stores in a real framework. The "checkpoint as durability boundary" pattern is durable even if LangGraph rotates.

---

## LLM knowledge bases (Karpathy pattern)

`id: memory.knowledge-bases` · *recommended*

A markdown library the LLM curates, lints, and interlinks. Replaces RAG for some use cases where retrieval is the wrong primitive.

**Competent means:** Knows when it beats RAG (small-to-medium evolving corpora, single user) and when it's a toy (high-traffic, low-trust, large corpus).

**Depends on:** `memory.working-vs-long-term`

**Related:** `retrieval.rag-basics`

**Also known as:** llm wiki, knowledge base, evolving markdown

**Resources:**

- [LLM Knowledge Bases (gist)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — Andrej Karpathy, 2026 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The originating post for the pattern. Short, specific, and the framing — markdown library as primary memory — is the durable contribution.

---

## Vector-store memory

`id: memory.vector-memory` · *recommended*

Embedding-based recall over past turns or events. Eviction policies matter more than embedding choice past a certain scale.

**Competent means:** Can defend their chunking strategy with a concrete example of when it failed and what the failure looked like in production.

**Depends on:** `memory.working-vs-long-term`, `retrieval.embeddings`

**Related:** `memory.forgetting`

**Also known as:** embedding memory, vector recall

**Resources:**

- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Packer et al., 2023 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The clearest paper-treatment of "embed memories, evict on pressure, summarize before eviction." The mechanics outlive the implementation.

---

## Forgetting, decay, eviction

`id: memory.forgetting` · *recommended*

When old memory becomes a liability — stale facts, outdated preferences, drifted personas. Forgetting is a design parameter, not a bug.

**Competent means:** Has implemented a non-trivial eviction policy (TTL + relevance + access-recency) and watched it remove the right things.

**Depends on:** `memory.vector-memory`

**Related:** `context.compaction`

**Also known as:** memory decay, eviction policy, ttl memory

**Resources:**

- [Memory in Agents](https://www.letta.com/blog/memory) — Letta, 2024 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - Treats forgetting as a design problem with specific eviction patterns. The clearest practitioner-level coverage.

---

## Shared memory across agents

`id: memory.shared-memory` · _optional_

Multi-agent memory blackboards, shared context channels, conflict resolution. A small surface that adds a large race-condition class.

**Competent means:** Knows the canonical race conditions (last-writer-wins overwrite, stale read, fan-out divergence) and how each one shows up in traces.

**Depends on:** `memory.state-persistence`, `orchestration.handoffs`

**Also known as:** shared state, blackboard, multi-agent memory

**Resources:**

- [LangGraph multi-agent workflows](https://blog.langchain.com/langgraph-multi-agent-workflows/) — LangChain, 2024 · `post` · `advanced` · `free` · 🜂 current *(unverified)*
  - Current-tool example — walks through shared-state design patterns in a real framework. The race-condition lessons transfer.

---
