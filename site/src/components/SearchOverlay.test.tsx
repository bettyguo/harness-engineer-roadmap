import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchOverlay } from "./SearchOverlay";
import type { Area, RoadmapNode } from "../types";

const nodes: RoadmapNode[] = [
  {
    id: "loop.react",
    label: "ReAct",
    area: "loop",
    tier: "core",
    summary: "interleaved reasoning and acting",
    competent_means: "",
    aliases: ["react pattern"],
    resources: [],
  },
  {
    id: "loop.basic-loop",
    label: "The basic agent loop",
    area: "loop",
    tier: "core",
    summary: "think act observe",
    competent_means: "",
    aliases: [],
    resources: [],
  },
];

const areasById = new Map<string, Area>([
  ["loop", { id: "loop", label: "Loop", color: "teal", order: 1, blurb: "" }],
]);

describe("SearchOverlay accessibility (Q2)", () => {
  it("renders nothing when closed", () => {
    render(
      <SearchOverlay
        nodes={nodes}
        areasById={areasById}
        open={false}
        onClose={vi.fn()}
        onPick={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders a dialog with aria-modal when open", () => {
    render(
      <SearchOverlay
        nodes={nodes}
        areasById={areasById}
        open
        onClose={vi.fn()}
        onPick={vi.fn()}
      />,
    );
    const dlg = screen.getByRole("dialog");
    expect(dlg).toBeInTheDocument();
    expect(dlg).toHaveAttribute("aria-modal", "true");
    expect(dlg).toHaveAttribute("aria-label");
  });

  it("filters results by query", () => {
    render(
      <SearchOverlay
        nodes={nodes}
        areasById={areasById}
        open
        onClose={vi.fn()}
        onPick={vi.fn()}
      />,
    );
    const input = screen.getByPlaceholderText(/search nodes/i);
    fireEvent.change(input, { target: { value: "react" } });
    expect(screen.getByText("ReAct")).toBeInTheDocument();
    expect(screen.queryByText("The basic agent loop")).toBeNull();
  });

  it("Enter picks the highlighted result and closes", () => {
    const onPick = vi.fn();
    const onClose = vi.fn();
    render(
      <SearchOverlay
        nodes={nodes}
        areasById={areasById}
        open
        onClose={onClose}
        onPick={onPick}
      />,
    );
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onPick).toHaveBeenCalledWith(nodes[0].id);
    expect(onClose).toHaveBeenCalled();
  });

  it("Escape closes the overlay", () => {
    const onClose = vi.fn();
    render(
      <SearchOverlay
        nodes={nodes}
        areasById={areasById}
        open
        onClose={onClose}
        onPick={vi.fn()}
      />,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
