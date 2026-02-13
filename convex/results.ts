import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
    requireRole,
    calculateGPA,
    generateVerificationCode,
    generateRollNumber,
} from "./helpers";

// Submit marks for a student
export const submitMarks = mutation({
    args: {
        studentId: v.id("students"),
        examSessionId: v.id("examSessions"),
        subjectId: v.id("subjects"),
        marksObtained: v.number(),
        isAbsent: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { userId } = await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "school_principal",
            "school_staff",
            "data_entry"
        );

        // Check for duplicate
        const existing = await ctx.db
            .query("examResults")
            .withIndex("by_student_exam", (q) =>
                q.eq("studentId", args.studentId).eq("examSessionId", args.examSessionId)
            )
            .collect();

        const duplicate = existing.find(
            (r) => r.subjectId === args.subjectId && r.status !== "rejected"
        );
        if (duplicate) {
            throw new Error("Marks already submitted for this student-subject-exam.");
        }

        return await ctx.db.insert("examResults", {
            ...args,
            submittedBy: userId,
            submittedAt: Date.now(),
            status: "submitted",
        });
    },
});

// List marks for an exam session
export const listByExamSession = query({
    args: { examSessionId: v.id("examSessions") },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "school_principal",
            "school_staff",
            "data_entry"
        );
        return await ctx.db
            .query("examResults")
            .withIndex("by_examSessionId", (q) =>
                q.eq("examSessionId", args.examSessionId)
            )
            .collect();
    },
});

// Approve marks
export const approveMarks = mutation({
    args: {
        resultIds: v.array(v.id("examResults")),
    },
    handler: async (ctx, args) => {
        const { userId } = await requireRole(
            ctx,
            "super_admin",
            "exam_controller"
        );

        for (const id of args.resultIds) {
            const result = await ctx.db.get(id);
            if (result && result.status === "submitted") {
                await ctx.db.patch(id, {
                    status: "approved",
                    approvedBy: userId,
                    approvedAt: Date.now(),
                });
            }
        }
    },
});

// Reject marks
export const rejectMarks = mutation({
    args: {
        resultIds: v.array(v.id("examResults")),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller");
        for (const id of args.resultIds) {
            await ctx.db.patch(id, { status: "rejected" });
        }
    },
});

// Generate and publish result summaries
export const publishResults = mutation({
    args: {
        examSessionId: v.id("examSessions"),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller");

        const examSession = await ctx.db.get(args.examSessionId);
        if (!examSession) throw new Error("Exam session not found");

        // Get all approved results for this exam
        const results = await ctx.db
            .query("examResults")
            .withIndex("by_examSessionId", (q) =>
                q.eq("examSessionId", args.examSessionId)
            )
            .collect();

        const approvedResults = results.filter((r) => r.status === "approved");

        // Group by student
        const studentResults: Record<string, typeof approvedResults> = {};
        for (const result of approvedResults) {
            const key = result.studentId;
            if (!studentResults[key]) studentResults[key] = [];
            studentResults[key].push(result);
        }

        let seq = 1;
        const academicYear = await ctx.db.get(examSession.academicYearId);
        const yearStr = academicYear?.year || "2025";

        for (const [studentId, marks] of Object.entries(studentResults)) {
            // Calculate totals
            let totalMarks = 0;
            let obtainedMarks = 0;
            let allPassed = true;

            for (const mark of marks) {
                const subject = await ctx.db.get(mark.subjectId);
                if (subject) {
                    totalMarks += subject.fullMarks;
                    obtainedMarks += mark.isAbsent ? 0 : mark.marksObtained;
                    if (mark.isAbsent || mark.marksObtained < subject.passMarks) {
                        allPassed = false;
                    }
                }
            }

            const percentage =
                totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
            const { gpa, grade } = calculateGPA(percentage);

            const rollNumber = generateRollNumber(
                examSession.type,
                yearStr,
                seq++
            );

            // Check for existing summary
            const existingSummary = await ctx.db
                .query("resultSummaries")
                .withIndex("by_student_exam", (q) =>
                    q
                        .eq("studentId", studentId as any)
                        .eq("examSessionId", args.examSessionId)
                )
                .first();

            if (existingSummary) {
                await ctx.db.patch(existingSummary._id, {
                    totalMarks,
                    obtainedMarks,
                    percentage: Math.round(percentage * 100) / 100,
                    gpa,
                    grade,
                    passStatus: allPassed ? "pass" : "fail",
                    isPublished: true,
                    publishedAt: Date.now(),
                });
            } else {
                await ctx.db.insert("resultSummaries", {
                    studentId: studentId as any,
                    examSessionId: args.examSessionId,
                    totalMarks,
                    obtainedMarks,
                    percentage: Math.round(percentage * 100) / 100,
                    gpa,
                    grade,
                    passStatus: allPassed ? "pass" : "fail",
                    rollNumber,
                    verificationCode: generateVerificationCode(),
                    isPublished: true,
                    publishedAt: Date.now(),
                    createdAt: Date.now(),
                });
            }

            // Update result statuses to published
            for (const mark of marks) {
                await ctx.db.patch(mark._id, { status: "published" });
            }
        }

        // Update exam session status
        await ctx.db.patch(args.examSessionId, {
            status: "results_published",
            updatedAt: Date.now(),
        });
    },
});

// Get result summaries for dashboard
export const listSummaries = query({
    args: {
        examSessionId: v.optional(v.id("examSessions")),
    },
    handler: async (ctx, args) => {
        await requireRole(
            ctx,
            "super_admin",
            "exam_controller",
            "academic_officer",
            "school_principal"
        );

        if (args.examSessionId) {
            return await ctx.db
                .query("resultSummaries")
                .withIndex("by_examSessionId", (q) =>
                    q.eq("examSessionId", args.examSessionId!)
                )
                .collect();
        }
        return await ctx.db.query("resultSummaries").collect();
    },
});
