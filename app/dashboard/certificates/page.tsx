"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Award, CheckCircle, XCircle, Search, Eye, Filter } from "lucide-react";

export default function CertificatesPage() {
    const certificates = useQuery(api.certificates.list, {});
    const generateCert = useMutation(api.certificates.generate);
    const revokeCert = useMutation(api.certificates.revoke);

    const [search, setSearch] = useState("");
    const [showGenerate, setShowGenerate] = useState(false);
    const [genForm, setGenForm] = useState({ studentId: "", examSessionId: "", type: "completion" as "completion" | "merit" | "participation" });
    const [genStatus, setGenStatus] = useState<{ type: string; msg: string } | null>(null);

    const filtered = certificates?.filter((c: any) =>
        !search || c.certificateNo.toLowerCase().includes(search.toLowerCase()) || String(c.studentId).includes(search)
    );

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await generateCert({
                studentId: genForm.studentId as any,
                examSessionId: genForm.examSessionId as any,
                type: genForm.type,
            });
            setGenStatus({ type: "success", msg: "Certificate generated!" });
            setGenForm({ studentId: "", examSessionId: "", type: "completion" });
        } catch (err: any) { setGenStatus({ type: "error", msg: err.message }); }
    };

    const handleRevoke = async (id: string) => {
        if (!confirm("Revoke this certificate?")) return;
        try { await revokeCert({ id: id as any }); } catch (err: any) { alert(err.message); }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>Certificate Management</h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>Generate, track, and manage student certificates</p>
                </div>
                <button className="btn btn-accent" onClick={() => setShowGenerate(!showGenerate)}>
                    <Award size={18} /> Generate Certificate
                </button>
            </div>

            {/* Stats */}
            <div className="dash-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-600)" }}><Award size={22} /></div>
                    <div className="value">{certificates?.length ?? "—"}</div><div className="label">Total Certificates</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "var(--color-accent-50)", color: "var(--color-accent-600)" }}><CheckCircle size={22} /></div>
                    <div className="value">{certificates?.filter((c: any) => c.status === "active").length ?? "—"}</div><div className="label">Active</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "#FEE2E2", color: "#DC2626" }}><XCircle size={22} /></div>
                    <div className="value">{certificates?.filter((c: any) => c.status === "revoked").length ?? "—"}</div><div className="label">Revoked</div>
                </div>
            </div>

            {/* Generate Form */}
            {showGenerate && (
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>Generate Certificate</h3>
                    {genStatus && <div style={{ background: genStatus.type === "success" ? "var(--color-accent-50)" : "#FEE2E2", color: genStatus.type === "success" ? "var(--color-accent-700)" : "#DC2626", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem" }}>{genStatus.msg}</div>}
                    <form onSubmit={handleGenerate}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "12px", alignItems: "end" }}>
                            <div className="form-group" style={{ margin: 0 }}><label>Student ID</label><input className="form-input" value={genForm.studentId} onChange={(e) => setGenForm({ ...genForm, studentId: e.target.value })} required placeholder="Paste student ID" /></div>
                            <div className="form-group" style={{ margin: 0 }}><label>Exam Session ID</label><input className="form-input" value={genForm.examSessionId} onChange={(e) => setGenForm({ ...genForm, examSessionId: e.target.value })} required placeholder="Paste exam session ID" /></div>
                            <div className="form-group" style={{ margin: 0 }}><label>Type</label><select className="form-input" value={genForm.type} onChange={(e) => setGenForm({ ...genForm, type: e.target.value as any })}><option value="completion">Completion</option><option value="merit">Merit</option><option value="participation">Participation</option></select></div>
                            <button type="submit" className="btn btn-primary">Generate</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: "16px", position: "relative", maxWidth: "400px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                <input className="form-input" placeholder="Search by certificate number..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "36px" }} />
            </div>

            {/* Table */}
            {!certificates ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : filtered && filtered.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Certificate No</th><th>Student</th><th>Type</th><th>Issued</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{filtered.map((c: any) => (
                            <tr key={c._id}>
                                <td><code style={{ background: "var(--color-primary-50)", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, color: "var(--color-primary-700)" }}>{c.certificateNo}</code></td>
                                <td><code style={{ fontSize: "0.8rem" }}>{String(c.studentId).slice(0, 12)}...</code></td>
                                <td style={{ textTransform: "capitalize" }}>{c.type}</td>
                                <td>{new Date(c.issuedAt).toLocaleDateString()}</td>
                                <td><span className={`status-badge ${c.status === "active" ? "status-active" : "status-suspended"}`}>{c.status}</span></td>
                                <td>
                                    {c.status === "active" && <button className="btn btn-danger btn-sm" onClick={() => handleRevoke(c._id)}><XCircle size={14} /> Revoke</button>}
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state"><Award size={48} /><h3>No certificates found</h3></div>
            )}
        </>
    );
}
