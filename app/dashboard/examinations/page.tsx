"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import {
    BookOpen, Plus, Calendar, ClipboardList, Layers,
    CheckCircle, Clock, Play, BarChart3, Eye
} from "lucide-react";

export default function ExaminationsListPage() {
    const examSessions = useQuery(api.examinations.listExamSessions, {});
    const academicYears = useQuery(api.examinations.listAcademicYears);
    const subjects = useQuery(api.examinations.listSubjects, {});
    const updateStatus = useMutation(api.examinations.updateExamSessionStatus);

    const [activeTab, setActiveTab] = useState<"sessions" | "years" | "subjects">("sessions");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredSessions = examSessions?.filter((s: any) =>
        !filterStatus || s.status === filterStatus
    );

    const getYearName = (yearId: string) =>
        academicYears?.find((y: any) => y._id === yearId)?.year ?? "—";

    const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
        scheduled: { color: "#2563EB", bg: "#DBEAFE", icon: Clock },
        ongoing: { color: "#D97706", bg: "#FEF3C7", icon: Play },
        completed: { color: "var(--color-accent-700)", bg: "var(--color-accent-50)", icon: CheckCircle },
        results_published: { color: "#7C3AED", bg: "#EDE9FE", icon: BarChart3 },
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>Examination Management</h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>
                        Manage exam sessions, academic years, and subjects
                    </p>
                </div>
                {activeTab === "sessions" && (
                    <Link href="/dashboard/examinations/create" className="btn btn-accent"><Plus size={18} /> New Session</Link>
                )}
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button className={`tab ${activeTab === "sessions" ? "active" : ""}`} onClick={() => setActiveTab("sessions")}>
                    <ClipboardList size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
                    Exam Sessions ({examSessions?.length ?? 0})
                </button>
                <button className={`tab ${activeTab === "years" ? "active" : ""}`} onClick={() => setActiveTab("years")}>
                    <Calendar size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
                    Academic Years ({academicYears?.length ?? 0})
                </button>
                <button className={`tab ${activeTab === "subjects" ? "active" : ""}`} onClick={() => setActiveTab("subjects")}>
                    <Layers size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
                    Subjects ({subjects?.length ?? 0})
                </button>
            </div>

            {/* Sessions Tab */}
            {activeTab === "sessions" && (
                <>
                    <div style={{ marginBottom: "16px" }}>
                        <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: "180px" }}>
                            <option value="">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                            <option value="results_published">Results Published</option>
                        </select>
                    </div>

                    {!examSessions ? (
                        <div className="loading"><div className="loading-spinner" /></div>
                    ) : filteredSessions && filteredSessions.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Name</th><th>Type</th><th>Academic Year</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {filteredSessions.map((session: any) => {
                                        const sc = statusConfig[session.status] || statusConfig.scheduled;
                                        const StatusIcon = sc.icon;
                                        return (
                                            <tr key={session._id}>
                                                <td><strong>{session.name}</strong></td>
                                                <td style={{ textTransform: "capitalize" }}>{session.type}</td>
                                                <td>{getYearName(session.academicYearId)}</td>
                                                <td style={{ fontSize: "0.85rem" }}>{session.startDate} → {session.endDate}</td>
                                                <td>
                                                    <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                                                        <StatusIcon size={12} /> {session.status.replace(/_/g, " ")}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "4px" }}>
                                                        <Link href={`/dashboard/examinations/${session._id}`} className="btn btn-ghost btn-sm"><Eye size={14} /></Link>
                                                        {session.status === "scheduled" && (
                                                            <button className="btn btn-accent btn-sm" onClick={() => updateStatus({ id: session._id as any, status: "ongoing" })}><Play size={14} /> Start</button>
                                                        )}
                                                        {session.status === "ongoing" && (
                                                            <button className="btn btn-primary btn-sm" onClick={() => updateStatus({ id: session._id as any, status: "completed" })}><CheckCircle size={14} /> Complete</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state"><BookOpen size={48} /><h3>No exam sessions found</h3></div>
                    )}
                </>
            )}

            {/* Academic Years Tab */}
            {activeTab === "years" && <AcademicYearsTab years={academicYears} />}

            {/* Subjects Tab */}
            {activeTab === "subjects" && <SubjectsTab subjects={subjects} />}
        </>
    );
}

