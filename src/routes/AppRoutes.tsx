import {BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home.tsx"
import Login from "../pages/Login.tsx";
import AdminDashboard from "../pages/AdminDashboard";

export default function AppRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/admin" element={<AdminDashboard/>} />
            </Routes>
        </BrowserRouter>
    );
}