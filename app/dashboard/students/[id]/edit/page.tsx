"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Save } from "lucide-react";

export default function EditStudentPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;

    const student = useQuery(api.students.getById, { id: studentId as any });
    const updateStudent = useMutation(api.students.update);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gradeLevel: "",
        altIdentification: "",
        interruptedHistory: "",
        isActive: true,
    });

    const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    useEffect(() => {
        if (student) {
            setForm({
                firstName: student.firstName,
                lastName: student.lastName,
                dateOfBirth: student.dateOfBirth || "",
                gradeLevel: student.gradeLevel,
                altIdentification: student.altIdentification || "",
                interruptedHistory: student.interruptedHistory || "",
                isActive: student.isActive,
            });
        }
    }, [student]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await updateStudent({
                id: student._id as any,
                firstName: form.firstName,
                lastName: form.lastName,
                dateOfBirth: form.dateOfBirth || undefined,
                gradeLevel: form.gradeLevel,
                altIdentification: form.altIdentification || undefined,
                interruptedHistory: form.interruptedHistory || undefined,
                isActive: form.isActive,
            });
            router.push(`/dashboard/students/${student._id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="breadcrumb">
                <Link href="/dashboard/students">Students</Link>
                <span>/</span>
                <Link href={`/dashboard/students/${student._id}`}>{student.firstName} {student.lastName}</Link>
                <span>/</span>
                <span>Edit</span>
            </div>

            <h1 className="dashboard-title">Edit Student</h1>

            {error && (
                <div style={{
                    background: "#FEE2E2", color: "#DC2626", padding: "12px 16px",
                    borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Personal Information</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input className="form-input" value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input className="form-input" value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input className="form-input" type="date" value={form.dateOfBirth}
                                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Grade Level</label>
                            <select className="form-input" value={form.gradeLevel}
                                onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}>
                                {grades.map((g) => (
                                    <option key={g} value={g}>Grade {g}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Additional Information</h3>
                    <div className="form-group">
                        <label>Alternative Identification</label>
                        <input className="form-input" value={form.altIdentification}
                            onChange={(e) => setForm({ ...form, altIdentification: e.target.value })}
                            placeholder="UNHCR ID, family card, etc." />
                    </div>
                    <div className="form-group">
                        <label>Interrupted Education History</label>
                        <textarea className="form-input" value={form.interruptedHistory}
                            onChange={(e) => setForm({ ...form, interruptedHistory: e.target.value })}
                            placeholder="Detail any gaps in education" />
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Status</h3>
                    <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                            style={{ width: "18px", height: "18px" }}
                        />
                        <span style={{ fontWeight: 500 }}>Student is active</span>
                    </label>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href={`/dashboard/students/${student._id}`} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>
                        {saving ? "Saving..." : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </>
    );
}
