import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireRole, generateCertificateId } from "./helpers";

export const list = query({
    args: {
        studentId: v.optional(v.id("students")),
    },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin", "exam_controller", "academic_officer");
        if (args.studentId) {
            return await ctx.db
                .query("certificates")
                .withIndex("by_studentId", (q) => q.eq("studentId", args.studentId!))
                .collect();
        }
        return await ctx.db.query("certificates").order("desc").collect();
    },
});

export const generate = mutation({
    args: {
        studentId: v.id("students"),
        examSessionId: v.id("examSessions"),
        type: v.union(
            v.literal("marksheet"),
            v.literal("completion"),
            v.literal("merit")
        ),
    },
    handler: async (ctx, args) => {
        const { userId } = await requireRole(ctx, "super_admin", "exam_controller");

        const certificateId = generateCertificateId();
        const qrCode = `https://ebrr.edu/verify/${certificateId}`;

        return await ctx.db.insert("certificates", {
            studentId: args.studentId,
            examSessionId: args.examSessionId,
            certificateId,
            qrCode,
            type: args.type,
            issuedBy: userId,
            issuedAt: Date.now(),
            isRevoked: false,
        });
    },
});

export const revoke = mutation({
    args: { id: v.id("certificates") },
    handler: async (ctx, args) => {
        await requireRole(ctx, "super_admin");
        await ctx.db.patch(args.id, { isRevoked: true });
    },
});

// Public certificate verification
export const verify = query({
    args: { certificateId: v.string() },
    handler: async (ctx, args) => {
        const cert = await ctx.db
            .query("certificates")
            .withIndex("by_certificateId", (q) =>
                q.eq("certificateId", args.certificateId)
            )
            .first();

        if (!cert) return null;

        const student = await ctx.db.get(cert.studentId);
        const examSession = await ctx.db.get(cert.examSessionId);
        const school = student ? await ctx.db.get(student.schoolId) : null;

        return {
            valid: !cert.isRevoked,
            isRevoked: cert.isRevoked,
            certificateId: cert.certificateId,
            type: cert.type,
            studentName: student
                ? `${student.firstName} ${student.lastName}`
                : "Unknown",
            boardRegId: student?.boardRegId ?? "",
            schoolName: school?.name ?? "",
            examSession: examSession?.name ?? "",
            issuedAt: cert.issuedAt,
        };
    },
});
