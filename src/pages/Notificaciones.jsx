import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";

const FILTROS = ["Todas", "No leídas", "Críticas", "Alertas de Cultivo"];

const REGISTROS_CAFICULTOR = [
  {
    id: 1,
    emoji: "🐛",
    titulo: "Alerta de Plaga Detectada",
    descripcion:
      "El sistema de IA ha detectado un posible brote de Roya del café en el Lote 3 (Variedad Castillo). Se recomienda inspección inmediata.",
    tiempo: "Hace 15 minutos",
    tipo: "critica",
    esAlertaCultivo: true,
    noLeida: true,
  },
  {
    id: 2,
    emoji: "🐞",
    titulo: "Ataque Severo de Broca",
    descripcion:
      "Se ha identificado un nivel de infestación de broca superior al 5% en el Lote 2. Requiere muestreo y control biológico urgente.",
    tiempo: "Hace 30 minutos",
    tipo: "critica",
    esAlertaCultivo: true,
    noLeida: true,
  },
  {
    id: 3,
    emoji: "🍂",
    titulo: "Foco de Mancha de Hierro",
    descripcion:
      "Aparición de manchas foliares en el almácigo del Lote 4 debido a alta humedad y deficiencia nutricional.",
    tiempo: "Hace 1 hora",
    tipo: "critica",
    esAlertaCultivo: true,
    noLeida: true,
  },
  {
    id: 4,
    emoji: "⚠️",
    titulo: "Deficiencia Crítica de Nitrógeno",
    descripcion:
      "Análisis foliar muestra clorosis severa en hojas viejas del Lote 1. Aplicar fertilización foliar de rescate.",
    tiempo: "Hace 2 horas",
    tipo: "critica",
    esAlertaCultivo: true,
    noLeida: false,
  },
  {
    id: 5,
    emoji: "🌱",
    titulo: "Sugerencia de Fertilización de Cultivo",
    descripcion:
      "Momento óptimo para la aplicación del fertilizante NPK en el Lote 1 tras inicio de lluvias.",
    tiempo: "Hace 3 horas",
    tipo: "fertilizacion",
    esAlertaCultivo: true,
    noLeida: true,
  },
  {
    id: 6,
    emoji: "🌾",
    titulo: "Control de Malezas Pendiente",
    descripcion:
      "Crecimiento excesivo de arvenses competidoras en las calles del Lote 3. Programar desyerbe manual.",
    tiempo: "Hace 4 horas",
    tipo: "manejo",
    esAlertaCultivo: true,
    noLeida: true,
  },
  {
    id: 7,
    emoji: "✂️",
    titulo: "Alerta de Poda y Zoqueo",
    descripcion:
      "Cafetos del Lote 5 han alcanzado la fase de agotamiento productivo. Se sugiere programación de poda zoca.",
    tiempo: "Hace 5 horas",
    tipo: "manejo",
    esAlertaCultivo: true,
    noLeida: false,
  },
  {
    id: 8,
    emoji: "🌸",
    titulo: "Monitoreo de Floración del Café",
    descripcion:
      "Se registra el pico principal de floración en la Parcela Central. Evitar aplicación de agroquímicos durante esta semana.",
    tiempo: "Ayer",
    tipo: "manejo",
    esAlertaCultivo: true,
    noLeida: false,
  },
  {
    id: 9,
    emoji: "☕",
    titulo: "Aviso de Recolección de Grano Maduro",
    descripcion:
      "Índice de maduración del fruto alcanzó el 80% en el Lote 2. Iniciar pase de cosecha para evitar grano sobremaduro.",
    tiempo: "Hace 2 días",
    tipo: "cosecha",
    esAlertaCultivo: true,
    noLeida: false,
  },
  {
    id: 10,
    emoji: "📊",
    titulo: "Reporte Mensual Generado",
    descripcion:
      "El informe detallado de rendimiento y estadísticas de cosecha correspondiente al mes pasado ya está disponible para su descarga.",
    tiempo: "Hace 3 días",
    tipo: "reporte",
    esAlertaCultivo: false,
    noLeida: false,
  },
];

const NOTIFICACIONES_ADMIN = [
  {
    id: 101,
    emoji: "👤",
    titulo: "Nueva cuenta de caficultor",
    descripcion:
      "Se registró una nueva cuenta y está lista para revisión desde el panel de usuarios.",
    tiempo: "Hace 20 minutos",
    tipo: "usuario",
    esAlertaCultivo: false,
    noLeida: true,
  },
  {
    id: 102,
    emoji: "📈",
    titulo: "Reporte de actividad disponible",
    descripcion:
      "El resumen semanal de actividad de la plataforma ya está disponible para consulta.",
    tiempo: "Hace 3 horas",
    tipo: "reporte",
    esAlertaCultivo: false,
    noLeida: true,
  },
  {
    id: 103,
    emoji: "🤖",
    titulo: "Revisión de análisis IA",
    descripcion:
      "Hay nuevos análisis de plagas que requieren revisión administrativa.",
    tiempo: "Ayer",
    tipo: "critica",
    esAlertaCultivo: true,
    noLeida: true,
  },
  {
    id: 104,
    emoji: "💾",
    titulo: "Copia de seguridad completada",
    descripcion:
      "La copia de seguridad programada de la plataforma finalizó correctamente.",
    tiempo: "Ayer",
    tipo: "sistema",
    esAlertaCultivo: false,
    noLeida: false,
  },
];

