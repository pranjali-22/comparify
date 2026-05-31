import { useNavigate } from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="hero">
                <h1>Comparify</h1>
                <p>Compare rides and food delivery in seconds</p>
            </div>

            <div className="card-grid">
                <div
                    className="feature-card"
                    onClick={() => navigate("/cabs")}
                >
                    <div className="icon">🚕</div>

                    <h2>Compare Cabs</h2>

                    <p>
                        Compare fares across ride providers and
                        choose the best option.
                    </p>
                </div>

                <div
                    className="feature-card"
                    onClick={() => navigate("/food")}
                >
                    <div className="icon">🍔</div>

                    <h2>Find Food</h2>

                    <p>
                        Discover restaurants nearby and compare
                        delivery options instantly.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;