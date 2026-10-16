import { lazy, Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Box, CloudSun, MapPin, Mountain, Plus, Sprout } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Cifra from "@/components/ui/Cifra";
import Estado from "@/components/ui/Estado";
import AvisoItem from "@/components/finca/AvisoItem";
import { FranjaDias, Atribucion, IconoTiempo } from "@/components/clima/Clima";
import LaderaSVG from "@/components/ladera/LaderaSVG";
import { useRegistro } from "@/components/registro/ContextoRegistro";
import { useFinca } from "@/datos/useFinca";
import { resumenFinanciero, precioVigente, produccion } from "@/datos/calculos";
import { anioCafetero, COSTO_REFERENCIA_CARGA, FUENTES, precioCargaPorFR } from "@/datos/agronomia";
import { describirTiempo } from "@/datos/clima";
import { cop, num, fLarga, ent, hoyISO, sumarDias } from "@/utilidades/formato";

const LaderaViva = lazy(() => import("@/components/ladera/LaderaViva"));

function saludo() {
  const hora = new Date().getHours();
  return hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
}

function Bienvenida({ finca }) {
  const { abrir } = useRegistro();
  return (
    <Seccion titulo="Empieza por tus lotes" bajada="Con los lotes y la fecha de la floración, la app calcula tu calendario de broca, roya y cosecha.">
      <ol className="grid gap-3 sm:grid-cols-3">
        {[
          ["1", "Crea tus lotes", "Nombre, área, variedad y año de siembra o de zoca.", <Link key="a" to="/finca/lotes?nuevo=1" className="boton-primario mt-3 w-full"><Plus className="h-5 w-5" aria-hidden="true" /> Nuevo lote</Link>],
          ["2", "Registra la floración", "Es la fecha que pone en marcha todos los avisos.", <button key="b" type="button" className="boton-secundario mt-3 w-full" onClick={() => abrir("floracion")}>Registrar floración</button>],
          ["3", "Anota lo que pasa", "Labores, muestreos, recolección y ventas, aunque no haya señal.", <button key="c" type="button" className="boton-secundario mt-3 w-full" onClick={() => abrir()}>Registrar</button>],
        ].map(([n, titulo, texto, accion]) => (
          <li key={n} className="flex flex-col rounded-2xl bg-pergamino p-4">
            <span className="titular text-3xl text-cereza">{n}</span>
            <p className="mt-1 font-bold">{titulo}</p>
            <p className="text-[0.95rem] text-tierra-media">{texto}</p>
            <div className="mt-auto">{accion}</div>
          </li>
        ))}
      </ol>
      {!Number.isFinite(finca?.lat) && (
        <p className="mt-4 flex items-center gap-2 text-[0.95rem] text-tierra-media">
          <MapPin className="h-5 w-5 text-cereza" aria-hidden="true" /> Ubica la finca en{" "}
          <Link to="/finca/perfil" className="font-bold underline">
            Mi cuenta
          </Link>{" "}
          para ver el clima.
        </p>
      )}
    </Seccion>
  );
}

