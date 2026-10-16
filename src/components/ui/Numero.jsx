import { Minus, Plus } from "lucide-react";

/* Convierte lo que escribe la persona («1.250,5», «1250.5») en número. */
export function aNumero(texto) {
  if (typeof texto === "number") return texto;
  const limpio = String(texto ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/\$/g, "");
  if (!limpio) return NaN;
  // «1.250,5» → 1250.5 ; «1250.5» → 1250.5 ; «1.250» → 1250
  if (limpio.includes(",")) return Number(limpio.replace(/\./g, "").replace(",", "."));
  if (/^\d{1,3}(\.\d{3})+$/.test(limpio)) return Number(limpio.replace(/\./g, ""));
  return Number(limpio);
}

/* Campo numérico con teclado de números en el celular. */
export function CampoNumero({ valor, alCambiar, sufijo, prefijo, className = "", ...resto }) {
  return (
    <span className={`relative flex items-center ${className}`}>
      {prefijo && <span className="pointer-events-none absolute left-3.5 font-bold text-grafito">{prefijo}</span>}
      <input
        {...resto}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
        className={`campo cifra ${prefijo ? "pl-8" : ""} ${sufijo ? "pr-16" : ""}`}
      />
      {sufijo && <span className="pointer-events-none absolute right-3.5 text-sm font-bold text-grafito">{sufijo}</span>}
    </span>
  );
}

/* Contador de campo: botones grandes para usarlo con el pulgar y sin mirar mucho. */
export function Contador({ etiqueta, valor, alCambiar, minimo = 0, maximo = 9999, paso = 1, tono = "tierra" }) {
  const tonos = { tierra: "bg-tinta text-niebla", cereza: "bg-cereza text-white", hoja: "bg-tinta text-white" };
  const cambiar = (delta) => alCambiar(Math.min(maximo, Math.max(minimo, (Number(valor) || 0) + delta)));
  return (
    <div className="grid gap-1.5">
      <span className="text-[0.95rem] font-bold">{etiqueta}</span>
      <div className="grid grid-cols-[3.5rem_1fr_3.5rem] items-stretch gap-2">
        <button type="button" onClick={() => cambiar(-paso)} className="grid h-14 place-items-center rounded-md border border-borde bg-lamina text-tinta active:bg-cal-honda" aria-label={`Restar a ${etiqueta}`}>
          <Minus className="h-6 w-6" aria-hidden="true" />
        </button>
        <input
          type="text"
          inputMode="numeric"
          aria-label={etiqueta}
          value={valor}
          onChange={(evento) => {
            const n = parseInt(evento.target.value.replace(/\D/g, "") || "0", 10);
            alCambiar(Math.min(maximo, Math.max(minimo, n)));
          }}
          className="campo cifra h-14 text-center text-2xl font-bold"
        />
        <button type="button" onClick={() => cambiar(paso)} className={`grid h-14 place-items-center rounded-md ${tonos[tono]} active:opacity-80`} aria-label={`Sumar a ${etiqueta}`}>
          <Plus className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* Grupo de opciones como fichas grandes (en lugar de un select). */
export function Fichas({ opciones, valor, alCambiar, etiqueta, multiple = false }) {
  const activo = (id) => (multiple ? valor.includes(id) : valor === id);
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 text-[0.95rem] font-bold">{etiqueta}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            aria-pressed={activo(opcion.id)}
            onClick={() => {
              if (!multiple) return alCambiar(opcion.id);
              alCambiar(activo(opcion.id) ? valor.filter((v) => v !== opcion.id) : [...valor, opcion.id]);
            }}
            className={`min-h-12 rounded-md border px-3.5 font-bold transition-colors ${
              activo(opcion.id) ? "border-tinta bg-tinta text-niebla" : "border-borde bg-lamina text-tinta hover:bg-cal-honda"
            }`}
          >
            {opcion.nombre}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
