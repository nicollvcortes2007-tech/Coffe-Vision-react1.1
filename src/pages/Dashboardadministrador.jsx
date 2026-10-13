import React, { useState } from 'react';
import Sidebar from '../components/Dashboardadministrador/Sidebar';
import Topbar from '../components/Dashboardadministrador/Topbar';
import KpiCard from '../components/Dashboardadministrador/KpiCard';
import FincaCard from '../components/Dashboardadministrador/FincaCard';
import ProgressBar from '../components/Dashboardadministrador/ProgressBar';
import { UserPlus, ShieldAlert } from 'lucide-react';
import { 
  kpisData, 
  usuariosIniciales, 
  estadisticasGenerales, 
  estadisticasPlagas 
} from '../datos/dashboardDatos';

export default function Dashboardadministrador() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoRol, setNuevoRol] = useState('caficultor');

  const handleAgregarUsuario = (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const nuevoUsuario = {
      id: Date.now(),
      nombre: nuevoNombre,
      rol: nuevoRol === 'caficultor' ? 'Caficultor' : 'Administrador',
      estado: 'Activo'
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setNuevoNombre('');
  };

  const handleEliminarUsuario = (id, nombre) => {
    // Primera confirmación
    const c1 = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${nombre}?`);
    if (!c1) return;

    // Segunda confirmación
    const c2 = window.confirm(`¡ADVERTENCIA! Esta acción no se puede deshacer. ¿Deseas continuar eliminando a ${nombre}?`);
    if (!c2) return;

    // Tercera confirmación
    const c3 = window.confirm(`Confirmación final: ¿Realmente quieres proceder a eliminar a ${nombre}?`);
    if (!c3) return;

    // Bloqueo final de eliminación
    alert(`Acción denegada: No tienes permisos para eliminar al usuario ${nombre}.`);
  };

  return (
    <>
      <Sidebar />

      <main className="main-content">
        <Topbar />

        {/* METRICAS / KPIs */}
        <section className="kpi-grid">
          {kpisData.map((kpi, idx) => (
            <KpiCard key={idx} {...kpi} />
          ))}
        </section>

        {/* FORMULARIO AGREGAR USUARIO */}
        <section id="usuarios" className="card-panel">
          <h2 className="section-title">
            <UserPlus size={20} style={{ marginRight: 8 }} /> Agregar usuario
          </h2>
          <form className="user-form" onSubmit={handleAgregarUsuario}>
            <input
              type="text"
              placeholder="Nombre completo"
              className="form-input"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              required
            />
            <select
              className="form-select"
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
            >
              <option value="caficultor">Caficultor</option>
              <option value="administrador">Administrador</option>
            </select>
            <button type="submit" className="btn-primary">Guardar</button>
          </form>
        </section>

        {/* TABLA DE USUARIOS */}
        <section className="card-panel no-padding">
          <header className="panel-header">
            <h2 className="section-title">Usuarios Registrados</h2>
          </header>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usr) => (
                  <tr key={usr.id}>
                    <td className="font-bold">{usr.nombre}</td>
                    <td>{usr.rol}</td>
                    <td><span className="badge badge-success">{usr.estado}</span></td>
                    <td className="text-right">
                      <button
                        className="btn-danger-soft"
                        onClick={() => handleEliminarUsuario(usr.id, usr.nombre)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ESTADO DE FINCAS */}
        <section id="reportes" className="card-panel">
          <h2 className="section-title">Estado de las Fincas</h2>
          <FincaCard />
        </section>

        {/* ESTADÍSTICAS */}
        <section id="estadisticas" className="charts-grid">
          <article className="card-panel">
            <h2 className="section-title">Estadísticas Generales</h2>
            <dl className="progress-group">
              {estadisticasGenerales.map((item, idx) => (
                <ProgressBar key={idx} {...item} />
              ))}
            </dl>
          </article>

          <article className="card-panel">
            <h2 className="section-title">
              <ShieldAlert size={20} style={{ marginRight: 8 }} /> Estadísticas de Plagas
            </h2>
            <dl className="progress-group">
              {estadisticasPlagas.map((item, idx) => (
                <ProgressBar key={idx} {...item} />
              ))}
            </dl>
          </article>
        </section>
      </main>
    </>
  );
}