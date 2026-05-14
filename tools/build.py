#!/usr/bin/env python3
"""Build site/src/data/graph.json and content/<area>.md from roadmap-data/.

- graph.json: a single bundled blob the React renderer imports at build time.
  Includes areas, nodes (with layout hints), edges (depends_on=solid,
  related=dashed), and resource lists.
- content/<area>.md: a generated static-markdown fallback so the repo is
  readable on GitHub even without the live site.

Usage:
  python tools/build.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "roadmap-data"
GRAPH_OUT = ROOT / "site" / "src" / "data" / "graph.json"
CONTENT_OUT = ROOT / "content"


def load_areas() -> list[dict]:
    files = sorted(p for p in DATA_DIR.glob("*.yml") if not p.name.startswith("_"))
    areas: list[dict] = []
    for path in files:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        if data is None:
            continue
        areas.append(data)
    return areas


def build_graph(areas: list[dict]) -> dict:
    """Build the flat graph.json structure."""
    out_areas = []
    out_nodes = []
    out_edges = []
    seen_related: set[frozenset[str]] = set()
    for area in sorted(areas, key=lambda a: a["area"]["order"]):
        a = area["area"]
        out_areas.append(
            {
                "id": a["id"],
                "label": a["label"],
                "color": a["color"],
                "order": a["order"],
                "blurb": a["blurb"],
            }
        )
        for node in area.get("nodes", []):
            out_nodes.append(
                {
                    "id": node["id"],
                    "label": node["label"],
                    "area": a["id"],
                    "tier": node["tier"],
                    "summary": node["summary"],
                    "competent_means": node["competent_means"],
                    "aliases": node.get("aliases", []),
                    "resources": node["resources"],
                }
            )
            for dep in node.get("depends_on", []):
                out_edges.append(
                    {
                        "from": dep,
                        "to": node["id"],
                        "kind": "depends_on",
                    }
                )
            for rel in node.get("related", []):
                if rel == node["id"]:
                    continue
                key = frozenset({node["id"], rel})
                if key in seen_related:
                    continue
                seen_related.add(key)
                out_edges.append(
                    {
                        "from": node["id"],
                        "to": rel,
                        "kind": "related",
                    }
                )
    return {
        "version": 1,
        "generated_by": "tools/build.py",
        "areas": out_areas,
        "nodes": out_nodes,
        "edges": out_edges,
    }


def tier_marker(tier: str) -> str:
    return {
        "core": "**core**",
        "recommended": "*recommended*",
        "optional": "_optional_",
    }.get(tier, tier)


def write_markdown(areas: list[dict]) -> None:
    CONTENT_OUT.mkdir(parents=True, exist_ok=True)

    # README inside content/
    readme = [
        "# Static markdown fallback",
        "",
        "This directory is **auto-generated** by `tools/build.py` from",
        "`roadmap-data/*.yml`. Don't edit by hand — your changes will be",
        "overwritten on the next build.",
        "",
        "For the full interactive experience, use the live site:",
        "https://bettyguo.github.io/harness-engineer-roadmap",
        "",
        "## Areas",
        "",
    ]
    for area in sorted(areas, key=lambda a: a["area"]["order"]):
        a = area["area"]
        readme.append(f"- [{a['label']}]({a['id']}.md) — {a['blurb']}")
    readme.append("")
    (CONTENT_OUT / "README.md").write_text("\n".join(readme), encoding="utf-8")

    # one file per area
    for area in areas:
        a = area["area"]
        lines = [
            f"# {a['label']}",
            "",
            f"> {a['blurb']}",
            "",
            f"*Area id: `{a['id']}`*",
            "",
            "---",
            "",
        ]
        for node in area.get("nodes", []):
            lines.append(f"## {node['label']}")
            lines.append("")
            lines.append(f"`id: {node['id']}` · {tier_marker(node['tier'])}")
            lines.append("")
            lines.append(node["summary"].strip())
            lines.append("")
            lines.append(f"**Competent means:** {node['competent_means'].strip()}")
            lines.append("")
            deps = node.get("depends_on", [])
            if deps:
                lines.append("**Depends on:** " + ", ".join(f"`{d}`" for d in deps))
                lines.append("")
            rel = node.get("related", [])
            if rel:
                lines.append("**Related:** " + ", ".join(f"`{r}`" for r in rel))
                lines.append("")
            aliases = node.get("aliases", [])
            if aliases:
                lines.append("**Also known as:** " + ", ".join(aliases))
                lines.append("")
            resources = node.get("resources", [])
            if resources:
                lines.append("**Resources:**")
                lines.append("")
                for r in resources:
                    durability = "🜂 current" if r.get("durability") == "current" else "◆ durable"
                    verified = "" if r.get("verified") == "yes" else " *(unverified)*"
                    lines.append(
                        f"- [{r['title']}]({r['link']}) — "
                        f"{r['author']}, {r['year']} · "
                        f"`{r['type']}` · `{r['difficulty']}` · `{r['cost']}` · "
                        f"{durability}{verified}"
                    )
                    lines.append(f"  - {r['why'].strip()}")
                lines.append("")
            lines.append("---")
            lines.append("")
        (CONTENT_OUT / f"{a['id']}.md").write_text(
            "\n".join(lines), encoding="utf-8"
        )


def main() -> int:
    areas = load_areas()
    if not areas:
        print(f"no area files found in {DATA_DIR}", file=sys.stderr)
        return 1

    graph = build_graph(areas)

    GRAPH_OUT.parent.mkdir(parents=True, exist_ok=True)
    GRAPH_OUT.write_text(json.dumps(graph, indent=2), encoding="utf-8")
    print(f"wrote {GRAPH_OUT.relative_to(ROOT)}")
    print(
        f"  areas: {len(graph['areas'])} · "
        f"nodes: {len(graph['nodes'])} · "
        f"edges: {len(graph['edges'])}"
    )

    write_markdown(areas)
    print(f"wrote {CONTENT_OUT.relative_to(ROOT)}/*.md")

    return 0


if __name__ == "__main__":
    sys.exit(main())
