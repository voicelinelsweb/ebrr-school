"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
    Search,
    CheckCircle,
    XCircle,
    Shield,
    Award,
} from "lucide-react";

export default function VerifyPage() {
    const [certificateId, setCertificateId] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const result = useQuery(
        api.certificates.verify,
        submitted && certificateId ? { certificateId } : "skip"
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (certificateId.trim()) {
            setSubmitted(true);
        }
    };

    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>Verify Certificate</h1>
                    <p>
                        Verify the authenticity of a certificate issued by EBRR Education
                        Board.
                    </p>
                </div>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: "600px" }}>
                    <div className="card" style={{ marginBottom: "32px" }}>
                        <h3
                            style={{
                                marginBottom: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Shield size={20} />
                            Certificate Verification
                        </h3>
                        <p
                            style={{
                                fontSize: "0.9rem",
                                color: "var(--color-neutral-500)",
                                marginBottom: "20px",
                            }}
                        >
                            Enter the certificate ID printed on your document or scanned from
                            the QR code.
                        </p>

                        <form onSubmit={handleSearch}>
                            <div className="form-group">
                                <label>Certificate ID</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. CERT-XXXXXXXX-XXXXXX"
                                    value={certificateId}
                                    onChange={(e) => {
                                        setCertificateId(e.target.value);
                                        setSubmitted(false);
                                    }}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                <Search size={16} />
                                Verify
                            </button>
                        </form>
                    </div>

                    {submitted && result === undefined && (
                        <div className="loading">
                            <div className="loading-spinner" />
                        </div>
                    )}

                    {submitted && result === null && (
                        <div className="alert alert-error">
                            <XCircle size={20} />
                            Certificate not found. Please check the certificate ID and try
                            again.
                        </div>
                    )}

                    {submitted && result && (
                        <div className="card">
                            {result.valid ? (
                                <>
                                    <div
                                        style={{
                                            textAlign: "center",
                                            marginBottom: "24px",
                                            padding: "20px",
                                            background: "var(--color-accent-50)",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        <CheckCircle
                                            size={48}
                                            color="var(--color-success)"
                                            style={{ margin: "0 auto 8px" }}
                                        />
                                        <h3 style={{ color: "var(--color-success)" }}>
                                            ✓ Certificate Verified
                                        </h3>
                                        <p style={{ fontSize: "0.85rem", color: "var(--color-accent-700)" }}>
                                            This certificate is valid and issued by EBRR Education
                                            Board.
                                        </p>
                                    </div>

                                    <div className="result-info-grid">
                                        <div className="result-info-item">
                                            <label>Certificate ID</label>
                                            <span>{result.certificateId}</span>
                                        </div>
                                        <div className="result-info-item">
                                            <label>Type</label>
                                            <span style={{ textTransform: "capitalize" }}>
                                                {result.type}
                                            </span>
                                        </div>
                                        <div className="result-info-item">
                                            <label>Student Name</label>
                                            <span>{result.studentName}</span>
                                        </div>
                                        <div className="result-info-item">
                                            <label>Board Reg. ID</label>
                                            <span>{result.boardRegId}</span>
                                        </div>
                                        <div className="result-info-item">
                                            <label>School</label>
                                            <span>{result.schoolName}</span>
                                        </div>
                                        <div className="result-info-item">
                                            <label>Exam Session</label>
                                            <span>{result.examSession}</span>
                                        </div>
                                        <div className="result-info-item">
                                            <label>Issued Date</label>
                                            <span>
                                                {new Date(result.issuedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                        background: "#FEF2F2",
                                        borderRadius: "12px",
                                    }}
                                >
                                    <XCircle
                                        size={48}
                                        color="var(--color-error)"
                                        style={{ margin: "0 auto 8px" }}
                                    />
                                    <h3 style={{ color: "var(--color-error)" }}>
                                        Certificate Revoked
                                    </h3>
                                    <p style={{ fontSize: "0.85rem", color: "#991B1B" }}>
                                        This certificate has been revoked by the board. Please
                                        contact the EBRR office for details.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
