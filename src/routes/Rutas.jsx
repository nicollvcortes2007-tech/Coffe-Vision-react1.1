import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Páginas del caficultor
import DashboardCaficultor from "@/pages/DashboardCaficultor";

// Páginas del administrador
import Dashboardadministrador from "@/pages/Dashboardadministrador";

function Rutas() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Caficultor */}
      <Route path="/dashboard/caficultor" element={<DashboardCaficultor />} />

      {/* Administrador */}
      <Route path="/dashboard/administrador" element={<Dashboardadministrador />} />
    </Routes>
  );
}

export default Rutas;