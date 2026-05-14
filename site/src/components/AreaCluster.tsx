import { type NodeProps } from "reactflow";
import type { Area } from "../types";
import { AREA_COLORS } from "../lib/colors";

interface AreaClusterData {
  area: Area;
  width: number;
  height: number;
}

// Background "node" for an area cluster. Rendered as a React Flow node so
// it pans/zooms with the rest of the graph. Painted first (lowest in the
// node array) so it sits behind real node cards.
export function AreaCluster({ data }: NodeProps<AreaClusterData>) {
  const palette = AREA_COLORS[data.area.color];
  return (
    <div
      className="relative pointer-events-none"
      style={{
        width: data.width,
        height: data.height,
        backgroundColor: palette.tint,
        border: `1px solid ${palette.solid}26`,
        borderRadius: 16,
      }}
    >
      <div
        className="absolute top-3 left-4 font-mono uppercase tracking-widest text-[11px]"
        style={{ color: palette.solid, opacity: 0.9 }}
      >
        {data.area.label}
      </div>
    </div>
  );
}
