
import { Link, useLocation } from "react-router-dom";

function BottomNav() {
    const location = useLocation();

    return (
        <div className="bottom-nav">
            <Link
                className={
                    location.pathname === "/"
                        ? "nav-btn active"
                        : "nav-btn"
                }
                to="/"
            >
                🚕 Cabs
            </Link>

            <Link
                className={
                    location.pathname === "/food"
                        ? "nav-btn active"
                        : "nav-btn"
                }
                to="/food"
            >
                🍴 Food
            </Link>
        </div>
    );
}

export default BottomNav;