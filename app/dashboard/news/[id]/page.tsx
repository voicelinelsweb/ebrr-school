"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Edit, Calendar, Tag } from "lucide-react";

export default function NewsDetailPage() {
    const params = useParams();
    const news = useQuery(api.news.getById, { id: params.id as any });

    if (news === undefined) return <div className="loading"><div className="loading-spinner" /></div>;
    if (news === null) return <div className="empty-state"><h3>Article not found</h3><Link href="/dashboard/news" className="btn btn-primary" style={{ marginTop: "16px" }}>Back</Link></div>;

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/news">News</Link><span>/</span><span>{news.title}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "8px" }}>{news.title}</h1>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span className={`status-badge ${news.isPublished ? "status-active" : "status-pending"}`}>{news.isPublished ? "Published" : "Draft"}</span>
                        <span className="status-badge" style={{ background: "var(--color-neutral-100)", color: "var(--color-neutral-600)", textTransform: "capitalize" }}><Tag size={12} style={{ verticalAlign: "middle" }} /> {news.category}</span>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)" }}><Calendar size={12} style={{ verticalAlign: "middle" }} /> {new Date(news.publishedAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <Link href={`/dashboard/news/${news._id}/edit`} className="btn btn-primary btn-sm"><Edit size={14} /> Edit</Link>
            </div>
            <div className="card">
                {news.excerpt && <p style={{ fontSize: "1.05rem", color: "var(--color-neutral-600)", fontStyle: "italic", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid var(--color-neutral-200)" }}>{news.excerpt}</p>}
                <div style={{ lineHeight: 1.8, color: "var(--color-neutral-700)" }} dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, "<br/>") }} />
            </div>
        </>
    );
}
