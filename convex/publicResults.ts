import { query } from "./_generated/server";
import { v } from "convex/values";

// Public result lookup (no auth required)
export const searchResult = query({
    args: {
        boardRegId: v.optional(v.string()),
        rollNumber: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (args.rollNumber) {
            const summary = await ctx.db
                .query("resultSummaries")
                .withIndex("by_rollNumber", (q) =>
                    q.eq("rollNumber", args.rollNumber!)
                )
                .first();

            if (!summary || !summary.isPublished) return null;

            const student = await ctx.db.get(summary.studentId);
            const examSession = await ctx.db.get(summary.examSessionId);

            // Get individual marks
            const results = await ctx.db
                .query("examResults")
                .withIndex("by_student_exam", (q) =>
                    q
                        .eq("studentId", summary.studentId)
                        .eq("examSessionId", summary.examSessionId)
                )
                .collect();

            const publishedResults = results.filter(
                (r) => r.status === "published"
            );

            const subjectMarks = await Promise.all(
                publishedResults.map(async (r) => {
                    const subject = await ctx.db.get(r.subjectId);
                    return {
                        subjectName: subject?.name ?? "Unknown",
                        subjectCode: subject?.code ?? "",
                        fullMarks: subject?.fullMarks ?? 0,
                        passMarks: subject?.passMarks ?? 0,
                        marksObtained: r.marksObtained,
                        isAbsent: r.isAbsent,
                    };
                })
            );

            const school = student ? await ctx.db.get(student.schoolId) : null;

            return {
                studentName: student
                    ? `${student.firstName} ${student.lastName}`
                    : "Unknown",
                boardRegId: student?.boardRegId ?? "",
                schoolName: school?.name ?? "",
                rollNumber: summary.rollNumber,
                examSessionName: examSession?.name ?? "",
                examType: examSession?.type ?? "",
                totalMarks: summary.totalMarks,
                obtainedMarks: summary.obtainedMarks,
                percentage: summary.percentage,
                gpa: summary.gpa,
                grade: summary.grade,
                passStatus: summary.passStatus,
                verificationCode: summary.verificationCode,
                publishedAt: summary.publishedAt,
                subjectMarks,
            };
        }

        if (args.boardRegId) {
            const student = await ctx.db
                .query("students")
                .withIndex("by_boardRegId", (q) =>
                    q.eq("boardRegId", args.boardRegId!)
                )
                .first();

            if (!student) return null;

            const summaries = await ctx.db
                .query("resultSummaries")
                .withIndex("by_studentId", (q) => q.eq("studentId", student._id))
                .collect();

            const publishedSummaries = summaries.filter((s) => s.isPublished);

            const school = await ctx.db.get(student.schoolId);

            return publishedSummaries.map((s) => ({
                studentName: `${student.firstName} ${student.lastName}`,
                boardRegId: student.boardRegId,
                schoolName: school?.name ?? "",
                rollNumber: s.rollNumber,
                totalMarks: s.totalMarks,
                obtainedMarks: s.obtainedMarks,
                percentage: s.percentage,
                gpa: s.gpa,
                grade: s.grade,
                passStatus: s.passStatus,
                verificationCode: s.verificationCode,
                publishedAt: s.publishedAt,
            }));
        }

        return null;
    },
});

// Verify result by verification code
export const verifyResult = query({
    args: { verificationCode: v.string() },
    handler: async (ctx, args) => {
        const summary = await ctx.db
            .query("resultSummaries")
            .withIndex("by_verificationCode", (q) =>
                q.eq("verificationCode", args.verificationCode)
            )
            .first();

        if (!summary || !summary.isPublished) return null;

        const student = await ctx.db.get(summary.studentId);
        const examSession = await ctx.db.get(summary.examSessionId);
        const school = student ? await ctx.db.get(student.schoolId) : null;

        return {
            verified: true,
            studentName: student
                ? `${student.firstName} ${student.lastName}`
                : "Unknown",
            boardRegId: student?.boardRegId ?? "",
            schoolName: school?.name ?? "",
            examSession: examSession?.name ?? "",
            gpa: summary.gpa,
            grade: summary.grade,
            passStatus: summary.passStatus,
            publishedAt: summary.publishedAt,
        };
    },
});
