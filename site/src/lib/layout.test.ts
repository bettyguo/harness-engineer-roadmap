import { describe, expect, it } from "vitest";
import { layoutGraph } from "./layout";
import type { Graph } from "../types";

function _graph(): Graph {
  return {
    version: 1,
    generated_by: "test",
    areas: [
      { id: "x", label: "X", color: "violet", order: 1, blurb: "b" },
    ],
    nodes: [
      {
        id: "x.a",
        label: "A",
        area: "x",
        tier: "core",
        summary: "s",
        competent_means: "c",
        resources: [],
      },
      {
        id: "x.b",
        label: "B",
        area: "x",
        tier: "core",
        summary: "s",
        competent_means: "c",
        resources: [],
      },
    ],
    edges: [{ from: "x.a", to: "x.b", kind: "depends_on" }],
  };
}

describe("layoutGraph", () => {
  it("is deterministic for identical input", () => {
    const g = _graph();
    const a = layoutGraph(g);
    const b = layoutGraph(g);
    expect(a.nodes.map((n) => n.position)).toEqual(
      b.nodes.map((n) => n.position),
    );
  });

  it("preserves node ids and ordering with input", () => {
    const g = _graph();
    const laid = layoutGraph(g);
    expect(laid.nodes.map((n) => n.id)).toEqual(["x.a", "x.b"]);
  });

  it("passes through all edges (depends_on AND related) unchanged", () => {
    const g = _graph();
    g.edges.push({ from: "x.a", to: "x.b", kind: "related" });
    const laid = layoutGraph(g);
    expect(laid.edges).toHaveLength(2);
    expect(laid.edges.map((e) => e.kind).sort()).toEqual([
      "depends_on",
      "related",
    ]);
  });

  it("places dependent node to the right of its prerequisite (LR layout)", () => {
    const g = _graph();
    const laid = layoutGraph(g);
    const a = laid.nodes.find((n) => n.id === "x.a")!;
    const b = laid.nodes.find((n) => n.id === "x.b")!;
    expect(a.position.x).toBeLessThan(b.position.x);
  });

  it("handles a graph with no edges (orphan nodes still get positions)", () => {
    const g = _graph();
    g.edges = [];
    const laid = layoutGraph(g);
    for (const n of laid.nodes) {
      expect(Number.isFinite(n.position.x)).toBe(true);
      expect(Number.isFinite(n.position.y)).toBe(true);
    }
  });

  // C3 invariant: callers (Graph.tsx) MUST be able to memoize layout
  // output keyed only on the graph and re-use it across activeId
  // changes. This test pins the contract: layoutGraph reads no UI
  // state, so identical graph in == identical positions out, every time.
  it("is referentially stable across N calls (no UI-state input)", () => {
    const g = _graph();
    const first = layoutGraph(g).nodes.map((n) => ({
      id: n.id,
      x: n.position.x,
      y: n.position.y,
    }));
    for (let i = 0; i < 5; i++) {
      const again = layoutGraph(g).nodes.map((n) => ({
        id: n.id,
        x: n.position.x,
        y: n.position.y,
      }));
      expect(again).toEqual(first);
    }
  });
});
