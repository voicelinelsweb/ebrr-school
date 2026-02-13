"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import {
    School, Plus, Search, Eye, Edit, CheckCircle, XCircle,
    Clock, Filter, MapPin
} from "lucide-react";

export default function SchoolsListPage() {
    const schools = useQuery(api.schools.list, {});
    const updateStatus = useMutation(api.schools.updateStatus);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filtered = schools?.filter((s: any) => {
        const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.registrationNo.toLowerCase().includes(search.toLowerCase());
        const matchType = !filterType || s.type === filterType;
        const matchStatus = !filterStatus || s.status === filterStatus;
        return matchSearch && matchType && matchStatus;
    });

    const statusCounts = {
        active: schools?.filter((s: any) => s.status === "active").length ?? 0,
        under_review: schools?.filter((s: any) => s.status === "under_review").length ?? 0,
        suspended: schools?.filter((s: any) => s.status === "suspended").length ?? 0,
    };

    const handleStatusChange = async (id: string, status: "active" | "under_review" | "suspended") => {
        try {
            await updateStatus({ id: id as any, status });
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>School Management</h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>
                        Manage affiliated schools, registrations, and status
                    </p>
                </div>
                <Link href="/dashboard/schools/create" className="btn btn-accent">
                    <Plus size={18} /> Register School
                </Link>
            </div>

            {/* Stats */}
            <div className="dash-stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-600)" }}>
                        <School size={22} />
                    </div>
                    <div className="value">{schools?.length ?? "—"}</div>
                    <div className="label">Total Schools</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "var(--color-accent-50)", color: "var(--color-accent-600)" }}>
                        <CheckCircle size={22} />
                    </div>
                    <div className="value">{statusCounts.active}</div>
                    <div className="label">Active</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "#FEF3C7", color: "#D97706" }}>
                        <Clock size={22} />
                    </div>
                    <div className="value">{statusCounts.under_review}</div>
                    <div className="label">Under Review</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                        <XCircle size={22} />
                    </div>
                    <div className="value">{statusCounts.suspended}</div>
                    <div className="label">Suspended</div>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                        <input className="form-input" placeholder="Search by name or registration no..."
                            value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "36px" }} />
                    </div>
                    <select className="form-input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: "150px" }}>
                        <option value="">All Types</option>
                        <option value="primary">Primary</option>
                        <option value="middle">Middle</option>
                        <option value="high">High</option>
                    </select>
                    <select className="form-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: "160px" }}>
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="under_review">Under Review</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)", marginBottom: "16px" }}>
                <Filter size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                Showing {filtered?.length ?? 0} school{(filtered?.length ?? 0) !== 1 ? "s" : ""}
            </div>

            {/* Table */}
            {!schools ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : filtered && filtered.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Reg No</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Camp/Block</th>
                                <th>Principal</th>
                                <th>Students</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((school: any) => (
                                <tr key={school._id}>
                                    <td><code style={{ background: "var(--color-neutral-100)", padding: "2px 8px", borderRadius: "4px", fontSize: "0.85rem" }}>{school.registrationNo}</code></td>
                                    <td><strong>{school.name}</strong></td>
                                    <td style={{ textTransform: "capitalize" }}>{school.type}</td>
                                    <td><MapPin size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />{school.campBlock}</td>
                                    <td>{school.principalName}</td>
                                    <td>{school.totalStudents}</td>
                                    <td>
                                        <span className={`status-badge ${school.status === "active" ? "status-active" : school.status === "under_review" ? "status-pending" : "status-suspended"}`}>
                                            {school.status.replace(/_/g, " ")}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <Link href={`/dashboard/schools/${school._id}`} className="btn btn-ghost btn-sm" title="View"><Eye size={14} /></Link>
                                            <Link href={`/dashboard/schools/${school._id}/edit`} className="btn btn-ghost btn-sm" title="Edit"><Edit size={14} /></Link>
                                            {school.status !== "active" && (
                                                <button className="btn btn-accent btn-sm" onClick={() => handleStatusChange(school._id, "active")} title="Activate"><CheckCircle size={14} /></button>
                                            )}
                                            {school.status !== "suspended" && (
                                                <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(school._id, "suspended")} title="Suspend"><XCircle size={14} /></button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <School size={48} />
                    <h3>No schools found</h3>
                    <p style={{ marginTop: "8px", color: "var(--color-neutral-400)" }}>
                        {search || filterType || filterStatus ? "Try adjusting your filters" : "Register your first school to get started"}
                    </p>
                </div>
            )}
        </>
    );
}
