import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";

const FILTROS = ["Todas", "No leídas", "Críticas", "Cultivos"];
const INICIALES = [
  { id: 1, titulo: "Alerta de plaga detectada", descripcion: "Posible brote de roya en el Lote 3. Se recomienda revisar las plantas afectadas.", tiempo: "Hace 15 minutos", tipo: "critica", leida: false },
  { id: 2, titulo: "Alerta meteorológica", descripcion: "Se pronostican lluvias fuertes en las próximas 48 horas. Verifica el drenaje de los lotes.", tiempo: "Hace 2 horas", tipo: "clima", leida: false },
  { id: 3, titulo: "Reporte mensual generado", descripcion: "El informe de rendimiento y cosecha ya está disponible.", tiempo: "Ayer", tipo: "reporte", leida: true },
  { id: 4, titulo: "Sugerencia de fertilización", descripcion: "El Lote 1 está listo para la aplicación de abono nitrogenado.", tiempo: "Hace 3 días", tipo: "cultivo", leida: true },
];
const NOTIFICACIONES_ADMIN = [
  { id: 101, titulo: "Nueva cuenta de caficultor", descripcion: "Se registró una nueva cuenta y está lista para revisión desde el panel de usuarios.", tiempo: "Hace 20 minutos", tipo: "usuario", leida: false },
  { id: 102, titulo: "Reporte de actividad disponible", descripcion: "El resumen semanal de actividad de la plataforma ya está disponible para consulta.", tiempo: "Hace 3 horas", tipo: "reporte", leida: false },
  { id: 103, titulo: "Revisión de análisis IA", descripcion: "Hay nuevos análisis de plagas que requieren revisión administrativa.", tiempo: "Ayer", tipo: "critica", leida: false },
  { id: 104, titulo: "Copia de seguridad completada", descripcion: "La copia de seguridad programada de la plataforma finalizó correctamente.", tiempo: "Ayer", tipo: "sistema", leida: true },
];

export default function Notificaciones() {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith("/admin/");
  const [items, setItems] = useState(() => esAdmin ? NOTIFICACIONES_ADMIN : INICIALES);
  const [filtro, setFiltro] = useState("Todas");
  const noLeidas = items.filter((item) => !item.leida).length;
  const visibles = useMemo(() => items.filter((item) => {
    if (filtro === "No leídas") return !item.leida;
    if (filtro === "Críticas") return item.tipo === "critica";
    if (filtro === "Cultivos") return ["critica", "cultivo"].includes(item.tipo);
    return true;
  }), [items, filtro]);

  function marcarLeida(id) {
    setItems((actuales) => actuales.map((item) => item.id === id ? { ...item, leida: true } : item));
  }

  return (
    <PlantillaPrincipal role={esAdmin ? "administrador" : "caficultor"}>
      <Topbar admin={esAdmin} eyebrow={esAdmin ? "Panel de administración" : "Centro de alertas"} title="Notificaciones" />
      <section className="grid w-full min-w-0 gap-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Alertas recientes</h2>
            <p className="mt-1 text-muted">Tienes {noLeidas} notificaciones sin leer.</p>
          </div>
          {noLeidas > 0 && <button type="button" onClick={() => setItems((actuales) => actuales.map((item) => ({ ...item, leida: true })))} className="rounded-lg border border-line bg-white px-4 py-2.5 font-semibold text-coffee hover:bg-green-soft">Marcar todas como leídas</button>}
        </header>

        <nav className="flex flex-wrap gap-2 border-b border-line pb-3" aria-label="Filtrar notificaciones">
          {FILTROS.map((opcion) => (
            <button key={opcion} type="button" onClick={() => setFiltro(opcion)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${filtro === opcion ? "bg-green text-white" : "bg-white text-muted hover:bg-green-soft hover:text-coffee"}`}>
              {opcion}{opcion === "No leídas" ? ` (${noLeidas})` : ""}
            </button>
          ))}
        </nav>

        <ul className="grid gap-3">
          {visibles.map((item) => (
            <li key={item.id} className={`flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-panel sm:flex-row sm:items-center ${item.leida ? "border-line" : "border-green/40"}`}>
              <span className={`grid h-11 w-11 flex-none place-items-center rounded-full ${item.tipo === "critica" ? "bg-red-50 text-danger" : "bg-green-soft text-green-deep"}`}>
                <i className={`fa-solid ${item.tipo === "critica" ? "fa-triangle-exclamation" : item.tipo === "clima" ? "fa-cloud-rain" : "fa-leaf"}`} aria-hidden="true"></i>
              </span>
              <article className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{item.titulo}</h3>
                  {!item.leida && <span className="rounded-full bg-green-soft px-2.5 py-1 text-xs font-bold text-green-deep">Nueva</span>}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.descripcion}</p>
                <time className="mt-2 block text-xs text-muted">{item.tiempo}</time>
              </article>
              {!item.leida && <button type="button" onClick={() => marcarLeida(item.id)} className="self-start rounded-lg border border-line px-3 py-2 text-sm font-semibold text-coffee hover:bg-green-soft sm:self-center">Marcar leída</button>}
            </li>
          ))}
          {visibles.length === 0 && <li className="rounded-xl border border-line bg-white p-10 text-center text-muted">No hay notificaciones en esta categoría.</li>}
        </ul>
      </section>
    </PlantillaPrincipal>
  );
}
