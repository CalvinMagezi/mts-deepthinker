import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createThought = mutation({
  args: {
    userId: v.id("users"),
    content: v.string(),
    x: v.number(),
    y: v.number(),
    connections: v.optional(v.array(v.id("thoughts"))),
  },
  handler: async (ctx, { userId, content, x, y, connections }) => {
    return await ctx.db.insert("thoughts", {
      userId,
      content,
      x,
      y,
      connections: connections ?? [],
      createdAt: Date.now(),
    });
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
    return await ctx.db.patch(thoughtId, updates);
  },
});

export const getThoughtsForUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("thoughts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Add your thoughts-related queries and mutations here
