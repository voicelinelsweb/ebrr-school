import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
    requireRole,
    requireSchoolAccess,
    generateBoardRegId,
} from "./helpers";

export const list = query({
    args: {
        schoolId: v.optional(v.id("schools")),
        gradeLevel: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "academic_officer",
            "school_principal",
            "school_staff",
            "data_entry"
        );

        if (args.schoolId) {
            return await ctx.db
                .query("students")
                .withIndex("by_schoolId", (q) => q.eq("schoolId", args.schoolId!))
                .collect();
        }

        if (args.gradeLevel) {
            return await ctx.db
                .query("students")
                .withIndex("by_gradeLevel", (q) =>
                    q.eq("gradeLevel", args.gradeLevel!)
                )
                .collect();
        }

        return await ctx.db.query("students").collect();
    },
});

export const getById = query({
    args: { id: v.id("students") },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "academic_officer",
            "school_principal",
            "school_staff",
            "data_entry"
        );
        return await ctx.db.get(args.id);
    },
});

export const getByBoardRegId = query({
    args: { boardRegId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("students")
            .withIndex("by_boardRegId", (q) => q.eq("boardRegId", args.boardRegId))
            .first();
    },
});

export const create = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        dateOfBirth: v.optional(v.string()),
        gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
        schoolId: v.id("schools"),
        gradeLevel: v.string(),
        enrollmentYear: v.number(),
        photoUrl: v.optional(v.string()),
        altIdentification: v.optional(v.string()),
        interruptedHistory: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "school_principal",
            "school_staff",
            "data_entry"
        );

        const school = await ctx.db.get(args.schoolId);
        if (!school) throw new Error("School not found");

        const boardRegId = generateBoardRegId(
            school.registrationNo,
            args.enrollmentYear
        );

        const studentId = await ctx.db.insert("students", {
            ...args,
            boardRegId,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Update school student count
        await ctx.db.patch(args.schoolId, {
            totalStudents: school.totalStudents + 1,
            updatedAt: Date.now(),
        });

        return studentId;
    },
});

export const update = mutation({
    args: {
        id: v.id("students"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        dateOfBirth: v.optional(v.string()),
        gradeLevel: v.optional(v.string()),
        photoUrl: v.optional(v.string()),
        altIdentification: v.optional(v.string()),
        interruptedHistory: v.optional(v.string()),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "school_principal",
            "school_staff",
            "data_entry"
        );
        const { id, ...updates } = args;
        const filtered = Object.fromEntries(
            Object.entries(updates).filter(([, val]) => val !== undefined)
        );
        await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
    },
});

export const transfer = mutation({
    args: {
        studentId: v.id("students"),
        newSchoolId: v.id("schools"),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "academic_officer");

        const student = await ctx.db.get(args.studentId);
        if (!student) throw new Error("Student not found");

        const oldSchool = await ctx.db.get(student.schoolId);
        const newSchool = await ctx.db.get(args.newSchoolId);
        if (!newSchool) throw new Error("Target school not found");

        await ctx.db.patch(args.studentId, {
            schoolId: args.newSchoolId,
            updatedAt: Date.now(),
        });

        if (oldSchool) {
            await ctx.db.patch(student.schoolId, {
                totalStudents: Math.max(0, oldSchool.totalStudents - 1),
                updatedAt: Date.now(),
            });
        }

        await ctx.db.patch(args.newSchoolId, {
            totalStudents: newSchool.totalStudents + 1,
            updatedAt: Date.now(),
        });
    },
});

// Guardian management
export const addGuardian = mutation({
    args: {
        studentId: v.id("students"),
        name: v.string(),
        relation: v.string(),
        contactInfo: v.optional(v.string()),
        address: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "school_principal",
            "school_staff",
            "data_entry"
        );
        return await ctx.db.insert("guardians", args);
    },
});

export const getGuardians = query({
    args: { studentId: v.id("students") },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "school_principal",
            "school_staff",
            "data_entry"
        );
        return await ctx.db
            .query("guardians")
            .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId))
            .collect();
    },
});

export const count = query({
    args: {},
    handler: async (ctx) => {
        const students = await ctx.db.query("students").collect();
        return students.length;
    },
});

export const countByGender = query({
    args: {},
    handler: async (ctx) => {
        const students = await ctx.db.query("students").collect();
        const male = students.filter((s) => s.gender === "male").length;
        const female = students.filter((s) => s.gender === "female").length;
        return { male, female, total: students.length };
    },
});
