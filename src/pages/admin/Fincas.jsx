import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Mountain, Phone } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Estado from "@/components/ui/Estado";
import Cifra from "@/components/ui/Cifra";
import LaderaSVG from "@/components/ladera/LaderaSVG";
import { useRegion } from "@/datos/region";
import { variedad, COSTO_REFERENCIA_CARGA } from "@/datos/agronomia";
import { cop, num, ent, hace } from "@/utilidades/formato";

function Detalle({ finca }) {
  return (
    <>
      <Link to="/admin/fincas" className="boton-fantasma -ml-3 mb-3">
        <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Fincas
      </Link>
      <EncabezadoPagina titulo={finca.nombre} rotulo={finca.propietario}>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-grafito">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" /> {[finca.vereda, finca.municipio, finca.departamento].filter(Boolean).join(", ")}
          </span>
          {finca.altitud && (
            <span className="inline-flex items-center gap-1.5">
              <Mountain className="h-4 w-4" aria-hidden="true" /> {ent(finca.altitud)} msnm
            </span>
          )}
          {finca.cuenta?.telefono && (
            <a href={`tel:${finca.cuenta.telefono.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 underline">
              <Phone className="h-4 w-4" aria-hidden="true" /> {finca.cuenta.telefono}
            </a>
          )}
        </p>
      </EncabezadoPagina>
      <div className="placa mb-6 grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <Cifra rotulo="Área en café" valor={num(finca.area)} unidad="ha" detalle={`${finca.lotes.length} lotes`} />
        <Cifra rotulo="Producción" valor={num(finca.resumen.produccion.cargas)} unidad="cargas" detalle={finca.area ? `${num(finca.resumen.produccion.cargas / finca.area)} cargas/ha` : null} />
        <Cifra rotulo="Costo por carga" valor={finca.resumen.costoPorCarga ? cop(finca.resumen.costoPorCarga) : "—"} detalle={`Referencia: ${cop(COSTO_REFERENCIA_CARGA)}`} />
        <Cifra rotulo="Último registro" valor={finca.ultimaActividad ? hace(finca.ultimaActividad) : "—"} tamano="sm" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Seccion titulo="Lotes">
          <LaderaSVG lotes={finca.lotes} />
          <ul className="mt-4 grid gap-2">
            {finca.lotes.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 rounded-md bg-cal px-3 py-2.5">
                <span>
                  <span className="block font-bold">{l.nombre}</span>
                  <span className="text-sm text-grafito">
                    {num(l.areaHa)} ha · {variedad(l.variedad).nombre} · {l.etapa.nombre}
                  </span>
                </span>
                <Estado tipo={l.estado} pequeno>
                  {l.estadoTexto}
                </Estado>
              </li>
            ))}
          </ul>
        </Seccion>
        <Seccion titulo="Lo que piden los lotes" bajada="Los mismos avisos que ve el caficultor en «Hoy».">
          {finca.avisos.length ? (
            <ul className="grid gap-2">
              {finca.avisos.map((a) => (
                <li key={a.id} className="rounded-md border border-linea p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Estado tipo={a.nivel === "info" ? "sinDatos" : a.nivel} pequeno />
                    <span className="text-sm font-bold text-grafito">{a.loteNombre}</span>
                  </div>
                  <p className="mt-1 font-bold">{a.titulo}</p>
                  <p className="text-[0.95rem] text-grafito">{a.razon}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-grafito">Ningún lote pide atención.</p>
          )}
        </Seccion>
      </div>
    </>
  );
}

export default function Fincas() {
  const { fincaId } = useParams();
  const { fincas } = useRegion();
  if (fincaId) {
    const finca = fincas.find((f) => f.id === fincaId);
    return finca ? <Detalle finca={finca} /> : <Vacio titulo="No encontramos esa finca" accion={<Link to="/admin/fincas" className="boton-primario">Ver fincas</Link>} />;
  }
  return (
    <>
      <EncabezadoPagina rotulo="Administración" titulo="Fincas" bajada={`${fincas.length} fincas registradas en este equipo.`} />
      <div className="overflow-x-auto rounded-lg border border-linea bg-lamina">
        <table className="w-full min-w-[46rem] text-left">
          <thead className="bg-cal-honda/60 text-sm text-grafito">
            <tr>
              <th className="px-4 py-3 font-bold">Finca</th>
              <th className="px-4 py-3 font-bold">Municipio</th>
              <th className="px-4 py-3 font-bold">Lotes</th>
              <th className="px-4 py-3 font-bold">Broca</th>
              <th className="px-4 py-3 font-bold">Roya</th>
              <th className="px-4 py-3 font-bold">Producción</th>
              <th className="px-4 py-3 font-bold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {fincas.map((f) => (
              <tr key={f.id} className="border-t border-linea">
                <td className="px-4 py-3">
                  <Link to={`/admin/fincas/${f.id}`} className="font-bold underline-offset-2 hover:underline">
                    {f.nombre}
                  </Link>
                  <span className="block text-sm text-grafito">{f.propietario}</span>
                </td>
                <td className="px-4 py-3">{f.municipio}</td>
                <td className="cifra px-4 py-3">
                  {f.lotes.length} · {num(f.area)} ha
                </td>
                <td className={`cifra px-4 py-3 ${f.brocaPromedio >= 2 ? "font-bold text-cereza" : ""}`}>{f.brocaPromedio !== null ? `${num(f.brocaPromedio)} %` : "—"}</td>
                <td className={`cifra px-4 py-3 ${f.royaPromedio > 5 ? "font-bold text-cereza" : ""}`}>{f.royaPromedio !== null ? `${num(f.royaPromedio)} %` : "—"}</td>
                <td className="cifra px-4 py-3">{num(f.resumen.produccion.cargas)} cargas</td>
                <td className="px-4 py-3">
                  <Estado tipo={f.estado} pequeno />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
