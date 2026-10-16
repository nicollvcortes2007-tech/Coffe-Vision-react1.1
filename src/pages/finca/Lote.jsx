import { lazy, Suspense, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2, MapPin, Footprints, Archive } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Estado from "@/components/ui/Estado";
import Cifra from "@/components/ui/Cifra";
import Hoja from "@/components/ui/Hoja";
import { useAvisos } from "@/components/ui/Avisos";
import AvisoItem from "@/components/finca/AvisoItem";
import FormLote from "@/components/lotes/FormLote";
import { useRegistro, TIPOS_REGISTRO } from "@/components/registro/ContextoRegistro";
import { Floracion, Broca, Roya, Canasto } from "@/components/marca/Pictogramas";
import { ClipboardList, Sprout, ScanSearch } from "lucide-react";
import { useFinca } from "@/datos/useFinca";
import { actualizar, crear, eliminar } from "@/datos/almacen";
import { produccion, movimientosCosto } from "@/datos/calculos";
import { floracionVigente } from "@/datos/reglas";
import { anioCafetero, evaluarBroca, evaluarRoya, labor, variedad, SISTEMAS, DIAS, esSusceptible, PRODUCTIVIDAD_PAIS_CARGAS_HA, FUENTES, MOTIVOS_APLICACION } from "@/datos/agronomia";
import { validarGeometria } from "@/utilidades/geo";
import { cop, num, ent, fCorta, fLarga, hace, sumarDias, diasEntre } from "@/utilidades/formato";

const LaderaViva = lazy(() => import("@/components/ladera/LaderaViva"));

const COLECCION = { labor: "labores", floracion: "floraciones", muestreo: "muestreos", recoleccion: "recolecciones", aplicacion: "aplicaciones", diagnostico: "diagnosticos" };

