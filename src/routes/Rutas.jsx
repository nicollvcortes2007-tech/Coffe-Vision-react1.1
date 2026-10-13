import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

// Páginas del caficultor
import DashboardCaficultor from "@/pages/DashboardCaficultor";
import Cultivos from "@/pages/cultivos";
import EstadisticasCultivo from "@/pages/estadisticascultivo";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      <Route
        path="/dashboard/caficultor"
        element={<DashboardCaficultor />}
      />
      <Route
        path="/caficultor/cultivos"
        element={<Cultivos />}
      />
      <Route
        path="/caficultor/estadisticas"
        element={<EstadisticasCultivo />}
      />
    </Routes>
  );
}

export default Rutas;




