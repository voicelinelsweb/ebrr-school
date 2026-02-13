"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { Newspaper, Plus, Edit, Eye, Trash2, Search, Filter } from "lucide-react";

export default function NewsListPage() {
    const newsList = useQuery(api.news.listAll, {});
    const removeNews = useMutation(api.news.remove);

    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");

    const filtered = newsList?.filter((n: any) => {
        const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = !filterCategory || n.category === filterCategory;
        return matchSearch && matchCategory;
    });

    const categories = ["announcement", "update", "academic", "event", "general"];

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this news article?")) return;
        try { await removeNews({ id: id as any }); } catch (err: any) { alert(err.message); }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>News & Announcements</h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>Manage news articles, announcements, and updates</p>
                </div>
                <Link href="/dashboard/news/create" className="btn btn-accent"><Plus size={18} /> New Article</Link>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                        <input className="form-input" placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "36px" }} />
                    </div>
                    <select className="form-input" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ width: "160px" }}>
                        <option value="">All Categories</option>
                        {categories.map((c) => (<option key={c} value={c} style={{ textTransform: "capitalize" }}>{c}</option>))}
                    </select>
                </div>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)", marginBottom: "16px" }}>
                <Filter size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                {filtered?.length ?? 0} article{(filtered?.length ?? 0) !== 1 ? "s" : ""}
            </div>

            {!newsList ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : filtered && filtered.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Title</th><th>Category</th><th>Published</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{filtered.map((n: any) => (
                            <tr key={n._id}>
                                <td><div><strong>{n.title}</strong><div style={{ fontSize: "0.8rem", color: "var(--color-neutral-500)", marginTop: "2px" }}>{n.excerpt?.slice(0, 80)}...</div></div></td>
                                <td><span className="status-badge" style={{ background: "var(--color-neutral-100)", color: "var(--color-neutral-600)", textTransform: "capitalize" }}>{n.category}</span></td>
                                <td style={{ fontSize: "0.85rem" }}>{new Date(n.publishedAt).toLocaleDateString()}</td>
                                <td><span className={`status-badge ${n.isPublished ? "status-active" : "status-pending"}`}>{n.isPublished ? "Published" : "Draft"}</span></td>
                                <td>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <Link href={`/dashboard/news/${n._id}`} className="btn btn-ghost btn-sm"><Eye size={14} /></Link>
                                        <Link href={`/dashboard/news/${n._id}/edit`} className="btn btn-ghost btn-sm"><Edit size={14} /></Link>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n._id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state"><Newspaper size={48} /><h3>No articles found</h3></div>
            )}
        </>
    );
}
