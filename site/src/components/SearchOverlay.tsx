import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoadmapNode, Area } from "../types";
import { AREA_COLORS } from "../lib/colors";

interface Props {
  nodes: RoadmapNode[];
  areasById: Map<string, Area>;
  open: boolean;
  onClose: () => void;
  onPick: (id: string) => void;
}

export function SearchOverlay({ nodes, areasById, open, onClose, onPick }: Props) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }
    // focus the input when the overlay opens
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return nodes.slice(0, 12);
    const q = query.trim().toLowerCase();
    const scored: { n: RoadmapNode; score: number }[] = [];
    for (const n of nodes) {
      let score = 0;
      const label = n.label.toLowerCase();
      const id = n.id.toLowerCase();
      const aliases = (n.aliases ?? []).map((a) => a.toLowerCase());
      if (label.includes(q)) score += 10;
      if (id.includes(q)) score += 6;
      for (const a of aliases) if (a.includes(q)) score += 4;
      if (n.summary.toLowerCase().includes(q)) score += 1;
      if (score > 0) scored.push({ n, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 12).map((s) => s.n);
  }, [query, nodes]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const pick = results[activeIndex];
        if (pick) {
          onPick(pick.id);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, activeIndex, onPick, onClose]);

  // Focus trap: Tab / Shift-Tab cycle within the overlay only.
  const overlayRef = useRef<HTMLDivElement>(null);
  const onTrapKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !overlayRef.current) return;
    const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4
                 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={overlayRef}
        className="w-full max-w-xl rounded-xl border border-white/10
                   bg-[rgb(var(--canvas))]/95 overflow-hidden"
        style={{ boxShadow: "0 24px 64px -16px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onTrapKey}
        role="dialog"
        aria-modal="true"
        aria-label="Search nodes"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[rgb(var(--ink-muted))]">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nodes, aliases, summaries…"
            className="flex-1 bg-transparent text-[14px] text-[rgb(var(--ink))]
                       placeholder-[rgb(var(--ink-muted))] outline-none"
          />
          <span className="text-[10px] font-mono uppercase text-[rgb(var(--ink-muted))] border border-white/10 px-1.5 py-0.5 rounded">
            esc
          </span>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto py-1">
          {results.map((n, i) => {
            const area = areasById.get(n.area);
            const palette = area ? AREA_COLORS[area.color] : null;
            const active = i === activeIndex;
            return (
              <li key={n.id}>
                <button
                  className={
                    "w-full text-left px-4 py-2.5 flex items-center gap-3 " +
                    (active
                      ? "bg-white/[0.04]"
                      : "hover:bg-white/[0.02] transition-colors")
                  }
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => {
                    onPick(n.id);
                    onClose();
                  }}
                >
                  {palette && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: palette.solid }}
                    />
                  )}
                  <span className="flex-1 text-[14px] text-[rgb(var(--ink))]">
                    {n.label}
                  </span>
                  <span className="text-[11px] font-mono text-[rgb(var(--ink-muted))]">
                    {n.id}
                  </span>
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-[13px] text-[rgb(var(--ink-muted))]">
              no matches
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
