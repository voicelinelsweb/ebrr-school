"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, UserPlus } from "lucide-react";

export default function CreateStudentPage() {
    const router = useRouter();
    const schools = useQuery(api.schools.list, {});
    const createStudent = useMutation(api.students.create);
    const addGuardian = useMutation(api.students.addGuardian);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male" as "male" | "female" | "other",
        schoolId: "",
        gradeLevel: "",
        enrollmentYear: new Date().getFullYear(),
        altIdentification: "",
        interruptedHistory: "",
    });

    const [guardian, setGuardian] = useState({
        name: "",
        relation: "",
        contactInfo: "",
        address: "",
    });

    const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName || !form.schoolId || !form.gradeLevel) {
            setError("Please fill in all required fields.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const studentId = await createStudent({
                firstName: form.firstName,
                lastName: form.lastName,
                dateOfBirth: form.dateOfBirth || undefined,
                gender: form.gender,
                schoolId: form.schoolId as any,
                gradeLevel: form.gradeLevel,
                enrollmentYear: form.enrollmentYear,
                altIdentification: form.altIdentification || undefined,
                interruptedHistory: form.interruptedHistory || undefined,
            });

            // Add guardian if provided
            if (guardian.name && guardian.relation) {
                await addGuardian({
                    studentId: studentId as any,
                    name: guardian.name,
                    relation: guardian.relation,
                    contactInfo: guardian.contactInfo || undefined,
                    address: guardian.address || undefined,
                });
            }

            router.push(`/dashboard/students/${studentId}`);
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
                <span>Register New Student</span>
            </div>

            <h1 className="dashboard-title">Register New Student</h1>

            {error && (
                <div className="alert alert-error" style={{
                    background: "#FEE2E2", color: "#DC2626", padding: "12px 16px",
                    borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Personal Information</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>First Name *</label>
                            <input
                                className="form-input"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input
                                className="form-input"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                placeholder="Enter last name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                className="form-input"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender *</label>
                            <select
                                className="form-input"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Academic Information</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>School *</label>
                            <select
                                className="form-input"
                                value={form.schoolId}
                                onChange={(e) => setForm({ ...form, schoolId: e.target.value })}
                                required
                            >
                                <option value="">Select a school...</option>
                                {schools
                                    ?.filter((s: any) => s.status === "active")
                                    .map((s: any) => (
                                        <option key={s._id} value={s._id}>
                                            {s.name} ({s.campBlock})
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Grade Level *</label>
                            <select
                                className="form-input"
                                value={form.gradeLevel}
                                onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                                required
                            >
                                <option value="">Select grade...</option>
                                {grades.map((g) => (
                                    <option key={g} value={g}>Grade {g}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Enrollment Year</label>
                            <input
                                className="form-input"
                                type="number"
                                value={form.enrollmentYear}
                                onChange={(e) => setForm({ ...form, enrollmentYear: parseInt(e.target.value) })}
                                min={2000}
                                max={2030}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Additional Information</h3>
                    <div className="form-group">
                        <label>Alternative Identification</label>
                        <input
                            className="form-input"
                            value={form.altIdentification}
                            onChange={(e) => setForm({ ...form, altIdentification: e.target.value })}
                            placeholder="UNHCR ID, family card, etc."
                        />
                    </div>
                    <div className="form-group">
                        <label>Interrupted Education History</label>
                        <textarea
                            className="form-input"
                            value={form.interruptedHistory}
                            onChange={(e) => setForm({ ...form, interruptedHistory: e.target.value })}
                            placeholder="Detail any gaps in education, prior schools, etc."
                        />
                    </div>
                </div>

                {/* Guardian Information */}
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Guardian (Optional)</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group">
                            <label>Guardian Name</label>
                            <input
                                className="form-input"
                                value={guardian.name}
                                onChange={(e) => setGuardian({ ...guardian, name: e.target.value })}
                                placeholder="Full name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Relation</label>
                            <input
                                className="form-input"
                                value={guardian.relation}
                                onChange={(e) => setGuardian({ ...guardian, relation: e.target.value })}
                                placeholder="e.g. Father, Mother, Uncle"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Info</label>
                            <input
                                className="form-input"
                                value={guardian.contactInfo}
                                onChange={(e) => setGuardian({ ...guardian, contactInfo: e.target.value })}
                                placeholder="Phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                className="form-input"
                                value={guardian.address}
                                onChange={(e) => setGuardian({ ...guardian, address: e.target.value })}
                                placeholder="Address"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href="/dashboard/students" className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>
                        {saving ? "Registering..." : <><UserPlus size={16} /> Register Student</>}
                    </button>
                </div>
            </form>
        </>
    );
}
