"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Save } from "lucide-react";

export default function EditSchoolPage() {
    const params = useParams();
    const router = useRouter();
    const schoolId = params.id as string;
    const school = useQuery(api.schools.getById, { id: schoolId as any });
    const updateSchool = useMutation(api.schools.update);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ name: "", principalName: "", totalStudents: 0, totalTeachers: 0, contactInfo: "", address: "", campBlock: "" });

    useEffect(() => {
        if (school) {
            setForm({
                name: school.name, principalName: school.principalName,
                totalStudents: school.totalStudents, totalTeachers: school.totalTeachers,
                contactInfo: school.contactInfo || "", address: school.address || "",
                campBlock: school.campBlock,
            });
        }
    }, [school]);

    if (school === undefined) return <div className="loading"><div className="loading-spinner" /></div>;
    if (school === null) return <div className="empty-state"><h3>School not found</h3><Link href="/dashboard/schools" className="btn btn-primary" style={{ marginTop: "16px" }}>Back</Link></div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setError("");
        try {
            await updateSchool({
                id: school._id as any, name: form.name, principalName: form.principalName,
                totalStudents: form.totalStudents, totalTeachers: form.totalTeachers,
                contactInfo: form.contactInfo || undefined, address: form.address || undefined,
                campBlock: form.campBlock,
            });
            router.push(`/dashboard/schools/${school._id}`);
        } catch (err: any) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/schools">Schools</Link><span>/</span><Link href={`/dashboard/schools/${school._id}`}>{school.name}</Link><span>/</span><span>Edit</span></div>
            <h1 className="dashboard-title">Edit School</h1>
            {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>School Information</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group"><label>School Name</label><input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                        <div className="form-group"><label>Principal Name</label><input className="form-input" value={form.principalName} onChange={(e) => setForm({ ...form, principalName: e.target.value })} /></div>
                        <div className="form-group"><label>Camp / Block</label><input className="form-input" value={form.campBlock} onChange={(e) => setForm({ ...form, campBlock: e.target.value })} /></div>
                        <div className="form-group"><label>Total Students</label><input className="form-input" type="number" value={form.totalStudents} onChange={(e) => setForm({ ...form, totalStudents: parseInt(e.target.value) || 0 })} min={0} /></div>
                        <div className="form-group"><label>Total Teachers</label><input className="form-input" type="number" value={form.totalTeachers} onChange={(e) => setForm({ ...form, totalTeachers: parseInt(e.target.value) || 0 })} min={0} /></div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>Contact Details</h3>
                    <div className="form-group"><label>Contact Info</label><input className="form-input" value={form.contactInfo} onChange={(e) => setForm({ ...form, contactInfo: e.target.value })} /></div>
                    <div className="form-group"><label>Address</label><textarea className="form-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href={`/dashboard/schools/${school._id}`} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? "Saving..." : <><Save size={16} /> Save Changes</>}</button>
                </div>
            </form>
        </>
    );
}
