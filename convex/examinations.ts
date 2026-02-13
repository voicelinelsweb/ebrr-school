import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole } from "./helpers";

// ─── Academic Years ───
export const listAcademicYears = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("academicYears").order("desc").collect();
    },
});

export const createAcademicYear = mutation({
    args: {
        year: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("completed"),
            v.literal("upcoming")
        ),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        return await ctx.db.insert("academicYears", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

// ─── Subjects ───
export const listSubjects = query({
    args: { gradeLevel: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.gradeLevel) {
            return await ctx.db
                .query("subjects")
                .withIndex("by_gradeLevel", (q) =>
                    q.eq("gradeLevel", args.gradeLevel!)
                )
                .collect();
        }
        return await ctx.db.query("subjects").collect();
    },
});

export const createSubject = mutation({
    args: {
        name: v.string(),
        code: v.string(),
        gradeLevel: v.string(),
        fullMarks: v.number(),
        passMarks: v.number(),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");
        return await ctx.db.insert("subjects", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

// ─── Exam Sessions ───
export const listExamSessions = query({
    args: {
        academicYearId: v.optional(v.id("academicYears")),
        status: v.optional(
            v.union(
                v.literal("scheduled"),
                v.literal("ongoing"),
                v.literal("completed"),
                v.literal("results_published")
            )
        ),
    },
    handler: async (ctx, args) => {
        if (args.academicYearId) {
            return await ctx.db
                .query("examSessions")
                .withIndex("by_academicYearId", (q) =>
                    q.eq("academicYearId", args.academicYearId!)
                )
                .collect();
        }
        if (args.status) {
            return await ctx.db
                .query("examSessions")
                .withIndex("by_status", (q) => q.eq("status", args.status!))
                .collect();
        }
        return await ctx.db.query("examSessions").order("desc").collect();
    },
});

export const createExamSession = mutation({
    args: {
        name: v.string(),
        type: v.union(
            v.literal("annual"),
            v.literal("midterm"),
            v.literal("special")
        ),
        academicYearId: v.id("academicYears"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller");
        return await ctx.db.insert("examSessions", {
            ...args,
            status: "scheduled",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});

export const updateExamSessionStatus = mutation({
    args: {
        id: v.id("examSessions"),
        status: v.union(
            v.literal("scheduled"),
            v.literal("ongoing"),
            v.literal("completed"),
            v.literal("results_published")
        ),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller");
        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: Date.now(),
        });
    },
});

export const countExamSessions = query({
    args: {},
    handler: async (ctx) => {
        const sessions = await ctx.db.query("examSessions").collect();
        return sessions.length;
    },
});
