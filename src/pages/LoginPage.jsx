import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex-center animate-enter" style={{ minHeight: 'calc(100vh - var(--header-height))', padding: '1rem' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
        <div className="flex-col gap-3" style={{ textAlign: 'center', marginBottom: '2rem', alignItems: 'center' }}>
          <Logo size={40} fontSize="2.2rem" />
          <p className="text-muted" style={{ fontSize: '1rem' }}>
            Enter your credentials to access your daily briefing.
          </p>
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
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />
          </div>
          <div className="flex-col gap-2">
            <label className="text-xs font-bold text-muted uppercase tracking-wider">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', height: '48px', width: '100%' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '2rem', pt: '1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'center', paddingTop: '1.5rem' }}>
          <p className="text-muted text-sm">
            New to DailyBrief? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account</Link>
          </p>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Demo Credentials</p>
            <div className="flex-col gap-2" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              <div className="flex-between"><span>Author:</span> <code style={{ color: 'var(--primary)' }}>alice@example.com / password123</code></div>
              <div className="flex-between"><span>Reader:</span> <code style={{ color: 'var(--primary)' }}>karim@example.com / password123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;