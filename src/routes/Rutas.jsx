import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Páginas del caficultor
import DashboardCaficultor from "@/pages/DashboardCaficultor";
import Estadisticas from "@/pages/Estadisticascultivo";
import Cultivos from '@/pages/Cultivos';
// Páginas del administrador


function Rutas() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Caficultor */}
      <Route path="/dashboard/caficultor" element={<DashboardCaficultor />} />
      <Route path="/caficultor/estadisticas" element={<Estadisticas />} />
      <Route path="/caficultor/cultivos" element={<Cultivos />} />

    </Routes>
  );
}

export default Rutas;
