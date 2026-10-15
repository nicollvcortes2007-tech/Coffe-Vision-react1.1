import React, { useState } from 'react';
import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';
import { 
  kpisData, 
  usuariosIniciales 
} from '../datos/dashboardDatos';
import bannerImg from '../assets/imagenes/Cafe.webp';
import '@/estilos/dashboardadministrador.css';

function KpiCard({ titulo, valor, subtitulo }) {
  return (
    <article className="card-panel">
      <p>{titulo}</p>
      <strong>{valor}</strong>
      <small>{subtitulo}</small>
    </article>
  );
}

export default function Dashboardadministrador() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoRol, setNuevoRol] = useState('caficultor');
  const [usuarioPendienteEliminar, setUsuarioPendienteEliminar] = useState(null);
  const [motivoEliminacion, setMotivoEliminacion] = useState('');
  const [detalleEliminacion, setDetalleEliminacion] = useState('');
  const [confirmacionEliminacion, setConfirmacionEliminacion] = useState(false);

  const estadisticasGeneralesLocales = [
    { etiqueta: 'Usuarios activos', porcentaje: 80 },
    { etiqueta: 'Producción mensual', porcentaje: 60 },
    { etiqueta: 'Alertas resueltas', porcentaje: 70 }
  ];

  const estadisticasPlagasLocales = [
    { etiqueta: 'Roya', porcentaje: 65 },
    { etiqueta: 'Broca', porcentaje: 45 },
    { etiqueta: 'Ojo de Gallo', porcentaje: 35 }
  ];

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

  const abrirEliminacion = (usuario) => {
    setUsuarioPendienteEliminar(usuario);
    setMotivoEliminacion('');
    setDetalleEliminacion('');
    setConfirmacionEliminacion(false);
  };

  const confirmarEliminacionUsuario = (e) => {
    e.preventDefault();
    if (!usuarioPendienteEliminar || !motivoEliminacion || !confirmacionEliminacion) return;
    setUsuarios((actuales) => actuales.filter((usr) => usr.id !== usuarioPendienteEliminar.id));
    setUsuarioPendienteEliminar(null);
  };

  return (
    <PlantillaPrincipal role="administrador">
      <Topbar
        eyebrow="Panel de administración"
        admin
      />

      <main className="admin-main-content">
        
        {/* BANNER PRINCIPAL */}
        <section className="admin-welcome-banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(42,26,15,0.9), rgba(78,42,21,0.62)), url(${bannerImg})` }}>
          <div className="admin-welcome-copy">
            <p className="admin-welcome-eyebrow">Panel administrador</p>
            <h2>Control de Coffee+Visión</h2>
            <p className="admin-welcome-description">
              Administra usuarios, supervisa los cultivos registrados y revisa las alertas de la plataforma.
            </p>
            <button className="admin-welcome-button" onClick={() => setVistaActual('usuarios')}>
              <i className="fa-solid fa-user-plus" aria-hidden="true" /> Gestionar usuarios
            </button>
          </div>
          <aside className="admin-system-health">
            <span>Estado del sistema</span>
            <strong>94%</strong>
            <small>La plataforma opera con normalidad.</small>
          </aside>
        </section>

        {/* VISTAS DE INICIO / USUARIOS */}
        {(vistaActual === 'inicio' || vistaActual === 'usuarios') && (
          <>
            {/* TARJETAS DE KPIS */}
            <section className="kpi-grid" style={{ marginBottom: '24px' }}>
              {kpisData.map((kpi, idx) => (
                <KpiCard key={idx} {...kpi} />
              ))}
            </section>

            {/* FORMULARIO AGREGAR USUARIO */}
            <section id="usuarios" className="card-panel" style={{ marginBottom: '24px' }}>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <i className="fa-solid fa-user-plus" aria-hidden="true" /> Agregar usuario
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
            <section className="card-panel no-padding" style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '24px', overflow: 'hidden' }}>
              <header className="panel-header" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 className="section-title" style={{ fontSize: '16px', color: '#2d3748', margin: 0, fontWeight: '700' }}>Usuarios Registrados</h2>
              </header>
              <div className="table-container">
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', color: '#718096', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '14px 24px' }}>Nombre</th>
                      <th style={{ padding: '14px 24px' }}>Rol</th>
                      <th style={{ padding: '14px 24px' }}>Estado</th>
                      <th className="text-right" style={{ padding: '14px 24px', textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usr) => (
                      <tr key={usr.id} style={{ borderTop: '1px solid #f1f5f9', fontSize: '14px', color: '#2d3748' }}>
                        <td className="font-bold" style={{ padding: '16px 24px', fontWeight: '600' }}>{usr.nombre}</td>
                        <td style={{ padding: '16px 24px', color: '#718096' }}>{usr.rol}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span className="badge badge-success" style={{ background: '#eaf4e0', color: '#2e4a19', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                            {usr.estado}
                          </span>
                        </td>
                        <td className="text-right" style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <button
                            className="btn-danger-soft"
                            style={{ padding: '6px 14px', background: '#edf2f7', color: '#718096', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                            onClick={() => abrirEliminacion(usr)}
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
          </>
        )}

        {/* VISTA REPORTES */}
        {vistaActual === 'reportes' && (
          <section style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', color: '#2d3748', marginBottom: '8px', fontWeight: '700' }}>Reportes del Sistema</h2>
            <p style={{ color: '#718096', margin: 0, fontSize: '14px' }}>Módulo de auditoría y descargas de reportes generales del sistema.</p>
          </section>
        )}

        {/* VISTA ESTADÍSTICAS */}
        {(vistaActual === 'inicio' || vistaActual === 'estadisticas') && (
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
            
            <article style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '20px', fontWeight: '700' }}>Estadísticas Generales</h2>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
                {estadisticasGeneralesLocales.map((item, idx) => (
                  <div key={idx} style={{ margin: 0 }}>
                    <dt style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#2d3748' }}>
                      <span style={{ fontWeight: '500' }}>{item.etiqueta}</span>
                      <strong style={{ fontWeight: '700' }}>{item.porcentaje}%</strong>
                    </dt>
                    <dd style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: 0 }}>
                      <span style={{ display: 'block', width: `${item.porcentaje}%`, background: '#3f3f46', height: '100%', borderRadius: '4px' }}></span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>

            <article style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <h2 style={{ fontSize: '16px', color: '#2d3748', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
                <i className="fa-solid fa-shield-halved" aria-hidden="true" /> Estadísticas de Plagas
              </h2>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
                {estadisticasPlagasLocales.map((item, idx) => (
                  <div key={idx} style={{ margin: 0 }}>
                    <dt style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#2d3748' }}>
                      <span style={{ fontWeight: '500' }}>{item.etiqueta}</span>
                      <strong style={{ fontWeight: '700' }}>{item.porcentaje}%</strong>
                    </dt>
                    <dd style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: 0 }}>
                      <span style={{ display: 'block', width: `${item.porcentaje}%`, background: '#2e4a19', height: '100%', borderRadius: '4px' }}></span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>

          </section>
        )}

      </main>

      {usuarioPendienteEliminar && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/55 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setUsuarioPendienteEliminar(null); }}>
          <section role="alertdialog" aria-modal="true" aria-labelledby="admin-delete-user-title" className="my-6 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-7">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-red-700 shadow-sm"><i className="fa-solid fa-user-xmark" aria-hidden="true" /></span>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-red-700">Confirmación de eliminación</p>
              <h2 id="admin-delete-user-title" className="mt-1 text-xl font-bold text-coffee">¿Estás seguro?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">Vas a eliminar la cuenta de <strong className="text-ink">{usuarioPendienteEliminar.nombre}</strong>. Esta acción no se puede deshacer.</p>
            </header>
            <form onSubmit={confirmarEliminacionUsuario} className="grid gap-5 p-6 sm:px-7">
              <label htmlFor="admin-delete-reason" className="grid gap-2 text-sm font-semibold text-ink">¿Cuál es el motivo de la eliminación?
                <select id="admin-delete-reason" required value={motivoEliminacion} onChange={(e) => setMotivoEliminacion(e.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-3 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20">
                  <option value="">Selecciona un motivo</option>
                  <option value="no-uso">La persona ya no utiliza el sistema</option>
                  <option value="cambio-finca">Cambió de finca o administración</option>
                  <option value="duplicada">La cuenta está duplicada</option>
                  <option value="solicitud">La persona solicitó cerrar su cuenta</option>
                  <option value="otro">Otro motivo</option>
                </select>
              </label>
              {motivoEliminacion === 'otro' && (
                <label htmlFor="admin-delete-detail" className="grid gap-2 text-sm font-semibold text-ink">Describe el motivo
                  <textarea id="admin-delete-detail" required value={detalleEliminacion} onChange={(e) => setDetalleEliminacion(e.target.value)} rows={3} placeholder="Escribe el motivo de la eliminación" className="rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
              )}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-100 bg-red-50/70 p-3 text-sm text-ink">
                <input type="checkbox" required checked={confirmacionEliminacion} onChange={(e) => setConfirmacionEliminacion(e.target.checked)} className="mt-0.5 h-4 w-4 accent-red-700" />
                <span>Confirmo que revisé la cuenta y entiendo que esta eliminación es permanente.</span>
              </label>
              <footer className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
                <button type="button" onClick={() => setUsuarioPendienteEliminar(null)} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-page">Cancelar</button>
                <button type="submit" disabled={!motivoEliminacion || !confirmacionEliminacion || (motivoEliminacion === 'otro' && !detalleEliminacion.trim())} className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">Confirmar eliminación</button>
              </footer>
              <p className="text-xs leading-relaxed text-muted">La cuenta se quitará de la lista de esta sesión de demostración.</p>
            </form>
          </section>
        </div>
      )}
    </PlantillaPrincipal>
  );
}
