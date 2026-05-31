import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import CabComparisonPage from "./pages/CabComparisonPage";
import FoodSearchPage from "./pages/FoodSearchPage";
import PickupLocationPage from "./pages/location/PickupLocationPage.tsx";
import DropOffLocationPage from "./pages/location/DropOffLocationPage.tsx";
import CabPricesPage from "./pages/prices/CabPricesPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/cabs" element={<CabComparisonPage />} />
                <Route path="/food" element={<FoodSearchPage />} />
                <Route
                    path="/pickup-location"
                    element={<PickupLocationPage />}
                />
                <Route
                    path="/dropOff-location"
                    element={<DropOffLocationPage />}
                />
                <Route
                    path="/cab-prices"
                    element={<CabPricesPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;