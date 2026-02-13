import Header from "../components/Header";
import Footer from "../components/Footer";
import {
    Shield,
    BookOpen,
    Users,
    Award,
    Eye,
    Target,
    Scale,
    Heart,
} from "lucide-react";

export const metadata = {
    title: "About - EBRR Education Board",
    description:
        "Learn about the EBRR Education Board mission, vision, governance, and commitment to educational dignity.",
};

export default function AboutPage() {
    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>About EBRR</h1>
                    <p>
                        The Education Board for Registration &amp; Results — uniting
                        community schools under one structured academic authority.
                    </p>
                </div>
            </div>

            {/* Mission & Vision */}
            <section className="section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-content">
                            <span className="section-tag">Our Purpose</span>
                            <h2>Mission &amp; Vision</h2>
                            <p>
                                <strong>Mission:</strong> To unite all community-based schools
                                under one structured education board, establishing standardized
                                curriculum alignment, conducting fair and transparent
                                examinations, publishing verified results, and issuing
                                structured, traceable certificates.
                            </p>
                            <p>
                                <strong>Vision:</strong> A future where every student has
                                access to recognized, documented, and credible academic records
                                that support their educational journey and future
                                opportunities, regardless of their displacement context.
                            </p>
                        </div>
                        <div className="value-cards">
                            <div className="value-card">
                                <h4>
                                    <Target size={18} color="var(--color-primary-700)" />
                                    Standardization
                                </h4>
                                <p>
                                    Establishing uniform academic standards across all affiliated
                                    schools.
                                </p>
                            </div>
                            <div className="value-card">
                                <h4>
                                    <Eye size={18} color="var(--color-accent-600)" />
                                    Transparency
                                </h4>
                                <p>
                                    Open and verifiable processes for examinations and result
                                    publication.
                                </p>
                            </div>
                            <div className="value-card">
                                <h4>
                                    <Scale size={18} color="var(--color-gold-500)" />
                                    Fairness
                                </h4>
                                <p>
                                    Equal treatment of all students with impartial assessment
                                    practices.
                                </p>
                            </div>
                            <div className="value-card">
                                <h4>
                                    <Heart size={18} color="#DC2626" />
                                    Dignity
                                </h4>
                                <p>
                                    Preserving educational identity and academic continuity for
                                    displaced students.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Background */}
            <section className="section section-alt">
                <div className="container" style={{ maxWidth: "800px" }}>
                    <div className="section-header">
                        <span className="section-tag">Context</span>
                        <h2>Education Challenges in Refugee Settings</h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {[
                            {
                                title: "Lack of Formal Documentation",
                                desc: "Many students lack national identity documents, making traditional enrollment and certification systems inaccessible.",
                            },
                            {
                                title: "Limited Infrastructure",
                                desc: "Schools operate with minimal facilities, inconsistent electricity, and limited access to educational materials.",
                            },
                            {
                                title: "Unstable Internet Connectivity",
                                desc: "Digital solutions must be designed for low-bandwidth environments and intermittent connectivity.",
                            },
                            {
                                title: "Paper-Based Records",
                                desc: "Academic records are often maintained on paper, leading to loss, inconsistency, and difficulty in verification.",
                            },
                            {
                                title: "Interrupted Education",
                                desc: "Students frequently experience gaps in their education due to displacement, requiring flexible academic tracking.",
                            },
                            {
                                title: "Need for Centralization",
                                desc: "Without a centralized board, individual schools cannot provide widely recognized documentation.",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="card"
                                style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                        background: "var(--color-primary-50)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        color: "var(--color-primary-700)",
                                        fontWeight: 800,
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: "4px" }}>{item.title}</h4>
                                    <p style={{ fontSize: "0.9rem" }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Governance */}
            <section className="section">
                <div className="container" style={{ maxWidth: "800px" }}>
                    <div className="section-header">
                        <span className="section-tag">Leadership</span>
                        <h2>Governance Structure</h2>
                        <p>
                            EBRR is governed by a structured board ensuring accountability,
                            fairness, and educational excellence.
                        </p>
                    </div>

                    <div className="grid-3">
                        {[
                            {
                                role: "Board Chairman",
                                desc: "Overall strategic direction and policy oversight.",
                                icon: Shield,
                            },
                            {
                                role: "Examination Controller",
                                desc: "Manages all examination processes and result integrity.",
                                icon: BookOpen,
                            },
                            {
                                role: "Academic Officer",
                                desc: "Oversees curriculum standards and academic calendar.",
                                icon: Award,
                            },
                        ].map((member, i) => (
                            <div key={i} className="card" style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        width: "64px",
                                        height: "64px",
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-50))",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "0 auto 16px",
                                        color: "var(--color-primary-700)",
                                    }}
                                >
                                    <member.icon size={28} />
                                </div>
                                <h4>{member.role}</h4>
                                <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                                    {member.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ethical Framework */}
            <section className="section section-alt">
                <div className="container" style={{ maxWidth: "800px" }}>
                    <div className="section-header">
                        <span className="section-tag">Standards</span>
                        <h2>Ethical &amp; Transparency Framework</h2>
                    </div>
                    <div className="grid-2">
                        {[
                            "All examination results are reviewed and approved by the Examination Controller before publication.",
                            "Certificate issuance is tracked with unique IDs and QR verification codes.",
                            "Audit logs track every change made within the system for accountability.",
                            "School affiliations are reviewed regularly to ensure compliance with board standards.",
                            "Result data is locked after publication to preserve academic integrity.",
                            "Gender equity in education access and participation is actively monitored.",
                        ].map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    alignItems: "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        width: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        background: "var(--color-accent-50)",
                                        color: "var(--color-accent-600)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: "0.75rem",
                                        fontWeight: 800,
                                    }}
                                >
                                    ✓
                                </div>
                                <p style={{ fontSize: "0.9rem" }}>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
