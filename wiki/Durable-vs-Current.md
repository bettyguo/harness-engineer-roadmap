# Durable concepts vs current tools

The single highest-leverage discipline in a fast-moving field. Most teams burn a year of learning every quarter because they couldn't tell which parts of a framework were the concept and which parts were the brand.

## The distinction

| | Durable | Current |
| --- | --- | --- |
| What | A concept, pattern, technique, or named discipline. | A specific tool, framework, vendor doc, or version-anchored guide. |
| Expected shelf | ≥3 years. Often 10+. | 6–18 months before noticeable drift. |
| Examples | ReAct (Yao et al. 2023), the agent loop, structured outputs, idempotency, the confused deputy, OWASP categories. | LangGraph's HITL guide, Anthropic's prompt-caching docs, Letta's blog, E2B's sandboxes, AgentOps. |
| Test | Will this still be readable and load-bearing in 2030? | Will this URL or product still exist as named in 2027? |
| In this repo | `durability: durable` | `durability: current` |

## Why we flag every resource

Because if we didn't, the map would silently rot.

When a `current` tool name rotates out of fashion — when LangGraph becomes LangGraph 2.0 and breaks its URLs, when AgentOps gets acquired and pivots, when Anthropic moves their docs to a new domain — the durable concept that resource was illustrating is still load-bearing. The fix is to swap the URL, not to relearn the discipline.

Without the flag, a reader can't tell which is which. With the flag:

- A reader skimming the map can decide *"durable: I'll bookmark this for the long term; current: I'll use it now and re-check next quarter."*
- Maintainers can sweep `current` entries on a cadence and ignore `durable` ones unless the author has corrected the paper.
- The CI link-checker focuses its anxiety in the right place.

## How a resource gets its flag

1. **Is it a paper?** Almost always `durable`. Even if the model numbers in the paper are dated, the framing usually outlives the experiment.
2. **Is it a foundational essay?** (Karpathy, Willison, Hashimoto, Böckeler.) Usually `durable`.
3. **Is it a spec?** (MCP, OpenTelemetry GenAI conventions.) Usually `durable`. Specs version, but they don't disappear, and they're written to outlive any one implementation.
4. **Is it vendor docs?** `current`. The mechanism is durable; the URL is not.
5. **Is it a framework's blog?** `current`. Most frameworks have a 12–18 month relevance window.
6. **Is it a current-tool benchmark?** `durable` if the methodology is the contribution; `current` if the leaderboard is the contribution.

## Maintenance cadence

- **Daily:** linkcheck catches the obvious URL rot.
- **Quarterly:** human content sweep. Every `current` resource gets a "still good?" check; durables get a spot-check.
- **Annually:** taxonomy review. Has a node aged out? Is there a new node?

See [Maintenance Cadence](Maintenance-Cadence) for the operational details.

## The deeper rule

If you can only learn one thing from this map's curation discipline, learn this: **when a new framework launches, ask which durable concept it implements before you ask whether it's good.** That single question saves a year of churn.
