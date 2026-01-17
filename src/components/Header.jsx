import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="container flex-between">
        {/* Branding */}
        <Logo fontSize="1.25rem" />

        {/* Navigation */}
        <nav className="flex-center gap-4">
          {user ? (
            <>
              <Link
                to="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Briefing
              </Link>

              {(user.role === 'author' || user.role === 'admin') && (
                <Link
                  to="/create"
                  className={`nav-link ${isActive("/create") ? "active" : ""}`}
                >
                  Write
                </Link>
              )}

              <div style={{ width: "1px", height: "24px", background: "var(--border-light)", margin: "0 0.5rem" }}></div>

              <div className="flex-center gap-4">
                <div className="flex-center gap-2">
                  <div
                    className="flex-center"
                    style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--border-light)", fontWeight: "bold", fontSize: "0.85rem" }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-sm font-medium hide-mobile" style={{ opacity: 0.9 }}>
                    {user.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm text-muted hover:text-white"
                  style={{ transition: "color 0.2s" }}
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}>
                Subscribe
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
