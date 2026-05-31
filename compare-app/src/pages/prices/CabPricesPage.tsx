function CabPricesPage() {
    return (
        <>
            <style>
                {`
                    body {
                        margin: 0;
                        background: #f5f7fb;
                        font-family: Inter, sans-serif;
                    }

                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 40px;
                    }

                    .title {
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin-bottom: 10px;
                    }

                    .subtitle {
                        color: #6b7280;
                        margin-bottom: 30px;
                    }
                `}
            </style>

            <div className="container">
                <h1 className="title">
                    Cab Fare Estimates
                </h1>

                <p className="subtitle">
                    Compare prices from different cab providers
                </p>
            </div>
        </>
    );
}

export default CabPricesPage;