"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
    BookOpen, CheckCircle, XCircle, BarChart3, Play, Clock
} from "lucide-react";

export default function ExamSessionDetailPage() {
    const params = useParams();
    const sessionId = params.id as string;

    const session = useQuery(api.examinations.listExamSessions, {});
    const academicYears = useQuery(api.examinations.listAcademicYears);
    const results = useQuery(api.results.listByExamSession, { examSessionId: sessionId as any });
    const approveMarks = useMutation(api.results.approveMarks);
    const rejectMarks = useMutation(api.results.rejectMarks);
    const publishResults = useMutation(api.results.publishResults);
    const updateStatus = useMutation(api.examinations.updateExamSessionStatus);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const currentSession = session?.find((s: any) => s._id === sessionId);
    const yearName = academicYears?.find((y: any) => y._id === currentSession?.academicYearId)?.year;

    if (!currentSession) {
        return <div className="loading"><div className="loading-spinner" /></div>;
    }

    const submitted = results?.filter((r: any) => r.status === "submitted") ?? [];
    const approved = results?.filter((r: any) => r.status === "approved") ?? [];
    const rejected = results?.filter((r: any) => r.status === "rejected") ?? [];
    const published = results?.filter((r: any) => r.status === "published") ?? [];

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleApprove = async () => {
        if (selectedIds.length === 0) return;
        try {
            await approveMarks({ resultIds: selectedIds as any });
            setSelectedIds([]);
        } catch (err: any) { alert(err.message); }
    };

    const handleReject = async () => {
        if (selectedIds.length === 0) return;
        try {
            await rejectMarks({ resultIds: selectedIds as any });
            setSelectedIds([]);
        } catch (err: any) { alert(err.message); }
    };

    const handlePublish = async () => {
        if (!confirm("Publish results for this exam session? This will calculate GPAs and generate summaries.")) return;
        try {
            await publishResults({ examSessionId: sessionId as any });
        } catch (err: any) { alert(err.message); }
    };

    const statusConfig: Record<string, { color: string; bg: string }> = {
        scheduled: { color: "#2563EB", bg: "#DBEAFE" },
        ongoing: { color: "#D97706", bg: "#FEF3C7" },
        completed: { color: "var(--color-accent-700)", bg: "var(--color-accent-50)" },
        results_published: { color: "#7C3AED", bg: "#EDE9FE" },
    };

    const sc = statusConfig[currentSession.status] || statusConfig.scheduled;

    return (
        <>
            <div className="breadcrumb">
                <Link href="/dashboard/examinations">Examinations</Link>
                <span>/</span>
                <span>{currentSession.name}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>{currentSession.name}</h1>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>{currentSession.status.replace(/_/g, " ")}</span>
                        <span className="status-badge" style={{ background: "var(--color-neutral-100)", color: "var(--color-neutral-600)", textTransform: "capitalize" }}>{currentSession.type}</span>
                        {yearName && <span style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)" }}>Academic Year: {yearName}</span>}
                    </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    {currentSession.status === "scheduled" && <button className="btn btn-accent btn-sm" onClick={() => updateStatus({ id: sessionId as any, status: "ongoing" })}><Play size={14} /> Start Exam</button>}
                    {currentSession.status === "ongoing" && <button className="btn btn-primary btn-sm" onClick={() => updateStatus({ id: sessionId as any, status: "completed" })}><CheckCircle size={14} /> Mark Complete</button>}
                    {currentSession.status === "completed" && <button className="btn btn-accent btn-sm" onClick={handlePublish}><BarChart3 size={14} /> Publish Results</button>}
                </div>
            </div>

            {/* Session Info */}
            <div className="dash-stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: "24px" }}>
                <div className="dash-stat-card">
                    <div className="value" style={{ color: "#2563EB" }}>{submitted.length}</div>
                    <div className="label">Submitted</div>
                </div>
                <div className="dash-stat-card">
                    <div className="value" style={{ color: "var(--color-accent-600)" }}>{approved.length}</div>
                    <div className="label">Approved</div>
                </div>
                <div className="dash-stat-card">
                    <div className="value" style={{ color: "#DC2626" }}>{rejected.length}</div>
                    <div className="label">Rejected</div>
                </div>
                <div className="dash-stat-card">
                    <div className="value" style={{ color: "#7C3AED" }}>{published.length}</div>
                    <div className="label">Published</div>
                </div>
            </div>

            {/* Date info */}
            <div className="card" style={{ marginBottom: "24px", padding: "16px 24px" }}>
                <div style={{ display: "flex", gap: "32px", fontSize: "0.9rem" }}>
                    <div><strong>Start Date:</strong> {currentSession.startDate}</div>
                    <div><strong>End Date:</strong> {currentSession.endDate}</div>
                    <div><strong>Total Marks Entries:</strong> {results?.length ?? 0}</div>
                </div>
            </div>

            {/* Batch Actions */}
            {submitted.length > 0 && (
                <div className="card" style={{ marginBottom: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.1rem" }}>Pending Review ({submitted.length})</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button className="btn btn-accent btn-sm" onClick={handleApprove} disabled={selectedIds.length === 0}>
                                <CheckCircle size={14} /> Approve ({selectedIds.length})
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={handleReject} disabled={selectedIds.length === 0}>
                                <XCircle size={14} /> Reject ({selectedIds.length})
                            </button>
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table>
                            <thead><tr><th style={{ width: "40px" }}><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? submitted.map((r: any) => r._id) : [])} checked={selectedIds.length === submitted.length && submitted.length > 0} /></th><th>Student ID</th><th>Subject ID</th><th>Marks</th><th>Absent</th><th>Submitted</th></tr></thead>
                            <tbody>
                                {submitted.map((r: any) => (
                                    <tr key={r._id}>
                                        <td><input type="checkbox" checked={selectedIds.includes(r._id)} onChange={() => toggleSelect(r._id)} /></td>
                                        <td><code style={{ fontSize: "0.8rem" }}>{String(r.studentId).slice(0, 12)}...</code></td>
                                        <td><code style={{ fontSize: "0.8rem" }}>{String(r.subjectId).slice(0, 12)}...</code></td>
                                        <td><strong>{r.marksObtained}</strong></td>
                                        <td>{r.isAbsent ? <span style={{ color: "#DC2626" }}>Yes</span> : "No"}</td>
                                        <td style={{ fontSize: "0.8rem" }}>{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Results */}
            {results && results.length > 0 && submitted.length === 0 && (
                <div className="card">
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>All Marks ({results.length})</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead><tr><th>Student ID</th><th>Subject ID</th><th>Marks</th><th>Absent</th><th>Status</th></tr></thead>
                            <tbody>
                                {results.map((r: any) => (
                                    <tr key={r._id}>
                                        <td><code style={{ fontSize: "0.8rem" }}>{String(r.studentId).slice(0, 12)}...</code></td>
                                        <td><code style={{ fontSize: "0.8rem" }}>{String(r.subjectId).slice(0, 12)}...</code></td>
                                        <td><strong>{r.marksObtained}</strong></td>
                                        <td>{r.isAbsent ? <span style={{ color: "#DC2626" }}>Yes</span> : "No"}</td>
                                        <td><span className={`status-badge ${r.status === "approved" ? "status-active" : r.status === "rejected" ? "status-suspended" : r.status === "published" ? "status-pass" : "status-pending"}`}>{r.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
