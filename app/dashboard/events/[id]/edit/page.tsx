"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Save } from "lucide-react";

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const events = useQuery(api.events.listAll, {});
    const updateEvent = useMutation(api.events.update);

    const currentEvent = events?.find((e: any) => e._id === params.id);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ title: "", description: "", type: "", date: "", time: "", location: "", organizer: "" });

    useEffect(() => {
        if (currentEvent) setForm({
            title: currentEvent.title, description: currentEvent.description || "",
            type: currentEvent.type, date: currentEvent.date, time: currentEvent.time || "",
            location: currentEvent.location, organizer: currentEvent.organizer || "",
        });
    }, [currentEvent]);

    if (!events) return <div className="loading"><div className="loading-spinner" /></div>;
    if (!currentEvent) return <div className="empty-state"><h3>Event not found</h3><Link href="/dashboard/events" className="btn btn-primary" style={{ marginTop: "16px" }}>Back</Link></div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSaving(true); setError("");
        try {
            await updateEvent({
                id: currentEvent._id as any, title: form.title, description: form.description || undefined,
                type: form.type as any, date: form.date, time: form.time || undefined,
                location: form.location, organizer: form.organizer || undefined,
            });
            router.push("/dashboard/events");
        } catch (err: any) { setError(err.message); } finally { setSaving(false); }
    };

    return (
        <>
            <div className="breadcrumb"><Link href="/dashboard/events">Events</Link><span>/</span><span>Edit: {currentEvent.title}</span></div>
            <h1 className="dashboard-title">Edit Event</h1>
            {error && <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.9rem" }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="card" style={{ marginBottom: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Title</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                        <div className="form-group"><label>Type</label><select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="workshop">Workshop</option><option value="seminar">Seminar</option><option value="exam">Exam</option><option value="ceremony">Ceremony</option><option value="meeting">Meeting</option><option value="other">Other</option></select></div>
                        <div className="form-group"><label>Date</label><input className="form-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                        <div className="form-group"><label>Time</label><input className="form-input" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
                        <div className="form-group"><label>Location</label><input className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Organizer</label><input className="form-input" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} /></div>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                    </div>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <Link href="/dashboard/events" className="btn btn-ghost">Cancel</Link>
                    <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? "Saving..." : <><Save size={16} /> Save Changes</>}</button>
                </div>
            </form>
        </>
    );
}
