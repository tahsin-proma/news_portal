import { Link } from "react-router-dom";

const Logo = ({ size = 30, fontSize = "1.25rem", iconOnly = false }) => {
    return (
        <Link to="/" className="flex-center" style={{ textDecoration: "none", gap: '0.75rem' }}>
            <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" stroke="var(--primary)" strokeWidth="2.5" />
                <path d="M18 7L11 17H17L14 25L21 15H15L18 7Z" fill="var(--primary)" />
            </svg>
            {!iconOnly && (
                <span style={{ fontSize: fontSize, fontWeight: 800, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
                    Daily<span style={{ color: "var(--primary)" }}>Brief</span>.
                </span>
            )}
        </Link>
    );
};

export default Logo;