function AcademicYearsTab({ years }: { years: any }) {
    const createYear = useMutation(api.examinations.createAcademicYear);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ year: "", startDate: "", endDate: "", status: "upcoming" as "active" | "completed" | "upcoming" });

    const handleCreate = async () => {
        if (!form.year || !form.startDate || !form.endDate) return;
        try {
            await createYear(form);
            setShowForm(false);
            setForm({ year: "", startDate: "", endDate: "", status: "upcoming" });
        } catch (err: any) { alert(err.message); }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <button className="btn btn-accent btn-sm" onClick={() => setShowForm(!showForm)}><Plus size={14} /> Add Academic Year</button>
            </div>
            {showForm && (
                <div className="card" style={{ marginBottom: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
                        <div className="form-group" style={{ margin: 0 }}><label>Year</label><input className="form-input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2025" /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>Start Date</label><input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>End Date</label><input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>Status</label><select className="form-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as any })}><option value="upcoming">Upcoming</option><option value="active">Active</option><option value="completed">Completed</option></select></div>
                        <button className="btn btn-primary btn-sm" onClick={handleCreate}>Save</button>
                    </div>
                </div>
            )}
            {!years ? <div className="loading"><div className="loading-spinner" /></div> : years.length > 0 ? (
                <div className="table-wrapper"><table>
                    <thead><tr><th>Year</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
                    <tbody>{years.map((y: any) => (
                        <tr key={y._id}><td><strong>{y.year}</strong></td><td>{y.startDate}</td><td>{y.endDate}</td><td><span className={`status-badge ${y.status === "active" ? "status-active" : y.status === "completed" ? "status-pass" : "status-pending"}`}>{y.status}</span></td></tr>
                    ))}</tbody>
                </table></div>
            ) : <div className="empty-state"><Calendar size={48} /><h3>No academic years</h3></div>}
        </>
    );
}

function SubjectsTab({ subjects }: { subjects: any }) {
    const createSubject = useMutation(api.examinations.createSubject);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", code: "", gradeLevel: "", fullMarks: 100, passMarks: 33 });

    const handleCreate = async () => {
        if (!form.name || !form.code || !form.gradeLevel) return;
        try {
            await createSubject(form);
            setShowForm(false);
            setForm({ name: "", code: "", gradeLevel: "", fullMarks: 100, passMarks: 33 });
        } catch (err: any) { alert(err.message); }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                <button className="btn btn-accent btn-sm" onClick={() => setShowForm(!showForm)}><Plus size={14} /> Add Subject</button>
            </div>
            {showForm && (
                <div className="card" style={{ marginBottom: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
                        <div className="form-group" style={{ margin: 0 }}><label>Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mathematics" /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>Code</label><input className="form-input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="MATH" /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>Grade</label><input className="form-input" value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} placeholder="e.g. 5" /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>Full Marks</label><input className="form-input" type="number" value={form.fullMarks} onChange={(e) => setForm({ ...form, fullMarks: parseInt(e.target.value) || 0 })} /></div>
                        <div className="form-group" style={{ margin: 0 }}><label>Pass Marks</label><input className="form-input" type="number" value={form.passMarks} onChange={(e) => setForm({ ...form, passMarks: parseInt(e.target.value) || 0 })} /></div>
                        <button className="btn btn-primary btn-sm" onClick={handleCreate}>Save</button>
                    </div>
                </div>
            )}
            {!subjects ? <div className="loading"><div className="loading-spinner" /></div> : subjects.length > 0 ? (
                <div className="table-wrapper"><table>
                    <thead><tr><th>Code</th><th>Name</th><th>Grade</th><th>Full Marks</th><th>Pass Marks</th></tr></thead>
                    <tbody>{subjects.map((s: any) => (
                        <tr key={s._id}><td><code style={{ background: "var(--color-neutral-100)", padding: "2px 8px", borderRadius: "4px" }}>{s.code}</code></td><td><strong>{s.name}</strong></td><td>Grade {s.gradeLevel}</td><td>{s.fullMarks}</td><td>{s.passMarks}</td></tr>
                    ))}</tbody>
                </table></div>
            ) : <div className="empty-state"><Layers size={48} /><h3>No subjects</h3></div>}
        </>
    );
}
