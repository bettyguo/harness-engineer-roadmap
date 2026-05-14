import { useCallback, useEffect, useMemo, useState } from "react";
import graphData from "./data/graph.json";
import type { Graph, RoadmapNode, Area } from "./types";
import { GraphCanvas } from "./components/Graph";
import { ResourcePanel } from "./components/ResourcePanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { SearchOverlay } from "./components/SearchOverlay";
import { Footer } from "./components/Footer";
import {
  readActiveNodeFromUrl,
  subscribeHash,
  writeActiveNodeToUrl,
} from "./lib/urlSync";

// graphData is the build output of tools/build.py; shape verified
// against site/src/types.ts.
const graph = graphData as Graph;

export function App() {
  const [activeId, setActiveId] = useState<string | null>(readActiveNodeFromUrl);
  const [searchOpen, setSearchOpen] = useState(false);

  const { nodesById, areasById } = useMemo(() => {
    const ni = new Map<string, RoadmapNode>();
    const ai = new Map<string, Area>();
    for (const n of graph.nodes) ni.set(n.id, n);
    for (const a of graph.areas) ai.set(a.id, a);
    return { nodesById: ni, areasById: ai };
  }, []);

  const handleSetActive = useCallback((id: string | null) => {
    setActiveId(id);
    writeActiveNodeToUrl(id);
  }, []);

  useEffect(() => {
    return subscribeHash((id) => setActiveId(id));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeNode = activeId ? nodesById.get(activeId) ?? null : null;
  const activeArea = activeNode ? areasById.get(activeNode.area) ?? null : null;

  const { dependsOnIds, relatedIds } = useMemo(() => {
    if (!activeNode) return { dependsOnIds: [], relatedIds: [] };
    const dep: string[] = [];
    const rel: string[] = [];
    for (const e of graph.edges) {
      if (e.to === activeNode.id && e.kind === "depends_on") dep.push(e.from);
      if (e.kind === "related") {
        if (e.from === activeNode.id) rel.push(e.to);
        else if (e.to === activeNode.id) rel.push(e.from);
      }
    }
    return { dependsOnIds: dep, relatedIds: rel };
  }, [activeNode]);

  return (
    <div className="relative w-full h-full">
      <Header onSearchClick={() => setSearchOpen(true)} />

      <GraphCanvas
        graph={graph}
        activeId={activeId}
        onNodeClick={handleSetActive}
      />

      <ResourcePanel
        node={activeNode}
        area={activeArea}
        onClose={() => handleSetActive(null)}
        onJumpTo={handleSetActive}
        nodesById={nodesById}
        dependsOnIds={dependsOnIds}
        relatedIds={relatedIds}
      />

      <SearchOverlay
        nodes={graph.nodes}
        areasById={areasById}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onPick={handleSetActive}
      />

      <Footer graph={graph} />
    </div>
  );
}

function Header({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <header className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between gap-3 pointer-events-none">
      <div className="pointer-events-auto px-4 py-2.5 rounded-lg border border-white/5
                      bg-[rgb(var(--canvas))]/70 backdrop-blur-sm
                      flex items-baseline gap-3 max-w-[640px]">
        <h1 className="font-display text-[18px] font-semibold tracking-tight text-[rgb(var(--ink))]">
          Harness Engineering Roadmap
        </h1>
        <span className="hidden md:inline text-[12px] text-[rgb(var(--ink-dim))]">
          the depth map for building reliable systems around LLMs
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          onClick={onSearchClick}
          className="inline-flex items-center gap-2 px-3 h-9 rounded-lg
                     border border-white/10 bg-[rgb(var(--canvas))]/85 backdrop-blur
                     text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--ink))]
                     hover:border-white/20 transition-colors text-[13px]"
          aria-label="Search nodes"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <span className="text-[10px] font-mono uppercase text-[rgb(var(--ink-muted))] border border-white/10 px-1 rounded ml-1">
            ⌘K
          </span>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
