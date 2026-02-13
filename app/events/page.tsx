"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Calendar } from "lucide-react";

export default function EventsPage() {
    const events = useQuery(api.events.listPublic, {});
    const [typeFilter, setTypeFilter] = useState("");

    const filtered = events?.filter((e) =>
        typeFilter ? e.type === typeFilter : true
    );

    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>Events &amp; Calendar</h1>
                    <p>Examination schedules, academic calendar, and important deadlines.</p>
                </div>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: "900px" }}>
                    <div className="filter-bar">
                        <select
                            className="form-input"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            style={{ maxWidth: "220px" }}
                        >
                            <option value="">All Event Types</option>
                            <option value="examination">Examination</option>
                            <option value="academic">Academic</option>
                            <option value="training">Training</option>
                            <option value="meeting">Meeting</option>
                            <option value="deadline">Deadline</option>
                            <option value="holiday">Holiday</option>
                        </select>
                    </div>

                    {!events ? (
                        <div className="loading"><div className="loading-spinner" /></div>
                    ) : filtered && filtered.length > 0 ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {filtered.map((event) => {
                                const d = new Date(event.date);
                                return (
                                    <div key={event._id} className="event-card">
                                        <div className="event-date-box">
                                            <div className="month">
                                                {d.toLocaleString("default", { month: "short" })}
                                            </div>
                                            <div className="day">{d.getDate()}</div>
                                            <div
                                                style={{
                                                    fontSize: "0.7rem",
                                                    color: "var(--color-neutral-400)",
                                                }}
                                            >
                                                {d.getFullYear()}
                                            </div>
                                        </div>
                                        <div className="event-info" style={{ flex: 1 }}>
                                            <h4>{event.title}</h4>
                                            <p>{event.description}</p>
                                            <span
                                                className="event-type-badge"
                                                style={{
                                                    background: "var(--color-primary-50)",
                                                    color: "var(--color-primary-700)",
                                                }}
                                            >
                                                {event.type}
                                            </span>
                                            {event.endDate && (
                                                <span
                                                    style={{
                                                        marginLeft: "8px",
                                                        fontSize: "0.75rem",
                                                        color: "var(--color-neutral-400)",
                                                    }}
                                                >
                                                    Until {new Date(event.endDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No events found</h3>
                            <p>Events and examination schedules will appear here.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
