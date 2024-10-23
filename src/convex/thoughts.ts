import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Thought } from "../types";

export const createThought = mutation({
  args: {
    clerkId: v.string(),
    canvasId: v.id("canvases"),
    content: v.string(),
    x: v.number(),
    y: v.number(),
    connections: v.optional(v.array(v.id("thoughts"))),
  },
  handler: async (
    ctx,
    { clerkId, canvasId, content, x, y, connections }
  ): Promise<Thought> => {
    // Fetch the Convex user ID using the Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const thoughtId = await ctx.db.insert("thoughts", {
      userId: user._id,
      canvasId,
      content,
      x,
      y,
      connections: connections ?? [],
      createdAt: now,
      lastModified: now,
    });
    return {
      _id: thoughtId,
      userId: user._id,
      canvasId,
      content,
      x,
      y,
      connections: connections ?? [],
      createdAt: now,
      lastModified: now,
    };
  },
});

export const updateThought = mutation({
  args: {
    thoughtId: v.id("thoughts"),
    content: v.optional(v.string()),
    x: v.optional(v.number()),
    y: v.optional(v.number()),
    connections: v.optional(v.array(v.id("thoughts"))),
  },
  handler: async (ctx, { thoughtId, ...updates }) => {
    return await ctx.db.patch(thoughtId, {
      ...updates,
      lastModified: Date.now(),
    });
  },
});

export const getThoughtsForCanvas = query({
  args: { canvasId: v.id("canvases") },
  handler: async (ctx, { canvasId }) => {
    return await ctx.db
      .query("thoughts")
      .withIndex("by_canvasId", (q) => q.eq("canvasId", canvasId))
      .collect();
  },
});
