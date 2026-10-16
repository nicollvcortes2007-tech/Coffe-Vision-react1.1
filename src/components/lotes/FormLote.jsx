import { useState } from "react";
import Campo from "@/components/ui/Campo";
import { CampoNumero, Fichas, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import CapturaUbicacion from "./CapturaUbicacion";
import { crear, actualizar } from "@/datos/almacen";
import { VARIEDADES, SISTEMAS, densidad, variedad, FUENTES, FACTOR_CEREZA_CPS } from "@/datos/agronomia";
import { areaHa } from "@/utilidades/geo";
import { num, ent, hoyISO } from "@/utilidades/formato";

/* Ficha del lote con los campos del SICA: área, variedad, edad, densidad y sombra. */
export default function FormLote({ finca, lote, alTerminar }) {
  const avisos = useAvisos();
  const [form, setForm] = useState(() => ({
    nombre: lote?.nombre ?? "",
    areaHa: lote?.areaHa ? String(lote.areaHa).replace(".", ",") : "",
    variedad: lote?.variedad ?? "castillo",
    sistema: lote?.sistema ?? "sol",
    fechaSiembra: lote?.fechaSiembra ?? "",
    ciclo: lote?.fechaRenovacion ? "zoca" : "siembra",
    fechaRenovacion: lote?.fechaRenovacion ?? "",
    distSurcos: lote?.distSurcos ? String(lote.distSurcos).replace(".", ",") : "",
    distPlantas: lote?.distPlantas ? String(lote.distPlantas).replace(".", ",") : "",
    arreglo: lote?.arreglo ?? "cuadro",
    densidadManual: lote?.densidad && !lote?.distSurcos ? String(lote.densidad) : "",
    factorCps: String(lote?.factorCps ?? FACTOR_CEREZA_CPS).replace(".", ","),
    geometria: lote?.geometria ?? null,
    antesDe2021: lote?.antesDe2021 ?? "desconocido",
  }));
  const cambiar = (campo) => (valor) => setForm((actual) => ({ ...actual, [campo]: valor }));
  const area = aNumero(form.areaHa);
  const dens = densidad(aNumero(form.distSurcos), aNumero(form.distPlantas), form.arreglo) ?? (aNumero(form.densidadManual) || null);
  const recomendada = variedad(form.variedad).densidadSur;
  const areaMedida = form.geometria?.tipo === "poligono" ? areaHa(form.geometria.puntos) : null;

  const guardar = (evento) => {
    evento.preventDefault();
    const datos = {
      fincaId: finca.id,
      nombre: form.nombre.trim(),
      areaHa: Number.isFinite(area) ? area : areaMedida ? Number(areaMedida.toFixed(2)) : 0,
      variedad: form.variedad,
      sistema: form.sistema,
      fechaSiembra: form.fechaSiembra || null,
      fechaRenovacion: form.ciclo === "zoca" ? form.fechaRenovacion || null : null,
      distSurcos: aNumero(form.distSurcos) || null,
      distPlantas: aNumero(form.distPlantas) || null,
      arreglo: form.arreglo,
      densidad: dens,
      factorCps: aNumero(form.factorCps) || FACTOR_CEREZA_CPS,
      geometria: form.geometria,
      antesDe2021: form.fechaSiembra ? (form.fechaSiembra <= "2020-12-31" ? "si" : "no") : form.antesDe2021,
    };
    if (lote) {
      actualizar("lotes", lote.id, datos);
      avisos.registrado("Lote actualizado", datos.nombre);
    } else {
      crear("lotes", datos, "lot");
      avisos.registrado("Lote creado", datos.nombre);
    }
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <Campo etiqueta="Nombre del lote">
        {(props) => <input {...props} required className="campo" value={form.nombre} onChange={(evento) => cambiar("nombre")(evento.target.value)} placeholder="Ej. La Loma" />}
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Área" ayuda={areaMedida ? `Medida con el GPS: ${num(areaMedida)} ha` : "En hectáreas. 1 ha = 10.000 m²."}>
          {(props) => <CampoNumero {...props} sufijo="ha" valor={form.areaHa} alCambiar={cambiar("areaHa")} />}
        </Campo>
        <Campo etiqueta="Variedad">
          {(props) => (
            <select {...props} className="campo" value={form.variedad} onChange={(evento) => cambiar("variedad")(evento.target.value)}>
              {VARIEDADES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                  {v.resistente === false ? " (susceptible a roya)" : v.resistente ? " (resistente a roya)" : ""}
                </option>
              ))}
            </select>
          )}
        </Campo>
      </div>
      <Fichas etiqueta="Luz" opciones={SISTEMAS} valor={form.sistema} alCambiar={cambiar("sistema")} />

      <fieldset className="grid gap-4 rounded-lg border border-linea p-4">
        <legend className="px-1 font-bold">Edad del cafetal</legend>
        <Campo etiqueta="Fecha de siembra en el campo">
          {(props) => <input {...props} type="date" max={hoyISO()} className="campo" value={form.fechaSiembra} onChange={(evento) => cambiar("fechaSiembra")(evento.target.value)} />}
        </Campo>
        <Fichas
          etiqueta="Ciclo actual"
          opciones={[
            { id: "siembra", nombre: "Desde la siembra" },
            { id: "zoca", nombre: "Desde una zoca" },
          ]}
          valor={form.ciclo}
          alCambiar={cambiar("ciclo")}
        />
        {form.ciclo === "zoca" && (
          <Campo etiqueta="Fecha de la última zoca">
            {(props) => <input {...props} type="date" max={hoyISO()} className="campo" value={form.fechaRenovacion} onChange={(evento) => cambiar("fechaRenovacion")(evento.target.value)} />}
          </Campo>
        )}
      </fieldset>

      <fieldset className="grid gap-4 rounded-lg border border-linea p-4">
        <legend className="px-1 font-bold">Densidad de siembra</legend>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Entre surcos">{(props) => <CampoNumero {...props} sufijo="m" valor={form.distSurcos} alCambiar={cambiar("distSurcos")} />}</Campo>
          <Campo etiqueta="Entre plantas">{(props) => <CampoNumero {...props} sufijo="m" valor={form.distPlantas} alCambiar={cambiar("distPlantas")} />}</Campo>
        </div>
        <Fichas
          etiqueta="Trazado"
          opciones={[
            { id: "cuadro", nombre: "En cuadro" },
            { id: "triangulo", nombre: "Tres bolillo" },
          ]}
          valor={form.arreglo}
          alCambiar={cambiar("arreglo")}
        />
        {!aNumero(form.distSurcos) && (
          <Campo etiqueta="O escribe los árboles por hectárea" opcional>
            {(props) => <CampoNumero {...props} sufijo="árb/ha" valor={form.densidadManual} alCambiar={cambiar("densidadManual")} />}
          </Campo>
        )}
        <p className="text-[0.95rem]">
          {dens ? (
            <>
              <strong className="cifra">{ent(dens)} árboles/ha</strong>
              {Number.isFinite(area) && area > 0 && <> · unos {ent(dens * area)} árboles en el lote</>}
            </>
          ) : (
            "Escribe las distancias para calcular la densidad."
          )}
          {recomendada && <span className="block text-sm text-grafito">Recomendada para {variedad(form.variedad).nombre} en la zona sur: unos {ent(recomendada)} por ha.</span>}
          <a href={FUENTES.densidad.url} target="_blank" rel="noreferrer" className="text-sm text-grafito underline">
            Fuente: Cenicafé
          </a>
        </p>
      </fieldset>

      <details className="rounded-lg border border-linea p-4">
        <summary className="cursor-pointer font-bold">Ubicación del lote (GPS)</summary>
        <div className="mt-4">
          <CapturaUbicacion valor={form.geometria} areaDeclarada={area} alCambiar={cambiar("geometria")} />
        </div>
      </details>

      <details className="rounded-lg border border-linea p-4">
        <summary className="cursor-pointer font-bold">Conversión cereza a pergamino</summary>
        <div className="mt-4">
          <Campo etiqueta="Kilos de pergamino seco por kilo de cereza" ayuda="Cenicafé usa 0,20 (unos 5 kg de cereza por kg de pergamino). Ajústalo si pesas tu café.">
            {(props) => <CampoNumero {...props} valor={form.factorCps} alCambiar={cambiar("factorCps")} />}
          </Campo>
        </div>
      </details>

      <button type="submit" className="boton-primario text-lg">
        {lote ? "Guardar cambios" : "Crear lote"}
      </button>
    </form>
  );
}
