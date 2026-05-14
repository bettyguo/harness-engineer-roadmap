# Contributing to harness-engineer-roadmap

Thanks for being here. This roadmap stays useful only if it stays accurate, and that takes contributors. Read this before opening a PR — the curation bar is intentionally specific.

## What this repo is

A curated, web-verified, interactive roadmap for harness engineering. Twelve areas, ~84 nodes. The diagram is the front door; the YAML in [`roadmap-data/`](roadmap-data/) is the source of truth; everything else is generated.

## The curation bar

Before you propose a resource:

1. **Would you send this resource to a colleague who needs to learn this node?** If the honest answer is "kind of," it's a no. The repo's value is curation, not coverage.
2. **Is the link still alive and does it match the description?** Click it. Read what's there. If the post moved, broke, or pivoted topic, don't include it.
3. **Can you say in one sentence why this resource and not another?** That sentence goes in the `why` field. Vague reasons ("good intro") are not enough; specific reasons ("the only place that walks through the lost-in-the-middle counter-example with code") are.
4. **Is it durable or current?** A durable resource (a paper, a foundational essay, a long-form post on an enduring concept) gets `durability: durable`. A specific tool's docs page, a current framework's tutorial, anything that will rotate in 12 months gets `durability: current` and a `why` that addresses its expected shelf life.

## How to add a resource to an existing node

1. Fork & clone.
2. Open the right `roadmap-data/<area>.yml`.
3. Find the node by `id`. Append to its `resources:` list using the schema below.
4. Run `python tools/validate_data.py` — it should pass.
5. Run `python tools/linkcheck.py --paths roadmap-data/<area>.yml` — your new link should resolve.
6. Open a PR using the template; check the boxes you actually completed.

Resource shape (copy-paste-edit):

```yaml
- title: "Exact title"
  author: "Lastname et al." # or full name; verbatim
  year: 2026
  type: paper               # paper | repo | tool | post | talk | spec | book | course
  link: "https://..."
  why: >
    One or two sentences explaining why THIS resource for THIS node — not
    another similar one. Be specific.
  difficulty: intermediate  # beginner | intermediate | advanced
  cost: free                # free | paid | freemium
  durability: durable       # durable | current
  verified: pending         # leave as pending; reviewers flip to yes
```

## How to add a new node (rare)

1. Open a [`new_node`](.github/ISSUE_TEMPLATE/new_node.yml) issue first. The curator triages.
2. If accepted, the issue receives a node `id` and an area assignment.
3. PR adds the node to the right `roadmap-data/<area>.yml` with at least one resource, the `summary`, the `competent_means` rubric, and `depends_on` edges.
4. `python tools/validate_data.py` must pass.

## How to fix a stale link

CI files these automatically with a `stale-link` label. To fix:

1. Find a replacement that meets the curation bar.
2. Edit the YAML.
3. Reference the issue number in your commit message.

If a resource's original page is gone and no equivalent exists: remove the entry. Better one fewer resource than a dead link.

## Local development

### Tooling (Python)

```bash
cd tools
pip install -r requirements.txt
python validate_data.py            # validates roadmap-data/
python linkcheck.py                # link-checks everything (slow)
python build.py                    # regenerates site/src/data/graph.json + content/*.md
```

### Site (Node.js)

```bash
cd site
npm ci
npm run dev                        # localhost:5173
npm run build                      # produces site/dist/
npm run preview                    # serve the production build locally
```

## File-size ceiling

No source file >500 lines. CI enforces this. Split big YAML areas into multiple files if you must (e.g. `patterns.yml` → `patterns.yml` + `patterns-recipes.yml`).

## Code of Conduct

Be useful. Be precise. Don't padding-bomb the PR with low-signal resources. Disagreement is fine; bad faith is not. The maintainer's call is final on curation calls.

## License

By contributing you agree that:
- Code contributions are licensed under MIT (see [LICENSE](LICENSE)).
- Content contributions (roadmap-data, generated content, assets) are licensed under CC-BY-4.0 (see [LICENSE-content](LICENSE-content)).
