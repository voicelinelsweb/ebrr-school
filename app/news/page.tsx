"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Search, Calendar, Bell } from "lucide-react";

export default function NewsPage() {
    const news = useQuery(api.news.listPublic, {});
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const filtered = news?.filter((n) => {
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase());
        const matchCategory = categoryFilter ? n.category === categoryFilter : true;
        return matchSearch && matchCategory;
    });

    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>News &amp; Announcements</h1>
                    <p>Official board circulars, policy updates, and examination notices.</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="filter-bar">
                        <div className="search-input" style={{ position: "relative" }}>
                            <Search
                                size={18}
                                style={{
                                    position: "absolute",
                                    left: "14px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "var(--color-neutral-400)",
                                }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search news..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: "42px" }}
                            />
                        </div>
                        <select
                            className="form-input"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={{ maxWidth: "200px" }}
                        >
                            <option value="">All Categories</option>
                            <option value="circular">Circular</option>
                            <option value="policy">Policy</option>
                            <option value="examination">Examination</option>
                            <option value="emergency">Emergency</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    {!news ? (
                        <div className="loading"><div className="loading-spinner" /></div>
                    ) : filtered && filtered.length > 0 ? (
                        <div className="grid-3">
                            {filtered.map((item) => (
                                <div key={item._id} className="news-card">
                                    <div className="news-card-body">
                                        <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                                            <span className={`category-badge badge-${item.category}`}>
                                                {item.category}
                                            </span>
                                            {item.isUrgent && (
                                                <span className="category-badge badge-urgent">
                                                    ⚡ Urgent
                                                </span>
                                            )}
                                        </div>
                                        <h3>{item.title}</h3>
                                        <p>{item.content.substring(0, 200)}...</p>
                                        <div className="meta">
                                            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Calendar size={14} />
                                                {item.publishedAt
                                                    ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })
                                                    : "Draft"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Bell size={48} />
                            <h3>No news found</h3>
                            <p>
                                {search || categoryFilter
                                    ? "Try adjusting your search or filter."
                                    : "No announcements have been published yet."}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
