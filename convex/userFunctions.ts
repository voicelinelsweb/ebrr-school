import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole, getUserProfile, getAuthUserId } from "./helpers";

// Get current user profile
export const me = query({
    args: {},
    handler: async (ctx) => {
        const profile = await getUserProfile(ctx);
        return profile;
    },
});

// List all users (admin only)
export const list = query({
    args: {},
    handler: async (ctx) => {
        await requireRole(ctx, "super_admin");
        return await ctx.db.query("userProfiles").collect();
    },
});

// Create / assign user profile (admin only)
export const createProfile = mutation({
    args: {
        userId: v.id("users"),
        name: v.string(),
        email: v.string(),
        role: v.union(
            v.literal("super_admin"),
            v.literal("exam_controller"),
            v.literal("academic_officer"),
            v.literal("school_principal"),
            v.literal("school_staff"),
            v.literal("data_entry")
        ),
        schoolId: v.optional(v.id("schools")),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // First profile can be created without auth (bootstrap)
        const existingProfiles = await ctx.db.query("userProfiles").collect();
        if (existingProfiles.length > 0) {
            await requireRole(ctx, "super_admin");
        }

        const existing = await ctx.db
            .query("userProfiles")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            throw new Error("Profile already exists for this user");
        }

        return await ctx.db.insert("userProfiles", {
            userId: args.userId,
            name: args.name,
            email: args.email,
            role: args.role,
            schoolId: args.schoolId,
            phone: args.phone,
            isActive: true,
            createdAt: Date.now(),
        });
    },
});

// Update user role (admin only)
export const updateRole = mutation({
    args: {
        profileId: v.id("userProfiles"),
        role: v.union(
            v.literal("super_admin"),
            v.literal("exam_controller"),
            v.literal("academic_officer"),
            v.literal("school_principal"),
            v.literal("school_staff"),
            v.literal("data_entry")
        ),
        schoolId: v.optional(v.id("schools")),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin");
        await ctx.db.patch(args.profileId, {
            role: args.role,
            schoolId: args.schoolId,
        });
    },
});

// Deactivate user (admin only)
export const toggleActive = mutation({
    args: {
        profileId: v.id("userProfiles"),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin");
        const profile = await ctx.db.get(args.profileId);
        if (!profile) throw new Error("Profile not found");
        await ctx.db.patch(args.profileId, { isActive: !profile.isActive });
    },
});
