"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Search, MapPin, Users, School as SchoolIcon } from "lucide-react";

export default function SchoolsPage() {
    const schools = useQuery(api.schools.listPublic);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const filtered = schools?.filter((s) => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.campBlock.toLowerCase().includes(search.toLowerCase()) ||
            s.principalName.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter ? s.type === typeFilter : true;
        return matchSearch && matchType;
    });

    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>Affiliated Schools</h1>
                    <p>
                        Schools registered and approved under the EBRR Education Board.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {/* Filters */}
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
                                placeholder="Search by name, location, or principal..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: "42px" }}
                            />
                        </div>
                        <select
                            className="form-input"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            style={{ maxWidth: "200px" }}
                        >
                            <option value="">All Types</option>
                            <option value="primary">Primary School</option>
                            <option value="middle">Middle School</option>
                            <option value="high">High School</option>
                        </select>
                    </div>

                    {/* School List */}
                    {!schools ? (
                        <div className="loading">
                            <div className="loading-spinner" />
                        </div>
                    ) : filtered && filtered.length > 0 ? (
                        <div className="grid-3">
                            {filtered.map((school) => (
                                <div key={school._id} className="card">
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "16px",
                                        }}
                                    >
                                        <span
                                            className={`status-badge ${school.status === "active" ? "status-active" : "status-pending"}`}
                                        >
                                            {school.status === "active" ? "Active" : "Under Review"}
                                        </span>
                                        <span
                                            style={{
                                                fontSize: "0.75rem",
                                                color: "var(--color-neutral-400)",
                                                fontWeight: 600,
                                            }}
                                        >
                                            {school.registrationNo}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: "1.1rem", marginBottom: "12px" }}>
                                        {school.name}
                                    </h3>

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                            fontSize: "0.85rem",
                                            color: "var(--color-neutral-600)",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <SchoolIcon size={15} />
                                            <span style={{ textTransform: "capitalize" }}>
                                                {school.type} School
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <MapPin size={15} />
                                            <span>{school.campBlock}</span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Users size={15} />
                                            <span>
                                                {school.totalStudents} students · {school.totalTeachers}{" "}
                                                teachers
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            marginTop: "16px",
                                            paddingTop: "16px",
                                            borderTop: "1px solid var(--color-neutral-100)",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontSize: "0.8rem",
                                            color: "var(--color-neutral-400)",
                                        }}
                                    >
                                        <span>Principal: {school.principalName}</span>
                                        <span>Est. {school.yearEstablished}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <SchoolIcon size={48} />
                            <h3>No schools found</h3>
                            <p>
                                {search || typeFilter
                                    ? "Try adjusting your search or filter."
                                    : "No affiliated schools have been registered yet."}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
