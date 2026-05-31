
import BottomNav from '../components/BottomNav.tsx';

function CabComparisonPage() {
    return (
        <div className="container">
            <h1>Compare Cab Fares</h1>
            <p>Find the cheapest ride for your journey</p>

            <div className="warning">
                Optional sign-in for Uber and Ola
            </div>

            <h3>Routes</h3>

            <div className="route-card">
                <span>FROM</span>
                <p>
                    Harshit Nagar Rd, Mohba Bazar,
                    Raipur, Chhattisgarh
                </p>
            </div>

            <div className="route-card">
                <span>TO</span>
                <p>Set Drop-off Location</p>
            </div>

            <BottomNav />
        </div>
    );
}


export default CabComparisonPage;