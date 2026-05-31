import { useState } from "react";

interface Location {
    id: string;
    name: string;
    fullAddress: string;
    lat: number;
    lng: number;
}

function PickupLocationPage() {
    const [search, setSearch] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!search.trim()) return;

        try {
            setLoading(true);
            console.log(encodeURIComponent(search))
            const response = await fetch(
                `http://localhost:3000/api/locations?q=${encodeURIComponent(search)}`
            );


            const data = await response.json();
            console.log(data.results)

            setLocations(data.results || []);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationSelect = (location: Location) => {
        console.log("Selected:", location);

        // Later:
        // Save location
        // Navigate back
    };

    return (
        <>
            <style>
                {`
                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        background: #f8fafc;
                        font-family: Inter, sans-serif;
                    }

                    .pickup-page {
                        min-height: 100vh;
                    }

                    .header {
                        background: white;
                        border-bottom: 1px solid #e5e7eb;
                        padding: 24px 32px;
                    }

                    .title {
                        margin: 0;
                        font-size: 2rem;
                        font-weight: 700;
                        color: #111827;
                    }

                    .subtitle {
                        margin-top: 6px;
                        color: #64748b;
                        font-size: 0.95rem;
                    }

                    .content {
                        max-width: 850px;
                        margin: 0 auto;
                        padding: 24px;
                    }

                    .search-container {
                        display: flex;
                        gap: 12px;
                        margin-bottom: 24px;
                    }

                    .search-input {
                        flex: 1;
                        height: 52px;

                        border: 1px solid #d1d5db;
                        border-radius: 16px;

                        padding: 0 16px;

                        font-size: 1rem;
                        outline: none;
                    }

                    .search-input:focus {
                        border-color: #2563eb;
                    }

                    .search-btn {
                        border: none;
                        background: #2563eb;
                        color: white;

                        padding: 0 24px;

                        border-radius: 16px;

                        cursor: pointer;

                        font-weight: 600;
                        font-size: 0.95rem;
                    }

                    .search-btn:hover {
                        background: #1d4ed8;
                    }

                    .loading {
                        color: #6b7280;
                        margin-bottom: 16px;
                    }

                    .results {
                        margin-top: 20px;
                    }

                    .location-card {
                        background: white;

                        border: 1px solid #d9dee8;
                        border-radius: 22px;

                        padding: 22px;

                        margin-bottom: 14px;

                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;

                        cursor: pointer;

                        transition: all 0.2s ease;
                    }

                    .location-card:hover {
                        border-color: #c7d2fe;
                        background: #fafcff;
                    }

                    .location-left {
                        display: flex;
                        gap: 18px;
                        flex: 1;
                    }

                    .pin-icon {
                        width: 42px;
                        height: 42px;

                        border-radius: 50%;

                        background: #eef2ff;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        flex-shrink: 0;

                        font-size: 1rem;
                    }

                    .location-details {
                        flex: 1;
                    }

                    .location-name {
                        font-size: 1.15rem;
                        font-weight: 600;
                        color: #111827;

                        margin-bottom: 8px;
                    }

                    .location-address {
                        color: #6b7280;

                        font-size: 0.95rem;

                        line-height: 1.6;
                    }

                    .location-arrow {
                        width: 44px;
                        height: 44px;

                        border-radius: 14px;

                        background: #f8fafc;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        color: #6b7280;

                        font-size: 1.5rem;

                        margin-left: 16px;
                    }

                    .empty {
                        color: #6b7280;
                        margin-top: 20px;
                    }
                `}
            </style>

            <div className="pickup-page">
                <div className="header">
                    <h1 className="title">
                        Set Pickup Location
                    </h1>

                    <div className="subtitle">
                        Search and select your pickup address
                    </div>
                </div>

                <div className="content">
                    <div className="search-container">
                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search location..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <button
                            className="search-btn"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    {loading && (
                        <div className="loading">
                            Searching locations...
                        </div>
                    )}

                    {!loading &&
                        search &&
                        locations.length === 0 && (
                            <div className="empty">
                                No locations found.
                            </div>
                        )}

                    <div className="results">
                        {locations.map((location) => (
                            <div
                                key={location.id}
                                className="location-card"
                                onClick={() =>
                                    handleLocationSelect(location)
                                }
                            >
                                <div className="location-left">
                                    <div className="pin-icon">
                                        📍
                                    </div>

                                    <div className="location-details">
                                        <div className="location-name">
                                            {location.name}
                                        </div>

                                        <div className="location-address">
                                            {location.fullAddress}
                                        </div>
                                    </div>
                                </div>

                                <div className="location-arrow">
                                    ›
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PickupLocationPage;