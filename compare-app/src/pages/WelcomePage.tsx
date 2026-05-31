import { useNavigate } from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="hero">
                <h1>Comparify</h1>
                <p>
                    Compare cab fares and food delivery options in one place
                </p>
            </div>

            <div className="card-grid">
                <div
                    className="feature-card"
                    onClick={() => navigate("/cabs")}
                >
                    <div className="feature-icon">🚕</div>
                    <h2>Compare Cabs</h2>
                    <p>
                        Find the cheapest ride across Uber, Ola and other
                        providers.
                    </p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => navigate("/food")}
                >
                    <div className="feature-icon">🍔</div>
                    <h2>Find Food</h2>
                    <p>
                        Discover restaurants nearby and compare delivery
                        options.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;