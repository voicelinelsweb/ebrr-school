"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";

export default function CreateExamSessionPage() {
    const router = useRouter();
    const academicYears = useQuery(api.examinations.listAcademicYears);
    const createSession = useMutation(api.examinations.createExamSession);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        type: "annual" as "annual" | "midterm" | "special",
        academicYearId: "",
        startDate: "",
        endDate: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.academicYearId || !form.startDate || !form.endDate) {
            setError("Please fill in all required fields."); return;
        }
        setSaving(true); setError("");
        try {
            const id = await createSession({
                name: form.name,
                type: form.type,
                academicYearId: form.academicYearId as any,
                startDate: form.startDate,
                endDate: form.endDate,
            });
            router.push(`/dashboard/examinations/${id}`);
        } catch (err: any) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/examinations">Examinations</Link><span>/</span><span>Create Session</span></div>
            <h1 className="dashboard-title">Create Exam Session</h1>
            {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Session Details</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group"><label>Session Name *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Annual Examination 2025" /></div>
                        <div className="form-group"><label>Type *</label><select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}><option value="annual">Annual</option><option value="midterm">Midterm</option><option value="special">Special</option></select></div>
                        <div className="form-group"><label>Academic Year *</label><select className="form-input" value={form.academicYearId} onChange={(e) => setForm({ ...form, academicYearId: e.target.value })} required><option value="">Select year...</option>{academicYears?.map((y: any) => (<option key={y._id} value={y._id}>{y.year} ({y.status})</option>))}</select></div>
                        <div></div>
                        <div className="form-group"><label>Start Date *</label><input className="form-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div>
                        <div className="form-group"><label>End Date *</label><input className="form-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href="/dashboard/examinations" className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? "Creating..." : <><Save size={16} /> Create Session</>}</button>
                </div>
            </form>
        </>
    );
}
