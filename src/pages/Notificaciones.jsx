import { useState } from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";

const filtros = [
  "Todas",
  "No leídas",
  "Críticas",
  "Alertas de Cultivo",
];

const registrosIniciales = [
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
    boton: true,
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
    boton: true,
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
    boton: true,
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
    boton: false,
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
    boton: true,
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
    boton: true,
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
    boton: false,
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
    boton: false,
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
    boton: false,
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
    boton: false,
  },
];

export default function Notificaciones() {
  const [registros, setRegistros] = useState(registrosIniciales);
  const [filtroActivo, setFiltroActivo] = useState("Todas");

  const totalTodas = registros.length;

  const totalNoLeidas = registros.filter(
    (registro) => registro.noLeida
  ).length;

  const marcarComoLeida = (id) => {
    setRegistros((actuales) =>
      actuales.map((registro) =>
        registro.id === id
          ? {
              ...registro,
              noLeida: false,
              boton: false,
            }
          : registro
      )
    );
  };

  const filtrarRegistros = () => {
    switch (filtroActivo) {
      case "No leídas":
        return registros.filter((registro) => registro.noLeida);

      case "Críticas":
        return registros.filter(
          (registro) => registro.tipo === "critica"
        );

      case "Alertas de Cultivo":
        return registros.filter(
          (registro) => registro.esAlertaCultivo
        );

      default:
        return registros;
    }
  };

  const registrosFiltrados = filtrarRegistros();

  return (
    <PlantillaPrincipal>
      <Topbar />

      {/* ENCABEZADO AGREGADO: CAFICULTOR */}
      <div className="w-full px-6 pt-3 pb-4 border-b border-line bg-page box-border">
        <h1 className="text-xl font-bold text-coffee">
          Caficultor
        </h1>

        <p className="text-sm text-muted mt-1">
          Panel de Caficultor
        </p>
      </div>

      <main className="w-full max-w-6xl mx-auto p-6 space-y-6 bg-page min-h-screen box-border">
        {/* TÍTULO */}
        <header className="space-y-1">
          <h2 className="text-xl font-bold text-ink">
            Notificaciones
          </h2>

          <p className="text-sm text-muted">
            Revisa las alertas de tus cultivos, reportes del clima y
            estados del sistema.
          </p>
        </header>

        <section className="space-y-6 w-full min-w-0">
          {/* PESTAÑAS */}
          <nav className="w-full border-b border-line">
            <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
              {filtros.map((filtro) => {
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

          {/* CONTENEDOR FIJO: NO CAMBIA DE ALTURA */}
          <div className="w-full h-[600px] min-h-[600px] max-h-[600px] box-border overflow-y-auto overflow-x-hidden">
            {registrosFiltrados.length === 0 ? (
              <div className="w-full h-full box-border flex items-center justify-center text-center p-6 text-muted italic bg-surface border border-dashed border-line rounded">
                No hay notificaciones disponibles en esta categoría.
              </div>
            ) : (
              <ul className="w-full min-h-full flex flex-col gap-3 list-none p-0 m-0 box-border">
                {registrosFiltrados.map((registro) => (
                  <li
                    key={registro.id}
                    className={`w-full h-[120px] min-h-[120px] max-h-[120px] shrink-0 box-border flex items-center justify-between gap-4 p-4 border rounded bg-surface shadow-panel overflow-hidden ${
                      registro.noLeida
                        ? "border-l-4 border-l-green"
                        : "border-line"
                    }`}
                  >
                    {/* ICONO Y DESCRIPCIÓN */}
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

                    {/* ESPACIO CONSTANTE PARA EL BOTÓN */}
                    <div className="shrink-0 w-[125px]">
                      {registro.boton && registro.noLeida && (
                        <button
                          type="button"
                          className="w-full bg-page hover:bg-green hover:text-surface text-ink p-2 rounded transition-colors text-xs font-semibold flex items-center justify-center gap-1 border border-line"
                          onClick={() => marcarComoLeida(registro.id)}
                          title="Marcar como leída"
                        >
                          ✓ Marcar leída
                        </button>
                      )}
                    </div>
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
