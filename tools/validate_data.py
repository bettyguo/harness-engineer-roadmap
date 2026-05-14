#!/usr/bin/env python3
"""Validate roadmap-data/ against the schema and structural rules.

Rules enforced:
  1. Each <area>.yml matches the JSON Schema at roadmap-data/_schema.json.
  2. Area id == filename stem.
  3. All node ids globally unique.
  4. All depends_on / related edges resolve to an existing node.
  5. No cycles in depends_on (related may form cycles).
  6. Every node has >=1 resource (already enforced by schema).
  7. With --strict: every node has >=1 resource with verified == "yes".
  8. Every resource with durability == "current" has a why >= 40 chars
     (so it actually addresses staleness, not just labels it).

Usage:
  python tools/validate_data.py              # non-strict (for PRs)
  python tools/validate_data.py --strict     # strict (for main / pre-release)
"""
from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict, deque
from pathlib import Path

import yaml
from jsonschema import Draft202012Validator

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "roadmap-data"
SCHEMA_PATH = DATA_DIR / "_schema.json"


def load_yaml(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def validate_schema(area_files: list[Path], schema: dict) -> list[str]:
    errors: list[str] = []
    validator = Draft202012Validator(schema)
    for path in area_files:
        try:
            data = load_yaml(path)
        except yaml.YAMLError as exc:
            errors.append(f"{path.name}: YAML parse error — {exc}")
            continue
        if data is None:
            errors.append(f"{path.name}: file is empty")
            continue
        for err in validator.iter_errors(data):
            location = "/".join(str(p) for p in err.absolute_path)
            errors.append(f"{path.name}: {location}: {err.message}")
    return errors


def collect_nodes(area_files: list[Path]) -> tuple[dict, list[str]]:
    """Return (node_by_id, errors)."""
    node_by_id: dict[str, dict] = {}
    errors: list[str] = []
    for path in area_files:
        data = load_yaml(path)
        if data is None:
            continue
        area_id = data["area"]["id"]
        if area_id != path.stem:
            errors.append(
                f"{path.name}: area.id ({area_id!r}) must match filename stem"
            )
        for node in data.get("nodes", []):
            node_id = node["id"]
            if not node_id.startswith(f"{area_id}."):
                errors.append(
                    f"{path.name}: node {node_id!r} must start with {area_id!r}."
                )
            if node_id in node_by_id:
                errors.append(f"duplicate node id: {node_id!r}")
            else:
                node_by_id[node_id] = node
    return node_by_id, errors


def check_edges(node_by_id: dict) -> list[str]:
    errors: list[str] = []
    for node_id, node in node_by_id.items():
        for dep in node.get("depends_on", []):
            if dep not in node_by_id:
                errors.append(
                    f"{node_id}: depends_on references unknown node {dep!r}"
                )
        for rel in node.get("related", []):
            if rel not in node_by_id:
                errors.append(
                    f"{node_id}: related references unknown node {rel!r}"
                )
            if rel == node_id:
                errors.append(f"{node_id}: related contains itself")
    return errors


def check_cycles(node_by_id: dict) -> list[str]:
    """Topological-sort check on depends_on; report any nodes left in a cycle."""
    graph = {nid: list(n.get("depends_on", [])) for nid, n in node_by_id.items()}
    indeg: dict[str, int] = defaultdict(int)
    for nid in graph:
        indeg.setdefault(nid, 0)
    for nid, deps in graph.items():
        for d in deps:
            if d in graph:
                indeg[nid] += 1
    queue = deque([nid for nid, c in indeg.items() if c == 0])
    visited = 0
    while queue:
        cur = queue.popleft()
        visited += 1
        for nid, deps in graph.items():
            if cur in deps:
                indeg[nid] -= 1
                if indeg[nid] == 0:
                    queue.append(nid)
    if visited != len(graph):
        leftover = [nid for nid, c in indeg.items() if c > 0]
        return [
            "depends_on cycle detected; nodes still in cycle: "
            + ", ".join(sorted(leftover))
        ]
    return []


def check_resources(node_by_id: dict, strict: bool) -> list[str]:
    errors: list[str] = []
    for node_id, node in node_by_id.items():
        resources = node.get("resources", [])
        if strict and not any(r.get("verified") == "yes" for r in resources):
            errors.append(
                f"{node_id}: --strict requires >=1 resource with verified == 'yes'"
            )
        for r in resources:
            if r.get("durability") == "current":
                why = r.get("why", "")
                if len(why) < 40:
                    errors.append(
                        f"{node_id}: resource {r.get('title')!r} is durability:current "
                        f"but 'why' is too short (got {len(why)} chars, need >=40)"
                    )
    return errors


def main() -> int:
    ap = argparse.ArgumentParser(description="Validate roadmap-data/")
    ap.add_argument(
        "--strict",
        action="store_true",
        help="Require every node to have >=1 resource with verified=='yes'.",
    )
    args = ap.parse_args()

    if not SCHEMA_PATH.exists():
        print(f"missing schema: {SCHEMA_PATH}", file=sys.stderr)
        return 2

    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    area_files = sorted(p for p in DATA_DIR.glob("*.yml") if not p.name.startswith("_"))

    if not area_files:
        print(f"no area files found in {DATA_DIR}", file=sys.stderr)
        return 2

    print(f"validating {len(area_files)} area files in {DATA_DIR.relative_to(ROOT)}/")

    schema_errors = validate_schema(area_files, schema)
    node_by_id, collect_errors = collect_nodes(area_files)
    edge_errors = check_edges(node_by_id) if not collect_errors else []
    cycle_errors = check_cycles(node_by_id) if not collect_errors and not edge_errors else []
    resource_errors = check_resources(node_by_id, args.strict)

    all_errors = schema_errors + collect_errors + edge_errors + cycle_errors + resource_errors

    print(f"  areas: {len(area_files)}")
    print(f"  nodes: {len(node_by_id)}")
    total_resources = sum(len(n.get("resources", [])) for n in node_by_id.values())
    verified = sum(
        1
        for n in node_by_id.values()
        for r in n.get("resources", [])
        if r.get("verified") == "yes"
    )
    print(f"  resources: {total_resources} ({verified} verified)")

    if all_errors:
        print(f"\n{len(all_errors)} error(s):", file=sys.stderr)
        for err in all_errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
