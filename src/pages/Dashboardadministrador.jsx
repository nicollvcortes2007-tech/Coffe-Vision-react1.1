import React, { useState } from 'react';
import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/Dashboardadministrador/Topbar';
import { 
  kpisData, 
  usuariosIniciales 
} from '../datos/dashboardDatos';
import { 
  Home, 
  Users, 
  FileText, 
  BarChart2, 
  AlertTriangle, 
  UserPlus, 
  Package, 
  Bug, 
  ShieldAlert 
} from 'lucide-react';
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

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'reportes', label: 'Reportes', icon: FileText },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart2 },
  ];

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

  const handleEliminarUsuario = (id, nombre) => {
    const c1 = window.confirm(`¿Estás seguro de que deseas eliminar al usuario ${nombre}?`);
    if (!c1) return;

    const c2 = window.confirm(`¡ADVERTENCIA! Esta acción no se puede deshacer. ¿Deseas continuar eliminando a ${nombre}?`);
    if (!c2) return;

    const c3 = window.confirm(`Confirmación final: ¿Realmente quieres proceder a eliminar a ${nombre}?`);
    if (!c3) return;

    setUsuarios(usuarios.filter((usr) => usr.id !== id));
    alert(`El usuario ${nombre} ha sido eliminado exitosamente.`);
  };

  return (
    <PlantillaPrincipal role="administrador">
      <Topbar />

      <main className="admin-main-content" style={{ padding: '24px 36px', boxSizing: 'border-box' }}>
        
        {/* BANNER PRINCIPAL */}
        <section 
          style={{ 
            backgroundImage: `linear-gradient(rgba(45, 30, 20, 0.65), rgba(30, 20, 12, 0.8)), url(${bannerImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '20px',
            padding: '36px 40px',
            color: '#fff',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
          }}
        >
          <header>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#facc15', fontWeight: '700' }}>
              PANEL ADMINISTRADOR
            </span>
            <h2 style={{ fontSize: '32px', margin: '8px 0 8px 0', fontWeight: '800', color: '#ffffff' }}>
              Coffee + Vision Control
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#e2e8f0', maxWidth: '480px', lineHeight: '1.4' }}>
              Supervisa las cuentas de usuario, revisa reportes de plagas y administra la plataforma cafetera de manera eficiente.
            </p>
            <button 
              onClick={() => setVistaActual('usuarios')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              + Registrar labor / usuario
            </button>
          </header>

          <article style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            padding: '20px 24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            minWidth: '200px'
          }}>
            <small style={{ fontSize: '12px', color: '#e2e8f0', display: 'block', marginBottom: '4px' }}>Salud del sistema</small>
            <strong style={{ fontSize: '36px', fontWeight: '800', color: '#ffffff', display: 'block', lineHeight: '1' }}>94%</strong>
            <small style={{ fontSize: '11px', color: '#cbd5e1', display: 'block', marginTop: '6px' }}>Plataforma operando con total normalidad.</small>
          </article>
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
                <UserPlus size={18} color="#2e4a19" /> Agregar usuario
              </h2>
              <form className="user-form" onSubmit={handleAgregarUsuario} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="form-input"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  style={{ padding: '12px 16px', flex: 1, border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '14px' }}
                  required
                />
                <select
                  className="form-select"
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value)}
                  style={{ padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff', outline: 'none', fontSize: '14px', color: '#334155' }}
                >
                  <option value="caficultor">Caficultor</option>
                  <option value="administrador">Administrador</option>
                </select>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px', background: '#2e4a19', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>Guardar</button>
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
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
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
                <ShieldAlert size={18} color="#2e4a19" /> Estadísticas de Plagas
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
    </PlantillaPrincipal>
  );
}