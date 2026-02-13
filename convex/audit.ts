import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./helpers";

export const log = mutation({
    args: {
        action: v.string(),
        tableName: v.string(),
        recordId: v.optional(v.string()),
        details: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        await ctx.db.insert("auditLogs", {
            userId: undefined,
            userName: identity?.name ?? "System",
            action: args.action,
            tableName: args.tableName,
            recordId: args.recordId,
            details: args.details,
            createdAt: Date.now(),
        });
    },
});

export const list = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller");
        const limit = args.limit ?? 50;
        const logs = await ctx.db
            .query("auditLogs")
            .order("desc")
            .take(limit);
        return logs;
    },
});

export const getByTable = query({
    args: {
        tableName: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller");
        const limit = args.limit ?? 50;
        const logs = await ctx.db
            .query("auditLogs")
            .withIndex("by_tableName", (q) => q.eq("tableName", args.tableName))
            .order("desc")
            .take(limit);
        return logs;
    },
});
