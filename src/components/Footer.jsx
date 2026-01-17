import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
    return (
        <footer
            style={{
                borderTop: "1px solid var(--border-light)",
                padding: "1.75rem 0",
                marginTop: "auto",
                background: "var(--bg-primary)",
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                }}
            >
                {/* Brand */}
                <Logo size={24} fontSize="1.1rem" />

                {/* Navigation */}
                <div
                    className="hide-mobile"
                    style={{
                        display: "flex",
                        gap: "1.5rem",
                        fontSize: "0.85rem",
                    }}
                >
                    <Link to="/" className="text-dim hover:text-white">
                        About
                    </Link>
                    <Link to="/" className="text-dim hover:text-white">
                        Authors
                    </Link>
                    <Link to="/" className="text-dim hover:text-white">
                        Privacy
                    </Link>
                    <Link to="/" className="text-dim hover:text-white">
                        Terms
                    </Link>
                </div>

                {/* Social */}
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.85rem",
                        opacity: 0.8,
                    }}
                >
                    <span className="hover:text-white">Twitter</span>
                    <span className="hover:text-white">LinkedIn</span>
                    <span className="hover:text-white">RSS</span>
                </div>
            </div>

            {/* Copyright */}
            <div
                className="container"
                style={{
                    marginTop: "0.75rem",
                    fontSize: "0.75rem",
                    opacity: 0.45,
                    textAlign: "center",
                }}
            >
                © 2026 DailyBrief Media Group. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
