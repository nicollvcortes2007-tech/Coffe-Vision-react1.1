
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas públicas
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

// Páginas del caficultor
import DashboardCaficultor from '@/pages/DashboardCaficultor';
import Cultivos from '@/pages/cultivos';
import EstadisticasCultivo from '@/pages/estadisticascultivo';

function Rutas() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Signup />} />

      {/* Panel principal del caficultor */}
      <Route
        path="/dashboard/caficultor"
        element={<DashboardCaficultor />}
      />

      {/* Página de cultivos */}
      <Route
        path="/caficultor/cultivos"
        element={<Cultivos />}
      />

      {/* Estadísticas de los cultivos */}
      <Route
        path="/caficultor/estadisticas"
        element={<EstadisticasCultivo />}
      />

      {/* Redirección para rutas inexistentes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default Rutas;
