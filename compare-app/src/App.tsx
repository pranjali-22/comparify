import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import CabComparisonPage from "./pages/CabComparisonPage";
import FoodSearchPage from "./pages/FoodSearchPage";
import PickupLocationPage from "./pages/PickupLocationPage.tsx";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;