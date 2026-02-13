import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./helpers";

export const listPublic = query({
    args: {
        type: v.optional(
            v.union(
                v.literal("examination"),
                v.literal("academic"),
                v.literal("training"),
                v.literal("meeting"),
                v.literal("deadline"),
                v.literal("holiday")
            )
        ),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 20;
        if (args.type) {
            const items = await ctx.db
                .query("events")
                .withIndex("by_type", (q) => q.eq("type", args.type!))
                .order("desc")
                .collect();
            return items.filter((e) => e.isPublished).slice(0, limit);
        }
        const items = await ctx.db
            .query("events")
            .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
            .order("desc")
            .take(limit);
        return items;
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "academic_officer"
        );
        return await ctx.db.query("events").order("desc").collect();
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        date: v.string(),
        endDate: v.optional(v.string()),
        type: v.union(
            v.literal("examination"),
            v.literal("academic"),
            v.literal("training"),
            v.literal("meeting"),
            v.literal("deadline"),
            v.literal("holiday")
        ),
        isPublished: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        return await ctx.db.insert("events", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("events"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        date: v.optional(v.string()),
        endDate: v.optional(v.string()),
        type: v.optional(
            v.union(
                v.literal("examination"),
                v.literal("academic"),
                v.literal("training"),
                v.literal("meeting"),
                v.literal("deadline"),
                v.literal("holiday")
            )
        ),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        const { id, ...updates } = args;
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, val]) => val !== undefined)
        );
        await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
    },
});

export const remove = mutation({
    args: { id: v.id("events") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin");
        await ctx.db.delete(args.id);
    },
});
