"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Save } from "lucide-react";

export default function EditNewsPage() {
    const params = useParams();
    const router = useRouter();
    const news = useQuery(api.news.getById, { id: params.id as any });
    const updateNews = useMutation(api.news.update);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", content: "", excerpt: "", category: "", isPublished: true });

    useEffect(() => {
        if (news) setForm({ title: news.title, content: news.content, excerpt: news.excerpt || "", category: news.category, isPublished: news.isPublished });
    }, [news]);

    if (news === undefined) return <div className="loading"><div className="loading-spinner" /></div>;
    if (news === null) return <div className="empty-state"><h3>Not found</h3><Link href="/dashboard/news" className="btn btn-primary" style={{ marginTop: "16px" }}>Back</Link></div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setError("");
        try {
            await updateNews({ id: news._id as any, title: form.title, content: form.content, excerpt: form.excerpt || undefined, category: form.category as any, isPublished: form.isPublished });
            router.push(`/dashboard/news/${news._id}`);
        } catch (err: any) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/news">News</Link><span>/</span><Link href={`/dashboard/news/${news._id}`}>{news.title}</Link><span>/</span><span>Edit</span></div>
            <h1 className="dashboard-title">Edit Article</h1>
            {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                    <div className="form-group"><label>Excerpt</label><input className="form-input" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group"><label>Category</label><select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="announcement">Announcement</option><option value="update">Update</option><option value="academic">Academic</option><option value="event">Event</option><option value="general">General</option></select></div>
                        <div className="form-group"><label style={{ display: "flex", alignItems: "center", gap: "8px" }}><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Published</label></div>
                    </div>
                    <div className="form-group"><label>Content</label><textarea className="form-input" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ minHeight: "250px" }} /></div>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href={`/dashboard/news/${news._id}`} className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? "Saving..." : <><Save size={16} /> Save Changes</>}</button>
                </div>
            </form>
        </>
    );
}
