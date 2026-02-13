"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import {
    Users, Plus, Search, Filter, Eye, Edit, ArrowRightLeft,
    GraduationCap, UserCheck, UserX
} from "lucide-react";

export default function StudentsListPage() {
    const students = useQuery(api.students.list, {});
    const schools = useQuery(api.schools.list, {});
    const genderStats = useQuery(api.students.countByGender);

    const [search, setSearch] = useState("");
    const [filterSchool, setFilterSchool] = useState("");
    const [filterGrade, setFilterGrade] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filtered = students?.filter((s: any) => {
        const matchSearch =
            !search ||
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            s.boardRegId.toLowerCase().includes(search.toLowerCase());
        const matchSchool = !filterSchool || s.schoolId === filterSchool;
        const matchGrade = !filterGrade || s.gradeLevel === filterGrade;
        const matchStatus =
            !filterStatus ||
            (filterStatus === "active" ? s.isActive : !s.isActive);
        return matchSearch && matchSchool && matchGrade && matchStatus;
    });

    const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

    return (
        <>
            {/* Page Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                    <h1 className="dashboard-title" style={{ marginBottom: "4px" }}>
                        Student Management
                    </h1>
                    <p style={{ color: "var(--color-neutral-500)", fontSize: "0.9rem" }}>
                        Manage student records, registrations, and academic profiles
                    </p>
                </div>
                <Link href="/dashboard/students/create" className="btn btn-accent">
                    <Plus size={18} /> Register Student
                </Link>
            </div>

            {/* Stats Row */}
            <div className="dash-stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "var(--color-primary-50)", color: "var(--color-primary-600)" }}>
                        <Users size={22} />
                    </div>
                    <div className="value">{genderStats?.total ?? "—"}</div>
                    <div className="label">Total Students</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "var(--color-accent-50)", color: "var(--color-accent-600)" }}>
                        <UserCheck size={22} />
                    </div>
                    <div className="value">{students?.filter((s: any) => s.isActive).length ?? "—"}</div>
                    <div className="label">Active</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "#DBEAFE", color: "#1D4ED8" }}>
                        <GraduationCap size={22} />
                    </div>
                    <div className="value">{genderStats?.male ?? "—"}</div>
                    <div className="label">Male Students</div>
                </div>
                <div className="dash-stat-card">
                    <div className="icon-box" style={{ background: "#FCE7F3", color: "#DB2777" }}>
                        <GraduationCap size={22} />
                    </div>
                    <div className="value">{genderStats?.female ?? "—"}</div>
                    <div className="label">Female Students</div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
                        <Search size={16} style={{
                            position: "absolute", left: "12px", top: "50%",
                            transform: "translateY(-50%)", color: "var(--color-neutral-400)"
                        }} />
                        <input
                            className="form-input"
                            placeholder="Search by name or Board Reg ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ paddingLeft: "36px" }}
                        />
                    </div>
                    <select
                        className="form-input"
                        value={filterSchool}
                        onChange={(e) => setFilterSchool(e.target.value)}
                        style={{ width: "180px" }}
                    >
                        <option value="">All Schools</option>
                        {schools?.map((s: any) => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                    </select>
                    <select
                        className="form-input"
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        style={{ width: "140px" }}
                    >
                        <option value="">All Grades</option>
                        {grades.map((g) => (
                            <option key={g} value={g}>Grade {g}</option>
                        ))}
                    </select>
                    <select
                        className="form-input"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ width: "130px" }}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "16px"
            }}>
                <span style={{ fontSize: "0.85rem", color: "var(--color-neutral-500)" }}>
                    <Filter size={14} style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Showing {filtered?.length ?? 0} student{(filtered?.length ?? 0) !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Students Table */}
            {!students ? (
                <div className="loading"><div className="loading-spinner" /></div>
            ) : filtered && filtered.length > 0 ? (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Board Reg ID</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Grade</th>
                                <th>Enrollment Year</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((student: any) => {
                                const school = schools?.find((s: any) => s._id === student.schoolId);
                                return (
                                    <tr key={student._id}>
                                        <td>
                                            <code style={{
                                                background: "var(--color-primary-50)",
                                                padding: "2px 8px",
                                                borderRadius: "4px",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                color: "var(--color-primary-700)"
                                            }}>
                                                {student.boardRegId}
                                            </code>
                                        </td>
                                        <td>
                                            <div>
                                                <strong>{student.firstName} {student.lastName}</strong>
                                                <div style={{ fontSize: "0.8rem", color: "var(--color-neutral-500)" }}>
                                                    {school?.name ?? "—"}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textTransform: "capitalize" }}>{student.gender}</td>
                                        <td>Grade {student.gradeLevel}</td>
                                        <td>{student.enrollmentYear}</td>
                                        <td>
                                            <span className={`status-badge ${student.isActive ? "status-active" : "status-suspended"}`}>
                                                {student.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "4px" }}>
                                                <Link
                                                    href={`/dashboard/students/${student._id}`}
                                                    className="btn btn-ghost btn-sm"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/students/${student._id}/edit`}
                                                    className="btn btn-ghost btn-sm"
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <Users size={48} />
                    <h3>No students found</h3>
                    <p style={{ marginTop: "8px", color: "var(--color-neutral-400)" }}>
                        {search || filterSchool || filterGrade
                            ? "Try adjusting your filters"
                            : "Register your first student to get started"}
                    </p>
                    {!search && !filterSchool && !filterGrade && (
                        <Link href="/dashboard/students/create" className="btn btn-accent" style={{ marginTop: "16px" }}>
                            <Plus size={16} /> Register Student
                        </Link>
                    )}
                </div>
            )}
        </>
    );
}
