"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    School,
    GraduationCap,
    BookOpen,
    FileCheck,
    Award,
    Newspaper,
    Calendar,
    MessageSquare,
    Shield,
    ClipboardList,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Bell,
} from "lucide-react";

type NavItem = {
    href: string;
    label: string;
    icon: ReactNode;
    roles?: string[];
};

const navSections: {
    title: string;
    items: NavItem[];
}[] = [
        {
            title: "Overview",
            items: [
                {
                    href: "/dashboard",
                    label: "Dashboard",
                    icon: <LayoutDashboard size={18} />,
                },
            ],
        },
        {
            title: "Academic",
            items: [
                {
                    href: "/dashboard/students",
                    label: "Students",
                    icon: <GraduationCap size={18} />,
                },
                {
                    href: "/dashboard/schools",
                    label: "Schools",
                    icon: <School size={18} />,
                    roles: ["super_admin", "academic_officer"],
                },
                {
                    href: "/dashboard/examinations",
                    label: "Examinations",
                    icon: <BookOpen size={18} />,
                    roles: ["super_admin", "exam_controller", "academic_officer"],
                },
                {
                    href: "/dashboard/results",
                    label: "Results",
                    icon: <FileCheck size={18} />,
                    roles: ["super_admin", "exam_controller"],
                },
                {
                    href: "/dashboard/certificates",
                    label: "Certificates",
                    icon: <Award size={18} />,
                    roles: ["super_admin", "exam_controller"],
                },
            ],
        },
        {
            title: "Content",
            items: [
                {
                    href: "/dashboard/news",
                    label: "News & Circulars",
                    icon: <Newspaper size={18} />,
                    roles: ["super_admin", "academic_officer"],
                },
                {
                    href: "/dashboard/events",
                    label: "Events",
                    icon: <Calendar size={18} />,
                    roles: ["super_admin", "academic_officer"],
                },
            ],
        },
        {
            title: "Administration",
            items: [
                {
                    href: "/dashboard/users",
                    label: "User Management",
                    icon: <Users size={18} />,
                    roles: ["super_admin"],
                },
                {
                    href: "/dashboard/admin",
                    label: "Admin Hub",
                    icon: <ClipboardList size={18} />,
                    roles: ["super_admin"],
                },
            ],
        },
    ];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { signOut } = useAuthActions();
    const router = useRouter();
    const pathname = usePathname();
    const profile = useQuery(api.userFunctions.me);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Redirect unauthenticated users
    useEffect(() => {
        if (profile === null) {
            router.push("/auth/sign-in");
        }
    }, [profile, router]);

    if (profile === undefined) {
        return (
            <div className="loading" style={{ minHeight: "100vh" }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    if (profile === null) {
        return null;
    }

    const userRole = profile.role;

    const filteredSections = navSections
        .map((section) => ({
            ...section,
            items: section.items.filter(
                (item) => !item.roles || item.roles.includes(userRole)
            ),
        }))
        .filter((section) => section.items.length > 0);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Shield size={20} />
                        EBRR Dashboard
                    </h2>
                    <p>{userRole.replace("_", " ")}</p>
                </div>

                <nav className="sidebar-nav">
                    {filteredSections.map((section) => (
                        <div key={section.title} className="sidebar-section">
                            <div className="sidebar-section-title">{section.title}</div>
                            {section.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    {item.icon}
                                    {item.label}
                                    {pathname === item.href && (
                                        <ChevronRight
                                            size={14}
                                            style={{ marginLeft: "auto", opacity: 0.5 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            background: "rgba(255,255,255,0.06)",
                            marginBottom: "8px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                color: "white",
                            }}
                        >
                            {profile.name}
                        </div>
                        <div
                            style={{
                                fontSize: "0.75rem",
                                color: "rgba(255,255,255,0.4)",
                                marginTop: "2px",
                            }}
                        >
                            {profile.email}
                        </div>
                    </div>
                    <button className="sidebar-link" onClick={handleSignOut}>
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="dashboard-main">
                <div className="dashboard-topbar">
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ display: "none" }}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <div style={{ fontSize: "0.9rem", color: "var(--color-neutral-500)" }}>
                        Welcome back, <strong style={{ color: "var(--color-neutral-800)" }}>{profile.name}</strong>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Bell size={18} color="var(--color-neutral-400)" />
                        <Link href="/" className="btn btn-ghost btn-sm">
                            View Site
                        </Link>
                    </div>
                </div>

                <div className="dashboard-content">{children}</div>
            </main>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.4)",
                        zIndex: 45,
                        display: "none",
                    }}
                />
            )}
        </div>
    );
}
