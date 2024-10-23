import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCanvas = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { userId, name }) => {
    const canvasId = await ctx.db.insert("canvases", {
      userId,
      name,
      createdAt: Date.now(),
      lastModified: Date.now(),
    });
    return canvasId;
  },
});

export const getCanvasesForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("canvases")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
  },
});

export const getCanvas = query({
  args: { canvasId: v.id("canvases") },
  handler: async (ctx, { canvasId }) => {
    return await ctx.db.get(canvasId);
  },
});
