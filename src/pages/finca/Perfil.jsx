import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Upload, Crosshair, KeyRound, Trash2, ShieldCheck, Smartphone, CircleCheck } from "lucide-react";
import { EncabezadoPagina, Seccion } from "@/components/ui/Pagina";
import Campo from "@/components/ui/Campo";
import Hoja from "@/components/ui/Hoja";
import { useAvisos } from "@/components/ui/Avisos";
import { useMiFinca } from "@/datos/miFinca";
import { actualizar, exportarRespaldo, restaurarRespaldo, eliminar, leerDatos, reemplazarColeccion } from "@/datos/almacen";
import { obtenerAltitud } from "@/datos/abiertos";
import { actualizarCuenta, cambiarClave, cerrarSesion, eliminarCuenta } from "@/utilidades/autenticacion";
import { descargar } from "@/utilidades/descargas";
import { geojsonFinca } from "@/utilidades/geo";
import { ent, fLarga, hoyISO } from "@/utilidades/formato";

function useInstalacion() {
  const [evento, setEvento] = useState(null);
  const [instalada, setInstalada] = useState(() => window.matchMedia?.("(display-mode: standalone)").matches ?? false);
  useEffect(() => {
    const guardar = (e) => {
      e.preventDefault();
      setEvento(e);
    };
    const listo = () => setInstalada(true);
    window.addEventListener("beforeinstallprompt", guardar);
    window.addEventListener("appinstalled", listo);
    return () => {
      window.removeEventListener("beforeinstallprompt", guardar);
      window.removeEventListener("appinstalled", listo);
    };
  }, []);
  return { puede: Boolean(evento), instalada, instalar: () => evento?.prompt() };
}

