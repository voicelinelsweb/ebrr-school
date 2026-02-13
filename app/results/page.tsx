"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import {
    Search,
    FileCheck,
    Download,
    CheckCircle,
    XCircle,
} from "lucide-react";

export default function ResultsPage() {
    const [searchType, setSearchType] = useState<"roll" | "board">("roll");
    const [searchValue, setSearchValue] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const resultByRoll = useQuery(
        api.publicResults.searchResult,
        submitted && searchType === "roll" && searchValue
            ? { rollNumber: searchValue }
            : "skip"
    );

    const resultByBoard = useQuery(
        api.publicResults.searchResult,
        submitted && searchType === "board" && searchValue
            ? { boardRegId: searchValue }
            : "skip"
    );

    const result = searchType === "roll" ? resultByRoll : resultByBoard;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            setSubmitted(true);
        }
    };

    const handleReset = () => {
        setSearchValue("");
        setSubmitted(false);
    };

    return (
        <>
            <Header />

            <div className="page-header">
                <div className="container">
                    <h1>Results Portal</h1>
                    <p>Search for published examination results using your Board ID or Roll Number.</p>
                </div>
            </div>

            <section className="section">
                <div className="container" style={{ maxWidth: "800px" }}>
                    {/* Search Form */}
                    <div className="card" style={{ marginBottom: "32px" }}>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "20px" }}>
                            <FileCheck
                                size={20}
                                style={{ verticalAlign: "middle", marginRight: "8px" }}
                            />
                            Search Results
                        </h3>

                        <div className="tabs" style={{ marginBottom: "20px" }}>
                            <button
                                className={`tab ${searchType === "roll" ? "active" : ""}`}
                                onClick={() => { setSearchType("roll"); handleReset(); }}
                            >
                                By Roll Number
                            </button>
                            <button
                                className={`tab ${searchType === "board" ? "active" : ""}`}
                                onClick={() => { setSearchType("board"); handleReset(); }}
                            >
                                By Board Reg. ID
                            </button>
                        </div>

                        <form onSubmit={handleSearch}>
                            <div className="form-group">
                                <label>
                                    {searchType === "roll"
                                        ? "Exam Roll Number"
                                        : "Board Registration ID"}
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder={
                                        searchType === "roll"
                                            ? "e.g. ANN-2025-00001"
                                            : "e.g. EBRR-2025-SCH001-ABCD"
                                    }
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.target.value);
                                        setSubmitted(false);
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button type="submit" className="btn btn-primary">
                                    <Search size={16} />
                                    Search
                                </button>
                                {submitted && (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        onClick={handleReset}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Results Display */}
                    {submitted && result === undefined && (
                        <div className="loading">
                            <div className="loading-spinner" />
                        </div>
                    )}

                    {submitted && result === null && (
                        <div className="alert alert-warning">
                            <XCircle size={20} />
                            No results found. Please check your{" "}
                            {searchType === "roll" ? "Roll Number" : "Board Registration ID"}{" "}
                            and try again.
                        </div>
                    )}

                    {submitted && result && !Array.isArray(result) && (
                        <div className="result-display">
                            <div className="result-header">
                                <h3>Examination Result</h3>
                                <p
                                    style={{
                                        color: "rgba(255,255,255,0.7)",
                                        fontSize: "0.9rem",
                                        marginTop: "4px",
                                    }}
                                >
                                    {result.examSessionName}
                                </p>
                            </div>
                            <div className="result-body">
                                <div className="result-info-grid">
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
                                        <label>Roll Number</label>
                                        <span>{result.rollNumber}</span>
                                    </div>
                                </div>

                                {/* Marks Table */}
                                {result.subjectMarks && result.subjectMarks.length > 0 && (
                                    <div className="table-wrapper" style={{ marginBottom: "24px" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Full Marks</th>
                                                    <th>Pass Marks</th>
                                                    <th>Obtained</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.subjectMarks.map((s, i) => (
                                                    <tr key={i}>
                                                        <td>
                                                            <strong>{s.subjectName}</strong>
                                                            <br />
                                                            <span className="text-xs text-muted">
                                                                {s.subjectCode}
                                                            </span>
                                                        </td>
                                                        <td>{s.fullMarks}</td>
                                                        <td>{s.passMarks}</td>
                                                        <td>
                                                            <strong>
                                                                {s.isAbsent ? "Absent" : s.marksObtained}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            {s.isAbsent ? (
                                                                <span className="status-badge status-fail">
                                                                    Absent
                                                                </span>
                                                            ) : s.marksObtained >= s.passMarks ? (
                                                                <span className="status-badge status-pass">
                                                                    Pass
                                                                </span>
                                                            ) : (
                                                                <span className="status-badge status-fail">
                                                                    Fail
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Summary */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: "12px",
                                        background: "var(--color-neutral-50)",
                                        padding: "20px",
                                        borderRadius: "12px",
                                    }}
                                >
                                    <div style={{ textAlign: "center" }}>
                                        <div className="text-xs text-muted font-semibold">
                                            TOTAL
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: 800,
                                                color: "var(--color-primary-900)",
                                            }}
                                        >
                                            {result.obtainedMarks}/{result.totalMarks}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div className="text-xs text-muted font-semibold">
                                            PERCENTAGE
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: 800,
                                                color: "var(--color-primary-900)",
                                            }}
                                        >
                                            {result.percentage}%
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div className="text-xs text-muted font-semibold">GPA</div>
                                        <div
                                            style={{
                                                fontSize: "1.5rem",
                                                fontWeight: 800,
                                                color: "var(--color-primary-900)",
                                            }}
                                        >
                                            {result.gpa} ({result.grade})
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div className="text-xs text-muted font-semibold">
                                            RESULT
                                        </div>
                                        <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                                            {result.passStatus === "pass" ? (
                                                <span style={{ color: "var(--color-success)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                                    <CheckCircle size={22} /> PASS
                                                </span>
                                            ) : (
                                                <span style={{ color: "var(--color-error)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                                                    <XCircle size={22} /> FAIL
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Verification */}
                                <div
                                    style={{
                                        marginTop: "20px",
                                        textAlign: "center",
                                        fontSize: "0.8rem",
                                        color: "var(--color-neutral-400)",
                                    }}
                                >
                                    Verification Code:{" "}
                                    <strong style={{ color: "var(--color-neutral-700)" }}>
                                        {result.verificationCode}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Multiple results (board ID search) */}
                    {submitted && result && Array.isArray(result) && result.length > 0 && (
                        <div>
                            <h3 style={{ marginBottom: "16px" }}>
                                Results for {result[0].studentName}
                            </h3>
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Roll Number</th>
                                            <th>Marks</th>
                                            <th>Percentage</th>
                                            <th>GPA</th>
                                            <th>Grade</th>
                                            <th>Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map((r, i) => (
                                            <tr key={i}>
                                                <td><strong>{r.rollNumber}</strong></td>
                                                <td>{r.obtainedMarks}/{r.totalMarks}</td>
                                                <td>{r.percentage}%</td>
                                                <td>{r.gpa}</td>
                                                <td>{r.grade}</td>
                                                <td>
                                                    <span
                                                        className={`status-badge ${r.passStatus === "pass" ? "status-pass" : "status-fail"}`}
                                                    >
                                                        {r.passStatus.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}
