import { useMemo, useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type Node as RFNode,
  type Edge as RFEdge,
} from "reactflow";
import "reactflow/dist/style.css";

import type { Graph as RoadmapGraph, Area, RoadmapNode } from "../types";
import { layoutGraph, NODE_W, NODE_H } from "../lib/layout";
import { AREA_COLORS, ACCENT } from "../lib/colors";
import { NodeCard } from "./NodeCard";
import { AreaCluster } from "./AreaCluster";

interface Props {
  graph: RoadmapGraph;
  activeId: string | null;
  onNodeClick: (id: string) => void;
}

const nodeTypes = {
  node: NodeCard,
  areaCluster: AreaCluster,
};

export function GraphCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <InnerGraph {...props} />
    </ReactFlowProvider>
  );
}

function InnerGraph({ graph, activeId, onNodeClick }: Props) {
  const areasById = useMemo(() => {
    const m = new Map<string, Area>();
    for (const a of graph.areas) m.set(a.id, a);
    return m;
  }, [graph.areas]);

  // Layout-and-structure: pure function of `graph` (and `areasById`,
  // which is itself derived from `graph`). This memo does the expensive
  // dagre work AND builds the per-render node/edge templates. It must
  // NOT depend on `activeId` — that's a per-click flag, not a layout
  // input. Re-running dagre on every click was the perf bug here.
  type RealNodeTemplate = {
    rfBase: Omit<RFNode, "data"> & { type: "node" };
    node: ReturnType<typeof layoutGraph>["nodes"][number];
    areaColor: Area["color"];
  };

  const { clusterNodes, realNodeTemplates, rfEdges } = useMemo(() => {
    const laid = layoutGraph(graph);

    // Compute per-area bounding boxes from laid-out node positions
    // (so cluster tints pan/zoom with the graph as React Flow nodes).
    const boxesByArea = new Map<
      string,
      { minX: number; minY: number; maxX: number; maxY: number }
    >();
    for (const n of laid.nodes) {
      const r = {
        minX: n.position.x,
        minY: n.position.y,
        maxX: n.position.x + NODE_W,
        maxY: n.position.y + NODE_H,
      };
      const b = boxesByArea.get(n.area);
      if (!b) boxesByArea.set(n.area, r);
      else {
        b.minX = Math.min(b.minX, r.minX);
        b.minY = Math.min(b.minY, r.minY);
        b.maxX = Math.max(b.maxX, r.maxX);
        b.maxY = Math.max(b.maxY, r.maxY);
      }
    }

    const clusterNodes: RFNode[] = Array.from(boxesByArea.entries()).map(
      ([areaId, b]) => {
        const area = areasById.get(areaId)!;
        const padX = 28;
        const padTop = 38;
        const padBottom = 24;
        return {
          id: `cluster-${areaId}`,
          type: "areaCluster",
          position: { x: b.minX - padX, y: b.minY - padTop },
          data: {
            area,
            width: b.maxX - b.minX + padX * 2,
            height: b.maxY - b.minY + padTop + padBottom,
          },
          width: b.maxX - b.minX + padX * 2,
          height: b.maxY - b.minY + padTop + padBottom,
          draggable: false,
          selectable: false,
          zIndex: 0,
          style: { zIndex: 0 },
        };
      }
    );

    // Real-node templates: everything except isActive + onClick which
    // are filled in by the cheap render-time mapper below.
    const realNodeTemplates: RealNodeTemplate[] = laid.nodes.map((n) => {
      const area = areasById.get(n.area)!;
      return {
        rfBase: {
          id: n.id,
          type: "node",
          position: n.position,
          width: NODE_W,
          height: NODE_H,
          draggable: false,
          selectable: false,
          zIndex: 1,
          style: { zIndex: 1 },
        },
        node: n,
        areaColor: area.color,
      };
    });

    // Edges: build a node->area index once, then use it instead of an
    // O(n) .find() per edge.
    const areaByNodeId = new Map<string, Area>();
    for (const n of graph.nodes) {
      const a = areasById.get(n.area);
      if (a) areaByNodeId.set(n.id, a);
    }
    const rfEdges: RFEdge[] = laid.edges.map((e, i) => {
      if (e.kind === "depends_on") {
        const area = areaByNodeId.get(e.from);
        const stroke = area ? AREA_COLORS[area.color].solid : "#888";
        return {
          id: `e${i}-${e.from}-${e.to}`,
          source: e.from,
          target: e.to,
          type: "default",
          animated: false,
          style: { stroke, strokeWidth: 1.5, opacity: 0.55 },
          markerEnd: {
            type: "arrowclosed",
            color: stroke,
            width: 12,
            height: 12,
          } as any,
        };
      }
      return {
        id: `e${i}-${e.from}-${e.to}`,
        source: e.from,
        target: e.to,
        type: "straight",
        animated: false,
        style: {
          stroke: "rgba(160,160,168,0.35)",
          strokeWidth: 1,
          strokeDasharray: "4 4",
        },
      };
    });

    return { clusterNodes, realNodeTemplates, rfEdges };
  }, [graph, areasById]);

  // Cheap per-render mapping: stamps activeId + onClick onto the cached
  // templates. Re-runs on every activeId change but does no layout work.
  const rfNodes = useMemo<RFNode[]>(() => {
    const realNodes: RFNode[] = realNodeTemplates.map((t) => ({
      ...t.rfBase,
      data: {
        node: t.node,
        areaColor: t.areaColor,
        isActive: t.node.id === activeId,
        onClick: onNodeClick,
      },
    }));
    return [...clusterNodes, ...realNodes];
  }, [clusterNodes, realNodeTemplates, activeId, onNodeClick]);

  const onPaneClickHandler = useCallback(() => {
    // background-click clears panel; the App reads URL hash for active id
    // and dispatches there if we wired it. Leaving as a no-op so the
    // panel-close-button + Esc are the canonical paths to dismiss.
  }, []);

  return (
    <div className="absolute inset-0">
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 1.0, minZoom: 0.2 }}
        minZoom={0.1}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnDoubleClick={false}
        onPaneClick={onPaneClickHandler}
        panOnScroll
        panOnDrag
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.05)"
        />

        <Controls
          position="top-right"
          showInteractive={false}
          style={{ marginTop: 60, marginRight: 12 }}
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(n) => {
            if (n.type === "areaCluster") return "transparent";
            const node = n.data?.node as RoadmapNode | undefined;
            if (!node) return ACCENT;
            const area = areasById.get(node.area);
            return area ? AREA_COLORS[area.color].solid : ACCENT;
          }}
          nodeStrokeWidth={0}
          maskColor="rgba(10,10,15,0.7)"
          style={{ marginRight: 12, marginBottom: 12, width: 200, height: 140 }}
        />
      </ReactFlow>
    </div>
  );
}
