# Curation bar

This page explains the rules that decide whether a resource gets on the map. They are deliberately stricter than "is it relevant?" — the value of the roadmap is curation, not coverage.

## The four checks every resource has to pass

### 1. Would you send this to a colleague who needs to learn this node?

If the honest answer is "kind of," it's a no. Three good resources beats ten mid ones. Send-to-colleague is a much higher bar than "is well-known."

### 2. Is the link alive and does it match the description?

Click it. Read what's there. Resources that have rotated topic, moved behind paywalls, or had their original posts deleted are removed, not patched with apologies.

### 3. Can you say in one sentence why this resource and not another?

That sentence is the `why` field. Vague reasons ("good intro") are rejected. Specific reasons ("the only walkthrough that shows the lost-in-the-middle counter-example with runnable code") are accepted.

### 4. Is it durable or current?

- **Durable** — papers, foundational essays, long-form on enduring concepts, specs. Expected ≥3-year shelf.
- **Current** — vendor docs, framework tutorials, version-specific guides. Expected to rotate every 6–18 months.

Every `current` resource has a `why` that explicitly addresses staleness. Every node has at least one `durable` resource. This is mechanically enforced by `tools/validate_data.py`.

## What we reject

- **The same tool added to multiple nodes.** Pick the single most relevant node. The map is a map, not a tag cloud.
- **Resource lists that read like a Twitter bookmark dump.** Every resource has to serve the rubric, not your reading queue.
- **Brand-new resources on foundational nodes.** Foundational nodes prefer canonical references (Hashimoto, Böckeler, etc.). Last week's blog goes on a more specific sub-node.
- **"Comprehensive" surveys without a specific recommendation.** "Here's everything written about X" is a librarian move; this is a curator's roadmap. We give you one or two reads per node.
- **Resources from corporate marketing that don't deliver.** A vendor post that's actually a sales pitch is rejected even if the brand is famous.

## How the bar is enforced

- **PR template** requires the verification link, the "why this one" annotation, the durable-vs-current flag, and a passing `tools/validate_data.py`.
- **`tools/validate_data.py`** rejects schema violations, unresolved edges, missing rubrics, and (with `--strict`) any node without at least one verified resource.
- **`tools/linkcheck.py`** rejects PRs that introduce broken links and files issues nightly on broken existing ones.
- **Curator review** on every PR. The maintainer's call is final on curation decisions; that's the whole point of a curated artifact.

## A few examples

### Accepted (durable, specific why)

> Yao et al. 2023, "ReAct: Synergizing Reasoning and Acting" — *The canonical paper. Read sections 2 and 4; skim the rest. The framing has held up; the benchmark numbers are dated.*

### Accepted (current, addresses staleness)

> Anthropic, "Prompt caching with Claude" — *Vendor docs (durability:current). The mechanism (prefix-stable caching with TTL) is now standard across providers; the durable lesson is "design your prompt as a cache key."*

### Rejected (vague why)

> ~~Famous Author, "All About Agents" — *Good overview, very thorough.*~~

### Rejected (off-topic for the node)

> ~~ToolBench paper on `loop.react`~~ — ToolBench belongs on `tools.tool-selection`, not the agent loop.

## When in doubt, delete

The bar exists because curation compounds. Every resource that's on the map raises trust. Every mid resource lowers it. When you're not sure, the move is to delete the entry, not justify keeping it.
