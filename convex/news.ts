import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./helpers";

export const listPublic = query({
    args: {
        category: v.optional(
            v.union(
                v.literal("circular"),
                v.literal("policy"),
                v.literal("examination"),
                v.literal("emergency"),
                v.literal("general")
            )
        ),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 20;
        if (args.category) {
            const items = await ctx.db
                .query("news")
                .withIndex("by_category", (q) => q.eq("category", args.category!))
                .order("desc")
                .collect();
            return items.filter((n) => n.isPublished).slice(0, limit);
        }
        const items = await ctx.db
            .query("news")
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
        return await ctx.db.query("news").order("desc").collect();
    },
});

export const getById = query({
    args: { id: v.id("news") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        category: v.union(
            v.literal("circular"),
            v.literal("policy"),
            v.literal("examination"),
            v.literal("emergency"),
            v.literal("general")
        ),
        isUrgent: v.boolean(),
        isPublished: v.boolean(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { userId } = await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "academic_officer"
        );

        return await ctx.db.insert("news", {
            ...args,
            authorId: userId,
            publishedAt: args.isPublished ? Date.now() : undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("news"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        category: v.optional(
            v.union(
                v.literal("circular"),
                v.literal("policy"),
                v.literal("examination"),
                v.literal("emergency"),
                v.literal("general")
            )
        ),
        isUrgent: v.optional(v.boolean()),
        isPublished: v.optional(v.boolean()),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller", "academic_officer");
        const { id, ...updates } = args;
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, val]) => val !== undefined)
        );
        if (updates.isPublished === true) {
            (filtered as any).publishedAt = Date.now();
        }
        await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
    },
});

export const remove = mutation({
    args: { id: v.id("news") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin");
        await ctx.db.delete(args.id);
    },
});
