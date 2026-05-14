# What harness engineering is, and why this roadmap exists

## The five-sentence version

A harness is everything around the model. The model is the part that thinks; the harness is the part that *makes the thinking useful in production* — the agent loop, the tool layer, the context layout, the memory, the eval discipline, the failure recovery, the security boundary. Most agent projects die because the harness is fragile, not because the model is weak. Improving the harness on the same model routinely beats switching to a more capable model. This roadmap is the map for getting good at building harnesses.

## Where the noun came from

The term **"agent harness"** was formalized by [Mitchell Hashimoto in February 2026](https://mitchellh.com/writing/my-ai-adoption-journey), with the formula `Agent = Model + Harness`. The discipline got a working vocabulary in April 2026 when [Birgitta Böckeler at ThoughtWorks](https://martinfowler.com/articles/harness-engineering.html) published the Martin Fowler-hosted piece on guides, sensors, harnessability, and the maintainability/architecture/behaviour split. By May 2026 the field had its first awesome lists, the first survey paper, mass-media coverage, and a noun adopted at MongoDB, Adnan Masood's Medium feed, and the major engineering-influencer surface.

Before "harness engineering" there were:
- "Prompt engineering" — which collapsed into a sub-skill.
- "Agent infrastructure" / "AgentOps" — which are the operational surface but not the design discipline.
- "Context engineering" (Karpathy) — which is one *sub-area* of the harness.

These adjacent terms aren't competitors. They're sub-disciplines of the same craft, and this roadmap covers all of them.

## What this map is — and what it isn't

This is:
- A **depth map** of one craft, in full detail.
- An interactive node-graph, 12 areas, 84 nodes, each clickable, each with curated resources.
- Curated under a real academic identity (Betty Guo, HKU). Resources are web-verified; CI checks links nightly.

This is NOT:
- A breadth map of the AI-engineer career path. For that, see [ai-engineer-roadmap](https://github.com/bettyguo/ai-engineer-roadmap).
- An LLM tutorial. The map assumes you've called an API and built a demo. If you haven't, [ai-engineer-roadmap](https://github.com/bettyguo/ai-engineer-roadmap) is upstream.
- An agent framework. There are many; this map will tell you which durable concept each framework implements.

## Who the map is for

- The AI engineer two years in, whose agents break in production in ways they can't diagnose.
- The senior backend engineer moving sideways into agent work.
- The applied-research engineer at a small AI shop, sharp on models, light on production scaffolding.
- The team lead at a company with one production agent and a mandate for three more.

The shared anxiety: *"my agent works in the demo and falls apart in the real world — how do I actually get good at this."* That anxiety is the map's reason to exist.
