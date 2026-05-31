import { useNavigate } from "react-router-dom";

function CabComparisonPage() {
    const navigate = useNavigate();

    const pickupLocation = JSON.parse(
        localStorage.getItem("pickupLocation") || "null"
    );

    const dropOffLocation = JSON.parse(
        localStorage.getItem("dropOffLocation") || "null"
    );

    const canGetFares =
        pickupLocation && dropOffLocation;

    return (
        <>
            <style>
                {`
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    background: #f5f7fb;
                    font-family: Inter, sans-serif;
                }

                .cab-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 40px;
                }

                .cab-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .cab-subtitle {
                    font-size: 1.1rem;
                    color: #6b7280;
                    margin-bottom: 40px;
                }

                .routes-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .routes-header h2 {
                    margin: 0;
                    font-size: 1.8rem;
                }

                .swap-btn {
                    width: 52px;
                    height: 52px;
                    border: none;
                    border-radius: 14px;
                    background: #4f6ef7;
                    color: white;
                    cursor: pointer;
                    font-size: 1.1rem;
                }

                .location-card {
                    background: white;
                    border: 1px solid #d1d5db;
                    border-radius: 20px;
                    padding: 20px 24px;
                    margin-bottom: 18px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .location-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.08);
                }

                .label {
                    display: block;
                    margin-bottom: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                }

                .from {
                    color: #22c55e;
                }

                .to {
                    color: #ef4444;
                }

                .location-row {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .dot {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .green {
                    background: #22c55e;
                }

                .red {
                    background: #ef4444;
                }

                .location-content {
                    flex: 1;
                }

                .location-text {
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: #1f2937;
                }

                .location-address {
                    margin-top: 4px;
                    font-size: 0.85rem;
                    color: #6b7280;
                }

                .arrow {
                    color: #9ca3af;
                    font-size: 1.8rem;
                }

                .fare-btn {
                    width: 100%;
                    height: 72px;
                    margin-top: 18px;

                    border: none;
                    border-radius: 20px;

                    background: #4f6ef7;
                    color: white;

                    font-size: 1.5rem;
                    font-weight: 600;

                    cursor: pointer;

                    transition: all 0.2s ease;
                }

                .fare-btn:hover {
                    background: #4361ee;
                }

                .fare-btn:active {
                    transform: scale(0.99);
                }
                `}
            </style>

            <div className="cab-container">
                <h1 className="cab-title">
                    Compare Cab Fares
                </h1>

                <p className="cab-subtitle">
                    Find the cheapest ride for your journey
                </p>

                <div className="routes-header">
                    <h2>Routes</h2>

                    <button className="swap-btn">
                        ⇅
                    </button>
                </div>

                {/* Pickup */}
                <div
                    className="location-card"
                    onClick={() =>
                        navigate("/pickup-location")
                    }
                >
                    <span className="label from">
                        FROM
                    </span>

                    <div className="location-row">
                        <span className="dot green"></span>

                        <div className="location-content">
                            <div className="location-text">
                                {pickupLocation
                                    ? pickupLocation.name
                                    : "Set Pickup Location"}
                            </div>

                            {pickupLocation && (
                                <div className="location-address">
                                    {
                                        pickupLocation.formatted_address
                                    }
                                </div>
                            )}
                        </div>

                        <span className="arrow">
                            ›
                        </span>
                    </div>
                </div>

                {/* Dropoff */}
                <div
                    className="location-card"
                    onClick={() =>
                        navigate("/dropoff-location")
                    }
                >
                    <span className="label to">
                        TO
                    </span>

                    <div className="location-row">
                        <span className="dot red"></span>

                        <div className="location-content">
                            <div className="location-text">
                                {dropOffLocation
                                    ? dropOffLocation.name
                                    : "Set Drop-off Location"}
                            </div>

                            {dropOffLocation && (
                                <div className="location-address">
                                    {
                                        dropOffLocation.formatted_address
                                    }
                                </div>
                            )}
                        </div>

                        <span className="arrow">
                            ›
                        </span>
                    </div>
                </div>

                {/* Fare Button */}
                {canGetFares && (
                    <button
                        className="fare-btn"
                        onClick={() =>
                            navigate("/cab-prices")
                        }
                    >
                        Get Fare Estimates
                    </button>
                )}
            </div>
        </>
    );
}

export default CabComparisonPage;