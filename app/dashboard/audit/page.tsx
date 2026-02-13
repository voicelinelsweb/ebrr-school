"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ClipboardList } from "lucide-react";

export default function AuditLogPage() {
    const logs = useQuery(api.audit.list, { limit: 100 });

    return (
        <>
            <h1 className="dashboard-title">Audit Log</h1>

            <p style={{ fontSize: "0.9rem", color: "var(--color-neutral-500)", marginBottom: "24px" }}>
                Complete record of all system actions for accountability and compliance.
            </p>

            {!logs ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : logs.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Resource</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td className="text-xs">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td>{log.userId}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                background:
                                                    log.action === "create"
                                                        ? "var(--color-accent-50)"
                                                        : log.action === "delete"
                                                            ? "#FEE2E2"
                                                            : "var(--color-primary-50)",
                                                color:
                                                    log.action === "create"
                                                        ? "var(--color-accent-700)"
                                                        : log.action === "delete"
                                                            ? "#DC2626"
                                                            : "var(--color-primary-700)",
                                            }}
                                        >
                                            {log.action}
                                        </span>
                                    </td>
                                    <td>{log.resourceType}</td>
                                    <td>
                                        <span className="text-xs text-muted">
                                            {log.resourceId}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <ClipboardList size={48} />
                    <h3>No audit logs</h3>
                    <p>System activity will be recorded here.</p>
                </div>
            )}
        </>
    );
}
