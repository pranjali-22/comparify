import { useState } from "react";

function DropOfLocationPage() {
    const [search, setSearch] = useState("");

    const addresses = [
        {
            title: "Railway Station",
            address: "Station Road, Moudhapara, Raipur",
        },
        {
            title: "Airport Road",
            address: "Mana, Raipur, Chhattisgarh",
        },
        {
            title: "Pandri Bus Stand",
            address: "Pandri, Raipur, Chhattisgarh",
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
            background: #f8fafc;
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
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
            max-width: 700px;
            margin: 0 auto;
            padding: 24px;
          }

          .search-box {
            height: 56px;
            background: white;
            border: 1px solid #dbe2ea;
            border-radius: 16px;

            display: flex;
            align-items: center;

            padding: 0 18px;
            margin-bottom: 16px;
          }

          .search-icon {
            color: #64748b;
          }

          .search-box input {
            border: none;
            outline: none;
            background: transparent;

            width: 100%;
            margin-left: 12px;

            font-size: 1rem;
          }

          .current-location {
            background: #eef4ff;
            border: 1px solid #d7e3ff;
            border-radius: 16px;

            padding: 16px 18px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            cursor: pointer;
            transition: 0.2s;
          }

          .current-location:hover {
            background: #e7efff;
          }

          .location-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .location-icon {
            width: 40px;
            height: 40px;

            border-radius: 50%;

            background: rgba(59,130,246,0.12);

            display: flex;
            align-items: center;
            justify-content: center;
          }

          .location-title {
            font-size: 1rem;
            font-weight: 600;
            color: #2563eb;
          }

          .location-subtitle {
            font-size: 0.85rem;
            color: #4f7cff;
            margin-top: 2px;
          }

          .section-title {
            margin-top: 28px;
            margin-bottom: 12px;

            font-size: 1rem;
            font-weight: 600;
            color: #374151;
          }

          .address-card {
            background: white;

            border: 1px solid #e5e7eb;
            border-radius: 16px;

            padding: 14px 18px;

            display: flex;
            justify-content: space-between;
            align-items: center;

            margin-bottom: 10px;

            cursor: pointer;
            transition: 0.2s;
          }

          .address-card:hover {
            border-color: #3b82f6;
            background: #fbfdff;
          }

          .address-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .pin {
            width: 34px;
            height: 34px;

            border-radius: 50%;

            background: #f1f5f9;

            display: flex;
            align-items: center;
            justify-content: center;

            flex-shrink: 0;
          }

          .address-title {
            font-size: 0.95rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 2px;
          }

          .address-subtitle {
            font-size: 0.82rem;
            color: #6b7280;
          }

          .arrow {
            color: #9ca3af;
            font-size: 1.2rem;
          }
        `}
            </style>

            <div className="pickup-page">
                <div className="header">
                    <h1 className="title">Set Drop Off Location</h1>
                    <div className="subtitle">
                        Enter your drop off address
                    </div>
                </div>

                <div className="content">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>

                        <input
                            type="text"
                            placeholder="Search for an address..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
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
                                    Automatically detect your location
                                </div>
                            </div>
                        </div>

                        <div className="arrow">›</div>
                    </div>

                    <div className="section-title">
                        Recent Locations
                    </div>

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

                            <div className="arrow">›</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default DropOfLocationPage;