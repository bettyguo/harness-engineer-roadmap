"""Regression tests for tools/build.py.

Each test calls `build_graph` against a synthetic in-memory `areas`
structure that mirrors the YAML shape. No filesystem reads, no
network.
"""
from __future__ import annotations

import build  # type: ignore[import-not-found]


def _area(area_id: str, order: int = 1, *, nodes: list[dict]) -> dict:
    return {
        "area": {
            "id": area_id,
            "label": area_id.title(),
            "color": "violet",
            "order": order,
            "blurb": "blurb",
        },
        "nodes": nodes,
    }


def _node(
    node_id: str,
    *,
    depends_on: list[str] | None = None,
    related: list[str] | None = None,
) -> dict:
    return {
        "id": node_id,
        "label": node_id,
        "tier": "core",
        "summary": "s",
        "competent_means": "c",
        "depends_on": depends_on or [],
        "related": related or [],
        "resources": [
            {
                "title": "t",
                "author": "a",
                "year": 2024,
                "type": "post",
                "link": "https://example.com/",
                "why": "why",
                "difficulty": "intermediate",
                "cost": "free",
                "durability": "durable",
                "verified": "yes",
            }
        ],
    }


# ---------- C1: one-directional related-edge dedup ----------


def test_related_edge_one_direction_a_to_b_is_emitted() -> None:
    """A declares related=[B], B declares nothing. Edge must appear."""
    areas = [
        _area(
            "x",
            nodes=[
                _node("x.a", related=["x.b"]),
                _node("x.b"),
            ],
        )
    ]
    graph = build.build_graph(areas)
    related = [e for e in graph["edges"] if e["kind"] == "related"]
    assert {(e["from"], e["to"]) for e in related} == {("x.a", "x.b")}


def test_related_edge_one_direction_b_to_a_is_emitted() -> None:
    """B declares related=[A], A declares nothing. The bug: with
    alphabetical dedup, this edge was silently dropped."""
    areas = [
        _area(
            "x",
            nodes=[
                _node("x.a"),
                _node("x.b", related=["x.a"]),
            ],
        )
    ]
    graph = build.build_graph(areas)
    related = [e for e in graph["edges"] if e["kind"] == "related"]
    # We don't care which direction is stored, only that exactly one edge exists.
    assert len(related) == 1
    e = related[0]
    assert {e["from"], e["to"]} == {"x.a", "x.b"}


def test_related_edge_bidirectional_emits_one_edge_only() -> None:
    """Both declare related to each other. Should produce one edge,
    not two — dedup must work."""
    areas = [
        _area(
            "x",
            nodes=[
                _node("x.a", related=["x.b"]),
                _node("x.b", related=["x.a"]),
            ],
        )
    ]
    graph = build.build_graph(areas)
    related = [e for e in graph["edges"] if e["kind"] == "related"]
    assert len(related) == 1


def test_related_self_loop_is_not_emitted() -> None:
    """A node referring to itself in `related` should not yield a self-edge.
    (Validation forbids this, but build.py shouldn't emit it even if it
    slipped through.)"""
    areas = [
        _area(
            "x",
            nodes=[_node("x.a", related=["x.a"])],
        )
    ]
    graph = build.build_graph(areas)
    related = [e for e in graph["edges"] if e["kind"] == "related"]
    assert all(e["from"] != e["to"] for e in related)


# ---------- depends_on edges are not affected ----------


def test_depends_on_edges_unaffected_by_related_dedup() -> None:
    areas = [
        _area(
            "x",
            nodes=[
                _node("x.a"),
                _node("x.b", depends_on=["x.a"]),
            ],
        )
    ]
    graph = build.build_graph(areas)
    deps = [e for e in graph["edges"] if e["kind"] == "depends_on"]
    assert deps == [{"from": "x.a", "to": "x.b", "kind": "depends_on"}]


# ---------- area ordering ----------


def test_areas_are_ordered_by_their_order_field() -> None:
    areas = [
        _area("z", order=3, nodes=[_node("z.a")]),
        _area("a", order=1, nodes=[_node("a.a")]),
        _area("m", order=2, nodes=[_node("m.a")]),
    ]
    graph = build.build_graph(areas)
    assert [a["id"] for a in graph["areas"]] == ["a", "m", "z"]
