"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Users, Shield, Edit, X } from "lucide-react";

export default function UsersManagePage() {
    const users = useQuery(api.userFunctions.list, {});
    const updateRole = useMutation(api.userFunctions.updateRole);
    const toggleActive = useMutation(api.userFunctions.toggleActive);

    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [newRole, setNewRole] = useState("");

    const roles = [
        "super_admin",
        "exam_controller",
        "academic_officer",
        "school_principal",
        "school_staff",
        "data_entry",
    ];

    return (
        <>
            <h1 className="dashboard-title">User Management</h1>

            <div className="alert alert-info" style={{ marginBottom: "24px" }}>
                <Shield size={18} />
                Only super administrators can manage user roles and access.
            </div>

            {!users ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : users.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td><strong>{user.name}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        {editingUser === user._id ? (
                                            <div style={{ display: "flex", gap: "4px" }}>
                                                <select
                                                    className="form-input"
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                    style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                                >
                                                    {roles.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r.replace(/_/g, " ")}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={async () => {
                                                        try {
                                                            await updateRole({
                                                                profileId: user._id as any,
                                                                role: newRole as any,
                                                            });
                                                            setEditingUser(null);
                                                        } catch (err: any) {
                                                            alert(err.message);
                                                        }
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => setEditingUser(null)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span
                                                className="status-badge"
                                                style={{
                                                    background: "var(--color-primary-50)",
                                                    color: "var(--color-primary-700)",
                                                }}
                                            >
                                                {user.role.replace(/_/g, " ")}
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <span
                                            className={`status-badge ${user.isActive ? "status-active" : "status-suspended"}`}
                                        >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "4px" }}>
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => {
                                                    setEditingUser(user._id);
                                                    setNewRole(user.role);
                                                }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className={`btn btn-sm ${user.isActive ? "btn-danger" : "btn-accent"}`}
                                                onClick={() =>
                                                    toggleActive({ profileId: user._id as any })
                                                }
                                            >
                                                {user.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <Users size={48} />
                    <h3>No users found</h3>
                </div>
            )}
        </>
    );
}
