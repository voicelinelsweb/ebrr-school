import { query } from "./_generated/server";

// Public statistics (no auth required)
export const getPublicStats = query({
    args: {},
    handler: async (ctx) => {
        const schools = await ctx.db
            .query("schools")
            .withIndex("by_status", (q) => q.eq("status", "active"))
            .collect();

        const students = await ctx.db.query("students").collect();
        const activeStudents = students.filter((s) => s.isActive);

        const examSessions = await ctx.db.query("examSessions").collect();

        const resultSummaries = await ctx.db.query("resultSummaries").collect();
        const publishedResults = resultSummaries.filter((r) => r.isPublished);
        const passedResults = publishedResults.filter(
            (r) => r.passStatus === "pass"
        );

        const maleStudents = activeStudents.filter(
            (s) => s.gender === "male"
        ).length;
        const femaleStudents = activeStudents.filter(
            (s) => s.gender === "female"
        ).length;

        return {
            totalSchools: schools.length,
            totalStudents: activeStudents.length,
            totalExams: examSessions.length,
            passRate:
                publishedResults.length > 0
                    ? Math.round(
                        (passedResults.length / publishedResults.length) * 100
                    )
                    : 0,
            maleStudents,
            femaleStudents,
            genderRatio:
                activeStudents.length > 0
                    ? `${maleStudents}:${femaleStudents}`
                    : "N/A",
        };
    },
});
