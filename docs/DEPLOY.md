# Deploy

The interactive site is deployed as a static site to **GitHub Pages**, built from `main` via the [`deploy.yml`](../.github/workflows/deploy.yml) workflow. This document is the operator's runbook.

## First-time setup (one-time manual steps)

These steps cannot be automated from a fresh clone — they require the repo to exist on GitHub and a human with admin access.

### 1. Create the GitHub repository

```sh
# On the curator's machine, after `git remote add origin <url>`:
gh repo create bettyguo/harness-engineer-roadmap --public \
  --description "An interactive roadmap for harness engineering — building the agent loop, tool layers, context engineering, memory, retrieval, eval harnesses, and the rest of the scaffolding around modern LLMs." \
  --source=. --push
```

If `gh` isn't installed, create the repo manually at <https://github.com/new>, then:

```sh
git remote add origin https://github.com/bettyguo/harness-engineer-roadmap.git
git push -u origin main
```

### 2. Enable GitHub Pages

In the repo on GitHub → **Settings → Pages**:

- Source: **GitHub Actions** (not "Deploy from a branch").

That's it. The next push to `main` triggers `deploy.yml`, which builds and publishes.

### 3. Set repo topics for discoverability

In the repo on GitHub → top of the page → ⚙ next to "About":

```
harness-engineering  agent-harness  context-engineering
agent-infrastructure  agentops  llm-agents  agent-frameworks
roadmap
```

(GitHub caps topics at 20. Eight is plenty.)

### 4. Verify the live URL

After the first successful deploy run (~3–4 minutes), the site is at:

<https://bettyguo.github.io/harness-engineer-roadmap/>

Click a node — the resource panel should slide in. Try the URL fragment: open `…/#node/loop.react` directly; the right panel should open.

## Subsequent deploys

Every push to `main` triggers `deploy.yml`. No manual action.

To deploy on demand: **Actions → deploy → Run workflow**.

## Local preview

```sh
# from repo root
pip install -r tools/requirements.txt
python tools/validate_data.py
python tools/build.py            # regenerates site/src/data/graph.json + content/

cd site
npm ci
npm run dev                       # localhost:5173
```

For a production-equivalent local preview:

```sh
cd site
npm run build
npm run preview                   # localhost:4173, serves site/dist/
```

## Fallback: Cloudflare Pages

If GitHub Pages becomes inconvenient (custom-domain hassles, bundle-size limits, regional CDN concerns):

1. Cloudflare dashboard → **Pages → Create application → Connect to Git**.
2. Pick `bettyguo/harness-engineer-roadmap`.
3. Build settings:
   - **Build command:** `pip install -r tools/requirements.txt && python tools/build.py && cd site && npm ci && npm run build`
   - **Build output directory:** `site/dist`
   - **Environment variables:** `NODE_VERSION=20`, `PYTHON_VERSION=3.12`
4. Save. First deploy ~3 minutes.

The GitHub Actions workflow can be disabled if Cloudflare Pages takes over the deploy.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| 404 on every asset | Vite `base` path doesn't match Pages subpath | Confirm `site/vite.config.ts` has `base: "/harness-engineer-roadmap/"`. |
| `deploy.yml` fails on `npm ci` | `site/package-lock.json` missing or stale | Commit a fresh `package-lock.json` from `site/`. |
| `validate_data.py` fails in CI but passes locally | Different Python minor; YAML order differences | Pin to Python 3.12 locally (matches CI). |
| Linkcheck flooding issues | A whole domain went down briefly | Add the domain to `.linkcheck-ignore` with a date + reason; remove when it recovers. |

## Cadence

- **Daily:** `linkcheck.yml` (cron 03:17 UTC) — soft-fails, files an issue on broken links.
- **On every PR:** `validate.yml` (data validity + site build + LOC cap), `linkcheck.yml` (hard-fail on broken links in changed files).
- **On every push to `main`:** `deploy.yml` (build → Pages).
- **Quarterly content sweep:** human-driven. Open a meta-issue, audit each area, log in `CHANGELOG.md`.
