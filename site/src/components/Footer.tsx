import type { Graph } from "../types";

interface Props {
  graph: Graph;
}

export function Footer({ graph }: Props) {
  const nodeCount = graph.nodes.length;
  const areaCount = graph.areas.length;

  return (
    <footer
      className="absolute bottom-3 left-3 z-20 pointer-events-none
                 text-[11px] font-mono text-[rgb(var(--ink-muted))]"
    >
      <div className="px-3 py-2 rounded-lg border border-white/5
                      bg-[rgb(var(--canvas))]/70 backdrop-blur-sm pointer-events-auto
                      flex flex-wrap gap-x-4 gap-y-1 items-center max-w-[640px]">
        <span>
          <strong className="font-display font-semibold text-[rgb(var(--ink))]">
            Harness Engineering Roadmap
          </strong>
        </span>
        <span>{areaCount} areas · {nodeCount} nodes</span>
        <a
          href="https://github.com/bettyguo/harness-engineer-roadmap"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[rgb(var(--ink))] transition-colors"
        >
          github
        </a>
        <a
          href="https://github.com/bettyguo/ai-engineer-roadmap"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[rgb(var(--ink))] transition-colors"
          title="The broader AI-engineer career path this fits into"
        >
          ↔ ai-engineer-roadmap
        </a>
        <a
          href="https://orcid.org/0009-0000-2388-1072"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[rgb(var(--ink))] transition-colors"
        >
          by Betty Guo · HKU
        </a>
        <span className="text-[10px] opacity-70">CC-BY-4.0</span>
      </div>
    </footer>
  );
}
