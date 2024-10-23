import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    thinkingStyle: v.optional(v.string()),
    aiInteraction: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    lastLoginAt: v.number(),
    lastLoginIp: v.string(),
    clerkId: v.string(),
    tokenUsage: v.number(),
    lastTokenResetDate: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  thoughts: defineTable({
    userId: v.id("users"),
    content: v.string(),
    x: v.number(),
    y: v.number(),
    connections: v.array(v.id("thoughts")),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
});
