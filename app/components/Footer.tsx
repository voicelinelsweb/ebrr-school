import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container-wide">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <GraduationCap size={24} />
                            EBRR Education Board
                        </h3>
                        <p>
                            The Education Board for Registration & Results serves as the
                            centralized academic authority for community-based schools,
                            ensuring standardized education, transparent examinations, and
                            certified academic recognition.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li>
                                <Link href="/about">About EBRR</Link>
                            </li>
                            <li>
                                <Link href="/schools">Affiliated Schools</Link>
                            </li>
                            <li>
                                <Link href="/results">Result Portal</Link>
                            </li>
                            <li>
                                <Link href="/news">News & Circulars</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Resources</h4>
                        <ul>
                            <li>
                                <Link href="/events">Academic Calendar</Link>
                            </li>
                            <li>
                                <Link href="/verify">Verify Certificate</Link>
                            </li>
                            <li>
                                <Link href="/contact">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/contact">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Board Office</h4>
                        <ul>
                            <li>
                                <span style={{ opacity: 0.6 }}>
                                    Education Board for Registration & Results
                                </span>
                            </li>
                            <li>
                                <span style={{ opacity: 0.6 }}>
                                    Central Office, Camp Administration
                                </span>
                            </li>
                            <li>
                                <a href="mailto:contact@ebrr.edu">contact@ebrr.edu</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>
                        © {new Date().getFullYear()} EBRR Education Board. All rights
                        reserved.
                    </span>
                    <span>
                        Committed to educational dignity and academic transparency.
                    </span>
                </div>
            </div>
        </footer>
    );
}
