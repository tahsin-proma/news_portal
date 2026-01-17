import { useState } from "react";
import { AuthService } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await AuthService.register(formData.name, formData.email, formData.password, formData.role);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please check your details.");
        }
    };

    return (
        <div className="flex-center animate-enter" style={{ minHeight: 'calc(100vh - var(--header-height))', padding: '1rem' }}>
            <div className="card" style={{ maxWidth: "480px", width: "100%", padding: '2rem' }}>
                <div className="flex-col gap-3" style={{ textAlign: 'center', marginBottom: '2rem', alignItems: 'center' }}>
                    <Logo size={40} fontSize="2rem" />
                    <p className="text-muted" style={{ fontSize: '0.95rem' }}>Start your journey with premium journalism.</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-col gap-5">
                    <div className="flex-col gap-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="input-field"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input-field"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex-col gap-2">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">
                            I want to be a...
                        </label>

                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            {/* Reader */}
                            <label
                                className="cursor-pointer transition-all"
                                style={{
                                    flex: "1 1 140px",
                                    minHeight: "110px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    gap: "0.25rem",
                                    background:
                                        formData.role === "user"
                                            ? "rgba(59, 130, 246, 0.08)"
                                            : "var(--bg-input)",
                                    border: `1px solid ${formData.role === "user"
                                        ? "var(--primary)"
                                        : "var(--border-light)"
                                        }`,
                                    borderRadius: "var(--radius-md)",
                                }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={formData.role === "user"}
                                    onChange={handleChange}
                                    style={{ display: "none" }}
                                />
                                <span
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        color:
                                            formData.role === "user" ? "white" : "var(--text-muted)",
                                    }}
                                >
                                    Reader
                                </span>
                                <span
                                    className="text-sm text-dim"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    Read and comment
                                </span>
                            </label>

                            {/* Author */}
                            <label
                                className="cursor-pointer transition-all"
                                style={{
                                    flex: "1 1 140px",
                                    minHeight: "110px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    gap: "0.25rem",
                                    background:
                                        formData.role === "author"
                                            ? "rgba(59, 130, 246, 0.08)"
                                            : "var(--bg-input)",
                                    border: `1px solid ${formData.role === "author"
                                        ? "var(--primary)"
                                        : "var(--border-light)"
                                        }`,
                                    borderRadius: "var(--radius-md)",
                                }}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="author"
                                    checked={formData.role === "author"}
                                    onChange={handleChange}
                                    style={{ display: "none" }}
                                />
                                <span
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        color:
                                            formData.role === "author" ? "white" : "var(--text-muted)",
                                    }}
                                >
                                    Author
                                </span>
                                <span
                                    className="text-sm text-dim"
                                    style={{ fontSize: "0.75rem" }}
                                >
                                    Publish news
                                </span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', height: '48px', width: '100%' }}>
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <p className="text-muted text-sm">
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;