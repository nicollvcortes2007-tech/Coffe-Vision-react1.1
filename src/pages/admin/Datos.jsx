import { useEffect, useRef, useState } from "react";
import { Download, Upload, RotateCcw, HardDrive, ShieldCheck } from "lucide-react";
import { EncabezadoPagina, Seccion } from "@/components/ui/Pagina";
import Hoja from "@/components/ui/Hoja";
import { useAvisos } from "@/components/ui/Avisos";
import { exportarRespaldo, restaurarRespaldo, inicializarDatos, useDatos } from "@/datos/almacen";
import { restablecerCuentas } from "@/utilidades/autenticacion";
import { descargar } from "@/utilidades/descargas";
import { hoyISO, num } from "@/utilidades/formato";

export default function Datos() {
  const avisos = useAvisos();
  const datos = useDatos();
  const archivo = useRef(null);
  const [espacio, setEspacio] = useState(null);
  const [persistente, setPersistente] = useState(null);
  const [reiniciar, setReiniciar] = useState(false);

  useEffect(() => {
    navigator.storage?.estimate?.().then(setEspacio).catch(() => {});
    navigator.storage?.persisted?.().then(setPersistente).catch(() => {});
  }, []);

  const total = Object.values(datos).reduce((s, lista) => s + lista.length, 0);
  const kb = new Blob([exportarRespaldo()]).size / 1024;

  return (
    <>
      <EncabezadoPagina rotulo="Administración" titulo="Datos y respaldo" bajada="Todo vive en este navegador. Un respaldo en JSON permite pasar los datos a otro equipo." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Seccion titulo="Respaldo">
          <p className="mb-4 text-[0.95rem] text-grafito">
            {num(total)} registros en {Object.keys(datos).length} colecciones · respaldo de {num(kb)} KB.
          </p>
          <div className="grid gap-2">
            <button type="button" className="boton-primario justify-start" onClick={() => descargar(`coffee-vision-respaldo-completo-${hoyISO()}.json`, exportarRespaldo())}>
              <Download className="h-5 w-5" aria-hidden="true" /> Descargar respaldo completo
            </button>
            <button type="button" className="boton-secundario justify-start" onClick={() => archivo.current?.click()}>
              <Upload className="h-5 w-5" aria-hidden="true" /> Restaurar un respaldo
            </button>
            <input
              ref={archivo}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                const r = restaurarRespaldo(await f.text());
                if (r.ok) avisos.registrado("Respaldo restaurado");
                else avisos.error(r.error);
              }}
            />
          </div>
        </Seccion>
        <Seccion titulo="Almacenamiento">
          <ul className="grid gap-3 text-[0.95rem]">
            <li className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-grafito" aria-hidden="true" />
              {espacio ? `Usados ${num(espacio.usage / 1024 / 1024)} MB de ${num(espacio.quota / 1024 / 1024)} MB disponibles para este sitio.` : "El navegador no informa el espacio."}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-grafito" aria-hidden="true" />
              {persistente ? "El navegador no borrará estos datos por falta de espacio." : "El navegador podría borrar los datos si se queda sin espacio."}
            </li>
          </ul>
          {!persistente && navigator.storage?.persist && (
            <button
              type="button"
              className="boton-secundario mt-4"
              onClick={async () => {
                const ok = await navigator.storage.persist();
                setPersistente(ok);
                avisos.info(ok ? "Los datos quedan protegidos en este navegador." : "El navegador no lo permitió. Descarga respaldos con frecuencia.");
              }}
            >
              Pedir que no se borren
            </button>
          )}
        </Seccion>
        <Seccion titulo="Datos de ejemplo" className="lg:col-span-2">
          <p className="text-[0.95rem] text-grafito">Vuelve a cargar las cuatro fincas de ejemplo y las cuentas de prueba. Borra todo lo demás de este navegador.</p>
          <button type="button" className="boton-secundario mt-3 text-cereza" onClick={() => setReiniciar(true)}>
            <RotateCcw className="h-5 w-5" aria-hidden="true" /> Restablecer la demostración
          </button>
        </Seccion>
      </div>
      <Hoja abierta={reiniciar} alCerrar={() => setReiniciar(false)} titulo="¿Restablecer la demostración?" descripcion="Se borran todas las fincas, registros y cuentas de este navegador y se cargan los de ejemplo. Descarga antes un respaldo si lo necesitas.">
        <div className="grid gap-3">
          <button
            type="button"
            className="boton-primario"
            onClick={() => {
              inicializarDatos({ forzar: true });
              restablecerCuentas();
            }}
          >
            Sí, restablecer
          </button>
          <button type="button" className="boton-secundario" onClick={() => setReiniciar(false)}>
            Cancelar
          </button>
        </div>
      </Hoja>
    </>
  );
}
