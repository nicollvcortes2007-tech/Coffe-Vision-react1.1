import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Download, MapPin, Footprints, ChevronRight } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Estado from "@/components/ui/Estado";
import Hoja from "@/components/ui/Hoja";
import { useAvisos } from "@/components/ui/Avisos";
import LaderaSVG from "@/components/ladera/LaderaSVG";
import FormLote from "@/components/lotes/FormLote";
import { Ladera } from "@/components/marca/Pictogramas";
import { useFinca } from "@/datos/useFinca";
import { variedad } from "@/datos/agronomia";
import { geojsonFinca, validarGeometria } from "@/utilidades/geo";
import { descargar } from "@/utilidades/descargas";
import { num, ent } from "@/utilidades/formato";

export default function Lotes() {
  const navegar = useNavigate();
  const [parametros, setParametros] = useSearchParams();
  const avisos = useAvisos();
  const { finca, lotes } = useFinca({ conClima: false });
  const [nuevo, setNuevo] = useState(false);

  useEffect(() => {
    if (parametros.get("nuevo")) {
      setNuevo(true);
      setParametros({}, { replace: true });
    }
  }, [parametros, setParametros]);

  const ubicados = lotes.filter((lote) => lote.geometria);
  const conProblemas = ubicados.filter((lote) => validarGeometria(lote).length);
  const exportar = () => {
    const nombre = `${(finca?.nombre ?? "finca").toLowerCase().replace(/\s+/g, "-")}-lotes.geojson`;
    descargar(nombre, JSON.stringify(geojsonFinca(finca, lotes), null, 2), "application/geo+json");
    avisos.info(`Se descargó ${nombre} con ${ubicados.length} lotes.`);
  };

  return (
    <>
      <EncabezadoPagina
        rotulo={finca?.nombre}
        titulo="Lotes"
        bajada="Cada lote con los datos que usa el SICA: área, variedad, edad, densidad y luz."
        acciones={
          <button type="button" className="boton-primario" onClick={() => setNuevo(true)}>
            <Plus className="h-5 w-5" aria-hidden="true" /> Nuevo lote
          </button>
        }
      />

      {!lotes.length ? (
        <Vacio Icono={Ladera} titulo="Todavía no hay lotes" texto="Crea el primero: con él empiezan los cálculos de la finca." accion={<button type="button" className="boton-primario" onClick={() => setNuevo(true)}><Plus className="h-5 w-5" aria-hidden="true" /> Nuevo lote</button>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <Seccion titulo="La ladera" bajada="Toca un lote para abrir su ficha.">
            <LaderaSVG lotes={lotes} alSeleccionar={(id) => navegar(`/finca/lotes/${id}`)} />
            <p className="mt-3 text-sm text-tierra-media">El dibujo ubica los lotes en orden sobre una ladera ilustrativa; la ubicación real es la del GPS.</p>
          </Seccion>

          <section aria-label="Lista de lotes" className="grid content-start gap-3">
            {lotes.map((lote) => (
              <Link key={lote.id} to={`/finca/lotes/${lote.id}`} className="papel group flex items-center gap-4 p-4 transition-colors hover:border-tierra sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="titular text-[1.45rem]">{lote.nombre}</h2>
                    <Estado tipo={lote.estado} pequeno>
                      {lote.estadoTexto}
                    </Estado>
                  </div>
                  <p className="mt-1 text-[0.95rem] text-tierra-media">
                    {num(lote.areaHa)} ha · {variedad(lote.variedad).nombre} · {lote.etapa.nombre}
                    {lote.etapa.cosechas ? ` (${lote.etapa.cosechas}.ª cosecha)` : ""}
                    {lote.densidad ? ` · ${ent(lote.densidad)} árb/ha` : ""}
                  </p>
                  {lote.avisos[0] && lote.estado !== "ok" && <p className="mt-1.5 text-[0.95rem] font-bold">{lote.avisos[0].titulo}</p>}
                </div>
                <span className="flex shrink-0 items-center gap-1 text-sm text-tierra-media">
                  {lote.geometria ? (
                    lote.geometria.tipo === "poligono" ? (
                      <Footprints className="h-4 w-4" aria-label="Con contorno" />
                    ) : (
                      <MapPin className="h-4 w-4" aria-label="Con punto GPS" />
                    )
                  ) : null}
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}

            <div className="mt-2 rounded-2xl border border-linea bg-papel p-4 sm:p-5">
              <h2 className="font-bold">Ubicación para compradores</h2>
              <p className="mt-1 text-[0.95rem] text-tierra-media">
                Desde el 30 de diciembre de 2026 la Unión Europea pide la ubicación de cada lote de donde sale el café (punto, o contorno desde 4 ha). Descarga tus lotes en GeoJSON para entregarlos si te los piden.
              </p>
              <p className="mt-2 text-sm">
                {ubicados.length} de {lotes.length} lotes ubicados{conProblemas.length ? ` · ${conProblemas.length} con algo por revisar` : ""}.
              </p>
              <button type="button" className="boton-secundario mt-3" disabled={!ubicados.length} onClick={exportar}>
                <Download className="h-5 w-5" aria-hidden="true" /> Descargar GeoJSON
              </button>
            </div>
          </section>
        </div>
      )}

      <Hoja abierta={nuevo} alCerrar={() => setNuevo(false)} titulo="Nuevo lote" descripcion="Solo el nombre es obligatorio; lo demás lo puedes completar después.">
        {nuevo && finca && <FormLote finca={finca} alTerminar={() => setNuevo(false)} />}
      </Hoja>
    </>
  );
}
