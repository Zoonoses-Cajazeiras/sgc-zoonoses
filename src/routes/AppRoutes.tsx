
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home.tsx";
import Login from "../pages/Login.tsx";
import AdminDashboard from "../pages/AdminDashboard.tsx";
import CampaignManagement from "../pages/CampaignManagement.tsx";
import RegisterTutor from "../pages/RegisterTutor.tsx";
import VerifyEmail from "../pages/VerifyEmail.tsx";
import TutorProfile from "../pages/TutorProfile.tsx";
import RegisterAnimal from "../pages/RegisterAnimal.tsx";
import AdminTutors from "../pages/AdminTutors";
import NewSolicitation from "../pages/NewSolicitation.tsx";
import MySolicitations from "../pages/MySolicitations.tsx";
import SolicitationDetails from "../pages/SolicitationDetails.tsx";
import AdminSolicitations from "../pages/AdminSolicitations";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<RegisterTutor />} />
                <Route path="/verificar-email" element={<VerifyEmail />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                    path="/admin/campanhas"
                    element={<CampaignManagement />}
                />
                <Route path="/admin/tutores" element={<AdminTutors />} />
                <Route
                    path="/admin/solicitacoes"
                    element={<AdminSolicitations />}
                />

                <Route path="/perfil" element={<TutorProfile />} />
                <Route path="/animais/cadastrar" element={<RegisterAnimal />} />
                <Route path="/animais/editar/:id" element={<RegisterAnimal />} />

                <Route
                    path="/solicitacoes/nova"
                    element={<NewSolicitation />}
                />

                <Route
                    path="/solicitacoes/minhas"
                    element={<MySolicitations />}
                />

                <Route
                    path="/solicitacoes/:id"
                    element={<SolicitationDetails />}
                />
            </Routes>
        </BrowserRouter>
    );
}
