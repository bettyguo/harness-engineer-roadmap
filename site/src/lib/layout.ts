// Dagre-based auto-layout for the React Flow graph.
//
// Strategy:
//   - One left-to-right layered graph for the whole map.
//   - Nodes are 240×96 (matching NodeCard dimensions).
//   - Nodes from the same area are grouped via a `rank` hint so each
//     area tends to form a vertical strip — readable as a cluster.
//   - depends_on edges are real edges to dagre. related edges are not
//     fed in, so they don't influence layout (they're rendered later
//     as decorative dashed edges).

import dagre from "@dagrejs/dagre";
import type { Graph, RoadmapNode, Edge } from "../types";

export const NODE_W = 240;
export const NODE_H = 96;
export const AREA_GAP_X = 80;
export const NODE_GAP_Y = 28;

export interface LaidOutNode extends RoadmapNode {
  position: { x: number; y: number };
}

export function layoutGraph(
  graph: Graph
): { nodes: LaidOutNode[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph({ multigraph: false, compound: false });
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    nodesep: NODE_GAP_Y,
    edgesep: 12,
    ranksep: AREA_GAP_X,
    marginx: 60,
    marginy: 60,
    ranker: "network-simplex",
  });

  for (const n of graph.nodes) {
    g.setNode(n.id, { width: NODE_W, height: NODE_H });
  }

  // Only depends_on edges drive layout.
  const dependsEdges = graph.edges.filter((e) => e.kind === "depends_on");
  for (const e of dependsEdges) {
    if (g.hasNode(e.from) && g.hasNode(e.to)) {
      g.setEdge(e.from, e.to);
    }
  }

  dagre.layout(g);

  const laid: LaidOutNode[] = graph.nodes.map((n) => {
    const pos = g.node(n.id);
    return {
      ...n,
      position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 },
    };
  });

  return { nodes: laid, edges: graph.edges };
}
