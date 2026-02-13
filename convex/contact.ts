import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./helpers";

export const submit = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("contactMessages", {
            ...args,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});

export const list = query({
    args: {
        unreadOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        if (args.unreadOnly) {
            return await ctx.db
                .query("contactMessages")
                .withIndex("by_isRead", (q) => q.eq("isRead", false))
                .order("desc")
                .collect();
        }
        return await ctx.db.query("contactMessages").order("desc").collect();
    },
});

export const markRead = mutation({
    args: { id: v.id("contactMessages") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        await ctx.db.patch(args.id, { isRead: true });
    },
});

// ─── FAQs ───
export const listFaqs = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("faqs")
            .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
            .collect();
    },
});

export const createFaq = mutation({
    args: {
        question: v.string(),
        answer: v.string(),
        category: v.string(),
        order: v.number(),
        isPublished: v.boolean(),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        return await ctx.db.insert("faqs", {
            ...args,
            createdAt: Date.now(),
        });
    },
});
