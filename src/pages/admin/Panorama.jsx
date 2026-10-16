import { Link } from "react-router-dom";
import { ArrowRight, BadgeDollarSign, MapPin } from "lucide-react";
import { EncabezadoPagina, Seccion } from "@/components/ui/Pagina";
import Cifra from "@/components/ui/Cifra";
import Estado from "@/components/ui/Estado";
import Barras from "@/components/ui/Barras";
import { useRegion } from "@/datos/region";
import { precioVigente } from "@/datos/calculos";
import { obtenerCafeMunicipios, obtenerTRM, useAbierto } from "@/datos/abiertos";
import { diasEntre, fLarga, cop, num, ent, hace } from "@/utilidades/formato";

function MapaFincas({ fincas }) {
  const ubicadas = fincas.filter((f) => Number.isFinite(f.lat) && Number.isFinite(f.lon));
  if (ubicadas.length < 2) return null;
  const lats = ubicadas.map((f) => f.lat);
  const lons = ubicadas.map((f) => f.lon);
  const [minLat, maxLat, minLon, maxLon] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  const x = (lon) => 40 + ((lon - minLon) / Math.max(maxLon - minLon, 0.01)) * 320;
  const y = (lat) => 200 - ((lat - minLat) / Math.max(maxLat - minLat, 0.01)) * 160;
  const color = { actuar: "#FF3B2F", vigilar: "#FFC21A", ok: "#FFFFFF", sinDatos: "#9A9C94" };
  return (
    <svg viewBox="0 0 400 240" className="h-auto w-full rounded-md bg-cal" role="img" aria-label="Ubicación relativa de las fincas">
      {ubicadas.map((f) => (
        <g key={f.id}>
          <circle cx={x(f.lon)} cy={y(f.lat)} r="11" fill={color[f.estado]} stroke="#111210" strokeWidth="2" />
          <text x={x(f.lon)} y={y(f.lat) + 26} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#111210" stroke="#F6F6F3" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "var(--font-sans)" }}>
            {f.nombre}
          </text>
          <text x={x(f.lon)} y={y(f.lat) + 39} textAnchor="middle" fontSize="10" fill="#4B4D47" stroke="#F6F6F3" strokeWidth="3" paintOrder="stroke" style={{ fontFamily: "var(--font-sans)" }}>
            {f.municipio}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Panorama() {
  const { fincas, anio, precios } = useRegion();
  const precio = precioVigente(precios);
  const trm = useAbierto(obtenerTRM, []);
  const eva = useAbierto(() => obtenerCafeMunicipios("Cauca"), []);
  const lotes = fincas.flatMap((f) => f.lotes);
  const actuar = fincas.flatMap((f) => f.avisos).filter((a) => a.nivel === "actuar");
  const conBroca = fincas.filter((f) => f.brocaPromedio !== null);
  const conRoya = fincas.filter((f) => f.royaPromedio !== null);
  const cargas = fincas.reduce((s, f) => s + f.resumen.produccion.cargas, 0);
  const orden = { actuar: 0, vigilar: 1, sinDatos: 2, ok: 3 };
  const precioViejo = precio ? diasEntre(precio.fecha) > 2 : true;
  const municipiosPropios = new Set(fincas.map((f) => f.municipio));

  return (
    <>
      <EncabezadoPagina rotulo="Administración" titulo="Panorama" bajada={`Las ${fincas.length} fincas registradas en este equipo, año cafetero ${anio.nombre}.`} />

      {precioViejo && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amarillo/40 bg-amarillo-tenue px-4 py-3">
          <p className="font-bold text-amarillo-texto">{precio ? `El precio de referencia es del ${fLarga(precio.fecha)}.` : "Aún no hay precio de referencia."} Los caficultores lo usan para estimar sus ventas.</p>
          <Link to="/admin/precio" className="boton-primario">
            <BadgeDollarSign className="h-5 w-5" aria-hidden="true" /> Registrar el precio de hoy
          </Link>
        </div>
      )}

      <div className="placa mb-6 grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <Cifra rotulo="Fincas" valor={ent(fincas.length)} detalle={`${ent(lotes.length)} lotes · ${num(fincas.reduce((s, f) => s + f.area, 0))} ha en café`} />
        <Cifra rotulo="Para actuar hoy" valor={ent(actuar.length)} tono={actuar.length ? "cereza" : "hoja"} detalle={`En ${new Set(actuar.map((a) => a.loteId)).size} lotes`} />
        <Cifra rotulo="Broca promedio" valor={conBroca.length ? `${num(conBroca.reduce((s, f) => s + f.brocaPromedio, 0) / conBroca.length)} %` : "—"} detalle="Último muestreo de cada lote" fuente="Promedio simple del último muestreo de broca de cada finca. Umbral de acción: 2 %." />
        <Cifra rotulo="Roya promedio" valor={conRoya.length ? `${num(conRoya.reduce((s, f) => s + f.royaPromedio, 0) / conRoya.length)} %` : "—"} detalle={`Producción: ${num(cargas)} cargas`} fuente="Promedio simple del último muestreo de roya de cada finca. Se aplica sobre el 5 %." />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Seccion titulo="Fincas" acciones={<Link to="/admin/fincas" className="boton-fantasma text-sm">Ver todas <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}>
          <ul className="grid gap-2">
            {[...fincas]
              .sort((a, b) => orden[a.estado] - orden[b.estado])
              .map((f) => (
                <li key={f.id}>
                  <Link to={`/admin/fincas/${f.id}`} className="flex items-center gap-3 rounded-md border border-linea bg-cal/60 px-4 py-3 hover:border-tinta">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{f.nombre}</p>
                      <p className="text-sm text-grafito">
                        <MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                        {f.municipio} · {f.propietario} · {f.lotes.length} lotes
                        {f.ultimaActividad ? ` · último registro ${hace(f.ultimaActividad)}` : ""}
                      </p>
                    </div>
                    <Estado tipo={f.estado} pequeno />
                  </Link>
                </li>
              ))}
          </ul>
          <div className="mt-4">
            <MapaFincas fincas={fincas} />
          </div>
        </Seccion>

        <div className="grid content-start gap-6">
          <Seccion titulo="Precio y tasa de cambio">
            <div className="grid gap-5 sm:grid-cols-2">
              <Cifra rotulo="Carga FR 94 (FNC)" valor={precio ? cop(precio.precioCarga) : "—"} detalle={precio ? fLarga(precio.fecha) : "Sin registrar"} fuente={precio?.fuente} />
              <Cifra
                rotulo="TRM"
                valor={trm.datos ? cop(trm.datos.valor[0].valor) : "—"}
                detalle={trm.datos ? `Vigente desde el ${fLarga(trm.datos.valor[0].fecha)}` : trm.cargando ? "Consultando…" : "Sin conexión"}
                fuente="Superintendencia Financiera en datos.gov.co (conjunto 32sa-8pi3, CC BY-SA 4.0)."
              />
            </div>
          </Seccion>
          <Seccion titulo="Café en el Cauca" bajada={eva.datos ? `Área sembrada por municipio, ${eva.datos.valor.anio}. En verde, municipios con fincas registradas.` : "Evaluaciones Agropecuarias (EVA) de la UPRA."}>
            {eva.datos ? (
              <>
                <Barras
                  titulo="Hectáreas de café sembradas por municipio del Cauca"
                  datos={eva.datos.valor.municipios.slice(0, 10).map((m) => ({ etiqueta: m.municipio.split(" ")[0].slice(0, 9), valor: Math.round(m.area), color: municipiosPropios.has(m.municipio) ? "#2E5B3A" : "#B8A88F" }))}
                  formato={(v) => `${ent(v / 1000)}k`}
                  alto={130}
                />
                <p className="mt-2 text-sm text-grafito">
                  Total del departamento: {ent(eva.datos.valor.municipios.reduce((s, m) => s + m.area, 0))} ha sembradas. Fuente:{" "}
                  <a className="underline" href="https://www.datos.gov.co/Agricultura-y-Desarrollo-Rural/Evaluaciones-Agropecuarias-Municipales-EVA-2019-2025/uejq-wxrr" target="_blank" rel="noreferrer">
                    UPRA, EVA en datos.gov.co
                  </a>{" "}
                  (CC BY-SA 4.0).
                </p>
              </>
            ) : (
              <p className="text-grafito">{eva.cargando ? "Consultando datos.gov.co…" : "Sin conexión: los datos del sector aparecen cuando haya señal."}</p>
            )}
          </Seccion>
        </div>
      </div>
    </>
  );
}
