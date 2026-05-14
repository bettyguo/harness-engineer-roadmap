// Mirrors the JSON Schema in roadmap-data/_schema.json.
// Generated graph.json conforms to this shape.

export type Tier = "core" | "recommended" | "optional";

export type AreaColor =
  | "violet" | "teal" | "amber" | "rose"
  | "indigo" | "emerald" | "fuchsia" | "sky"
  | "orange" | "lime" | "red" | "cyan";

export type ResourceType =
  | "paper" | "repo" | "tool" | "post"
  | "talk" | "spec" | "book" | "course";

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type Cost = "free" | "paid" | "freemium";
export type Durability = "durable" | "current";
export type Verified = "pending" | "yes" | "no";
export type EdgeKind = "depends_on" | "related";

export interface Area {
  id: string;
  label: string;
  color: AreaColor;
  order: number;
  blurb: string;
}

export interface Resource {
  title: string;
  author: string;
  year: number;
  type: ResourceType;
  link: string;
  why: string;
  difficulty: Difficulty;
  cost: Cost;
  durability: Durability;
  verified: Verified;
  verified_at?: string | null;
}

export interface RoadmapNode {
  id: string;
  label: string;
  area: string;
  tier: Tier;
  summary: string;
  competent_means: string;
  aliases?: string[];
  resources: Resource[];
}

export interface Edge {
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface Graph {
  version: number;
  generated_by: string;
  areas: Area[];
  nodes: RoadmapNode[];
  edges: Edge[];
}