export default function Notificaciones() {
  const location = useLocation();
  const esAdmin = location.pathname.startsWith("/admin/");

  const [registros, setRegistros] = useState(() =>
    esAdmin ? NOTIFICACIONES_ADMIN : REGISTROS_CAFICULTOR
  );
  const [filtroActivo, setFiltroActivo] = useState("Todas");

  const totalTodas = registros.length;
  const totalNoLeidas = registros.filter((item) => item.noLeida).length;

  const marcarComoLeida = (id) => {
    setRegistros((actuales) =>
      actuales.map((registro) =>
        registro.id === id
          ? {
              ...registro,
              noLeida: false,
            }
          : registro
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    setRegistros((actuales) =>
      actuales.map((item) => ({ ...item, noLeida: false }))
    );
  };

  const registrosFiltrados = useMemo(() => {
    return registros.filter((registro) => {
      if (filtroActivo === "No leídas") return registro.noLeida;
      if (filtroActivo === "Críticas") return registro.tipo === "critica";
      if (filtroActivo === "Alertas de Cultivo") return registro.esAlertaCultivo;
      return true;
    });
  }, [registros, filtroActivo]);

  return (
    <PlantillaPrincipal role={esAdmin ? "administrador" : "caficultor"}>
      <Topbar
        admin={esAdmin}
        eyebrow={esAdmin ? "Panel de administración" : "Centro de alertas"}
        title="Notificaciones"
      />

      <main className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-page min-h-screen box-border">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <hgroup className="space-y-1">
            <h2 className="text-xl font-bold text-ink">Alertas recientes</h2>
            <p className="text-sm text-muted">
              Revisa las alertas de tus cultivos, reportes del clima y estados del sistema.
            </p>
          </hgroup>
          {totalNoLeidas > 0 && (
            <button
              type="button"
              onClick={marcarTodasComoLeidas}
              className="rounded-lg border border-line bg-white px-4 py-2 text-xs font-semibold text-coffee hover:bg-green-soft"
            >
              Marcar todas como leídas
            </button>
          )}
        </header>

        <section className="space-y-6 w-full min-w-0">
          <nav className="w-full border-b border-line">
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {FILTROS.map((filtro) => {
                const isActive = filtroActivo === filtro;

                return (
                  <li key={filtro}>
                    <button
                      type="button"
                      onClick={() => setFiltroActivo(filtro)}
                      className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 rounded-t ${
                        isActive
                          ? "border-green text-green font-semibold"
                          : "border-transparent text-muted hover:text-ink"
                      }`}
                    >
                      {filtro === "Todas"
                        ? `Todas (${totalTodas})`
                        : filtro === "No leídas"
                        ? `No leídas (${totalNoLeidas})`
                        : filtro}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="w-full h-[600px] min-h-[600px] max-h-[600px] box-border overflow-y-auto overflow-x-hidden">
            {registrosFiltrados.length === 0 ? (
              <p className="w-full h-full box-border flex items-center justify-center text-center p-6 text-muted italic bg-surface border border-dashed border-line rounded">
                No hay notificaciones disponibles en esta categoría.
              </p>
            ) : (
              <ul className="w-full min-h-full flex flex-col gap-3 list-none p-0 m-0 box-border">
                {registrosFiltrados.map((registro) => (
                  <li
                    key={registro.id}
                    className={`box-border flex min-h-[120px] w-full shrink-0 flex-col items-stretch justify-between gap-3 overflow-hidden rounded border bg-surface p-4 shadow-panel sm:h-[120px] sm:max-h-[120px] sm:flex-row sm:items-center sm:gap-4 ${
                      registro.noLeida
                        ? "border-l-4 border-l-green"
                        : "border-line"
                    }`}
                  >
                    <section className="flex gap-3 items-start min-w-0 flex-1">
                      <span className="shrink-0 w-9 h-9 rounded-full bg-page text-lg flex items-center justify-center border border-line">
                        {registro.emoji}
                      </span>

                      <article className="min-w-0 flex-1 overflow-hidden">
                        <h3 className="text-sm font-bold text-ink truncate">
                          {registro.titulo}
                        </h3>

                        <p className="text-xs text-muted leading-relaxed overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                          {registro.descripcion}
                        </p>

                        <time className="block text-[11px] text-muted/80 pt-1">
                          {registro.tiempo}
                        </time>
                      </article>
                    </section>

                    <aside className="w-full shrink-0 sm:w-[125px]">
                      {registro.noLeida && (
                        <button
                          type="button"
                          className="w-full bg-page hover:bg-green hover:text-surface text-ink p-2 rounded transition-colors text-xs font-semibold flex items-center justify-center gap-1 border border-line"
                          onClick={() => marcarComoLeida(registro.id)}
                          title="Marcar como leída"
                        >
                          ✓ Marcar leída
                        </button>
                      )}
                    </aside>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </PlantillaPrincipal>
  );
}
