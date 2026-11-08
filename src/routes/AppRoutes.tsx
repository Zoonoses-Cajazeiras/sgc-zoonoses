
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import AdminDashboard from "../pages/AdminDashboard";
import RegisterTutor from "../pages/RegisterTutor.tsx";
import VerifyEmail from "../pages/VerifyEmail.tsx";
import TutorProfile from "../pages/TutorProfile";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<RegisterTutor />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/verificar-email" element={<VerifyEmail />} />
                <Route path="/perfil" element={<TutorProfile />} />
            </Routes>
        </BrowserRouter>
    );
}
