import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import { Link } from "react-router-dom";
import Topbar from "@/components/navegacion/Topbar";
import MetricCard from "@/components/comunes/MetricCard";
import Panel from "@/components/comunes/Panel";
import StatusBadge from "@/components/comunes/StatusBadge";
import avatar from "@/assets/imagenes/image.png";
import fondoFinca from "@/assets/imagenes/Cafe.webp";

const METRICAS = [
  { icon: "fa-solid fa-seedling", label: "Lotes activos", value: "6", hint: "2 en floracion" },
  { icon: "fa-solid fa-bug", label: "Alertas de plagas", value: "2", hint: "Broca y roya en revision" },
  { icon: "fa-solid fa-mug-hot", label: "Cosecha estimada", value: "840 kg", hint: "Proximo corte" },
  { icon: "fa-solid fa-calendar-check", label: "Labores pendientes", value: "5", hint: "Esta semana" },
];

const BARRAS = [44, 62, 51, 78, 68, 86, 72];

const RECOMENDACIONES = [
  { icon: "fa-bug", titulo: "Revisar frutos perforados", detalle: "Prioridad alta en lote 2." },
  { icon: "fa-droplet", titulo: "Fertilizacion balanceada", detalle: "Programada para final de mes." },
  { icon: "fa-cloud-sun", titulo: "Monitorear humedad", detalle: "Riesgo por lluvias frecuentes." },
];

const GUIAS = [
  { icon: "fa-shield-halved", titulo: "Manejo integrado de plagas", detalle: "Prevencion, monitoreo y control responsable." },
  { icon: "fa-seedling", titulo: "Nutricion del cultivo", detalle: "Buenas practicas para cada etapa del cafe." },
  { icon: "fa-mug-saucer", titulo: "Cosecha y postcosecha", detalle: "Mejora la calidad del grano y reduce perdidas." },
];

const LABORES = [
  ["Revision de broca", "Lote 2", "Hoy", <StatusBadge tipo="warning">Pendiente</StatusBadge>],
  ["Aplicacion de fertilizante", "Lote 4", "30 mayo", <StatusBadge tipo="ok">Programada</StatusBadge>],
  ["Registro de cosecha", "Lote 1", "2 junio", <StatusBadge tipo="ok">Lista</StatusBadge>],
];

function DashboardCaficultor() {
  return (
    <PlantillaPrincipal role="caficultor">
      <Topbar
        eyebrow="Bienvenido"
        title="Mi finca cafetera"
        notifTo="/notificaciones"
        perfilTo="/perfil"
        avatar={avatar}
        nombre="Caficultor"
        rol="Finca El Paraíso"
      />

      <header
        className="relative flex min-h-[270px] flex-col justify-center gap-4 overflow-hidden rounded-lg p-8 text-white shadow-hero sm:flex-row sm:items-center sm:justify-between"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(42,26,15,0.9), rgba(78,42,21,0.62)), url(${fondoFinca})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <section className="relative z-10 max-w-xl">
          <p className="eyebrow !text-gold">Panel caficultor</p>
          <h1 className="text-white sm:text-4xl">Finca El Paraiso</h1>
          <p className="mt-3 leading-relaxed text-white/90">
            Gestiona tus cultivos, revisa recomendaciones y consulta el asistente inteligente para tomar
            mejores decisiones en tu produccion cafetera.
          </p>
          <Link to="/registrar-labor" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/35 bg-white/15 px-4 py-2.5 font-extrabold">
            <i className="fa-solid fa-plus"></i> Registrar labor
          </Link>
        </section>

        <section className="relative z-10 grid w-full max-w-[210px] gap-2.5 rounded-lg border border-white/25 bg-white/15 p-5 backdrop-blur">
          <span className="text-white/85">Salud del cultivo</span>
          <strong className="text-5xl leading-none">82%</strong>
          <small className="text-white/85">Estado estable con seguimiento recomendado en el lote 2.</small>
        </section>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Indicadores de mi finca">
        {METRICAS.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Panel
          eyebrow="Estadisticas"
          title="Resumen semanal y mensual"
          className="lg:col-span-2"
          action={
            <div className="flex gap-2 rounded-lg bg-[#fbfaf7] p-1">
              <button className="rounded-md bg-white px-3 py-1.5 text-sm font-bold text-coffee shadow-sm">Semanal</button>
              <button className="px-3 py-1.5 text-sm font-bold text-muted">Mensual</button>
            </div>
          }
        >
          <section className="mb-4 grid gap-3 sm:grid-cols-3">
            {[
              ["Produccion", "210 kg", "+14% vs semana anterior"],
              ["Alertas", "3", "2 atendidas"],
              ["Labores", "12", "Riego, poda y control"],
            ].map(([label, valor, nota]) => (
              <article key={label} className="rounded-lg border border-line bg-[#fbfaf7] p-4">
                <span className="text-muted">{label}</span>
                <strong className="my-1 block text-[1.7rem] text-coffee">{valor}</strong>
                <small className="text-muted">{nota}</small>
              </article>
            ))}
          </section>

          <div className="grid h-[210px] grid-cols-7 items-end gap-3 rounded-lg border border-line bg-gradient-to-b from-[#fbfaf7] to-[#f0eadf] p-4">
            {BARRAS.map((alto, i) => (
              <span
                key={i}
                className="block min-h-[22px] rounded-t-lg rounded-b bg-gradient-to-b from-green to-green-deep"
                style={{ height: `${alto}%` }}
              ></span>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Recomendaciones" title="Acciones sugeridas">
          <ul className="grid gap-3">
            {RECOMENDACIONES.map((r) => (
              <li key={r.titulo} className="flex items-start gap-3 rounded-lg border border-line bg-[#fbfaf7] p-3">
                <i className={`fa-solid ${r.icon} mt-1 text-green`}></i>
                <span>
                  <strong className="block text-coffee">{r.titulo}</strong>
                  <small className="text-muted">{r.detalle}</small>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel eyebrow="Aprendizaje" title="Guias de buenas practicas">
          <section className="grid gap-3">
            {GUIAS.map((g) => (
              <article key={g.titulo} className="flex items-start gap-3 rounded-lg border border-line bg-[#fbfaf7] p-3">
                <i className={`fa-solid ${g.icon} mt-1 text-green`}></i>
                <div>
                  <h3>{g.titulo}</h3>
                  <p className="mt-1 text-sm text-muted">{g.detalle}</p>
                </div>
              </article>
            ))}
          </section>
        </Panel>

        <Panel
          eyebrow="Agenda"
          title="Labores proximas de la finca"
          className="lg:col-span-2"
          action={<button className="text-sm font-bold text-green hover:text-green-deep">Agregar labor</button>}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Actividad", "Lote", "Fecha", "Estado"].map((h) => (
                  <th key={h} className="border-b border-line px-3 py-3.5 text-left text-[0.82rem] text-coffee">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LABORES.map((fila, i) => (
                <tr key={i}>
                  {fila.map((celda, j) => (
                    <td key={j} className="border-b border-line px-3 py-3.5 text-[0.93rem] text-muted">{celda}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </section>

    </PlantillaPrincipal>
  );
}

export default DashboardCaficultor;
