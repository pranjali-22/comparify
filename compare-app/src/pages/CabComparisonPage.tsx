function CabComparisonPage() {
    return (
        <>
            <style>
                {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: #f5f7fb;
            font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
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
            color: #6b7280;
            font-size: 1.1rem;
            margin-bottom: 40px;
          }

          .routes-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .routes-header h2 {
            font-size: 1.8rem;
            color: #111827;
          }

          .swap-btn {
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 12px;
            background: #e5e7eb;
            color: #6b7280;
            cursor: pointer;
            font-size: 1.1rem;
            transition: 0.2s ease;
          }

          .swap-btn:hover {
            background: #d1d5db;
          }

          .location-card {
            background: white;
            border: 1px solid #d1d5db;
            border-radius: 20px;
            padding: 20px 24px;
            margin-bottom: 18px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.04);
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

          .location-text {
            flex: 1;
            font-size: 1.1rem;
            font-weight: 500;
            color: #1f2937;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .arrow {
            font-size: 1.8rem;
            color: #9ca3af;
            flex-shrink: 0;
          }

          @media (max-width: 768px) {
            .cab-container {
              padding: 24px;
            }

            .cab-title {
              font-size: 2rem;
            }

            .routes-header h2 {
              font-size: 1.5rem;
            }

            .location-text {
              font-size: 1rem;
            }
          }
        `}
            </style>

            <div className="cab-container">
                <h1 className="cab-title">Compare Cab Fares</h1>

                <p className="cab-subtitle">
                    Find the cheapest ride for your journey
                </p>

                <div className="routes-header">
                    <h2>Routes</h2>

                    <button className="swap-btn">
                        ⇅
                    </button>
                </div>

                <div className="location-card">
                    <span className="label from">FROM</span>

                    <div className="location-row">
                        <span className="dot green"></span>

                        <span className="location-text">
              Harshit Nagar Rd, behind Vishwakarma Mandir, Mohba Bazar,
              Raipur, Chhattisgarh 492099, India
            </span>

                        <span className="arrow">›</span>
                    </div>
                </div>

                <div className="location-card">
                    <span className="label to">TO</span>

                    <div className="location-row">
                        <span className="dot red"></span>

                        <span className="location-text">
              Set Drop-off Location
            </span>

                        <span className="arrow">›</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CabComparisonPage;