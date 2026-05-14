# Authoring nodes

A field guide for adding or editing roadmap nodes. Read this if you're touching `roadmap-data/*.yml`.

## The shape

Each node lives in `roadmap-data/<area>.yml` under `nodes:`. The full schema is in [`roadmap-data/_schema.json`](../roadmap-data/_schema.json); a working example:

```yaml
- id: loop.deterministic-skeleton
  label: "Deterministic skeletons"
  tier: core
  summary: >
    Hard-code the deterministic backbone (state machine, DAG) and let the
    model fill flexible steps. The single biggest reliability lever.
  competent_means: >
    Can refactor an open-ended agent into a skeleton+flexible-step design,
    and can name three steps that should NOT be left to the model.
  depends_on: [loop.basic-loop]
  related: [patterns.skeleton-with-flex]
  aliases: [agent skeleton, state-machine harness]
  resources:
    - title: "Agents"
      author: "Anthropic"
      year: 2024
      type: post
      link: "https://www.anthropic.com/research/building-effective-agents"
      why: >
        The clearest "deterministic backbone vs flexible step" framing in
        the field — the source most practitioners cite when explaining the
        idea to teammates.
      difficulty: intermediate
      cost: free
      durability: durable
      verified: yes
      verified_at: "2026-05-14"
```

## Writing the `summary`

One or two sentences. Drops you straight into what the node is *about*. Skip the throat-clearing ("This node covers..."). Lead with the thing.

## Writing the `competent_means` rubric

This is the most differentiated field in the repo. Every node says what *being competent at this specific thing* looks like. Three rules:

1. **It should describe a behavior, not a feeling.** "Understands the agent loop" — not a rubric. "Can implement an agent loop in 50 lines without a framework, and can name three things the framework was hiding" — a rubric.
2. **It should be falsifiable.** A reader should be able to honestly answer "yes" or "no."
3. **It should be specific to this node.** Don't reuse "understands the concepts" across 84 nodes.

## Edges (`depends_on` and `related`)

- `depends_on`: strict prerequisites. *To do this competently, you must first be competent at X.*
- `related`: affinity, not prerequisite. *These two concepts illuminate each other.*

`depends_on` becomes a solid edge in the diagram. `related` becomes a dashed edge. Don't list 10 dependencies; the goal is a readable graph. Most nodes have 1–3 `depends_on` edges.

## Tier

- **core** — every reader should know this. Filled node in the diagram.
- **recommended** — strongly worth learning, but you can ship without it. Outlined node.
- **optional** — for the deep dive. Dashed-outlined node. Generally <20% of nodes are optional.

## Aliases

Lowercase. Used for the Cmd-K search overlay and for picking up adjacent-term traffic (e.g. node `tools.mcp` has aliases `model context protocol`, `mcp servers`). Don't pad with synonyms that nobody actually searches.

## Resources — the curation bar

1. **Read it.** Don't add a resource you haven't read or watched.
2. **Specific `why`.** Say what makes *this* resource better than others on the same topic. "Good intro" is rejected. "The only walkthrough that shows the lost-in-the-middle counter-example with runnable code" — accepted.
3. **Durable or current?**
   - **durable**: papers, foundational essays, long-form on enduring concepts, specs. ≥3-year shelf.
   - **current**: tool docs, framework tutorials, version-specific guides. Mark them clearly; expect to rotate every 6–18 months.
4. **Difficulty**:
   - **beginner**: assumes only that you've called an LLM API.
   - **intermediate**: assumes you've shipped a working agent.
   - **advanced**: assumes you've shipped agents that broke and you've debugged them.
5. **Cost**: be honest about paywalls.
6. **`verified: pending`** when you propose. Reviewer flips to `yes` after they independently verify the link resolves and the description matches.

## When in doubt

When in doubt, delete a resource. The repo's value is the curation. Three good resources beats ten mid ones.

## Anti-patterns

- **Adding a tool to multiple nodes** — pick the single most relevant node and put it there. The diagram is a map, not a tag cloud.
- **Resource lists that read like a Twitter bookmark dump** — every resource should serve the rubric, not your reading queue.
- **"Comprehensive" descriptions** — long summaries hurt the panel UX. If you need more than two sentences, you're conflating two nodes.
- **Brand-new resource on a foundational node** — for `foundations.what-is-a-harness`, prefer the canonical Hashimoto / Böckeler essays over last week's blog. Last week's blog goes on a more specific sub-node.
