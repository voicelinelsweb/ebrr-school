"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { BarChart3, Search, Filter, Upload, Eye, CheckCircle, XCircle } from "lucide-react";

export default function ResultsPage() {
    const examSessions = useQuery(api.examinations.listExamSessions, {});
    const summaries = useQuery(api.results.listSummaries, {});
    const submitMarks = useMutation(api.results.submitMarks);

    const [activeTab, setActiveTab] = useState<"summaries" | "submit">("summaries");
    const [filterSession, setFilterSession] = useState("");
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    // Submit marks form state
    const [markForm, setMarkForm] = useState({
        studentId: "", subjectId: "", examSessionId: "",
        marksObtained: 0, isAbsent: false,
    });
    const [submitStatus, setSubmitStatus] = useState<{ type: string; msg: string } | null>(null);

    const filteredSummaries = summaries?.filter((s: any) =>
        !filterSession || s.examSessionId === filterSession
    );

    const getSessionName = (id: string) =>
        examSessions?.find((s: any) => s._id === id)?.name ?? id.slice(0, 10) + "...";

    const handleSubmitMarks = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitMarks({
                studentId: markForm.studentId as any,
                subjectId: markForm.subjectId as any,
                examSessionId: markForm.examSessionId as any,
                marksObtained: markForm.marksObtained,
                isAbsent: markForm.isAbsent,
            });
            setSubmitStatus({ type: "success", msg: "Marks submitted successfully!" });
            setMarkForm({ studentId: "", subjectId: "", examSessionId: "", marksObtained: 0, isAbsent: false });
        } catch (err: any) {
            setSubmitStatus({ type: "error", msg: err.message });
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>Results Management</h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>
                        View result summaries and submit marks
                    </p>
                </div>
                <button className="btn btn-accent" onClick={() => setShowSubmitForm(!showSubmitForm)}>
                    <Upload size={18} /> Submit Marks
                </button>
            </div>

            {/* Submit Marks Form */}
            {showSubmitForm && (
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Submit Marks</h3>
                    {submitStatus && (
                        <div style={{
                            background: submitStatus.type === "success" ? "var(--color-accent-50)" : "#FEE2E2",
                            color: submitStatus.type === "success" ? "var(--color-accent-700)" : "#DC2626",
                            padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem"
                        }}>{submitStatus.msg}</div>
                    )}
                    <form onSubmit={handleSubmitMarks}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Student ID</label>
                                <input className="form-input" value={markForm.studentId} onChange={(e) => setMarkForm({ ...markForm, studentId: e.target.value })} placeholder="Paste student ID" required />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Subject ID</label>
                                <input className="form-input" value={markForm.subjectId} onChange={(e) => setMarkForm({ ...markForm, subjectId: e.target.value })} placeholder="Paste subject ID" required />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Exam Session</label>
                                <select className="form-input" value={markForm.examSessionId} onChange={(e) => setMarkForm({ ...markForm, examSessionId: e.target.value })} required>
                                    <option value="">Select session...</option>
                                    {examSessions?.filter((s: any) => s.status === "ongoing").map((s: any) => (
                                        <option key={s._id} value={s._id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label>Marks Obtained</label>
                                <input className="form-input" type="number" value={markForm.marksObtained} onChange={(e) => setMarkForm({ ...markForm, marksObtained: parseInt(e.target.value) || 0 })} min={0} />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <input type="checkbox" checked={markForm.isAbsent} onChange={(e) => setMarkForm({ ...markForm, isAbsent: e.target.checked })} />
                                    Student was absent
                                </label>
                            </div>
                            <div style={{ display: "flex", alignItems: "end" }}>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Summaries */}
            <div style={{ marginBottom: "16px" }}>
                <select className="form-input" value={filterSession} onChange={(e) => setFilterSession(e.target.value)} style={{ width: "240px" }}>
                    <option value="">All Sessions</option>
                    {examSessions?.map((s: any) => (<option key={s._id} value={s._id}>{s.name}</option>))}
                </select>
            </div>

            {!summaries ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : filteredSummaries && filteredSummaries.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Student</th><th>Session</th><th>Total Marks</th><th>Obtained</th><th>GPA</th><th>Result</th></tr></thead>
                        <tbody>
                            {filteredSummaries.map((s: any) => (
                                <tr key={s._id}>
                                    <td><code style={{ fontSize: "0.8rem" }}>{String(s.studentId).slice(0, 12)}...</code></td>
                                    <td>{getSessionName(s.examSessionId)}</td>
                                    <td>{s.totalMarks}</td>
                                    <td><strong>{s.marksObtained}</strong></td>
                                    <td><strong style={{ color: "var(--color-primary-700)" }}>{s.gpa.toFixed(2)}</strong></td>
                                    <td><span className={`status-badge ${s.result === "pass" ? "status-pass" : "status-fail"}`}>{s.result}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state"><BarChart3 size={48} /><h3>No result summaries yet</h3><p style={{ marginTop: "8px", color: "var(--color-neutral-400)" }}>Results will appear here after exams are published</p></div>
            )}
        </>
    );
}
