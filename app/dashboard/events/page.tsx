"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus, Edit, Trash2, MapPin, Clock, Filter, Search } from "lucide-react";

export default function EventsListPage() {
    const events = useQuery(api.events.listAll, {});
    const removeEvent = useMutation(api.events.remove);

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");

    const filtered = events?.filter((e: any) => {
        const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
        const matchType = !filterType || e.type === filterType;
        return matchSearch && matchType;
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event?")) return;
        try { await removeEvent({ id: id as any }); } catch (err: any) { alert(err.message); }
    };

    const types = ["workshop", "seminar", "exam", "ceremony", "meeting", "other"];

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>Event Management</h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>Manage upcoming and past events</p>
                </div>
                <Link href="/dashboard/events/create" className="btn btn-accent"><Plus size={18} /> New Event</Link>
            </div>

            <div className="card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                        <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-neutral-400)" }} />
                        <input className="form-input" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "36px" }} />
                    </div>
                    <select className="form-input" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: "150px" }}>
                        <option value="">All Types</option>
                        {types.map((t) => (<option key={t} value={t} style={{ textTransform: "capitalize" }}>{t}</option>))}
                    </select>
                </div>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)", marginBottom: "16px" }}>
                <Filter size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />{filtered?.length ?? 0} event{(filtered?.length ?? 0) !== 1 ? "s" : ""}
            </div>

            {!events ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : filtered && filtered.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead><tr><th>Title</th><th>Type</th><th>Date & Time</th><th>Location</th><th>Actions</th></tr></thead>
                        <tbody>{filtered.map((e: any) => (
                            <tr key={e._id}>
                                <td><div><strong>{e.title}</strong><div style={{ fontSize: "0.8rem", color: "var(--color-neutral-500)", marginTop: "2px" }}>{e.description?.slice(0, 80)}...</div></div></td>
                                <td><span className="status-badge" style={{ background: "var(--color-neutral-100)", color: "var(--color-neutral-600)", textTransform: "capitalize" }}>{e.type}</span></td>
                                <td style={{ fontSize: "0.85rem" }}><div><Clock size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />{e.date} {e.time}</div></td>
                                <td><MapPin size={12} style={{ verticalAlign: "middle", marginRight: "4px" }} />{e.location}</td>
                                <td>
                                    <div style={{ display: "flex", gap: "4px" }}>
                                        <Link href={`/dashboard/events/${e._id}/edit`} className="btn btn-ghost btn-sm"><Edit size={14} /></Link>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e._id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state"><CalendarDays size={48} /><h3>No events found</h3></div>
            )}
        </>
    );
}
