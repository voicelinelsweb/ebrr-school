"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
    School,
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    Award,
    MessageSquare,
    FileCheck,
} from "lucide-react";

export default function DashboardHome() {
    const stats = useQuery(api.statistics.getPublicStats);

    return (
        <>
            <h1 className="dashboard-title">Dashboard Overview</h1>

            <div className="dash-stats-grid">
                <div className="dash-stat-card">
                    <div
                        className="icon-box"
                        style={{ background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}
                    >
                        <School size={22} />
                    </div>
                    <div className="value">{stats?.totalSchools ?? "—"}</div>
                    <div className="label">Affiliated Schools</div>
                </div>
                <div className="dash-stat-card">
                    <div
                        className="icon-box"
                        style={{ background: "var(--color-accent-50)", color: "var(--color-accent-600)" }}
                    >
                        <GraduationCap size={22} />
                    </div>
                    <div className="value">{stats?.totalStudents ?? "—"}</div>
                    <div className="label">Registered Students</div>
                </div>
                <div className="dash-stat-card">
                    <div
                        className="icon-box"
                        style={{ background: "#DBEAFE", color: "#2563EB" }}
                    >
                        <BookOpen size={22} />
                    </div>
                    <div className="value">{stats?.totalExams ?? "—"}</div>
                    <div className="label">Examinations</div>
                </div>
                <div className="dash-stat-card">
                    <div
                        className="icon-box"
                        style={{ background: "#FEF3C7", color: "#D97706" }}
                    >
                        <TrendingUp size={22} />
                    </div>
                    <div className="value">
                        {stats?.passRate ? `${stats.passRate}%` : "—"}
                    </div>
                    <div className="label">Pass Rate</div>
                </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid-2" style={{ marginTop: "8px" }}>
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Users
                                size={18}
                                style={{ marginRight: "8px", verticalAlign: "middle" }}
                            />
                            Gender Distribution
                        </h3>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            fontSize: "0.9rem",
                            color: "var(--color-neutral-600)",
                        }}
                    >
                        <div>
                            <strong style={{ fontSize: "1.5rem", color: "var(--color-primary-900)" }}>
                                {stats?.genderRatio?.male ?? "—"}
                            </strong>
                            <div className="text-xs text-muted">Male Students</div>
                        </div>
                        <div>
                            <strong style={{ fontSize: "1.5rem", color: "var(--color-primary-900)" }}>
                                {stats?.genderRatio?.female ?? "—"}
                            </strong>
                            <div className="text-xs text-muted">Female Students</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Award
                                size={18}
                                style={{ marginRight: "8px", verticalAlign: "middle" }}
                            />
                            Quick Actions
                        </h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <a href="/dashboard/students" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                            <GraduationCap size={16} /> Manage Students
                        </a>
                        <a href="/dashboard/results" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                            <FileCheck size={16} /> Manage Results
                        </a>
                        <a href="/dashboard/news" className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }}>
                            <MessageSquare size={16} /> Manage News
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
