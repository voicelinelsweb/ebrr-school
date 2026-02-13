"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
    const { signIn } = useAuthActions();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn("password", { email, password, flow: "signIn" });
            router.push("/dashboard");
        } catch {
            setError("Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "24px",
                    }}
                >
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            background: "linear-gradient(135deg, var(--color-primary-700), var(--color-accent-500))",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                        }}
                    >
                        <GraduationCap size={30} />
                    </div>
                </div>

                <h1>EBRR Dashboard</h1>
                <p className="subtitle">
                    Sign in to the management system
                </p>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: "20px" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                style={{ paddingRight: "44px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    color: "var(--color-neutral-400)",
                                    cursor: "pointer",
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                        style={{ padding: "14px", fontSize: "0.95rem" }}
                    >
                        <LogIn size={18} />
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p
                    style={{
                        textAlign: "center",
                        fontSize: "0.8rem",
                        color: "var(--color-neutral-400)",
                        marginTop: "24px",
                    }}
                >
                    Access is restricted to authorized EBRR staff only.
                    <br />
                    Contact the board administrator for access.
                </p>
            </div>
        </div>
    );
}
