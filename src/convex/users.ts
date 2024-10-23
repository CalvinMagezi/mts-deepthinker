import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrUpdateUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    thinkingStyle: v.optional(v.string()),
    aiInteraction: v.optional(v.string()),
    ip: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const userData = {
      email: args.email,
      name: args.name,
      role: args.role,
      interests: args.interests,
      thinkingStyle: args.thinkingStyle,
      aiInteraction: args.aiInteraction,
      lastLoginAt: Date.now(),
      tokenUsage: 0,
      lastTokenResetDate: Date.now(),
      lastLoginIp: args.ip,
      clerkId: args.clerkId,
    };

    if (existingUser) {
      return await ctx.db.patch(existingUser._id, {
        ...userData,
        onboardingCompleted: !!args.aiInteraction,
      });
    } else {
      return await ctx.db.insert("users", {
        ...userData,
        onboardingCompleted: false,
      });
    }
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

export const updateOnboardingStep = mutation({
  args: {
    clerkId: v.string(),
    step: v.string(),
    value: v.any(),
  },
  handler: async (ctx, { clerkId, step, value }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const update = { [step]: value };
    if (step === "aiInteraction") {
      update.onboardingCompleted = true;
    }

    return await ctx.db.patch(user._id, update);
  },
});

export const getTokenUsage = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      // Instead of throwing an error, return null
      return null;
    }

    const currentDate = new Date();
    const lastResetDate = new Date(user.lastTokenResetDate);

    if (
      currentDate.getMonth() !== lastResetDate.getMonth() ||
      currentDate.getFullYear() !== lastResetDate.getFullYear()
    ) {
      // We can't modify the database in a query function, so we'll just return 0
      // The actual reset will happen in the next mutation that updates token usage
      return 0;
    }

    return user.tokenUsage;
  },
});

export const updateTokenUsage = mutation({
  args: {
    clerkId: v.string(),
    tokensUsed: v.number(),
  },
  handler: async (ctx, { clerkId, tokensUsed }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentDate = new Date();
    const lastResetDate = new Date(user.lastTokenResetDate);
    let newTokenUsage = user.tokenUsage + tokensUsed;

    if (
      currentDate.getMonth() !== lastResetDate.getMonth() ||
      currentDate.getFullYear() !== lastResetDate.getFullYear()
    ) {
      newTokenUsage = tokensUsed;
    }

    return await ctx.db.patch(user._id, {
      tokenUsage: newTokenUsage,
      lastTokenResetDate: currentDate.getTime(),
    });
  },
});
