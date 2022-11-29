import { Routes, Route } from "react-router-dom";
import CheckDisease from "../pages/check-disease";
import Home from "../pages/home";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/check-symptoms" element={<CheckDisease />} />
        </Routes>
    )
}