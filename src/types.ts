import { Id } from "@/convex/_generated/dataModel";

export type Thought = {
  _id: Id<"thoughts">;
  userId: Id<"users">;
  canvasId: Id<"canvases">;
  content: string;
  x: number;
  y: number;
  createdAt: number;
  lastModified: number;
  connections: Id<"thoughts">[];
};
