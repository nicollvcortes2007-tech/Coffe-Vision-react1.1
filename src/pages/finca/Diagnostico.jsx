import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, ImagePlus, Trash2, ShieldCheck, Download, CircleHelp, Leaf, Sun, Maximize, Hand, Save } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Hoja from "@/components/ui/Hoja";
import Campo from "@/components/ui/Campo";
import { useAvisos } from "@/components/ui/Avisos";
import { prepararFoto } from "@/ia/preparar";
import { interpretar, combinar } from "@/ia/interpretar";
import { clasificar, prepararMotor, modeloEnCache } from "@/ia/motor";
import { CLASES, ENTRENAMIENTO } from "@/ia/modelo";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { hoyISO, pct, ent } from "@/utilidades/formato";

const MAX_FOTOS = 6;

const ESTADO_TEXTO = {
  confiado: { texto: "Muy probable", clase: "bg-cereza-tenue text-cereza-oscura ring-cereza/30" },
  posible: { texto: "Posible", clase: "bg-pinton-tenue text-pinton-texto ring-pinton/40" },
  incierto: { texto: "No estoy seguro", clase: "bg-niebla text-niebla-oscura ring-niebla-oscura/20" },
};

function Resultado({ resultado, titulo }) {
  const estado = ESTADO_TEXTO[resultado.estado];
  const ganadora = resultado.ganadora;
  const sana = ganadora.id === "healthy" && resultado.aceptada;
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-sm font-bold ring-1 ring-inset ${sana ? "bg-hoja-tenue text-hoja-oscura ring-hoja/25" : estado.clase}`}>
          {sana ? "Se ve sana" : estado.texto}
        </span>
        {titulo && <span className="text-sm text-tierra-media">{titulo}</span>}
      </div>
      {resultado.aceptada ? (
        <p className="titular text-2xl">
          {ganadora.nombre}
          {ganadora.cientifico && <span className="block text-base font-normal italic text-tierra-media">{ganadora.cientifico}</span>}
        </p>
      ) : (
        <p className="font-bold">{resultado.motivo ?? "No es posible decirlo con esta foto."}</p>
      )}
      <ul className="grid gap-2" aria-label="Las tres opciones más probables">
        {resultado.top.map((clase) => (
          <li key={clase.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
            <span className="text-[0.95rem]">{clase.nombre}</span>
            <span className="cifra text-sm font-bold text-tierra-media">{pct(clase.probabilidad)}</span>
            <span className="col-span-2 h-2 overflow-hidden rounded-full bg-crema">
              <span className="block h-full rounded-full bg-tierra-media" style={{ width: `${Math.max(2, clase.probabilidad * 100)}%` }} />
            </span>
          </li>
        ))}
      </ul>
      {resultado.aceptada && ganadora.guia && (
        <Link to={`/finca/guias/${ganadora.guia}`} className="font-bold text-cereza underline decoration-2 underline-offset-2">
          Ver la guía de manejo de {ganadora.nombre.toLowerCase()}
        </Link>
      )}
    </div>
  );
}

export default function Diagnostico() {
  const { finca, lotes } = useMiFinca();
  const avisos = useAvisos();
  const entrada = useRef(null);
  const [fotos, setFotos] = useState([]);
  const [motor, setMotor] = useState({ estado: "sin-cargar", error: null });
  const [enCache, setEnCache] = useState(false);
  const [guardar, setGuardar] = useState(false);
  const [loteId, setLoteId] = useState("");

  useEffect(() => {
    modeloEnCache().then(setEnCache);
  }, []);

  const analizar = async (lista) => {
    const nuevas = lista.slice(0, MAX_FOTOS - fotos.length).map((archivo) => ({ id: crypto.randomUUID(), archivo, estado: "preparando" }));
    if (!nuevas.length) return;
    setFotos((actuales) => [...actuales, ...nuevas]);
    try {
      if (motor.estado !== "listo") setMotor({ estado: "cargando", error: null });
      await prepararMotor();
      setMotor({ estado: "listo", error: null });
    } catch (error) {
      console.error(error);
      setMotor({ estado: "error", error: "No se pudo cargar el modelo. Revisa la conexión la primera vez; después funciona sin señal." });
      setFotos((actuales) => actuales.map((foto) => (nuevas.some((n) => n.id === foto.id) ? { ...foto, estado: "error" } : foto)));
      return;
    }
    for (const foto of nuevas) {
      try {
        const { tensor, calidad, miniatura } = await prepararFoto(foto.archivo);
        const probabilidades = await clasificar(tensor);
        const resultado = interpretar(probabilidades, calidad);
        setFotos((actuales) => actuales.map((item) => (item.id === foto.id ? { ...item, estado: "listo", miniatura, calidad, probabilidades, resultado } : item)));
      } catch (error) {
        console.error(error);
        setFotos((actuales) => actuales.map((item) => (item.id === foto.id ? { ...item, estado: "error" } : item)));
      }
    }
    modeloEnCache().then(setEnCache);
  };

  const listas = fotos.filter((foto) => foto.estado === "listo");
  const combinado = listas.length > 1 ? combinar(listas) : null;
  const final = combinado ?? listas[0]?.resultado ?? null;

  const guardarEnLote = (evento) => {
    evento.preventDefault();
    if (!final) return;
    const lote = lotes.find((item) => item.id === loteId);
    crear(
      "diagnosticos",
      {
        fincaId: finca?.id,
        loteId: loteId || null,
        fecha: hoyISO(),
        clase: final.aceptada ? final.ganadora.id : null,
        nombre: final.aceptada ? final.ganadora.nombre : "Sin resultado claro",
        estado: final.estado,
        probabilidad: final.ganadora.probabilidad,
        hojas: listas.length,
        miniatura: listas[0]?.miniatura ?? null,
      },
      "dia",
    );
    setGuardar(false);
    avisos.registrado("Diagnóstico guardado", lote ? `En ${lote.nombre}` : "En la finca");
  };

  return (
    <>
      <EncabezadoPagina
        rotulo="Visión"
        titulo="Diagnóstico por foto"
        bajada="Una orientación sobre manchas y daños en la hoja. No reemplaza el muestreo ni al extensionista."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Seccion
          titulo={fotos.length ? "Tus hojas" : "Toma la foto de una hoja"}
          bajada={`Hasta ${MAX_FOTOS} hojas del mismo lote. Mirar varias hojas mejora el resultado.`}
          acciones={
            fotos.length > 0 && (
              <button type="button" className="boton-fantasma" onClick={() => setFotos([])}>
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Empezar de nuevo
              </button>
            )
          }
        >
          <input
            ref={entrada}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            className="sr-only"
            id="foto-hoja"
            onChange={(evento) => {
              analizar(Array.from(evento.target.files ?? []));
              evento.target.value = "";
            }}
          />

          {fotos.length === 0 ? (
            <div className="grid gap-4">
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  [Leaf, "Una sola hoja, que llene el cuadro"],
                  [Sun, "De día, sin sol directo encima"],
                  [Maximize, "Si hay polvillo naranja, el envés de la hoja"],
                  [Hand, "Quieto un segundo para que no salga movida"],
                ].map(([Icono, texto]) => (
                  <li key={texto} className="flex items-center gap-3 rounded-xl bg-pergamino px-3 py-2.5">
                    <Icono className="h-5 w-5 shrink-0 text-hoja" aria-hidden="true" />
                    <span className="text-[0.95rem]">{texto}</span>
                  </li>
                ))}
              </ul>
              <label htmlFor="foto-hoja" className="boton-primario w-full cursor-pointer text-lg sm:w-auto">
                <Camera className="h-6 w-6" aria-hidden="true" /> Tomar o elegir foto
              </label>
            </div>
          ) : (
            <ul className="grid gap-4">
              {fotos.map((foto, indice) => (
                <li key={foto.id} className="grid gap-4 rounded-2xl border border-linea bg-pergamino/60 p-3 sm:grid-cols-[7.5rem_1fr]">
                  <div className="aspect-square w-full max-w-[7.5rem] overflow-hidden rounded-xl bg-crema">
                    {foto.miniatura ? (
                      <img src={foto.miniatura} alt={`Hoja ${indice + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-tierra-media">
                        <Leaf className="h-8 w-8 animate-pulse" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0" aria-live="polite">
                    {foto.estado === "preparando" && (
                      <p className="font-bold text-tierra-media">{motor.estado === "cargando" ? "Preparando el modelo…" : "Analizando la hoja…"}</p>
                    )}
                    {foto.estado === "error" && <p className="font-bold text-cereza">No se pudo analizar esta foto.</p>}
                    {foto.estado === "listo" && <Resultado resultado={foto.resultado} titulo={`Hoja ${indice + 1}`} />}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {fotos.length > 0 && fotos.length < MAX_FOTOS && (
            <label htmlFor="foto-hoja" className="boton-secundario mt-4 w-full cursor-pointer sm:w-auto">
              <ImagePlus className="h-5 w-5" aria-hidden="true" /> Agregar otra hoja
            </label>
          )}

          {motor.estado === "cargando" && (
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-niebla/70 px-3 py-2.5 text-[0.95rem]" role="status">
              <Download className="h-5 w-5 shrink-0 text-niebla-oscura" aria-hidden="true" />
              La primera vez se descarga el modelo (unos 10 MB). Después funciona sin señal.
            </p>
          )}
          {motor.error && (
            <p className="mt-4 rounded-xl bg-cereza-tenue px-3 py-2.5 font-bold text-cereza-oscura" role="alert">
              {motor.error}
            </p>
          )}
        </Seccion>

        <div className="grid content-start gap-5">
          {final ? (
            <Seccion titulo={combinado ? `Resultado de ${listas.length} hojas` : "Resultado"}>
              <Resultado resultado={final} />
              <div className="mt-5 grid gap-2 border-t border-linea pt-4">
                <button type="button" className="boton-hoja" onClick={() => setGuardar(true)}>
                  <Save className="h-5 w-5" aria-hidden="true" /> Guardar en el lote
                </button>
                <Link to="/finca/sanidad" className="boton-secundario">
                  Confirmar con un muestreo
                </Link>
              </div>
            </Seccion>
          ) : (
            <Vacio Icono={CircleHelp} titulo="Aún no hay resultado" texto="Toma la foto de una hoja y aquí verás lo más probable, con su porcentaje." />
          )}

          <Seccion titulo="Qué reconoce y qué no">
            <p className="text-[0.95rem] text-tierra-media">Reconoce en la hoja:</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {CLASES.filter((clase) => !clase.rechazo && !clase.desactivada).map((clase) => (
                <li key={clase.id} className="rounded-full bg-hoja-tenue px-2.5 py-1 text-sm font-bold text-hoja-oscura">
                  {clase.nombre}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.95rem] text-tierra-media">
              <strong className="text-tierra">No reconoce</strong> la broca (está en el fruto: usa el muestreo), el ojo de gallo, la llaga macana ni las deficiencias de nutrientes.
            </p>
            <details className="mt-4 rounded-xl bg-pergamino px-3 py-2.5 text-[0.95rem]">
              <summary className="cursor-pointer font-bold">Sobre el modelo y sus límites</summary>
              <div className="mt-2 grid gap-2 text-tierra-media">
                <p>
                  EfficientNet-B1 ajustado por ConnorLee08 (licencia Apache-2.0) con {ent(ENTRENAMIENTO.imagenes)} fotos: {ENTRENAMIENTO.fuentes}.
                </p>
                <p>
                  Acierta el {pct(ENTRENAMIENTO.exactitudInterna)} en fotos parecidas a las de entrenamiento, pero en fotos de roya tomadas en el Huila solo aceptó y acertó{" "}
                  {ENTRENAMIENTO.aceptadasRoyaHuila.aceptadas} de {ENTRENAMIENTO.aceptadasRoyaHuila.total}. Por eso se abstiene cuando no está seguro y no debe usarse como diagnóstico.
                </p>
                <a className="font-bold text-cereza underline" href="https://huggingface.co/ConnorLee08/coffee-leaf-efficientnet-b2/tree/main/models/b1" target="_blank" rel="noreferrer">
                  Ficha del modelo
                </a>
              </div>
            </details>
            <p className="mt-4 flex items-start gap-2 text-sm text-tierra-media">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-hoja" aria-hidden="true" />
              La foto se analiza en tu celular: no se envía a ningún servidor.
              {enCache && " El modelo ya está guardado para usarlo sin señal."}
            </p>
          </Seccion>
        </div>
      </div>

      <Hoja abierta={guardar} alCerrar={() => setGuardar(false)} titulo="Guardar el diagnóstico" descripcion="Queda en la historia del lote, con la miniatura de la primera hoja.">
        <form onSubmit={guardarEnLote} className="grid gap-4">
          <Campo etiqueta="Lote">
            {(props) => (
              <select {...props} className="campo" value={loteId} onChange={(evento) => setLoteId(evento.target.value)}>
                <option value="">Toda la finca</option>
                {lotes.map((lote) => (
                  <option key={lote.id} value={lote.id}>
                    {lote.nombre}
                  </option>
                ))}
              </select>
            )}
          </Campo>
          <button type="submit" className="boton-primario">
            Guardar
          </button>
        </form>
      </Hoja>
    </>
  );
}
