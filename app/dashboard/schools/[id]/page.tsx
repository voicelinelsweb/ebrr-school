"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { School, Edit, Users, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function SchoolDetailPage() {
    const params = useParams();
    const schoolId = params.id as string;

    const school = useQuery(api.schools.getById, { id: schoolId as any });
    const students = useQuery(api.students.list, { schoolId: schoolId as any });
    const updateStatus = useMutation(api.schools.updateStatus);

    if (school === undefined) return <div className="loading"><div className="loading-spinner" /></div>;
    if (school === null) return (
        <div className="empty-state">
            <h3>School not found</h3>
            <Link href="/dashboard/schools" className="btn btn-primary" style={{ marginTop: "16px" }}>Back to Schools</Link>
        </div>
    );

    return (
        <>
            <div className="breadcrumb">
                <Link href="/dashboard/schools">Schools</Link>
                <span>/</span>
                <span>{school.name}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>{school.name}</h1>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <code style={{ background: "var(--color-primary-50)", padding: "4px 12px", borderRadius: "6px", fontWeight: 700, color: "var(--color-primary-700)" }}>{school.registrationNo}</code>
                        <span className={`status-badge ${school.status === "active" ? "status-active" : school.status === "under_review" ? "status-pending" : "status-suspended"}`}>{school.status.replace(/_/g, " ")}</span>
                        <span className="status-badge" style={{ background: "var(--color-neutral-100)", color: "var(--color-neutral-600)", textTransform: "capitalize" }}>{school.type}</span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/dashboard/schools/${school._id}/edit`} className="btn btn-primary btn-sm"><Edit size={14} /> Edit</Link>
                    {school.status !== "active" && <button className="btn btn-accent btn-sm" onClick={() => updateStatus({ id: school._id as any, status: "active" })}><CheckCircle size={14} /> Activate</button>}
                    {school.status !== "suspended" && <button className="btn btn-danger btn-sm" onClick={() => updateStatus({ id: school._id as any, status: "suspended" })}><XCircle size={14} /> Suspend</button>}
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
                <div className="card">
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}><School size={18} /> School Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="result-info-item"><label>Registration No</label><span>{school.registrationNo}</span></div>
                        <div className="result-info-item"><label>Type</label><span style={{ textTransform: "capitalize" }}>{school.type}</span></div>
                        <div className="result-info-item"><label>Principal</label><span>{school.principalName}</span></div>
                        <div className="result-info-item"><label>Year Established</label><span>{school.yearEstablished}</span></div>
                        <div className="result-info-item"><label>Camp / Block</label><span>{school.campBlock}</span></div>
                        <div className="result-info-item"><label>Total Teachers</label><span>{school.totalTeachers}</span></div>
                        {school.contactInfo && <div className="result-info-item" style={{ gridColumn: "1 / -1" }}><label>Contact</label><span>{school.contactInfo}</span></div>}
                        {school.address && <div className="result-info-item" style={{ gridColumn: "1 / -1" }}><label>Address</label><span>{school.address}</span></div>}
                    </div>
                </div>

                <div>
                    <div className="card" style={{ marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}><Users size={18} style={{ verticalAlign: "middle", marginRight: "8px" }} />Student Count</h3>
                        <div className="value" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary-900)" }}>{school.totalStudents}</div>
                        <div className="label" style={{ color: "var(--color-neutral-500)", fontSize: "0.85rem" }}>registered students</div>
                    </div>
                    <div className="card">
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}><Calendar size={18} style={{ verticalAlign: "middle", marginRight: "8px" }} />Dates</h3>
                        <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-600)" }}>
                            <div style={{ marginBottom: "8px" }}><strong>Created:</strong> {new Date(school.createdAt).toLocaleDateString()}</div>
                            <div><strong>Updated:</strong> {new Date(school.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrolled Students */}
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}><Users size={18} /> Enrolled Students</h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)" }}>{students?.length ?? 0} student{(students?.length ?? 0) !== 1 ? "s" : ""}</span>
                </div>
                {!students ? (
                    <div className="loading" style={{ padding: "24px" }}><div className="loading-spinner" /></div>
                ) : students.length > 0 ? (
                    <div className="table-wrapper">
                        <table>
                            <thead><tr><th>Board Reg ID</th><th>Name</th><th>Grade</th><th>Gender</th><th>Status</th><th></th></tr></thead>
                            <tbody>
                                {students.slice(0, 20).map((s: any) => (
                                    <tr key={s._id}>
                                        <td><code style={{ background: "var(--color-primary-50)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", color: "var(--color-primary-700)" }}>{s.boardRegId}</code></td>
                                        <td><strong>{s.firstName} {s.lastName}</strong></td>
                                        <td>Grade {s.gradeLevel}</td>
                                        <td style={{ textTransform: "capitalize" }}>{s.gender}</td>
                                        <td><span className={`status-badge ${s.isActive ? "status-active" : "status-suspended"}`}>{s.isActive ? "Active" : "Inactive"}</span></td>
                                        <td><Link href={`/dashboard/students/${s._id}`} className="btn btn-ghost btn-sm">View</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "24px", color: "var(--color-neutral-400)" }}>No students enrolled yet</div>
                )}
            </div>
        </>
    );
}
