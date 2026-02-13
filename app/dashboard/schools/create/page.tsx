"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";

export default function CreateSchoolPage() {
    const router = useRouter();
    const createSchool = useMutation(api.schools.create);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "", registrationNo: "", type: "primary" as "primary" | "middle" | "high",
        campBlock: "", principalName: "", yearEstablished: new Date().getFullYear(),
        totalStudents: 0, totalTeachers: 0, contactInfo: "", address: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.registrationNo || !form.campBlock || !form.principalName) {
            setError("Please fill in all required fields."); return;
        }
        setSaving(true); setError("");
        try {
            const id = await createSchool({
                name: form.name, registrationNo: form.registrationNo, type: form.type,
                campBlock: form.campBlock, principalName: form.principalName,
                yearEstablished: form.yearEstablished, totalStudents: form.totalStudents,
                totalTeachers: form.totalTeachers,
                contactInfo: form.contactInfo || undefined, address: form.address || undefined,
            });
            router.push(`/dashboard/schools/${id}`);
        } catch (err: any) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/schools">Schools</Link><span>/</span><span>Register New School</span></div>
            <h1 className="dashboard-title">Register New School</h1>
            {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>School Information</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group"><label>School Name *</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Full school name" /></div>
                        <div className="form-group"><label>Registration No *</label><input className="form-input" value={form.registrationNo} onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} required placeholder="e.g. SCH-001" /></div>
                        <div className="form-group"><label>Type *</label><select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}><option value="primary">Primary</option><option value="middle">Middle</option><option value="high">High</option></select></div>
                        <div className="form-group"><label>Camp / Block *</label><input className="form-input" value={form.campBlock} onChange={(e) => setForm({ ...form, campBlock: e.target.value })} required placeholder="e.g. Camp 1, Block A" /></div>
                        <div className="form-group"><label>Principal Name *</label><input className="form-input" value={form.principalName} onChange={(e) => setForm({ ...form, principalName: e.target.value })} required /></div>
                        <div className="form-group"><label>Year Established</label><input className="form-input" type="number" value={form.yearEstablished} onChange={(e) => setForm({ ...form, yearEstablished: parseInt(e.target.value) })} min={1990} max={2030} /></div>
                        <div className="form-group"><label>Total Students</label><input className="form-input" type="number" value={form.totalStudents} onChange={(e) => setForm({ ...form, totalStudents: parseInt(e.target.value) || 0 })} min={0} /></div>
                        <div className="form-group"><label>Total Teachers</label><input className="form-input" type="number" value={form.totalTeachers} onChange={(e) => setForm({ ...form, totalTeachers: parseInt(e.target.value) || 0 })} min={0} /></div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Contact Details</h3>
                    <div className="form-group"><label>Contact Info</label><input className="form-input" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} placeholder="Phone number or email" /></div>
                    <div className="form-group"><label>Address</label><textarea className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Full address" /></div>
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href="/dashboard/schools" className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? "Registering..." : <><Save size={16} /> Register School</>}</button>
                </div>
            </form>
        </>
    );
}
