import { BrowserRouter, Routes, Route } from "react-router-dom";
import SymptomPage from "../pages/symptoms";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/symptoms" element={<SymptomPage />} />
        </Routes>
    )
}