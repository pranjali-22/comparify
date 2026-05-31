
import BottomNav from "../components/BottomNav.tsx";

function FoodSearchPage() {
    return (
        <div className="container">
            <div className="address">
                📍 Harshit Nagar Rd, Mohba Bazar,
                Raipur, Chhattisgarh
            </div>

            <div className="search-section">
                <h3>Find Food</h3>

                <input
                    placeholder="Search restaurants or dishes"
                />

                <button className="search-btn">
                    Search
                </button>
            </div>

            <div className="warning">
                Login to see more restaurants
            </div>

            <h2>Restaurants Near You</h2>

            <div className="restaurant-card">
                <img
                    src="https://images.unsplash.com/photo-1563379091339-03246963d96c"
                    alt="food"
                />

                <div className="content">
                    <h3>Galaxy Food Centre</h3>

                    <p>Amanaka, Mohba Bazar</p>

                    <p>Indian • Chinese • Fast Food</p>

                    <div className="platform swiggy">
                        <strong>Swiggy</strong>
                        <p>⭐ 4.3 | 35-45 mins | 1.2 km</p>
                    </div>

                    <div className="platform zomato">
                        <strong>Zomato</strong>
                        <p>⭐ 4.0 | 25-30 mins | 1 km</p>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}

export default FoodSearchPage;