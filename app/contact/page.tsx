"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
    Send,
    MapPin,
    Mail,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    CheckCircle,
} from "lucide-react";

export default function ContactPage() {
    const submitContact = useMutation(api.contact.submit);
    const faqs = useQuery(api.contact.listFaqs);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await submitContact(formData);
            setSent(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch {
            alert("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>Contact Us</h1>
                    <p>Reach out for inquiries, verification help, or feedback.</p>
                </div>
            </div>

            <section className="section">
                <div className="container">
                    <div className="grid-2">
                        {/* Contact Form */}
                        <div>
                            <h3 style={{ marginBottom: "20px" }}>Send a Message</h3>
                            {sent ? (
                                <div className="card" style={{ textAlign: "center", padding: "48px" }}>
                                    <CheckCircle
                                        size={56}
                                        color="var(--color-success)"
                                        style={{ margin: "0 auto 16px" }}
                                    />
                                    <h3>Message Sent!</h3>
                                    <p style={{ marginTop: "8px" }}>
                                        Thank you for contacting us. We&apos;ll respond as soon as possible.
                                    </p>
                                    <button
                                        className="btn btn-outline mt-6"
                                        onClick={() => setSent(false)}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="What is this about?"
                                            value={formData.subject}
                                            onChange={(e) =>
                                                setFormData({ ...formData, subject: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea
                                            className="form-input"
                                            placeholder="Your message..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={sending}
                                    >
                                        <Send size={16} />
                                        {sending ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Info + FAQ */}
                        <div>
                            <h3 style={{ marginBottom: "20px" }}>Board Office</h3>
                            <div className="card" style={{ marginBottom: "24px" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px",
                                    }}
                                >
                                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                        <MapPin
                                            size={20}
                                            color="var(--color-primary-600)"
                                            style={{ flexShrink: 0, marginTop: "2px" }}
                                        />
                                        <div>
                                            <strong>Address</strong>
                                            <p style={{ fontSize: "0.9rem", marginTop: "2px" }}>
                                                Education Board for Registration &amp; Results
                                                <br />
                                                Central Administration Office
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                        <Mail
                                            size={20}
                                            color="var(--color-primary-600)"
                                            style={{ flexShrink: 0, marginTop: "2px" }}
                                        />
                                        <div>
                                            <strong>Email</strong>
                                            <p style={{ fontSize: "0.9rem", marginTop: "2px" }}>
                                                contact@ebrr.edu
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ */}
                            <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <HelpCircle size={20} />
                                Frequently Asked Questions
                            </h3>

                            {faqs && faqs.length > 0 ? (
                                faqs.map((faq) => (
                                    <div key={faq._id} className="faq-item">
                                        <button
                                            className="faq-question"
                                            onClick={() =>
                                                setOpenFaq(openFaq === faq._id ? null : faq._id)
                                            }
                                        >
                                            {faq.question}
                                            {openFaq === faq._id ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                        </button>
                                        {openFaq === faq._id && (
                                            <div className="faq-answer">{faq.answer}</div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div
                                    style={{
                                        padding: "24px",
                                        textAlign: "center",
                                        color: "var(--color-neutral-400)",
                                        background: "var(--color-neutral-50)",
                                        borderRadius: "12px",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    <HelpCircle
                                        size={32}
                                        style={{ margin: "0 auto 8px", opacity: 0.5 }}
                                    />
                                    <p>FAQ section coming soon.</p>
                                    <p>For now, please use the contact form.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
