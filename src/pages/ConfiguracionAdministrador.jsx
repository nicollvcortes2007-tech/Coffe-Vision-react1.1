import { useState } from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";
import { usuariosIniciales } from "@/datos/dashboardDatos";
import MetricasChatbot from "@/components/configuracion/MetricasChatbot";

const pestañas = [
  { id: "cuentas", titulo: "Cuentas", icono: "fa-users-gear" },
  { id: "cuenta", titulo: "Mi cuenta", icono: "fa-user-gear" },
  { id: "seguridad", titulo: "Seguridad", icono: "fa-shield-halved" },
  { id: "plataforma", titulo: "Métricas del chatbot", icono: "fa-chart-line" },
];

const camposCuenta = [
  { id: "nombres", etiqueta: "Nombres y apellidos", valor: "Administrador Sistema", tipo: "text" },
  { id: "direccion", etiqueta: "Dirección del administrador", valor: "Calle 5 #12-45, Centro", tipo: "text" },
  { id: "correo", etiqueta: "Correo electrónico", valor: "admin@coffeetech.com", tipo: "email" },
  { id: "finca", etiqueta: "Nombre de la finca", valor: "Finca El Paraíso", tipo: "text" },
];

function ConfiguracionAdministrador() {
  const [pestañaActiva, setPestañaActiva] = useState("cuenta");
  const [datos, setDatos] = useState(() => Object.fromEntries(camposCuenta.map((campo) => [campo.id, campo.valor])));
  const [guardado, setGuardado] = useState(false);
  const [mensajeSeguridad, setMensajeSeguridad] = useState("");
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoRol, setNuevoRol] = useState("Caficultor");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [motivoBaja, setMotivoBaja] = useState("");
  const [detalleBaja, setDetalleBaja] = useState("");
  const [aceptaBaja, setAceptaBaja] = useState(false);
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmacionClave, setConfirmacionClave] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [mensajeCuentas, setMensajeCuentas] = useState("");
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [motivoEliminacion, setMotivoEliminacion] = useState("");
  const [aceptaEliminacion, setAceptaEliminacion] = useState(false);
  const [mensajeEliminacion, setMensajeEliminacion] = useState("");

  const guardarDatos = (evento) => {
    evento.preventDefault();
    setGuardado(true);
    window.setTimeout(() => setGuardado(false), 3000);
  };

  const agregarCuenta = (evento) => {
    evento.preventDefault();
    if (!nuevoNombre.trim()) return;
    setUsuarios((actuales) => [...actuales, {
      id: Date.now(),
      nombre: nuevoNombre.trim(),
      rol: nuevoRol,
      estado: "Activo",
    }]);
    setNuevoNombre("");
    setMensajeCuentas("Cuenta agregada a esta sesión de demostración.");
  };

  const cambiarEstadoCuenta = (id) => {
    setUsuarios((actuales) => actuales.map((usuario) => usuario.id === id
      ? { ...usuario, estado: usuario.estado === "Activo" ? "Inactivo" : "Activo" }
      : usuario));
    setMensajeCuentas("Estado actualizado en esta sesión de demostración.");
  };

  const cambiarRolCuenta = (id, rol) => {
    setUsuarios((actuales) => actuales.map((usuario) => usuario.id === id ? { ...usuario, rol } : usuario));
    setMensajeCuentas("Rol actualizado en esta sesión de demostración.");
  };

  const abrirConfirmacionBaja = (usuario) => {
    setUsuarioAEliminar(usuario);
    setMotivoBaja("");
    setDetalleBaja("");
    setAceptaBaja(false);
    setMensajeCuentas("");
  };

  const confirmarBajaCuenta = (evento) => {
    evento.preventDefault();
    if (!usuarioAEliminar || !motivoBaja || !aceptaBaja) return;
    const nombre = usuarioAEliminar.nombre;
    setUsuarios((actuales) => actuales.filter((item) => item.id !== usuarioAEliminar.id));
    setUsuarioAEliminar(null);
    setMensajeCuentas(`La cuenta de ${nombre} se quitó de esta sesión de demostración. La eliminación no se guarda en el servidor.`);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    `${usuario.nombre} ${usuario.rol} ${usuario.estado}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <PlantillaPrincipal role="administrador">
      <Topbar admin eyebrow="Administración" title="Configuración" />

      <main className="mx-auto mt-7 w-full max-w-6xl space-y-6 pb-8">
        <section className="overflow-hidden rounded-2xl border border-line bg-surface shadow-panel">
          <nav aria-label="Secciones de configuración" className="border-b border-line bg-white px-3 sm:px-5">
            <ul className="flex list-none gap-1 overflow-x-auto p-0 m-0">
              {pestañas.map((pestaña) => (
                <li key={pestaña.id}>
                  <button
                    type="button"
                    aria-current={pestañaActiva === pestaña.id ? "page" : undefined}
                    onClick={() => setPestañaActiva(pestaña.id)}
                    className={`flex min-h-[4.5rem] items-center gap-3 whitespace-nowrap border-b-[3px] px-6 text-base font-bold transition sm:px-8 sm:text-lg ${pestañaActiva === pestaña.id ? "border-green text-green-deep" : "border-transparent text-muted hover:text-coffee"}`}
                  >
                    <i className={`fa-solid ${pestaña.icono} text-lg sm:text-xl`} aria-hidden="true" />
                    {pestaña.titulo}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {pestañaActiva === "cuentas" && (
            <section className="p-5 sm:p-7">
              <header className="mb-6">
                <h3 className="text-lg font-bold text-coffee">Administración de cuentas</h3>
                <p className="mt-1 text-sm text-muted">Crea cuentas, revisa sus roles y administra su acceso.</p>
              </header>

              <form onSubmit={agregarCuenta} className="mb-6 grid gap-3 rounded-xl border border-line bg-page p-4 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-end">
                <label className="grid gap-2 text-sm font-semibold text-ink">Nombre del usuario
                  <input value={nuevoNombre} onChange={(evento) => setNuevoNombre(evento.target.value)} required placeholder="Nombre completo" className="min-h-11 rounded-lg border border-line bg-white px-3 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">Rol
                  <select value={nuevoRol} onChange={(evento) => setNuevoRol(evento.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-3 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20">
                    <option>Caficultor</option><option>Administrador</option>
                  </select>
                </label>
                <button type="submit" className="min-h-11 rounded-lg bg-green px-4 text-sm font-bold text-white hover:bg-green-deep"><i className="fa-solid fa-user-plus mr-2" aria-hidden="true" />Agregar cuenta</button>
              </form>

              <label className="mb-4 flex max-w-md items-center gap-2 rounded-lg border border-line bg-white px-3">
                <i className="fa-solid fa-magnifying-glass text-muted" aria-hidden="true" />
                <input value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Buscar por nombre, rol o estado" className="min-h-11 w-full border-0 bg-transparent text-sm outline-none" />
              </label>

              {mensajeCuentas && <p role="status" className="mb-4 rounded-lg bg-green-soft px-4 py-3 text-sm font-medium text-green-deep">{mensajeCuentas}</p>}

              <div className="overflow-x-auto rounded-xl border border-line">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead className="bg-page text-xs uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Usuario</th><th className="px-4 py-3">Rol</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead>
                  <tbody>
                    {usuariosFiltrados.map((usuario) => (
                      <tr key={usuario.id} className="border-t border-line text-sm">
                        <td className="px-4 py-4 font-semibold text-ink">{usuario.nombre}</td>
                        <td className="px-4 py-4"><select aria-label={`Rol de ${usuario.nombre}`} value={usuario.rol} onChange={(evento) => cambiarRolCuenta(usuario.id, evento.target.value)} className="rounded-lg border border-line bg-white px-2 py-1.5 text-sm text-ink"><option>Caficultor</option><option>Administrador</option></select></td>
                        <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${usuario.estado === "Activo" ? "bg-green-soft text-green-deep" : "bg-gray-100 text-gray-600"}`}>{usuario.estado}</span></td>
                        <td className="px-4 py-4"><div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setUsuarioSeleccionado(usuario); setNuevaClave(""); setConfirmacionClave(""); setErrorClave(""); setMensajeCuentas(""); }} className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-coffee hover:bg-page">Cambiar contraseña</button>
                          <button type="button" onClick={() => cambiarEstadoCuenta(usuario.id)} className="rounded-lg border border-line px-3 py-2 text-xs font-bold text-muted hover:bg-page">{usuario.estado === "Activo" ? "Desactivar" : "Activar"}</button>
                          <button type="button" onClick={() => abrirConfirmacionBaja(usuario)} aria-label={`Eliminar cuenta de ${usuario.nombre}`} className="grid h-9 w-9 place-items-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50"><i className="fa-solid fa-trash" aria-hidden="true" /></button>
                        </div></td>
                      </tr>
                    ))}
                    {usuariosFiltrados.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">No hay cuentas que coincidan con la búsqueda.</td></tr>}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Los cambios de cuentas se guardan solo durante esta sesión de demostración. Para aplicar altas, estados y contraseñas al inicio de sesión se necesita conectar el servidor de autenticación.</p>
            </section>
          )}

          {pestañaActiva === "cuenta" && (
            <form onSubmit={guardarDatos} className="p-5 sm:p-7">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-coffee">Información del administrador y la finca</h3>
                <p className="mt-1 text-sm text-muted">Actualiza tus datos personales y de contacto.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {camposCuenta.map((campo) => (
                  <label key={campo.id} htmlFor={`config-${campo.id}`} className="grid gap-2 text-sm font-semibold text-ink">
                    {campo.etiqueta}
                    <input
                      id={`config-${campo.id}`}
                      type={campo.tipo}
                      value={datos[campo.id]}
                      onChange={(evento) => setDatos((anterior) => ({ ...anterior, [campo.id]: evento.target.value }))}
                      className="min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 font-normal outline-none transition focus:border-green focus:ring-2 focus:ring-green/20"
                    />
                  </label>
                ))}
              </div>
              <footer className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5">
                {guardado && <span role="status" className="mr-auto text-sm font-semibold text-green-deep">Cambios guardados.</span>}
                <button type="submit" className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-deep">Guardar cambios</button>
              </footer>
            </form>
          )}

          {pestañaActiva === "seguridad" && (
            <section className="p-5 sm:p-7">
              <h3 className="text-lg font-bold text-coffee">Seguridad de la cuenta</h3>
              <p className="mt-1 text-sm text-muted">Actualiza periódicamente tu contraseña para proteger la cuenta.</p>
              <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={(evento) => { evento.preventDefault(); setMensajeSeguridad("La actualización debe confirmarse con el servicio de autenticación."); }}>
                <label className="grid gap-2 text-sm font-semibold text-ink sm:col-span-2">Contraseña actual
                  <input type="password" required autoComplete="current-password" placeholder="Ingresa tu contraseña actual" className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">Nueva contraseña
                  <input type="password" required minLength={8} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">Confirmar nueva contraseña
                  <input type="password" required minLength={8} autoComplete="new-password" placeholder="Repite la nueva contraseña" className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
                <p className="text-xs text-muted sm:col-span-2">Usa al menos 8 caracteres, con una letra mayúscula y un número.</p>
                {mensajeSeguridad && <p role="status" className="text-sm text-muted sm:col-span-2">{mensajeSeguridad}</p>}
                <div className="sm:col-span-2"><button type="submit" className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-deep">Actualizar contraseña</button></div>
              </form>
            </section>
          )}

          {pestañaActiva === "plataforma" && (
            <section className="p-5 sm:p-7"><MetricasChatbot /></section>
          )}
        </section>

        {usuarioSeleccionado && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setUsuarioSeleccionado(null); }}>
            <section role="dialog" aria-modal="true" aria-labelledby="reset-pass-title" className="max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
              <p className="text-xs font-extrabold uppercase tracking-wider text-green-deep">Gestión de cuenta</p>
              <h3 id="reset-pass-title" className="mt-2 text-xl font-bold text-coffee">Cambiar contraseña</h3>
              <p className="mt-1 text-sm text-muted">Cuenta: {usuarioSeleccionado.nombre}</p>
              <form className="mt-5 grid gap-4" onSubmit={(evento) => { evento.preventDefault(); if (nuevaClave.length < 8) { setErrorClave("La contraseña debe tener al menos 8 caracteres."); return; } if (nuevaClave !== confirmacionClave) { setErrorClave("Las contraseñas no coinciden."); return; } setMensajeCuentas(`Cambio de contraseña validado para ${usuarioSeleccionado.nombre}. Para aplicarlo al inicio de sesión se necesita conectar el servidor de autenticación.`); setUsuarioSeleccionado(null); }}>
                <label className="grid gap-2 text-sm font-semibold text-ink">Nueva contraseña
                  <input type="password" value={nuevaClave} onChange={(evento) => setNuevaClave(evento.target.value)} minLength={8} required autoComplete="new-password" placeholder="Mínimo 8 caracteres" className="min-h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-ink">Confirmar contraseña
                  <input type="password" value={confirmacionClave} onChange={(evento) => setConfirmacionClave(evento.target.value)} minLength={8} required autoComplete="new-password" placeholder="Repite la contraseña" className="min-h-11 rounded-lg border border-line px-3 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                </label>
                {errorClave && <p role="alert" className="text-sm font-semibold text-red-700">{errorClave}</p>}
                <p className="text-xs text-muted">Por seguridad, la contraseña no se almacena en el navegador.</p>
                <footer className="mt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setUsuarioSeleccionado(null)} className="rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink">Cancelar</button>
                  <button type="submit" className="rounded-lg bg-green px-4 py-2.5 text-sm font-bold text-white hover:bg-green-deep">Preparar cambio</button>
                </footer>
              </form>
            </section>
          </div>
        )}

        {usuarioAEliminar && (
          <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/55 p-4" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setUsuarioAEliminar(null); }}>
            <section role="alertdialog" aria-modal="true" aria-labelledby="delete-account-title" className="my-6 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              <header className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-red-700 shadow-sm"><i className="fa-solid fa-user-xmark" aria-hidden="true" /></span>
                <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-red-700">Confirmación de eliminación</p>
                <h2 id="delete-account-title" className="mt-1 text-xl font-bold text-coffee">¿Estás seguro?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">Vas a eliminar la cuenta de <strong className="text-ink">{usuarioAEliminar.nombre}</strong>. Esta acción no se puede deshacer.</p>
              </header>
              <form onSubmit={confirmarBajaCuenta} className="grid gap-5 p-6 sm:px-7">
                <label htmlFor="motivo-baja-cuenta" className="grid gap-2 text-sm font-semibold text-ink">¿Cuál es el motivo de la eliminación?
                  <select id="motivo-baja-cuenta" required value={motivoBaja} onChange={(evento) => setMotivoBaja(evento.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-3 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20">
                    <option value="">Selecciona un motivo</option>
                    <option value="no-uso">La persona ya no utiliza el sistema</option>
                    <option value="cambio-finca">Cambió de finca o administración</option>
                    <option value="duplicada">La cuenta está duplicada</option>
                    <option value="solicitud">La persona solicitó cerrar su cuenta</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                </label>
                {motivoBaja === "otro" && (
                  <label htmlFor="detalle-baja-cuenta" className="grid gap-2 text-sm font-semibold text-ink">Describe el motivo
                    <textarea id="detalle-baja-cuenta" required value={detalleBaja} onChange={(evento) => setDetalleBaja(evento.target.value)} rows={3} placeholder="Escribe el motivo de la eliminación" className="rounded-lg border border-line px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" />
                  </label>
                )}
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-100 bg-red-50/70 p-3 text-sm text-ink">
                  <input type="checkbox" required checked={aceptaBaja} onChange={(evento) => setAceptaBaja(evento.target.checked)} className="mt-0.5 h-4 w-4 accent-red-700" />
                  <span>Confirmo que revisé la cuenta y entiendo que esta eliminación es permanente.</span>
                </label>
                <footer className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
                  <button type="button" onClick={() => setUsuarioAEliminar(null)} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-page">Cancelar</button>
                  <button type="submit" disabled={!motivoBaja || !aceptaBaja || (motivoBaja === "otro" && !detalleBaja.trim())} className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">Confirmar eliminación</button>
                </footer>
                <p className="text-xs leading-relaxed text-muted">En esta versión de demostración, la cuenta se retira solo de la lista temporal. La eliminación permanente requiere conexión con el servidor.</p>
              </form>
            </section>
          </div>
        )}

        <section className="rounded-2xl border border-red-200 bg-white p-5 shadow-panel sm:p-6">
          <p className="text-xs font-extrabold uppercase tracking-wider text-red-700">Zona de riesgo</p>
          <h3 className="mt-1 font-bold text-coffee">Eliminación de cuenta</h3>
          <p className="mt-1 max-w-3xl text-sm text-muted">La eliminación es irreversible y puede borrar los registros asociados al administrador y a la finca. Contacta al equipo de soporte para solicitarla.</p>
          {!confirmarEliminacion ? (
            <button type="button" onClick={() => { setConfirmarEliminacion(true); setMensajeEliminacion(""); }} className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100">Eliminar cuenta</button>
          ) : (
            <section role="alertdialog" aria-modal="true" aria-labelledby="confirmar-eliminacion-titulo" className="mt-5 max-w-2xl rounded-xl border border-red-200 bg-red-50/70 p-4 sm:p-5">
              <h4 id="confirmar-eliminacion-titulo" className="font-bold text-red-800">¿Estás seguro de que quieres eliminar tu cuenta?</h4>
              <p className="mt-1 text-sm text-red-700">Esta acción es permanente. Cuéntanos el motivo antes de continuar.</p>
              <label htmlFor="motivo-eliminacion" className="mt-4 grid gap-2 text-sm font-semibold text-ink">Motivo de eliminación
                <select id="motivo-eliminacion" value={motivoEliminacion} onChange={(evento) => setMotivoEliminacion(evento.target.value)} className="min-h-11 rounded-lg border border-line bg-white px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20">
                  <option value="">Selecciona un motivo</option>
                  <option value="no-uso">Ya no utilizo el sistema</option>
                  <option value="cambio-finca">Cambié de finca o administración</option>
                  <option value="otro">Otro motivo</option>
                </select>
              </label>
              {motivoEliminacion === "otro" && <label htmlFor="otro-motivo" className="mt-3 grid gap-2 text-sm font-semibold text-ink">Cuéntanos brevemente
                <textarea id="otro-motivo" rows={3} className="rounded-lg border border-line bg-white px-3 py-2 font-normal outline-none focus:border-green focus:ring-2 focus:ring-green/20" placeholder="Escribe el motivo" />
              </label>}
              <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-ink">
                <input type="checkbox" checked={aceptaEliminacion} onChange={(evento) => setAceptaEliminacion(evento.target.checked)} className="mt-1 h-4 w-4 accent-red-700" />
                <span>Entiendo que la eliminación de la cuenta y sus datos es irreversible.</span>
              </label>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => { setConfirmarEliminacion(false); setMotivoEliminacion(""); setAceptaEliminacion(false); }} className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-page">Cancelar</button>
                <button type="button" disabled={!motivoEliminacion || !aceptaEliminacion} onClick={() => setMensajeEliminacion("No se envió la solicitud: la eliminación de cuentas todavía no está conectada al servicio de administración.")} className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50">Confirmar eliminación</button>
              </div>
              {mensajeEliminacion && <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{mensajeEliminacion}</p>}
            </section>
          )}
        </section>
      </main>
    </PlantillaPrincipal>
  );
}

export default ConfiguracionAdministrador;
