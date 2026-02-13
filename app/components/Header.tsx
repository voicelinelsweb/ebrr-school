"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    GraduationCap,
    Menu,
    X,
} from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/schools", label: "Schools" },
    { href: "/results", label: "Results" },
    { href: "/news", label: "News" },
    { href: "/events", label: "Events" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="header-logo">
                    <div className="header-logo-icon">
                        <GraduationCap size={22} />
                    </div>
                    <span>EBRR</span>
                </Link>

                <nav className="header-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={pathname === link.href ? "active" : ""}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="header-cta">
                    <Link href="/auth/sign-in" className="btn btn-primary btn-sm">
                        Dashboard
                    </Link>
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "var(--header-height)",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "white",
                        zIndex: 99,
                        padding: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                padding: "14px 16px",
                                borderRadius: "8px",
                                fontSize: "1rem",
                                fontWeight: 500,
                                color:
                                    pathname === link.href
                                        ? "var(--color-primary-700)"
                                        : "var(--color-neutral-700)",
                                background:
                                    pathname === link.href
                                        ? "var(--color-primary-50)"
                                        : "transparent",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ marginTop: "16px" }}>
                        <Link
                            href="/auth/sign-in"
                            className="btn btn-primary w-full"
                            onClick={() => setMobileOpen(false)}
                        >
                            Dashboard Login
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
