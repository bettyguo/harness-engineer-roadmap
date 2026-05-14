import { Handle, Position, type NodeProps } from "reactflow";
import type { RoadmapNode } from "../types";
import { AREA_COLORS } from "../lib/colors";
import type { AreaColor } from "../types";

interface NodeCardData {
  node: RoadmapNode;
  areaColor: AreaColor;
  isActive: boolean;
  onClick: (id: string) => void;
}

export function NodeCard({ data }: NodeProps<NodeCardData>) {
  const { node, areaColor, isActive, onClick } = data;
  const palette = AREA_COLORS[areaColor];

  const isCore = node.tier === "core";
  const isOptional = node.tier === "optional";

  const baseClasses =
    "group relative flex flex-col justify-between w-[240px] h-[96px] " +
    "rounded-lg px-4 py-3 cursor-pointer select-none transition-all duration-150 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  const styles: React.CSSProperties = isCore
    ? {
        backgroundColor: palette.solid,
        color: palette.text,
        border: `1.5px solid ${palette.border}`,
      }
    : {
        backgroundColor: "transparent",
        color: palette.solid,
        border: isOptional
          ? `1px dashed ${palette.border}`
          : `1.5px solid ${palette.border}`,
        opacity: isOptional ? 0.85 : 1,
      };

  const activeStyles: React.CSSProperties = isActive
    ? {
        boxShadow:
          "0 0 0 2px #5EEAD4, 0 0 0 6px rgba(94,234,212,0.16)",
      }
    : {};

  return (
    <div
      className={baseClasses}
      style={{ ...styles, ...activeStyles }}
      role="button"
      tabIndex={0}
      aria-label={`Open ${node.label}`}
      onClick={() => onClick(node.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(node.id);
        }
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "transparent", border: "none", width: 1, height: 1 }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "transparent", border: "none", width: 1, height: 1 }}
        isConnectable={false}
      />

      <div className="text-[15px] leading-tight font-semibold">
        {node.label}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider opacity-70">
        <span>{node.id}</span>
        <span>{node.tier}</span>
      </div>
    </div>
  );
}
