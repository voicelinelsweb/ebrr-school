import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
    ...authTables,

    // ─── User profiles (extends auth users) ───
    userProfiles: defineTable({
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
        isActive: v.boolean(),
        phone: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_email", ["email"])
        .index("by_role", ["role"])
        .index("by_schoolId", ["schoolId"]),

    // ─── Schools ───
    schools: defineTable({
        name: v.string(),
        registrationNo: v.string(),
        type: v.union(
            v.literal("primary"),
            v.literal("middle"),
            v.literal("high")
        ),
        campBlock: v.string(),
        principalName: v.string(),
        yearEstablished: v.number(),
        totalStudents: v.number(),
        totalTeachers: v.number(),
        status: v.union(
            v.literal("active"),
            v.literal("under_review"),
            v.literal("suspended")
        ),
        contactInfo: v.optional(v.string()),
        address: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_registrationNo", ["registrationNo"])
        .index("by_type", ["type"])
        .index("by_campBlock", ["campBlock"])
        .index("by_status", ["status"]),

    // ─── Students ───
    students: defineTable({
        boardRegId: v.string(),
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
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_boardRegId", ["boardRegId"])
        .index("by_schoolId", ["schoolId"])
        .index("by_gradeLevel", ["gradeLevel"])
        .index("by_enrollmentYear", ["enrollmentYear"]),

    // ─── Guardians ───
    guardians: defineTable({
        studentId: v.id("students"),
        name: v.string(),
        relation: v.string(),
        contactInfo: v.optional(v.string()),
        address: v.optional(v.string()),
    }).index("by_studentId", ["studentId"]),

    // ─── Academic Years ───
    academicYears: defineTable({
        year: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        status: v.union(
            v.literal("active"),
            v.literal("completed"),
            v.literal("upcoming")
        ),
        createdAt: v.number(),
    })
        .index("by_year", ["year"])
        .index("by_status", ["status"]),

    // ─── Subjects ───
    subjects: defineTable({
        name: v.string(),
        code: v.string(),
        gradeLevel: v.string(),
        fullMarks: v.number(),
        passMarks: v.number(),
        createdAt: v.number(),
    })
        .index("by_code", ["code"])
        .index("by_gradeLevel", ["gradeLevel"]),

    // ─── Exam Sessions ───
    examSessions: defineTable({
        name: v.string(),
        type: v.union(
            v.literal("annual"),
            v.literal("midterm"),
            v.literal("special")
        ),
        academicYearId: v.id("academicYears"),
        startDate: v.string(),
        endDate: v.string(),
        status: v.union(
            v.literal("scheduled"),
            v.literal("ongoing"),
            v.literal("completed"),
            v.literal("results_published")
        ),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_academicYearId", ["academicYearId"])
        .index("by_status", ["status"])
        .index("by_type", ["type"]),

    // ─── Exam Results (individual marks) ───
    examResults: defineTable({
        studentId: v.id("students"),
        examSessionId: v.id("examSessions"),
        subjectId: v.id("subjects"),
        marksObtained: v.number(),
        isAbsent: v.boolean(),
        submittedBy: v.optional(v.id("users")),
        submittedAt: v.optional(v.number()),
        approvedBy: v.optional(v.id("users")),
        approvedAt: v.optional(v.number()),
        status: v.union(
            v.literal("draft"),
            v.literal("submitted"),
            v.literal("approved"),
            v.literal("rejected"),
            v.literal("published")
        ),
    })
        .index("by_studentId", ["studentId"])
        .index("by_examSessionId", ["examSessionId"])
        .index("by_student_exam", ["studentId", "examSessionId"])
        .index("by_status", ["status"]),

    // ─── Result Summaries (aggregated per student per exam) ───
    resultSummaries: defineTable({
        studentId: v.id("students"),
        examSessionId: v.id("examSessions"),
        totalMarks: v.number(),
        obtainedMarks: v.number(),
        percentage: v.number(),
        gpa: v.number(),
        grade: v.string(),
        passStatus: v.union(v.literal("pass"), v.literal("fail")),
        rollNumber: v.string(),
        verificationCode: v.string(),
        isPublished: v.boolean(),
        publishedAt: v.optional(v.number()),
        createdAt: v.number(),
    })
        .index("by_studentId", ["studentId"])
        .index("by_examSessionId", ["examSessionId"])
        .index("by_rollNumber", ["rollNumber"])
        .index("by_verificationCode", ["verificationCode"])
        .index("by_student_exam", ["studentId", "examSessionId"]),

    // ─── Certificates ───
    certificates: defineTable({
        studentId: v.id("students"),
        examSessionId: v.id("examSessions"),
        certificateId: v.string(),
        qrCode: v.string(),
        type: v.union(
            v.literal("marksheet"),
            v.literal("completion"),
            v.literal("merit")
        ),
        issuedBy: v.optional(v.id("users")),
        issuedAt: v.number(),
        isRevoked: v.boolean(),
    })
        .index("by_studentId", ["studentId"])
        .index("by_certificateId", ["certificateId"])
        .index("by_examSessionId", ["examSessionId"]),

    // ─── News ───
    news: defineTable({
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
        publishedAt: v.optional(v.number()),
        scheduledAt: v.optional(v.number()),
        imageUrl: v.optional(v.string()),
        authorId: v.optional(v.id("users")),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_category", ["category"])
        .index("by_isPublished", ["isPublished"])
        .index("by_isUrgent", ["isUrgent"]),

    // ─── Events ───
    events: defineTable({
        title: v.string(),
        description: v.string(),
        date: v.string(),
        endDate: v.optional(v.string()),
        type: v.union(
            v.literal("examination"),
            v.literal("academic"),
            v.literal("training"),
            v.literal("meeting"),
            v.literal("deadline"),
            v.literal("holiday")
        ),
        isPublished: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_date", ["date"])
        .index("by_type", ["type"])
        .index("by_isPublished", ["isPublished"]),

    // ─── Contact Messages ───
    contactMessages: defineTable({
        name: v.string(),
        email: v.string(),
        subject: v.string(),
        message: v.string(),
        isRead: v.boolean(),
        createdAt: v.number(),
    }).index("by_isRead", ["isRead"]),

    // ─── Audit Logs ───
    auditLogs: defineTable({
        userId: v.optional(v.id("users")),
        userName: v.optional(v.string()),
        action: v.string(),
        tableName: v.string(),
        recordId: v.optional(v.string()),
        details: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_tableName", ["tableName"])
        .index("by_createdAt", ["createdAt"]),

    // ─── FAQs ───
    faqs: defineTable({
        question: v.string(),
        answer: v.string(),
        category: v.string(),
        order: v.number(),
        isPublished: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_category", ["category"])
        .index("by_isPublished", ["isPublished"]),
});

export default schema;
