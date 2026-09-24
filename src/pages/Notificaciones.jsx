import { useState } from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";
import persona from "@/assets/imagenes/persona.jpg";

const tarjetas = [
  {
    titulo: "Alerta de Plaga Detectada",
    dato: "Roya del café",
    descripcion: "Posible brote detectado en el Lote 3",
    ancho: "85%",
    eficiencia: "85%",
  },
  {
    titulo: "Alerta Meteorológica",
    dato: "Lluvias Fuertes",
    descripcion: "Precipitaciones altas en las próximas 48 horas",
    ancho: "70%",
    eficiencia: "70%",
  },
  {
    titulo: "Reporte Mensual Generado",
    dato: "Disponible",
    descripcion: "Informe de rendimiento y estadísticas de cosecha",
    ancho: "90%",
    eficiencia: "90%",
  },
  {
    titulo: "Sugerencia de Fertilización",
    dato: "Lote 1",
    descripcion: "Momento óptimo para aplicar el abonado nitrogenado",
    ancho: "80%",
    eficiencia: "80%",
  },
];

const barras = [
  { alto: "85%", clase: "bg-[#769f1a]" },
  { alto: "70%", clase: "bg-[#769f1a]" },
  { alto: "90%", clase: "bg-[#769f1a]" },
  { alto: "80%", clase: "bg-[#769f1a]" },
];

const recomendaciones = [
  "Inspección inmediata del Lote 3",
  "Asegurar los canales de drenaje",
  "Revisar el reporte mensual",
  "Aplicar el abonado nitrogenado programado",
];

const filtros = [
  "Todas",
  "No leídas",
  "Críticas",
  "Alertas de Cultivo",
];

const registrosIniciales = [
  {
    id: 1,
    titulo: "Alerta de Plaga Detectada",
    descripcion:
      "El sistema de IA ha detectado un posible brote de Roya del café en el Lote 3 (Variedad Castillo). Se recomienda inspección inmediata.",
    tiempo: "Hace 15 minutos",
    tipo: "critica",
    noLeida: true,
    boton: true,
  },
  {
    id: 2,
    titulo: "Alerta Meteorológica: Lluvias Fuertes",
    descripcion:
      "Se pronostican precipitaciones altas en la zona de Popayán para las próximas 48 horas. Asegure los canales de drenaje en los cultivos jóvenes.",
    tiempo: "Hace 2 horas",
    tipo: "clima",
    noLeida: true,
    boton: true,
  },
  {
    id: 3,
    titulo: "Reporte Mensual Generado",
    descripcion:
      "El informe detallado de rendimiento y estadísticas de cosecha correspondiente al mes pasado ya está disponible para su descarga.",
    tiempo: "Ayer",
    tipo: "reporte",
    noLeida: false,
    boton: false,
  },
  {
    id: 4,
    titulo: "Sugerencia de Fertilización",
    descripcion:
      "Basado en los datos de humedad del suelo del Lote 1, es un momento óptimo para aplicar el abonado nitrogenado programado.",
    tiempo: "Hace 3 días",
    tipo: "fertilizacion",
    noLeida: false,
    boton: false,
  },
];

export default function Recomendaciones() {
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
    if (filtroActivo === "Todas") {
      return registros;
    }

    if (filtroActivo === "No leídas") {
      return registros.filter((registro) => registro.noLeida);
    }

    if (filtroActivo === "Críticas") {
      return registros.filter((registro) => registro.tipo === "critica");
    }

    if (filtroActivo === "Alertas de Cultivo") {
      return registros.filter(
        (registro) =>
          registro.descripcion.toLowerCase().includes("plaga") ||
          registro.descripcion.toLowerCase().includes("roya") ||
          registro.descripcion.toLowerCase().includes("lluvias") ||
          registro.descripcion.toLowerCase().includes("fertilización")
      );
    }

    return registros;
  };

  const registrosFiltrados = filtrarRegistros();

  return (
    <PlantillaPrincipal>
      <Topbar />

      <main className="main-content">

        {/* ENCABEZADO */}
        <header className="top-header">
          <div>
            <h1>Caficultor</h1>
            <p>Panel de Caficultor</p>
          </div>

          <section className="user-status">

            <button
              className="notif-bell"
              aria-label="Notificaciones"
            >
              🔔
              {totalNoLeidas > 0 && (
                <mark className="badge-top">
                  {totalNoLeidas}
                </mark>
              )}
            </button>

            <button className="user-menu-btn">
              <img
                src={persona}
                alt="Foto de perfil de Caficultor"
              />

              <span className="user-info-text">
                <strong>Caficultor</strong>
                <small>caficu@coffeetech.com</small>
              </span>

              <span className="arrow-down">▼</span>
            </button>

          </section>
        </header>

        <hr />

        {/* TÍTULO */}
        <header className="section-header">
          <h2>Notificaciones</h2>

          <p>
            Revisa las alertas de tus cultivos, reportes del clima
            y estados del sistema.
          </p>
        </header>

        {/* CONTENEDOR DE NOTIFICACIONES */}
        <section className="notifications-container">

          {/* FILTROS */}
          <nav className="form-tabs">
            <ul>
              {filtros.map((filtro) => (
                <li key={filtro}>
                  <a
                    href="#"
                    className={
                      filtroActivo === filtro
                        ? "active-tab"
                        : ""
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setFiltroActivo(filtro);
                    }}
                  >
                    {filtro === "Todas"
                      ? `Todas (${totalTodas})`
                      : filtro === "No leídas"
                      ? `No leídas (${totalNoLeidas})`
                      : filtro}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* LISTA DE NOTIFICACIONES */}
          <ul className="notifications-list">

            {registrosFiltrados.length === 0 ? (
              <li
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666",
                  fontStyle: "italic",
                  listStyle: "none",
                }}
              >
                No hay notificaciones disponibles en esta categoría.
              </li>
            ) : (
              registrosFiltrados.map((registro) => (

                <li
                  key={registro.id}
                  className={`notification-item ${
                    registro.noLeida ? "unread" : ""
                  } ${
                    registro.tipo === "critica"
                      ? "critical"
                      : ""
                  }`}
                >

                  {/* ICONO */}
                  <span className="notification-icon">
                    {registro.tipo === "critica"
                      ? "!"
                      : ""}
                  </span>

                  {/* INFORMACIÓN */}
                  <article className="notification-body">

                    <h3>{registro.titulo}</h3>

                    <p>
                      {registro.descripcion}
                    </p>

                    <time>
                      {registro.tiempo}
                    </time>

                  </article>

                  {/* BOTÓN */}
                  {registro.boton && registro.noLeida && (
                    <button
                      type="button"
                      className="btn-action-notif"
                      aria-label="Marcar como leída"
                      onClick={() =>
                        marcarComoLeida(registro.id)
                      }
                    >
                      ✓
                    </button>
                  )}

                </li>

              ))
            )}

          </ul>

        </section>

      </main>
    </PlantillaPrincipal>
  );
}