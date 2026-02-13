"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save } from "lucide-react";

export default function CreateNewsPage() {
    const router = useRouter();
    const createNews = useMutation(api.news.create);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", content: "", excerpt: "", category: "announcement", isPublished: true });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.content) { setError("Title and content required."); return; }
        setSaving(true); setError("");
        try {
            const id = await createNews({
                title: form.title, content: form.content, excerpt: form.excerpt || undefined,
                category: form.category as any, isPublished: form.isPublished,
            });
            router.push(`/dashboard/news/${id}`);
        } catch (err: any) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/news">News</Link><span>/</span><span>New Article</span></div>
            <h1 className="dashboard-title">Create News Article</h1>
            {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="form-group"><label>Title *</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Article title" /></div>
                    <div className="form-group"><label>Excerpt</label><input className="form-input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary" /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group"><label>Category</label><select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="announcement">Announcement</option><option value="update">Update</option><option value="academic">Academic</option><option value="event">Event</option><option value="general">General</option></select></div>
                        <div className="form-group"><label style={{ display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Publish immediately</label></div>
                    </div>
                    <div className="form-group"><label>Content *</label><textarea className="form-input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required placeholder="Full article content..." style={{ minHeight: "250px" }} /></div>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href="/dashboard/news" className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? "Publishing..." : <><Save size={16} /> Publish</>}</button>
                </div>
            </form>
        </>
    );
}
