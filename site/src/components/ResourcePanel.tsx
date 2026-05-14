import { useEffect } from "react";
import type { RoadmapNode, Area, Resource } from "../types";
import { AREA_COLORS } from "../lib/colors";

interface Props {
  node: RoadmapNode | null;
  area: Area | null;
  onClose: () => void;
  onJumpTo: (id: string) => void;
  nodesById: Map<string, RoadmapNode>;
  relatedIds: string[];
  dependsOnIds: string[];
}

export function ResourcePanel({
  node,
  area,
  onClose,
  onJumpTo,
  nodesById,
  relatedIds,
  dependsOnIds,
}: Props) {
  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node, onClose]);

  if (!node || !area) {
    return null;
  }

  const palette = AREA_COLORS[area.color];

  return (
    <>
      <div
        className="fixed inset-0 z-30 md:hidden bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <aside
        className="fixed top-0 right-0 z-40 h-full w-full md:w-[480px]
                   bg-[rgb(var(--canvas))] border-l border-white/5
                   overflow-y-auto"
        style={{ boxShadow: "0 0 0 1px rgba(245,245,247,0.06), 0 12px 48px -16px rgba(0,0,0,0.6)" }}
        role="dialog"
        aria-label={`Resources for ${node.label}`}
      >
        <PanelHeader area={area} node={node} onClose={onClose} palette={palette} />
        <PanelBody
          node={node}
          area={area}
          dependsOnIds={dependsOnIds}
          relatedIds={relatedIds}
          nodesById={nodesById}
          onJumpTo={onJumpTo}
        />
      </aside>
    </>
  );
}

function PanelHeader({
  area,
  node,
  onClose,
  palette,
}: {
  area: Area;
  node: RoadmapNode;
  onClose: () => void;
  palette: typeof AREA_COLORS[keyof typeof AREA_COLORS];
}) {
  return (
    <div
      className="sticky top-0 z-10 px-6 pt-5 pb-4 bg-[rgb(var(--canvas))] border-b border-white/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className="text-[11px] font-mono uppercase tracking-widest mb-1"
            style={{ color: palette.solid }}
          >
            {area.label}
          </div>
          <h2 className="font-display text-2xl font-semibold leading-tight">
            {node.label}
          </h2>
          <div className="text-[11px] font-mono text-[rgb(var(--ink-muted))] mt-1.5">
            {node.id} · {node.tier}
          </div>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded
                     text-[rgb(var(--ink-dim))] hover:text-[rgb(var(--ink))]
                     hover:bg-white/5 transition-colors"
          aria-label="Close panel"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

function PanelBody({
  node,
  area,
  dependsOnIds,
  relatedIds,
  nodesById,
  onJumpTo,
}: {
  node: RoadmapNode;
  area: Area;
  dependsOnIds: string[];
  relatedIds: string[];
  nodesById: Map<string, RoadmapNode>;
  onJumpTo: (id: string) => void;
}) {
  return (
    <div className="px-6 pb-12 pt-5 space-y-6">
      <Section title="What it covers">
        <p className="text-[15px] leading-relaxed text-[rgb(var(--ink))]">
          {node.summary}
        </p>
      </Section>

      <Section title="What 'competent' looks like">
        <p className="text-[15px] leading-relaxed text-[rgb(var(--ink-dim))]">
          {node.competent_means}
        </p>
      </Section>

      {dependsOnIds.length > 0 && (
        <Section title="Depends on">
          <NodeChips ids={dependsOnIds} nodesById={nodesById} onJumpTo={onJumpTo} />
        </Section>
      )}

      {relatedIds.length > 0 && (
        <Section title="Related">
          <NodeChips ids={relatedIds} nodesById={nodesById} onJumpTo={onJumpTo} />
        </Section>
      )}

      <Section title={`Resources (${node.resources.length})`}>
        <div className="space-y-4">
          {node.resources.map((r, i) => (
            <ResourceCard key={i} resource={r} areaColor={area.color} />
          ))}
        </div>
      </Section>

      {node.aliases && node.aliases.length > 0 && (
        <Section title="Also known as">
          <div className="text-[12px] font-mono text-[rgb(var(--ink-muted))]">
            {node.aliases.join(" · ")}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-mono uppercase tracking-widest text-[rgb(var(--ink-muted))] mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function NodeChips({
  ids,
  nodesById,
  onJumpTo,
}: {
  ids: string[];
  nodesById: Map<string, RoadmapNode>;
  onJumpTo: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => {
        const target = nodesById.get(id);
        return (
          <button
            key={id}
            onClick={() => onJumpTo(id)}
            className="inline-flex items-center px-2 py-1 rounded text-[12px]
                       border border-white/10 text-[rgb(var(--ink-dim))]
                       hover:border-accent/40 hover:text-[rgb(var(--ink))]
                       hover:bg-white/[0.03] transition-colors"
          >
            {target?.label ?? id}
          </button>
        );
      })}
    </div>
  );
}

function ResourceCard({ resource, areaColor }: { resource: Resource; areaColor: Area["color"] }) {
  const palette = AREA_COLORS[areaColor];
  const isCurrent = resource.durability === "current";
  return (
    <article
      className="p-3.5 rounded-lg border border-white/[0.08]
                 hover:border-white/15 transition-colors"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium leading-snug hover:text-accent transition-colors"
          style={{ color: "rgb(var(--ink))" }}
        >
          {resource.title}
          <span className="inline-block ml-1 opacity-50">↗</span>
        </a>
      </div>
      <div className="text-[12px] text-[rgb(var(--ink-dim))] mb-2">
        {resource.author} · {resource.year} · {resource.type}
      </div>
      <p className="text-[13px] leading-relaxed text-[rgb(var(--ink-dim))] mb-3">
        {resource.why}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Tag>{resource.difficulty}</Tag>
        <Tag>{resource.cost}</Tag>
        <Tag
          style={
            isCurrent
              ? { borderColor: palette.solid, color: palette.solid }
              : undefined
          }
        >
          {isCurrent ? "current tool" : "durable"}
        </Tag>
        {resource.verified !== "yes" && <Tag dim>unverified</Tag>}
      </div>
    </article>
  );
}

function Tag({
  children,
  dim,
  style,
}: {
  children: React.ReactNode;
  dim?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono " +
        "uppercase tracking-wider border " +
        (dim
          ? "border-white/10 text-[rgb(var(--ink-muted))]"
          : "border-white/15 text-[rgb(var(--ink-dim))]")
      }
      style={style}
    >
      {children}
    </span>
  );
}
