import React, { useState } from 'react';
import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/Dashboardadministrador/Topbar';
import { 
  kpisData, 
  usuariosIniciales, 
  estadisticasGenerales, 
  estadisticasPlagas 
} from '../datos/dashboardDatos';
import '@/estilos/dashboardadministrador.css';

function KpiCard({ titulo, valor, subtitulo }) {
  return <article className="card-panel"><p>{titulo}</p><strong>{valor}</strong><small>{subtitulo}</small></article>;
}

function FincaCard() {
  return <p>Hay fincas registradas para seguimiento y monitoreo.</p>;
}

function ProgressBar({ etiqueta, porcentaje }) {
  return (
    <div className="progress-item">
      <dt>{etiqueta}</dt>
      <dd><span style={{ width: `${porcentaje}%` }} /> {porcentaje}%</dd>
    </div>
  );
}

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

  const handleEliminarUsuario = (id) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  return (
    <PlantillaPrincipal role="administrador">
        <Topbar />

        {/* METRICAS / KPIs */}
        <section className="admin-main-content">
        <section className="kpi-grid">
          {kpisData.map((kpi, idx) => (
            <KpiCard key={idx} {...kpi} />
          ))}
        </section>

        {/* FORMULARIO AGREGAR USUARIO */}
        <section id="usuarios" className="card-panel">
          <h2 className="section-title">
            <i className="fa-solid fa-user-plus" style={{ marginRight: 8 }} aria-hidden="true" /> Agregar usuario
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
                        onClick={() => handleEliminarUsuario(usr.id)}
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
              <i className="fa-solid fa-shield-halved" style={{ marginRight: 8 }} aria-hidden="true" /> Estadísticas de Plagas
            </h2>
            <dl className="progress-group">
              {estadisticasPlagas.map((item, idx) => (
                <ProgressBar key={idx} {...item} />
              ))}
            </dl>
          </article>
        </section>
        </section>
    </PlantillaPrincipal>
  );
}