function eventos(lote, datos) {
  const lista = [];
  const de = (coleccion) => datos[coleccion].filter((item) => item.loteId === lote.id);
  for (const item of de("labores")) lista.push({ tipo: "labor", item, fecha: item.fecha, Icono: ClipboardList, titulo: labor(item.tipo).nombre, detalle: [item.jornales ? `${item.jornales} jornales` : null, item.notas].filter(Boolean).join(" · ") });
  for (const item of de("floraciones")) lista.push({ tipo: "floracion", item, fecha: item.fecha, Icono: Floracion, titulo: item.principal ? "Floración principal" : "Floración", detalle: item.intensidad?.replace("-", " ") });
  for (const item of de("muestreos")) {
    const r = item.tipo === "broca" ? evaluarBroca(item) : evaluarRoya(item);
    const pct = item.tipo === "broca" ? r.infestacion : r.incidencia;
    lista.push({ tipo: "muestreo", item, fecha: item.fecha, Icono: item.tipo === "broca" ? Broca : Roya, titulo: `Muestreo de ${item.tipo}: ${num(pct)} %`, detalle: r.nivel === "ok" ? "Por debajo del umbral" : "Sobre el umbral", nivel: r.nivel });
  }
  const recolecciones = de("recolecciones");
  const porDia = new Map();
  for (const item of recolecciones) {
    const actual = porDia.get(item.fecha) ?? { kg: 0, personas: new Set(), items: [] };
    actual.kg += Number(item.kgCereza) || 0;
    actual.personas.add(item.recolector);
    actual.items.push(item);
    porDia.set(item.fecha, actual);
  }
  for (const [fecha, dia] of porDia) lista.push({ tipo: "recoleccion", items: dia.items, fecha, Icono: Canasto, titulo: `Recolección: ${ent(dia.kg)} kg de cereza`, detalle: [...dia.personas].join(", ") });
  for (const item of de("aplicaciones")) lista.push({ tipo: "aplicacion", item, fecha: item.fecha, Icono: Sprout, titulo: `${MOTIVOS_APLICACION.find((m) => m.id === item.motivo)?.nombre ?? "Aplicación"}: ${item.producto}`, detalle: [item.dosis ? `${num(item.dosis)} ${item.unidad}` : null, item.carenciaDias ? `carencia ${item.carenciaDias} días` : null].filter(Boolean).join(" · ") });
  for (const item of de("diagnosticos")) lista.push({ tipo: "diagnostico", item, fecha: item.fecha, Icono: ScanSearch, titulo: `Diagnóstico por foto: ${item.nombre}`, detalle: item.estado === "incierto" ? "Sin resultado claro" : `${Math.round(item.probabilidad * 100)} %` });
  return lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export default function Lote() {
  const { loteId } = useParams();
  const navegar = useNavigate();
  const avisos = useAvisos();
  const { abrir } = useRegistro();
  const datos = useFinca({ conClima: false });
  const lote = datos.lotes.find((item) => item.id === loteId);
  const [editar, setEditar] = useState(false);
  const [archivar, setArchivar] = useState(false);
  const [mostrar, setMostrar] = useState(15);
  const linea = useMemo(() => (lote ? eventos(lote, datos) : []), [lote, datos]);

  if (!lote) {
    return <Vacio titulo="No encontramos este lote" texto="Puede que se haya archivado." accion={<Link to="/finca/lotes" className="boton-primario">Ver los lotes</Link>} />;
  }

  const anio = anioCafetero();
  const prod = produccion(datos, { desde: anio.inicio, hasta: anio.fin, loteId: lote.id });
  const costo = movimientosCosto(datos, { desde: anio.inicio, hasta: anio.fin, loteId: lote.id }).reduce((s, m) => s + m.valor, 0);
  const productividad = lote.areaHa ? prod.cargas / lote.areaHa : null;
  const ultimoBroca = linea.find((e) => e.tipo === "muestreo" && e.item.tipo === "broca");
  const ultimoRoya = linea.find((e) => e.tipo === "muestreo" && e.item.tipo === "roya");
  const floracion = floracionVigente(datos.floraciones, lote.id);
  const problemasGeo = lote.geometria ? validarGeometria(lote) : [];

  const borrarEvento = (evento) => {
    const coleccion = COLECCION[evento.tipo];
    const items = evento.items ?? [evento.item];
    for (const item of items) eliminar(coleccion, item.id);
    avisos.conDeshacer(`Se borró: ${evento.titulo}`, () => {
      for (const item of items) crear(coleccion, item);
    });
  };

  const calendario = floracion
    ? [
        esSusceptible(lote) && [DIAS.royaPrimeraAplicacion, "Primera aplicación contra roya"],
        ...DIAS.muestreosRoya.map((d) => [d, `Muestreo de roya (día ${d})`]),
        [DIAS.brocaCritico, "Inicio del período crítico de broca"],
        [DIAS.cosecha, "Pico de cosecha estimado"],
      ]
        .filter(Boolean)
        .map(([dias, texto]) => ({ dias, texto, fecha: sumarDias(floracion.fecha, dias) }))
    : [];
  const diasFloracion = floracion ? diasEntre(floracion.fecha) : null;

  return (
    <>
      <Link to="/finca/lotes" className="boton-fantasma -ml-3 mb-3">
        <ArrowLeft className="h-5 w-5" aria-hidden="true" /> Lotes
      </Link>
      <EncabezadoPagina
        titulo={lote.nombre}
        acciones={
          <>
            <button type="button" className="boton-secundario" onClick={() => setEditar(true)}>
              <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
            </button>
            <button type="button" className="boton-primario" onClick={() => abrir(null)}>
              <Plus className="h-5 w-5" aria-hidden="true" /> Registrar
            </button>
          </>
        }
      >
        <div className="mt-3 flex flex-wrap items-center gap-2 text-grafito">
          <Estado tipo={lote.estado}>{lote.estadoTexto}</Estado>
          <span>
            {variedad(lote.variedad).nombre}
            {variedad(lote.variedad).resistente === false ? " (susceptible a roya)" : ""} · {lote.etapa.nombre}
            {lote.etapa.cosechas ? `, ${lote.etapa.cosechas}.ª cosecha` : ""}
            {lote.etapa.diasParaCosechar ? `, primera cosecha en ~${Math.round(lote.etapa.diasParaCosechar / 30)} meses` : ""} · {SISTEMAS.find((s) => s.id === lote.sistema)?.nombre}
          </span>
        </div>
      </EncabezadoPagina>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          {lote.avisos.length > 0 && (
            <section aria-label="Lo que pide este lote">
              <ul className="grid gap-3">
                {lote.avisos.map((aviso) => (
                  <AvisoItem key={aviso.id} aviso={aviso} mostrarLote={false} />
                ))}
              </ul>
            </section>
          )}

          <div className="placa grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
            <Cifra rotulo="Área" valor={num(lote.areaHa)} unidad="ha" detalle={lote.densidad ? `${ent(lote.densidad)} árb/ha · unos ${ent(lote.densidad * lote.areaHa)} árboles` : "Sin densidad registrada"} fuente={FUENTES.densidad.texto} />
            <Cifra
              rotulo={`Producción ${anio.nombre}`}
              valor={num(prod.cargas)}
              unidad="cargas"
              detalle={productividad !== null ? `${num(productividad)} cargas/ha · promedio del país: ${num(PRODUCTIVIDAD_PAIS_CARGAS_HA)}` : null}
              fuente={`Kilos de cereza × ${num(lote.factorCps ?? 0.2)} ÷ 125. ${FUENTES.productividad.texto}.`}
            />
            <Cifra rotulo="Costo del lote" valor={cop(costo)} detalle={prod.cargas ? `${cop(costo / prod.cargas)} por carga` : "Sin producción registrada"} fuente="Labores, recolección y aplicaciones del lote en el año cafetero. Los gastos generales de la finca no se reparten por lote." />
            <div className="grid gap-4">
              <Cifra rotulo="Broca" tamano="sm" valor={ultimoBroca ? `${num(evaluarBroca(ultimoBroca.item).infestacion)} %` : "—"} detalle={ultimoBroca ? `Muestreo ${hace(ultimoBroca.fecha)}` : "Sin muestreos"} tono={ultimoBroca?.nivel === "ok" ? "hoja" : ultimoBroca ? "cereza" : "tierra"} />
              <Cifra rotulo="Roya" tamano="sm" valor={ultimoRoya ? `${num(evaluarRoya(ultimoRoya.item).incidencia)} %` : "—"} detalle={ultimoRoya ? `Muestreo ${hace(ultimoRoya.fecha)}` : "Sin muestreos"} tono={ultimoRoya?.nivel === "ok" ? "hoja" : ultimoRoya ? "cereza" : "tierra"} />
            </div>
          </div>

          <Seccion titulo="Historia del lote" bajada="Todo lo registrado, del más reciente al más antiguo.">
            {linea.length ? (
              <>
                <ol className="relative grid gap-1 border-l-2 border-linea pl-5">
                  {linea.slice(0, mostrar).map((evento, indice) => (
                    <li key={`${evento.tipo}-${evento.fecha}-${indice}`} className="group relative flex items-start gap-3 rounded-md py-2.5 pr-1">
                      <span className="absolute top-3.5 -left-[1.95rem] grid h-7 w-7 place-items-center rounded-full border border-linea bg-lamina text-grafito">
                        <evento.Icono className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-snug">{evento.titulo}</p>
                        <p className="text-sm text-grafito">
                          {fCorta(evento.fecha)}
                          {evento.detalle ? ` · ${evento.detalle}` : ""}
                        </p>
                      </div>
                      <button type="button" onClick={() => borrarEvento(evento)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-grafito opacity-70 hover:bg-cal-honda hover:text-cereza focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Borrar: ${evento.titulo}`}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ol>
                {linea.length > mostrar && (
                  <button type="button" className="boton-fantasma mt-2" onClick={() => setMostrar((m) => m + 20)}>
                    Ver más ({linea.length - mostrar})
                  </button>
                )}
              </>
            ) : (
              <Vacio titulo="Sin registros todavía" texto="Usa «Registrar» para anotar labores, floraciones, muestreos y recolecciones." />
            )}
          </Seccion>
        </div>

        <div className="grid content-start gap-6">
          <Seccion titulo="Calendario" bajada={floracion ? `Desde la floración del ${fLarga(floracion.fecha)} (hace ${diasFloracion} días).` : "Registra la floración principal para calcularlo."}>
            {floracion ? (
              <ol className="grid gap-2">
                {calendario.map(({ dias, texto, fecha }) => {
                  const pasado = diasFloracion > dias;
                  return (
                    <li key={texto} className={`grid grid-cols-[5.5rem_1fr] gap-3 rounded-md px-3 py-2 ${!pasado && diasFloracion + 14 >= dias ? "bg-amarillo-tenue" : ""}`}>
                      <span className={`cifra font-bold ${pasado ? "text-grafito line-through decoration-1" : ""}`}>{fCorta(fecha)}</span>
                      <span className={pasado ? "text-grafito" : ""}>{texto}</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <button type="button" className="boton-secundario" onClick={() => abrir("floracion", { loteId: lote.id })}>
                <Floracion className="h-5 w-5" /> Registrar floración
              </button>
            )}
            <a href={FUENTES.fenologia.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-grafito underline">
              Fuente: Cenicafé
            </a>
          </Seccion>

          <Seccion titulo="Registrar en este lote">
            <div className="grid grid-cols-2 gap-2">
              {["recoleccion", "muestreo-broca", "muestreo-roya", "floracion", "labor", "aplicacion"].map((tipo) => {
                const { titulo, Icono } = TIPOS_REGISTRO[tipo];
                return (
                  <button key={tipo} type="button" onClick={() => abrir(tipo, { loteId: lote.id })} className="flex min-h-14 items-center gap-2 rounded-md border border-linea bg-cal px-3 text-left font-bold hover:border-tinta">
                    <Icono className="h-5 w-5 shrink-0 text-cereza" aria-hidden="true" />
                    <span className="leading-tight">{titulo}</span>
                  </button>
                );
              })}
            </div>
          </Seccion>

          <Seccion titulo="Ubicación">
            {lote.geometria && (
              <Suspense fallback={<div className="mb-4 aspect-square w-full rounded-md bg-basalto" />}>
                <LaderaViva
                  finca={datos.finca}
                  lotes={datos.lotes}
                  className="mb-4 aspect-square w-full rounded-md bg-basalto"
                  controlesVisibles={false}
                  etiquetasDe={[lote.id]}
                  alListo={(escena) => escena.enfocarLote(lote.id, 0)}
                  respaldo={null}
                />
              </Suspense>
            )}
            {lote.geometria ? (
              <div className="grid gap-2 text-[0.95rem]">
                <p className="flex items-center gap-2 font-bold">
                  {lote.geometria.tipo === "poligono" ? <Footprints className="h-5 w-5 text-tinta" aria-hidden="true" /> : <MapPin className="h-5 w-5 text-tinta" aria-hidden="true" />}
                  {lote.geometria.tipo === "poligono" ? `Contorno con ${lote.geometria.puntos.length} esquinas` : `Punto GPS: ${lote.geometria.punto[1].toFixed(6)}, ${lote.geometria.punto[0].toFixed(6)}`}
                </p>
                <p className="text-grafito">Sembrado antes de 2021: {lote.antesDe2021 === "si" ? "sí" : lote.antesDe2021 === "no" ? "no" : "sin dato"}</p>
                {problemasGeo.map((problema) => (
                  <p key={problema} className="font-bold text-amarillo-texto">
                    {problema}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-grafito">Sin ubicación. Edita el lote para marcar el punto o el contorno con el GPS.</p>
            )}
          </Seccion>

          <button type="button" className="boton-fantasma justify-start text-grafito" onClick={() => setArchivar(true)}>
            <Archive className="h-5 w-5" aria-hidden="true" /> Archivar este lote
          </button>
        </div>
      </div>

      <Hoja abierta={editar} alCerrar={() => setEditar(false)} titulo={`Editar ${lote.nombre}`}>
        {editar && <FormLote finca={datos.finca} lote={lote} alTerminar={() => setEditar(false)} />}
      </Hoja>
      <Hoja abierta={archivar} alCerrar={() => setArchivar(false)} titulo="¿Archivar el lote?" descripcion="Deja de aparecer en la finca, pero sus registros se conservan en el respaldo.">
        <div className="grid gap-3">
          <button
            type="button"
            className="boton-primario"
            onClick={() => {
              actualizar("lotes", lote.id, { archivado: true });
              avisos.conDeshacer(`${lote.nombre} archivado`, () => actualizar("lotes", lote.id, { archivado: false }));
              navegar("/finca/lotes");
            }}
          >
            Sí, archivar
          </button>
          <button type="button" className="boton-secundario" onClick={() => setArchivar(false)}>
            Cancelar
          </button>
        </div>
      </Hoja>
    </>
  );
}