export default function Hoy() {
  const navegar = useNavigate();
  const datosFinca = useFinca();
  const { sesion, finca, lotes, avisos, clima, precios, recolecciones } = datosFinca;
  const [ver3d, setVer3d] = useState(false);
  const anio = anioCafetero();
  const resumen = resumenFinanciero(datosFinca, anio);
  const precio = precioVigente(precios);
  const semana = produccion(datosFinca, { desde: hoyISO(sumarDias(new Date(), -6)) });
  const pendientes = avisos.filter((aviso) => aviso.nivel !== "info");
  const nombre = sesion?.nombre?.split(" ")[0] ?? "";
  const hoyClima = clima.datos?.clima?.dias?.find((dia) => dia.fecha === hoyISO());
  const ubicacion = [finca?.vereda && `Vereda ${finca.vereda}`, finca?.municipio, finca?.departamento].filter(Boolean).join(", ");

  return (
    <>
      <EncabezadoPagina rotulo={`${saludo()}, ${nombre}`} titulo={finca?.nombre ?? "Mi finca"}>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-tierra-media">
          {ubicacion && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {ubicacion}
            </span>
          )}
          {Number.isFinite(finca?.altitud) && (
            <span className="inline-flex items-center gap-1.5">
              <Mountain className="h-4 w-4" aria-hidden="true" /> {ent(finca.altitud)} msnm
            </span>
          )}
          {lotes.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Sprout className="h-4 w-4" aria-hidden="true" /> {lotes.length} lotes · {num(lotes.reduce((s, l) => s + (l.areaHa || 0), 0))} ha
            </span>
          )}
        </p>
      </EncabezadoPagina>

      {!lotes.length ? (
        <Bienvenida finca={finca} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-6">
            <section aria-labelledby="titulo-hoy">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h2 id="titulo-hoy" className="titular text-[1.7rem]">
                  {pendientes.length ? `Para hoy: ${pendientes.length} ${pendientes.length === 1 ? "cosa" : "cosas"}` : "Todo al día"}
                </h2>
                <Link to="/finca/lotes" className="text-sm font-bold text-tierra-media underline-offset-2 hover:underline">
                  Ver lotes
                </Link>
              </div>
              {avisos.length ? (
                <ul className="grid gap-3">
                  {avisos.slice(0, 8).map((aviso) => (
                    <AvisoItem key={aviso.id} aviso={aviso} />
                  ))}
                </ul>
              ) : (
                <Vacio Icono={Sprout} titulo="Nada pendiente" texto="Ningún lote pide atención según tus registros. Sigue anotando muestreos y floraciones." />
              )}
            </section>
          </div>

          <div className="grid content-start gap-6">
            <Seccion
              titulo="La ladera"
              bajada="Cada lote con su estado. Toca uno para ver su ficha."
              acciones={
                <button type="button" className="boton-fantasma text-sm" onClick={() => setVer3d((v) => !v)} aria-pressed={ver3d}>
                  <Box className="h-4 w-4" aria-hidden="true" /> {ver3d ? "Ver en 2D" : "Ver en 3D"}
                </button>
              }
            >
              <div className="overflow-hidden rounded-xl">
                {ver3d ? (
                  <Suspense fallback={<LaderaSVG lotes={lotes} />}>
                    <LaderaViva lotes={lotes} alSeleccionar={(id) => navegar(`/finca/lotes/${id}`)} respaldo={<LaderaSVG lotes={lotes} alSeleccionar={(id) => navegar(`/finca/lotes/${id}`)} />} />
                  </Suspense>
                ) : (
                  <LaderaSVG lotes={lotes} alSeleccionar={(id) => navegar(`/finca/lotes/${id}`)} />
                )}
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {lotes.map((lote) => (
                  <li key={lote.id}>
                    <Link to={`/finca/lotes/${lote.id}`} className="flex min-h-12 items-center justify-between gap-2 rounded-xl bg-pergamino px-3 py-2 hover:bg-crema">
                      <span className="truncate font-bold">{lote.nombre}</span>
                      <Estado tipo={lote.estado} pequeno>
                        {lote.estadoTexto}
                      </Estado>
                    </Link>
                  </li>
                ))}
              </ul>
            </Seccion>

            <Seccion
              titulo="Clima"
              acciones={
                <Link to="/finca/clima" className="boton-fantasma text-sm">
                  <CloudSun className="h-4 w-4" aria-hidden="true" /> Detalle
                </Link>
              }
            >
              {clima.datos ? (
                <>
                  {hoyClima && (
                    <p className="mb-3 flex items-center gap-3">
                      <IconoTiempo codigo={hoyClima.codigo} className="h-9 w-9 text-tierra-media" />
                      <span>
                        <span className="block font-bold">{describirTiempo(hoyClima.codigo).texto}</span>
                        <span className="text-[0.95rem] text-tierra-media">
                          Lluvia probable {hoyClima.probLluvia} % · humedad {hoyClima.humedad} %
                        </span>
                      </span>
                    </p>
                  )}
                  <FranjaDias dias={clima.datos.clima.dias} />
                  <Atribucion datos={clima.datos} alActualizar={clima.actualizar} />
                </>
              ) : (
                <p className="text-tierra-media">{clima.cargando ? "Cargando el pronóstico…" : clima.error ?? "Sin pronóstico."}</p>
              )}
            </Seccion>
          </div>

          <section aria-labelledby="titulo-cifras" className="xl:col-span-2">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="titulo-cifras" className="titular text-[1.7rem]">
                Año cafetero {anio.nombre}
              </h2>
              <Link to="/finca/costos" className="inline-flex items-center gap-1 text-sm font-bold text-tierra-media hover:underline">
                Costos y ventas <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="papel grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
              <Cifra
                rotulo="Producción"
                valor={num(resumen.produccion.cargas)}
                unidad="cargas"
                detalle={`${ent(resumen.produccion.kgCereza)} kg de cereza recogidos${semana.kgCereza ? ` · ${ent(semana.kgCereza)} kg esta semana` : ""}`}
                fuente={`Cargas de 125 kg de café pergamino seco, con el factor de conversión de cada lote. ${FUENTES.conversion.texto}.`}
              />
              <Cifra
                rotulo="Costo por carga"
                valor={resumen.costoPorCarga ? cop(resumen.costoPorCarga) : "—"}
                tono={resumen.costoPorCarga && precio && resumen.costoPorCarga > precio.precioCarga ? "cereza" : "tierra"}
                detalle={`Referencia nacional: ${cop(COSTO_REFERENCIA_CARGA)}`}
                fuente={`Suma de labores, recolección, aplicaciones y gastos del año cafetero, dividida por las cargas producidas. Referencia: ${FUENTES.costos.texto}.`}
              />
              <Cifra
                rotulo="Precio de referencia"
                valor={precio ? cop(precioCargaPorFR(precio.precioCarga, 94, precio.pasillaKg)) : "—"}
                detalle={precio ? `Carga FR 94 · ${fLarga(precio.fecha)}` : "El administrador no ha registrado el precio."}
                fuente={precio ? `${precio.fuente}. Lo registra el administrador a partir del precio publicado por la FNC.` : undefined}
              />
              <Cifra
                rotulo="Ventas"
                valor={cop(resumen.ingresos)}
                detalle={`${num(resumen.kgVendidos / 125)} cargas vendidas`}
                tono={resumen.margen >= 0 ? "hoja" : "cereza"}
                fuente="Suma de las ventas registradas en el año cafetero (octubre a septiembre)."
              />
            </div>
            {recolecciones.length === 0 && <p className="mt-3 text-sm text-tierra-media">Aún no hay recolecciones registradas este año.</p>}
          </section>
        </div>
      )}
    </>
  );
}
