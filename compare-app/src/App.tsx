import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import CabComparisonPage from "./pages/CabComparisonPage";
import FoodSearchPage from "./pages/FoodSearchPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/cabs" element={<CabComparisonPage />} />
                <Route path="/food" element={<FoodSearchPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;