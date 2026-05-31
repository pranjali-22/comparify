import { useState } from "react";

function PickupLocationPage() {
    const [search, setSearch] = useState("");

    const addresses = [
        {
            title: "Railway Station",
            address:
                "Station Road, Moudhapara, Raipur, Chhattisgarh, India",
        },
        {
            title: "Railway Station Taxi Stand",
            address:
                "Station Road, Moudhapara, Raipur, Chhattisgarh, India",
        },
        {
            title: "Airport Road",
            address:
                "Mana, Raipur, Chhattisgarh, India",
        },
    ];

    return (
        <>
            <style>
                {`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #f6f8fc;
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
          }

          .pickup-page {
            min-height: 100vh;
          }

          .header {
            padding: 32px 40px 24px;
            border-bottom: 1px solid #e5e7eb;
            background: white;
          }

          .title {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
            color: #0f172a;
          }

          .subtitle {
            margin-top: 8px;
            color: #64748b;
            font-size: 1.1rem;
          }

          .content {
            max-width: 820px;
            margin: 0 auto;
            padding: 24px;
          }

          .search-box {
            height: 72px;

            background: white;

            border: 1px solid #d7dce5;
            border-radius: 22px;

            display: flex;
            align-items: center;

            padding: 0 24px;

            margin-bottom: 20px;
          }

          .search-icon {
            font-size: 1.4rem;
            color: #4f7cff;
          }

          .search-box input {
            border: none;
            outline: none;
            width: 100%;

            margin-left: 16px;

            font-size: 1.2rem;
            background: transparent;
          }

          .current-location {
            background: #eef3ff;

            border: 1px solid #d9e4ff;

            border-radius: 24px;

            padding: 24px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            cursor: pointer;

            transition: 0.2s ease;
          }

          .current-location:hover {
            background: #e7efff;
          }

          .location-left {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .location-icon {
            width: 52px;
            height: 52px;

            border-radius: 50%;

            background: rgba(79,124,255,0.12);

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 1.5rem;
          }

          .location-title {
            font-size: 1.7rem;
            font-weight: 600;
            color: #3b5bdb;
          }

          .location-subtitle {
            margin-top: 4px;
            color: #5c7cfa;
            font-size: 1.05rem;
          }

          .arrow-btn {
            width: 48px;
            height: 48px;

            border-radius: 16px;

            background: rgba(255,255,255,0.5);

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 1.4rem;
            color: #4f7cff;
          }

          .results {
            margin-top: 28px;
          }

          .address-card {
            background: white;

            border: 1px solid #d7dce5;
            border-radius: 24px;

            padding: 24px;

            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            margin-bottom: 14px;

            cursor: pointer;

            transition: 0.2s ease;
          }

          .address-card:hover {
            border-color: #4f7cff;
            background: #fbfcff;
          }

          .address-left {
            display: flex;
            gap: 18px;
          }

          .pin {
            width: 44px;
            height: 44px;

            border-radius: 50%;

            background: #f2f5ff;

            display: flex;
            align-items: center;
            justify-content: center;

            flex-shrink: 0;
          }

          .address-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 6px;
          }

          .address-subtitle {
            color: #6b7280;
            line-height: 1.5;
            font-size: 1.05rem;
          }

          .card-arrow {
            color: #9ca3af;
            font-size: 1.6rem;
            margin-left: 16px;
          }
        `}
            </style>

            <div className="pickup-page">
                <div className="header">
                    <h1 className="title">Set Pickup Location</h1>

                    <div className="subtitle">
                        Enter your pickup address
                    </div>
                </div>

                <div className="content">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>

                        <input
                            placeholder="Search for an address..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="current-location">
                        <div className="location-left">
                            <div className="location-icon">
                                📍
                            </div>

                            <div>
                                <div className="location-title">
                                    Use Current Location
                                </div>

                                <div className="location-subtitle">
                                    Automatically detect your current position
                                </div>
                            </div>
                        </div>

                        <div className="arrow-btn">
                            ›
                        </div>
                    </div>

                    <div className="results">
                        {addresses.map((address) => (
                            <div
                                className="address-card"
                                key={address.title}
                            >
                                <div className="address-left">
                                    <div className="pin">
                                        📍
                                    </div>

                                    <div>
                                        <div className="address-title">
                                            {address.title}
                                        </div>

                                        <div className="address-subtitle">
                                            {address.address}
                                        </div>
                                    </div>
                                </div>

                                <div className="card-arrow">
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