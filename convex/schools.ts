import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./helpers";

export const list = query({
    args: {
        type: v.optional(
            v.union(v.literal("primary"), v.literal("middle"), v.literal("high"))
        ),
        campBlock: v.optional(v.string()),
        status: v.optional(
            v.union(
                v.literal("active"),
                v.literal("under_review"),
                v.literal("suspended")
            )
        ),
    },
    handler: async (ctx, args) => {
        let q: any = ctx.db.query("schools");

        if (args.type) {
            q = q.withIndex("by_type", (i: any) => i.eq("type", args.type!));
        } else if (args.status) {
            q = q.withIndex("by_status", (i: any) => i.eq("status", args.status!));
        } else if (args.campBlock) {
            q = q.withIndex("by_campBlock", (i: any) =>
                i.eq("campBlock", args.campBlock!)
            );
        }

        return await q.collect();
    },
});

export const getById = query({
    args: { id: v.id("schools") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const listPublic = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("schools")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        registrationNo: v.string(),
        type: v.union(v.literal("primary"), v.literal("middle"), v.literal("high")),
        campBlock: v.string(),
        principalName: v.string(),
        yearEstablished: v.number(),
        totalStudents: v.number(),
        totalTeachers: v.number(),
        contactInfo: v.optional(v.string()),
        address: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");

        const existing = await ctx.db
            .query("schools")
            .withIndex("by_registrationNo", (q) =>
                q.eq("registrationNo", args.registrationNo)
            )
            .first();
        if (existing) {
            throw new Error("School with this registration number already exists");
        }

        return await ctx.db.insert("schools", {
            ...args,
            status: "under_review",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("schools"),
        name: v.optional(v.string()),
        principalName: v.optional(v.string()),
        totalStudents: v.optional(v.number()),
        totalTeachers: v.optional(v.number()),
        contactInfo: v.optional(v.string()),
        address: v.optional(v.string()),
        campBlock: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "academic_officer",
            "school_principal"
        );
        const { id, ...updates } = args;
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, v]) => v !== undefined)
        );
        await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("schools"),
        status: v.union(
            v.literal("active"),
            v.literal("under_review"),
            v.literal("suspended")
        ),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin");
        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: Date.now(),
        });
    },
});
