"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Shield, FileText, MessageSquare, HelpCircle, Eye, CheckCircle, Plus, Users, Clock, Search } from "lucide-react";

export default function AdministrationPage() {
    const auditLogs = useQuery(api.audit.list, {});
    const contacts = useQuery(api.contact.list, {});
    const users = useQuery(api.userFunctions.list);
    const faqs = useQuery(api.contact.listFaqs);
    const markRead = useMutation(api.contact.markRead);
    const createFaq = useMutation(api.contact.createFaq);

    const [activeTab, setActiveTab] = useState<"audit" | "contacts" | "users" | "faqs">("audit");
    const [showFaqForm, setShowFaqForm] = useState(false);
    const [faqForm, setFaqForm] = useState({ question: "", answer: "" });

    const handleCreateFaq = async () => {
        if (!faqForm.question || !faqForm.answer) return;
        try {
            await createFaq({ question: faqForm.question, answer: faqForm.answer });
            setShowFaqForm(false);
            setFaqForm({ question: "", answer: "" });
        } catch (err: any) { alert(err.message); }
    };

    const unreadCount = contacts?.filter((c: any) => !c.isRead).length ?? 0;

    return (
        <>
            <div style={{ marginBottom: "24px" }}>
                <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>Administration</h1>
                <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>Audit logs, contact messages, user overview, and FAQs</p>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === "audit" ? "active" : ""}`} onClick={() => setActiveTab("audit")}>
                    <FileText size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />Audit Logs ({auditLogs?.length ?? 0})
                </button>
                <button className={`tab ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>
                    <MessageSquare size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />Messages {unreadCount > 0 && <span style={{ background: "#DC2626", color: "white", borderRadius: "999px", padding: "0 6px", fontSize: "0.7rem", marginLeft: "4px" }}>{unreadCount}</span>}
                </button>
                <button className={`tab ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
                    <Users size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />Users ({users?.length ?? 0})
                </button>
                <button className={`tab ${activeTab === "faqs" ? "active" : ""}`} onClick={() => setActiveTab("faqs")}>
                    <HelpCircle size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />FAQs ({faqs?.length ?? 0})
                </button>
            </div>

            {/* Audit Logs */}
            {activeTab === "audit" && (
                !auditLogs ? <div className="loading"><div className="loading-spinner" /></div> :
                    auditLogs.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Action</th><th>Table</th><th>Record</th><th>User</th><th>Time</th></tr></thead>
                                <tbody>{auditLogs.slice(0, 50).map((log: any) => (
                                    <tr key={log._id}>
                                        <td><span className="status-badge" style={{
                                            background: log.action === "create" ? "var(--color-accent-50)" : log.action === "delete" ? "#FEE2E2" : "#DBEAFE",
                                            color: log.action === "create" ? "var(--color-accent-700)" : log.action === "delete" ? "#DC2626" : "#2563EB",
                                            textTransform: "capitalize"
                                        }}>{log.action}</span></td>
                                        <td style={{ textTransform: "capitalize" }}>{log.tableName}</td>
                                        <td><code style={{ fontSize: "0.8rem" }}>{String(log.recordId).slice(0, 12)}...</code></td>
                                        <td><code style={{ fontSize: "0.8rem" }}>{log.userId ? String(log.userId).slice(0, 12) + "..." : "System"}</code></td>
                                        <td style={{ fontSize: "0.8rem" }}>{new Date(log._creationTime).toLocaleString()}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    ) : <div className="empty-state"><FileText size={48} /><h3>No audit logs yet</h3></div>
            )}

            {/* Contact Messages */}
            {activeTab === "contacts" && (
                !contacts ? <div className="loading"><div className="loading-spinner" /></div> :
                    contacts.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Date</th><th></th></tr></thead>
                                <tbody>{contacts.map((msg: any) => (
                                    <tr key={msg._id} style={{ background: msg.isRead ? "transparent" : "rgba(59, 96, 165, 0.03)" }}>
                                        <td><strong>{msg.name}</strong></td>
                                        <td>{msg.email}</td>
                                        <td>{msg.subject}</td>
                                        <td><span className={`status-badge ${msg.isRead ? "status-active" : "status-pending"}`}>{msg.isRead ? "Read" : "Unread"}</span></td>
                                        <td style={{ fontSize: "0.85rem" }}>{new Date(msg._creationTime).toLocaleDateString()}</td>
                                        <td>{!msg.isRead && <button className="btn btn-ghost btn-sm" onClick={() => markRead({ id: msg._id as any })}><CheckCircle size={14} /> Mark Read</button>}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    ) : <div className="empty-state"><MessageSquare size={48} /><h3>No messages</h3></div>
            )}

            {/* Users Overview */}
            {activeTab === "users" && (
                !users ? <div className="loading"><div className="loading-spinner" /></div> :
                    users.length > 0 ? (
                        <div className="table-wrapper">
                            <table>
                                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                                <tbody>{users.map((u: any) => (
                                    <tr key={u._id}>
                                        <td><strong>{u.name}</strong></td>
                                        <td>{u.email}</td>
                                        <td><span className="status-badge" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-700)" }}>{u.role?.replace(/_/g, " ")}</span></td>
                                        <td><span className={`status-badge ${u.isActive ? "status-active" : "status-suspended"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    ) : <div className="empty-state"><Users size={48} /><h3>No users</h3></div>
            )}

            {/* FAQs */}
            {activeTab === "faqs" && (
                <>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                        <button className="btn btn-accent btn-sm" onClick={() => setShowFaqForm(!showFaqForm)}><Plus size={14} /> Add FAQ</button>
                    </div>
                    {showFaqForm && (
                        <div className="card" style={{ marginBottom: "16px" }}>
                            <div className="form-group"><label>Question</label><input className="form-input" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} placeholder="Frequently asked question..." /></div>
                            <div className="form-group"><label>Answer</label><textarea className="form-input" value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} placeholder="Answer..." /></div>
                            <button className="btn btn-primary btn-sm" onClick={handleCreateFaq}>Save FAQ</button>
                        </div>
                    )}
                    {!faqs ? <div className="loading"><div className="loading-spinner" /></div> :
                        faqs.length > 0 ? (
                            <div className="table-wrapper">
                                <table>
                                    <thead><tr><th>Question</th><th>Answer</th></tr></thead>
                                    <tbody>{faqs.map((f: any) => (
                                        <tr key={f._id}><td><strong>{f.question}</strong></td><td style={{ fontSize: "0.9rem" }}>{f.answer.slice(0, 120)}...</td></tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        ) : <div className="empty-state"><HelpCircle size={48} /><h3>No FAQs</h3></div>}
                </>
            )}
        </>
    );
}
