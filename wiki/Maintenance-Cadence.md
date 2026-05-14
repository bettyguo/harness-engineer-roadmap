# Maintenance cadence

A roadmap in a fast-moving field is only as trustworthy as its freshness. This page is the operator's contract — what gets checked, how often, and how to read the badges in the README that prove it.

## What's checked, and how often

| Cadence | What | How | Output |
| --- | --- | --- | --- |
| **Every PR** | Data validity, edge resolution, the 500-line cap, the build, types | [`.github/workflows/validate.yml`](https://github.com/bettyguo/harness-engineer-roadmap/blob/main/.github/workflows/validate.yml) | Required check on the PR |
| **Every PR (data changes)** | Resource links in changed YAML | [`.github/workflows/linkcheck.yml`](https://github.com/bettyguo/harness-engineer-roadmap/blob/main/.github/workflows/linkcheck.yml) (PR mode, hard-fail) | Required check on the PR |
| **Nightly 03:17 UTC** | Every link in `roadmap-data/` | [`linkcheck.yml`](https://github.com/bettyguo/harness-engineer-roadmap/blob/main/.github/workflows/linkcheck.yml) (soft mode) + [`stale-link-issue.yml`](https://github.com/bettyguo/harness-engineer-roadmap/blob/main/.github/workflows/stale-link-issue.yml) | Auto-files `stale-link` issues |
| **Push to `main`** | Build, deploy to GH Pages | [`deploy.yml`](https://github.com/bettyguo/harness-engineer-roadmap/blob/main/.github/workflows/deploy.yml) | Live site updated |
| **Quarterly (human-driven)** | Per-area content sweep | Curator review, see process below | Updates `CHANGELOG.md` |
| **Annual (human-driven)** | Taxonomy review | Node-add / node-retire decisions | Major changelog entry |

## Quarterly content sweep — process

Next: **August 2026**, then **November 2026**, **February 2027**, etc.

Each sweep:

1. Open a tracking issue: `[content-sweep] 2026Q3`.
2. Walk each area in order. For each node:
   - Are all `durable` resources still load-bearing? (Usually yes.)
   - Are all `current` resources still resolving and still the best example of their category? (Often no — this is where most of the work is.)
   - Has the node's `summary` or `competent_means` aged?
3. For each `current` resource that has aged:
   - Replace with the current best example, OR
   - Remove if the category has dissolved.
4. Re-run `python tools/validate_data.py --strict && python tools/build.py`.
5. Update `CHANGELOG.md` with a dated summary.
6. Close the tracking issue.

A sweep is "done" when every node's resources have been touched in the last ~90 days.

## Annual taxonomy review — process

Next: **May 2027**.

Once a year, the bigger questions:

- **Have any nodes aged out?** (E.g. would "MCP" become a non-discipline by 2028? Probably not — but the question gets asked.)
- **Have any new nodes earned their place?** Nominated via [`new_node` issues](https://github.com/bettyguo/harness-engineer-roadmap/issues?q=is%3Aissue+label%3Anew-node) accumulated through the year.
- **Has any area become two areas?**
- **Has the noun "harness engineering" itself shifted?** See [What Is Harness Engineering](What-Is-Harness-Engineering) for the position the repo took on the noun. If the field has consolidated around "agent engineering," the repo title gets re-evaluated.

## The "last updated" badge

The README's `[![Last updated]]` badge reads the most recent commit on `main`. It's a load-bearing trust signal — a roadmap dated nine months ago is a roadmap to ignore. Drive that badge by landing real updates, not by churning whitespace.

## When CI is yellow

If nightly linkcheck files three or more `stale-link` issues in one day, that's signal — a domain went down, a vendor migrated docs en masse, or a network problem hit the runner. Don't fix-storm:

1. Check whether the failures share a domain. If so, it's likely temporary.
2. If permanent: replace via PR, batched by domain.
3. If recurring temporary (CDN flakey under cron windows): add the domain to `.linkcheck-ignore` with a date + reason. Remove the entry when the domain recovers.

## The unwritten cadence

Beyond CI: read your own map every quarter as if you'd never seen it. If a node makes you wince now and didn't six months ago, that's the signal to rewrite it.
