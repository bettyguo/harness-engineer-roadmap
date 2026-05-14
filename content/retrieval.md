# Retrieval Integration

> Retrieval from the harness-layer perspective — not RAG 101. How RAG plugs into the agent loop, embeddings, hybrid search, query rewriting, citations, and agentic / iterative retrieval.


*Area id: `retrieval`*

---

## RAG as a harness component

`id: retrieval.rag-basics` · **core**

Just enough RAG to slot it into a harness — chunk, embed, retrieve, re-insert into context. Most production RAG problems are chunking and retrieval-prompt problems, not embedding choice.

**Competent means:** Can explain why most "bad RAG" is bad chunking or bad query, not bad embedding. Knows the three sub-systems a RAG stack is made of.

**Depends on:** `foundations.what-is-a-harness`

**Related:** `memory.knowledge-bases`

**Also known as:** rag, retrieval augmented generation

**Resources:**

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401) — Lewis et al., 2020 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The originating paper. Read the architecture section; skim the numbers. The "retrieve, then condition" framing is the durable contribution.

---

## Embeddings & dense retrieval

`id: retrieval.embeddings` · **core**

Embedding model choice, dimensionality, normalization, the cost of switching embeddings post-launch. Most teams pick once and never revisit; they should.

**Competent means:** Knows three embedding-choice failure modes (domain mismatch, scale mismatch, language mismatch) and can identify which is biting them.

**Depends on:** `retrieval.rag-basics`

**Also known as:** embedding models, vector embeddings, dense retrieval

**Resources:**

- [MTEB: Massive Text Embedding Benchmark](https://arxiv.org/abs/2210.07316) — Muennighoff et al., 2022 · `paper` · `intermediate` · `free` · ◆ durable *(unverified)*
  - The reference for "which embedding model and why." The leaderboard rotates; the methodology for picking is durable.

---

## Hybrid search (BM25 + dense + rerank)

`id: retrieval.hybrid` · *recommended*

Pure dense retrieval loses on technical terms, acronyms, and named-entity queries. BM25 + dense + a reranker is the production default.

**Competent means:** Ships hybrid retrieval by default. Can show a query where dense misses and BM25 catches.

**Depends on:** `retrieval.embeddings`

**Also known as:** hybrid retrieval, bm25, reranking

**Resources:**

- [Hybrid Search Explained](https://www.pinecone.io/learn/hybrid-search-intro/) — Pinecone, 2023 · `post` · `intermediate` · `free` · ◆ durable *(unverified)*
  - Vendor-flavored but the clearest practitioner walkthrough of why hybrid wins, with worked examples on the kinds of queries dense alone fails.

---

## Query rewriting & HyDE

`id: retrieval.query-rewriting` · *recommended*

Let the model rewrite the user's query before retrieval — expansion, decomposition, hypothesis-doc generation. Cheap when retrieval matters more than generation cost.

**Competent means:** Can show a query where rewriting changes the retrieved set in a way that materially improves the final answer.

**Depends on:** `retrieval.rag-basics`

**Related:** `retrieval.agentic-retrieval`

**Also known as:** hyde, query expansion, query decomposition

**Resources:**

- [Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)](https://arxiv.org/abs/2212.10496) — Gao et al., 2022 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The canonical paper on rewriting queries via hypothetical documents. The trick generalizes: model-as-query-rewriter is a durable pattern.

---

## Citations, attribution, grounding

`id: retrieval.citations` · **core**

The antidote to hallucinated retrievals: make the agent show its work. Without citations you cannot audit "did this answer actually come from the source?"

**Competent means:** Can audit an agent's citations and find one that's fabricated. Has a citation-validation gate in their eval suite.

**Depends on:** `retrieval.rag-basics`

**Related:** `evals.task-evals`

**Also known as:** grounded generation, attribution, citation validation

**Resources:**

- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511) — Asai et al., 2023 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The clearest treatment of "generation that knows when to cite and when to abstain." The mechanism is durable; the specific training recipe is one of many.

---

## Agentic / iterative retrieval

`id: retrieval.agentic-retrieval` · *recommended*

The agent decides what to retrieve next based on what it just read. Where the agent loop and retrieval meet — and where most "deep research" agents live.

**Competent means:** Knows when iterative beats single-shot retrieval (large corpora, multi-hop questions) and the cost it adds (latency, token spend).

**Depends on:** `retrieval.query-rewriting`, `loop.react`

**Related:** `patterns.research-agent-recipes`

**Also known as:** iterative rag, research agent, agentic rag

**Resources:**

- [Self-Ask with Search](https://arxiv.org/abs/2210.03350) — Press et al., 2022 · `paper` · `advanced` · `free` · ◆ durable *(unverified)*
  - The clearest paper on "decompose, retrieve, repeat" loops. The pattern survives the specific implementation.

---