export default function Perfil() {
  const { sesion, finca, lotes } = useMiFinca();
  const avisos = useAvisos();
  const navegar = useNavigate();
  const archivo = useRef(null);
  const instalacion = useInstalacion();
  const [cuenta, setCuenta] = useState({ nombre: sesion?.nombre ?? "", telefono: sesion?.telefono ?? "" });
  const [datosFinca, setDatosFinca] = useState({ nombre: finca?.nombre ?? "", municipio: finca?.municipio ?? "", vereda: finca?.vereda ?? "", departamento: finca?.departamento ?? "", puntoCompra: finca?.puntoCompra ?? "" });
  const [clave, setClave] = useState({ actual: "", nueva: "", abierta: false, error: "" });
  const [borrar, setBorrar] = useState({ abierta: false, texto: "" });
  const [ubicando, setUbicando] = useState(false);

  const guardarCuenta = (evento) => {
    evento.preventDefault();
    actualizarCuenta(sesion.id, { nombre: cuenta.nombre.trim(), telefono: cuenta.telefono.trim() });
    if (finca) actualizar("fincas", finca.id, { propietario: cuenta.nombre.trim() });
    avisos.registrado("Datos de la cuenta guardados");
  };

  const guardarFinca = (evento) => {
    evento.preventDefault();
    actualizar("fincas", finca.id, Object.fromEntries(Object.entries(datosFinca).map(([k, v]) => [k, v.trim()])));
    avisos.registrado("Datos de la finca guardados");
  };

  const ubicar = () => {
    if (!("geolocation" in navigator)) return avisos.error("Este navegador no da acceso al GPS.");
    setUbicando(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const altitud = await obtenerAltitud(lat, lon).catch(() => (Number.isFinite(pos.coords.altitude) ? Math.round(pos.coords.altitude) : finca.altitud ?? null));
        actualizar("fincas", finca.id, { lat, lon, altitud });
        setUbicando(false);
        avisos.registrado("Finca ubicada", altitud ? `${ent(altitud)} m de altitud` : undefined);
      },
      () => {
        setUbicando(false);
        avisos.error("No se pudo leer el GPS. Sal a campo abierto e inténtalo de nuevo.");
      },
      { enableHighAccuracy: true, timeout: 20000 },
    );
  };

  const respaldar = () => {
    descargar(`coffee-vision-respaldo-${hoyISO()}.json`, exportarRespaldo());
    avisos.info("Respaldo descargado. Guárdalo en otro lugar (correo, nube o memoria).");
  };

  const restaurar = async (evento) => {
    const archivoElegido = evento.target.files?.[0];
    evento.target.value = "";
    if (!archivoElegido) return;
    const resultado = restaurarRespaldo(await archivoElegido.text());
    if (resultado.ok) avisos.registrado("Respaldo restaurado");
    else avisos.error(resultado.error);
  };

  const cambiar = async (evento) => {
    evento.preventDefault();
    const r = await cambiarClave(sesion.id, { actual: clave.actual, nueva: clave.nueva });
    if (!r.ok) return setClave((c) => ({ ...c, error: r.error }));
    setClave({ actual: "", nueva: "", abierta: false, error: "" });
    avisos.registrado("Contraseña cambiada");
  };

  /* Borra la cuenta, la finca y todos sus registros de este equipo (derecho de supresión). */
  const borrarTodo = () => {
    const datos = leerDatos();
    const idsLotes = new Set(datos.lotes.filter((l) => l.fincaId === finca.id).map((l) => l.id));
    for (const coleccion of ["labores", "floraciones", "muestreos", "recolecciones", "aplicaciones"]) {
      reemplazarColeccion(coleccion, datos[coleccion].filter((item) => !idsLotes.has(item.loteId)));
    }
    for (const coleccion of ["ventas", "gastos", "trabajadores", "diagnosticos"]) {
      reemplazarColeccion(coleccion, datos[coleccion].filter((item) => item.fincaId !== finca.id && !idsLotes.has(item.loteId)));
    }
    reemplazarColeccion("lotes", datos.lotes.filter((l) => l.fincaId !== finca.id));
    eliminar("fincas", finca.id);
    eliminarCuenta(sesion.id);
    cerrarSesion();
    navegar("/", { replace: true });
  };

  return (
    <>
      <EncabezadoPagina rotulo={sesion?.correo} titulo="Mi cuenta y datos" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid content-start gap-6">
          <Seccion titulo="La finca">
            <form onSubmit={guardarFinca} className="grid gap-4">
              <Campo etiqueta="Nombre de la finca">{(p) => <input {...p} required className="campo" value={datosFinca.nombre} onChange={(e) => setDatosFinca((d) => ({ ...d, nombre: e.target.value }))} />}</Campo>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo etiqueta="Municipio">{(p) => <input {...p} className="campo" value={datosFinca.municipio} onChange={(e) => setDatosFinca((d) => ({ ...d, municipio: e.target.value }))} />}</Campo>
                <Campo etiqueta="Vereda">{(p) => <input {...p} className="campo" value={datosFinca.vereda} onChange={(e) => setDatosFinca((d) => ({ ...d, vereda: e.target.value }))} />}</Campo>
              </div>
              <Campo etiqueta="Departamento">{(p) => <input {...p} className="campo" value={datosFinca.departamento} onChange={(e) => setDatosFinca((d) => ({ ...d, departamento: e.target.value }))} />}</Campo>
              <Campo etiqueta="Dónde vendes el café" opcional>{(p) => <input {...p} className="campo" value={datosFinca.puntoCompra} onChange={(e) => setDatosFinca((d) => ({ ...d, puntoCompra: e.target.value }))} />}</Campo>
              <div className="rounded-xl bg-pergamino px-4 py-3 text-[0.95rem]">
                {Number.isFinite(finca?.lat) ? (
                  <p className="flex items-center gap-2">
                    <CircleCheck className="h-5 w-5 text-hoja" aria-hidden="true" /> Ubicada en {finca.lat.toFixed(4)}, {finca.lon.toFixed(4)}
                    {finca.altitud ? ` · ${ent(finca.altitud)} msnm` : ""}
                  </p>
                ) : (
                  <p>Sin ubicación: el clima no se puede mostrar.</p>
                )}
                <button type="button" className="boton-secundario mt-2" onClick={ubicar} disabled={ubicando}>
                  <Crosshair className="h-5 w-5" aria-hidden="true" /> {ubicando ? "Leyendo el GPS…" : "Ubicar con el GPS"}
                </button>
              </div>
              <button type="submit" className="boton-primario">
                Guardar la finca
              </button>
            </form>
          </Seccion>

          <Seccion titulo="La cuenta">
            <form onSubmit={guardarCuenta} className="grid gap-4">
              <Campo etiqueta="Nombre">{(p) => <input {...p} required className="campo" value={cuenta.nombre} onChange={(e) => setCuenta((c) => ({ ...c, nombre: e.target.value }))} />}</Campo>
              <Campo etiqueta="Celular" opcional>{(p) => <input {...p} type="tel" className="campo" value={cuenta.telefono} onChange={(e) => setCuenta((c) => ({ ...c, telefono: e.target.value }))} />}</Campo>
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="boton-primario">
                  Guardar
                </button>
                <button type="button" className="boton-secundario" onClick={() => setClave((c) => ({ ...c, abierta: true }))}>
                  <KeyRound className="h-5 w-5" aria-hidden="true" /> Cambiar contraseña
                </button>
              </div>
              {sesion?.vence && <p className="text-sm text-tierra-media">La sesión vence el {fLarga(sesion.vence.slice(0, 10))}.</p>}
            </form>
          </Seccion>
        </div>

        <div className="grid content-start gap-6">
          <Seccion titulo="Tus datos" bajada="Viven en este equipo. Si borras el navegador o cambias de celular, se pierden: descarga un respaldo.">
            <div className="grid gap-2">
              <button type="button" className="boton-hoja justify-start" onClick={respaldar}>
                <Download className="h-5 w-5" aria-hidden="true" /> Descargar respaldo (JSON)
              </button>
              <button type="button" className="boton-secundario justify-start" onClick={() => archivo.current?.click()}>
                <Upload className="h-5 w-5" aria-hidden="true" /> Restaurar un respaldo
              </button>
              <input ref={archivo} type="file" accept="application/json,.json" className="sr-only" onChange={restaurar} tabIndex={-1} aria-hidden="true" />
              <button
                type="button"
                className="boton-secundario justify-start"
                disabled={!lotes.some((l) => l.geometria)}
                onClick={() => descargar(`${finca.nombre.toLowerCase().replace(/\s+/g, "-")}-lotes.geojson`, JSON.stringify(geojsonFinca(finca, lotes), null, 2), "application/geo+json")}
              >
                <Download className="h-5 w-5" aria-hidden="true" /> Ubicación de los lotes (GeoJSON)
              </button>
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-tierra-media">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-hoja" aria-hidden="true" /> Nada de esto se envía a un servidor.{" "}
              <Link to="/privacidad" className="font-bold underline">
                Privacidad y datos
              </Link>
            </p>
          </Seccion>

          <Seccion titulo="Usar sin señal">
            {instalacion.instalada ? (
              <p className="flex items-center gap-2 font-bold text-hoja">
                <CircleCheck className="h-5 w-5" aria-hidden="true" /> La app está instalada en este equipo.
              </p>
            ) : instalacion.puede ? (
              <button type="button" className="boton-primario" onClick={instalacion.instalar}>
                <Smartphone className="h-5 w-5" aria-hidden="true" /> Instalar en el celular
              </button>
            ) : (
              <p className="text-[0.95rem] text-tierra-media">Después de la primera visita la app abre sin señal. Para tenerla como aplicación, usa «Agregar a la pantalla de inicio» en el menú del navegador.</p>
            )}
          </Seccion>

          <Seccion titulo="Borrar mi cuenta">
            <p className="text-[0.95rem] text-tierra-media">Borra la cuenta, la finca, los lotes y todos los registros de este equipo. No se puede deshacer: descarga antes un respaldo.</p>
            <button type="button" className="boton-secundario mt-3 border-cereza text-cereza" onClick={() => setBorrar({ abierta: true, texto: "" })}>
              <Trash2 className="h-5 w-5" aria-hidden="true" /> Borrar todo
            </button>
          </Seccion>
        </div>
      </div>

      <Hoja abierta={clave.abierta} alCerrar={() => setClave({ actual: "", nueva: "", abierta: false, error: "" })} titulo="Cambiar contraseña">
        <form onSubmit={cambiar} className="grid gap-4">
          <Campo etiqueta="Contraseña actual">{(p) => <input {...p} type="password" autoComplete="current-password" required className="campo" value={clave.actual} onChange={(e) => setClave((c) => ({ ...c, actual: e.target.value }))} />}</Campo>
          <Campo etiqueta="Contraseña nueva" ayuda="8 o más, con mayúscula, minúscula y número." error={clave.error || null}>
            {(p) => <input {...p} type="password" autoComplete="new-password" required className="campo" value={clave.nueva} onChange={(e) => setClave((c) => ({ ...c, nueva: e.target.value, error: "" }))} />}
          </Campo>
          <button type="submit" className="boton-primario">
            Cambiar
          </button>
        </form>
      </Hoja>

      <Hoja abierta={borrar.abierta} alCerrar={() => setBorrar({ abierta: false, texto: "" })} titulo="¿Borrar todo?" descripcion={`Escribe el nombre de la finca («${finca?.nombre}») para confirmar.`}>
        <div className="grid gap-4">
          <Campo etiqueta="Nombre de la finca">{(p) => <input {...p} className="campo" value={borrar.texto} onChange={(e) => setBorrar((b) => ({ ...b, texto: e.target.value }))} autoComplete="off" />}</Campo>
          <button type="button" className="boton-primario" disabled={borrar.texto.trim().toLowerCase() !== (finca?.nombre ?? "").toLowerCase()} onClick={borrarTodo}>
            Borrar definitivamente
          </button>
        </div>
      </Hoja>
    </>
  );
}
