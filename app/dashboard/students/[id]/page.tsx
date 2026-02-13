"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft, Edit, ArrowRightLeft, UserCheck, UserX,
    GraduationCap, MapPin, Calendar, Hash, Users, Award, FileText
} from "lucide-react";

export default function StudentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    const student = useQuery(api.students.getById, { id: studentId as any });
    const guardians = useQuery(api.students.getGuardians, { studentId: studentId as any });
    const schools = useQuery(api.schools.list, {});
    const updateStudent = useMutation(api.students.update);
    const transferStudent = useMutation(api.students.transfer);

    const [showTransferModal, setShowTransferModal] = useState(false);
    const [transferSchoolId, setTransferSchoolId] = useState("");

    if (student === undefined) {
        return <div className="loading"><div className="loading-spinner" /></div>;
    }

    if (student === null) {
        return (
            <div className="empty-state">
                <h3>Student not found</h3>
                <Link href="/dashboard/students" className="btn btn-primary" style={{ marginTop: "16px" }}>
                    Back to Students
                </Link>
            </div>
        );
    }

    const school = schools?.find((s: any) => s._id === student.schoolId);

    const handleToggleStatus = async () => {
        try {
            await updateStudent({ id: student._id as any, isActive: !student.isActive });
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleTransfer = async () => {
        if (!transferSchoolId) return;
        try {
            await transferStudent({
                studentId: student._id as any,
                newSchoolId: transferSchoolId as any,
            });
            setShowTransferModal(false);
            setTransferSchoolId("");
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <Link href="/dashboard/students">Students</Link>
                <span>/</span>
                <span>{student.firstName} {student.lastName}</span>
            </div>

            {/* Header */}
            <div style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                marginBottom: "32px", flexWrap: "wrap", gap: "16px"
            }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>
                        {student.firstName} {student.lastName}
                    </h1>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <code style={{
                            background: "var(--color-primary-50)", padding: "4px 12px",
                            borderRadius: "6px", fontSize: "0.9rem", fontWeight: 700,
                            color: "var(--color-primary-700)"
                        }}>
                            {student.boardRegId}
                        </code>
                        <span className={`status-badge ${student.isActive ? "status-active" : "status-suspended"}`}>
                            {student.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowTransferModal(true)}
                    >
                        <ArrowRightLeft size={14} /> Transfer
                    </button>
                    <Link href={`/dashboard/students/${student._id}/edit`} className="btn btn-primary btn-sm">
                        <Edit size={14} /> Edit
                    </Link>
                    <button
                        className={`btn btn-sm ${student.isActive ? "btn-danger" : "btn-accent"}`}
                        onClick={handleToggleStatus}
                    >
                        {student.isActive ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                    </button>
                </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginBottom: "24px" }}>
                {/* Personal Information */}
                <div className="card">
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <GraduationCap size={18} /> Student Information
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="result-info-item">
                            <label>First Name</label>
                            <span>{student.firstName}</span>
                        </div>
                        <div className="result-info-item">
                            <label>Last Name</label>
                            <span>{student.lastName}</span>
                        </div>
                        <div className="result-info-item">
                            <label>Date of Birth</label>
                            <span>{student.dateOfBirth || "Not provided"}</span>
                        </div>
                        <div className="result-info-item">
                            <label>Gender</label>
                            <span style={{ textTransform: "capitalize" }}>{student.gender}</span>
                        </div>
                        <div className="result-info-item">
                            <label>Grade Level</label>
                            <span>Grade {student.gradeLevel}</span>
                        </div>
                        <div className="result-info-item">
                            <label>Enrollment Year</label>
                            <span>{student.enrollmentYear}</span>
                        </div>
                        {student.altIdentification && (
                            <div className="result-info-item" style={{ gridColumn: "1 / -1" }}>
                                <label>Alternative Identification</label>
                                <span>{student.altIdentification}</span>
                            </div>
                        )}
                        {student.interruptedHistory && (
                            <div className="result-info-item" style={{ gridColumn: "1 / -1" }}>
                                <label>Interrupted Education History</label>
                                <span>{student.interruptedHistory}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* School Info */}
                <div>
                    <div className="card" style={{ marginBottom: "16px" }}>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <MapPin size={18} /> School
                        </h3>
                        {school ? (
                            <div>
                                <strong style={{ fontSize: "1rem" }}>{school.name}</strong>
                                <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)", marginTop: "4px" }}>
                                    {school.campBlock} · {school.type}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)", marginTop: "2px" }}>
                                    Reg: {school.registrationNo}
                                </div>
                                <Link
                                    href={`/dashboard/schools/${school._id}`}
                                    className="btn btn-ghost btn-sm"
                                    style={{ marginTop: "12px" }}
                                >
                                    View School →
                                </Link>
                            </div>
                        ) : (
                            <p style={{ color: "var(--color-neutral-400)" }}>School data loading...</p>
                        )}
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <Calendar size={18} /> Dates
                        </h3>
                        <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-600)" }}>
                            <div style={{ marginBottom: "8px" }}>
                                <strong>Created:</strong> {new Date(student.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Last Updated:</strong> {new Date(student.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guardians Section */}
            <div className="card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Users size={18} /> Guardians
                    </h3>
                </div>
                {!guardians ? (
                    <div className="loading" style={{ padding: "24px" }}><div className="loading-spinner" /></div>
                ) : guardians.length > 0 ? (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Relation</th>
                                    <th>Contact</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guardians.map((g: any) => (
                                    <tr key={g._id}>
                                        <td><strong>{g.name}</strong></td>
                                        <td style={{ textTransform: "capitalize" }}>{g.relation}</td>
                                        <td>{g.contactInfo || "—"}</td>
                                        <td>{g.address || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "24px", color: "var(--color-neutral-400)" }}>
                        No guardians registered yet
                    </div>
                )}
            </div>

            {/* Transfer Modal */}
            {showTransferModal && (
                <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Transfer Student</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowTransferModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ marginBottom: "16px", fontSize: "0.9rem", color: "var(--color-neutral-600)" }}>
                                Transfer <strong>{student.firstName} {student.lastName}</strong> from{" "}
                                <strong>{school?.name}</strong> to a different school.
                            </p>
                            <div className="form-group">
                                <label>New School</label>
                                <select
                                    className="form-input"
                                    value={transferSchoolId}
                                    onChange={(e) => setTransferSchoolId(e.target.value)}
                                >
                                    <option value="">Select a school...</option>
                                    {schools
                                        ?.filter((s: any) => s._id !== student.schoolId && s.status === "active")
                                        .map((s: any) => (
                                            <option key={s._id} value={s._id}>
                                                {s.name} ({s.campBlock})
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowTransferModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleTransfer} disabled={!transferSchoolId}>
                                <ArrowRightLeft size={14} /> Transfer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
