import Campo from "@/components/ui/Campo";
import { hoyISO } from "@/utilidades/formato";

export function SelectorLote({ lotes, valor, alCambiar, etiqueta = "Lote", permitirFinca = false, error }) {
  return (
    <Campo etiqueta={etiqueta} error={error}>
      {(props) => (
        <select {...props} className="campo" value={valor} onChange={(evento) => alCambiar(evento.target.value)} required={!permitirFinca}>
          {permitirFinca ? <option value="">Toda la finca</option> : <option value="">Elige el lote</option>}
          {lotes.map((lote) => (
            <option key={lote.id} value={lote.id}>
              {lote.nombre}
            </option>
          ))}
        </select>
      )}
    </Campo>
  );
}

export function CampoFecha({ valor, alCambiar, etiqueta = "Fecha" }) {
  return (
    <Campo etiqueta={etiqueta}>
      {(props) => <input {...props} type="date" className="campo" value={valor} max={hoyISO()} onChange={(evento) => alCambiar(evento.target.value)} required />}
    </Campo>
  );
}

export function Pie({ texto = "Guardar", deshabilitado = false, secundario }) {
  return (
    <div className="sticky -bottom-5 -mx-5 mt-2 grid gap-2 border-t border-linea bg-lamina/95 px-5 pt-3 pb-1 backdrop-blur sm:-mx-6 sm:px-6">
      <button type="submit" className="boton-primario w-full text-lg" disabled={deshabilitado}>
        {texto}
      </button>
      {secundario}
    </div>
  );
}

export function Resultado({ nivel, titulo, cifra, texto, fuente }) {
  const estilos = {
    ok: "border-tinta/30 bg-cal-honda text-tinta",
    vigilar: "border-amarillo/40 bg-amarillo-tenue text-amarillo-texto",
    actuar: "border-cereza/30 bg-cereza-tenue text-cereza-honda",
    sinDatos: "border-ceniza-honda/20 bg-niebla text-ceniza-honda",
  };
  return (
    <div className={`rounded-lg border p-4 ${estilos[nivel] ?? estilos.sinDatos}`} role="status" aria-live="polite">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-bold">{titulo}</p>
        {cifra && <p className="cifra text-3xl font-bold">{cifra}</p>}
      </div>
      {texto && <p className="mt-1.5 text-[0.95rem] text-tinta">{texto}</p>}
      {fuente && (
        <a href={fuente.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-grafito underline underline-offset-2">
          Fuente: {fuente.texto}
        </a>
      )}
    </div>
  );
}
