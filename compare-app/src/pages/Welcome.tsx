import { useNavigate } from "react-router-dom";

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <h1>Comparify</h1>
            <p>Compare food and cab prices easily</p>

            <div className="cards-container">
                <div
                    className="service-card"
                    onClick={() => navigate("/cabs")}
                >
                    <div className="icon">🚕</div>
                    <h2>Cabs</h2>
                    <p>Compare Uber, Ola and other ride fares</p>
                </div>

                <div
                    className="service-card"
                    onClick={() => navigate("/food")}
                >
                    <div className="icon">🍔</div>
                    <h2>Food</h2>
                    <p>Compare restaurants and delivery apps</p>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;