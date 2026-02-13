import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { auth } from "./auth";

export type Role =
    | "super_admin"
    | "exam_controller"
    | "academic_officer"
    | "school_principal"
    | "school_staff"
    | "data_entry";

// Role hierarchy for permission checking
const ROLE_LEVELS: Record<Role, number> = {
    super_admin: 100,
    exam_controller: 80,
    academic_officer: 70,
    school_principal: 60,
    school_staff: 40,
    data_entry: 30,
};

export async function getAuthUserId(ctx: QueryCtx | MutationCtx) {
    const identity = await auth.getUserId(ctx);
    return identity;
}

export async function getUserProfile(ctx: QueryCtx | MutationCtx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

    return profile;
}

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        throw new Error("Authentication required");
    }
    return userId;
}

export async function requireRole(
    ctx: QueryCtx | MutationCtx,
    ...allowedRoles: Role[]
) {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

    if (!profile) {
        throw new Error("User profile not found. Please contact admin.");
    }

    if (!profile.isActive) {
        throw new Error("Account is deactivated. Please contact admin.");
    }

    if (!allowedRoles.includes(profile.role as Role)) {
        throw new Error(
            `Access denied. Required role: ${allowedRoles.join(" or ")}`
        );
    }

    return { userId, profile };
}

export async function requireSchoolAccess(
    ctx: QueryCtx | MutationCtx,
    schoolId: Id<"schools">
) {
    const userId = await requireAuth(ctx);
    const profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .first();

    if (!profile) {
        throw new Error("User profile not found");
    }

    // Super admin and exam controller can access all schools
    if (
        profile.role === "super_admin" ||
        profile.role === "exam_controller" ||
        profile.role === "academic_officer"
    ) {
        return { userId, profile };
    }

    // School-level roles can only access their own school
    if (profile.schoolId !== schoolId) {
        throw new Error("Access denied. You can only access your assigned school.");
    }

    return { userId, profile };
}

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
    return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

// GPA calculation helper
export function calculateGPA(percentage: number): { gpa: number; grade: string } {
    if (percentage >= 90) return { gpa: 4.0, grade: "A+" };
    if (percentage >= 80) return { gpa: 3.7, grade: "A" };
    if (percentage >= 70) return { gpa: 3.3, grade: "A-" };
    if (percentage >= 65) return { gpa: 3.0, grade: "B+" };
    if (percentage >= 60) return { gpa: 2.7, grade: "B" };
    if (percentage >= 55) return { gpa: 2.3, grade: "B-" };
    if (percentage >= 50) return { gpa: 2.0, grade: "C+" };
    if (percentage >= 45) return { gpa: 1.7, grade: "C" };
    if (percentage >= 40) return { gpa: 1.3, grade: "D" };
    return { gpa: 0.0, grade: "F" };
}

// Generate unique IDs
export function generateBoardRegId(schoolRegNo: string, year: number): string {
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EBRR-${year}-${schoolRegNo}-${suffix}`;
}

export function generateCertificateId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${timestamp}-${random}`;
}

export function generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export function generateRollNumber(
    examType: string,
    year: string,
    seq: number
): string {
    const prefix = examType.substring(0, 3).toUpperCase();
    return `${prefix}-${year}-${seq.toString().padStart(5, "0")}`;
}
