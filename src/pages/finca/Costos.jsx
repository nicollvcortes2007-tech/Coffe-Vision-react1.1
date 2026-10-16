import { useMemo, useState } from "react";
import { Download, Plus, Trash2 } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Cifra from "@/components/ui/Cifra";
import { Proporcion } from "@/components/ui/Barras";
import { useAvisos } from "@/components/ui/Avisos";
import { useRegistro } from "@/components/registro/ContextoRegistro";
import { useFinca } from "@/datos/useFinca";
import { resumenFinanciero, precioVigente } from "@/datos/calculos";
import { anioCafetero, ACTIVIDADES, ESTRUCTURA_REFERENCIA, COSTO_REFERENCIA_CARGA, FUENTES, precioCargaPorFR } from "@/datos/agronomia";
import { crear, eliminar } from "@/datos/almacen";
import { aCSV, descargar } from "@/utilidades/descargas";
import { cop, num, fCorta } from "@/utilidades/formato";

const ORIGEN = { labor: "labores", recoleccion: "recolecciones", aplicacion: "aplicaciones", gasto: "gastos" };

export default function Costos() {
  const datos = useFinca({ conClima: false });
  const { abrir } = useRegistro();
  const avisos = useAvisos();
  const [filtro, setFiltro] = useState("todas");
  const anio = anioCafetero();
  const resumen = useMemo(() => resumenFinanciero(datos, anio), [datos, anio]);
  const precio = precioVigente(datos.precios);
  const precioFR94 = precio ? precioCargaPorFR(precio.precioCarga, 94, precio.pasillaKg) : null;
  const nombreLote = new Map(datos.lotes.map((l) => [l.id, l.nombre]));
  const lista = resumen.costos.filter((m) => filtro === "todas" || m.actividad === filtro);
  const equilibrio = precioFR94 ? resumen.costoTotal / precioFR94 : null;

  const borrar = (movimiento) => {
    const coleccion = ORIGEN[movimiento.origen];
    const original = datos[coleccion].find((item) => item.id === movimiento.id);
    if (!original) return;
    eliminar(coleccion, original.id);
    avisos.conDeshacer(`Se borró: ${movimiento.concepto}`, () => crear(coleccion, original));
  };

  const exportar = () => {
    const csv = aCSV(resumen.costos, [
      { titulo: "Fecha", valor: "fecha" },
      { titulo: "Lote", valor: (m) => nombreLote.get(m.loteId) ?? "Finca" },
      { titulo: "Actividad", valor: (m) => ACTIVIDADES.find((a) => a.id === m.actividad)?.nombre },
      { titulo: "Concepto", valor: "concepto" },
      { titulo: "Valor (COP)", valor: "valor" },
    ]);
    descargar(`costos-${anio.nombre.replace("/", "-")}.csv`, csv, "text/csv");
  };

  return (
    <>
      <EncabezadoPagina
        rotulo={`Año cafetero ${anio.nombre}`}
        titulo="Costos"
        bajada="Todo lo que cuesta producir, sumado solo: labores, recolección, aplicaciones y otros gastos."
        acciones={
          <>
            <button type="button" className="boton-secundario" onClick={exportar} disabled={!resumen.costos.length}>
              <Download className="h-5 w-5" aria-hidden="true" /> CSV
            </button>
            <button type="button" className="boton-primario" onClick={() => abrir("gasto")}>
              <Plus className="h-5 w-5" aria-hidden="true" /> Gasto
            </button>
          </>
        }
      />

      <div className="papel mb-6 grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <Cifra rotulo="Costo total" valor={cop(resumen.costoTotal)} detalle={`${resumen.costos.length} movimientos`} />
        <Cifra
          rotulo="Costo por carga"
          valor={resumen.costoPorCarga ? cop(resumen.costoPorCarga) : "—"}
          detalle={`Referencia nacional: ${cop(COSTO_REFERENCIA_CARGA)}`}
          tono={resumen.costoPorCarga && precioFR94 && resumen.costoPorCarga > precioFR94 ? "cereza" : "tierra"}
          fuente={`Costo total ÷ ${num(resumen.produccion.cargas)} cargas producidas. ${FUENTES.costos.texto}.`}
        />
        <Cifra
          rotulo="Margen"
          valor={cop(resumen.margen)}
          tono={resumen.margen >= 0 ? "hoja" : "cereza"}
          detalle={`Ventas ${cop(resumen.ingresos)} menos costos`}
          fuente="Solo con las ventas registradas. Si todavía tienes café en bodega, el margen real será mayor."
        />
        <Cifra
          rotulo="Punto de equilibrio"
          valor={equilibrio ? num(equilibrio) : "—"}
          unidad="cargas"
          detalle={precioFR94 ? `Para cubrir los costos al precio de hoy (${cop(precioFR94)})` : "Falta el precio de referencia"}
          fuente="Costo total ÷ precio de referencia de la carga FR 94."
        />
      </div>

      {!resumen.costos.length ? (
        <Vacio titulo="Sin costos este año cafetero" texto="Registra labores con jornales, recolecciones, aplicaciones y gastos: aquí se suman solos." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <Seccion titulo="¿En qué se va la plata?" bajada="La línea roja es la estructura promedio del país (FNC, 2025).">
            <div className="grid gap-4">
              {ACTIVIDADES.filter((a) => resumen.porActividad[a.id] || ESTRUCTURA_REFERENCIA[a.id] >= 5).map((a) => {
                const valor = resumen.porActividad[a.id] ?? 0;
                const pct = resumen.costoTotal ? (valor / resumen.costoTotal) * 100 : 0;
                return <Proporcion key={a.id} etiqueta={a.nombre} valor={pct} referencia={ESTRUCTURA_REFERENCIA[a.id]} texto={`${num(pct)} % · ${cop(valor)}`} />;
              })}
            </div>
            <a href={FUENTES.costos.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-tierra-media underline">
              Fuente: {FUENTES.costos.texto}
            </a>
          </Seccion>

          <Seccion
            titulo="Movimientos"
            acciones={
              <select aria-label="Filtrar por actividad" className="campo min-h-11 w-auto py-1 text-[0.95rem]" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="todas">Todas</option>
                {ACTIVIDADES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            }
          >
            <ul className="grid">
              {lista.slice(0, 60).map((m) => (
                <li key={`${m.origen}-${m.id}`} className="group flex items-center gap-3 border-b border-linea/70 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{m.concepto}</p>
                    <p className="text-sm text-tierra-media">
                      {fCorta(m.fecha)} · {nombreLote.get(m.loteId) ?? "Finca"} · {ACTIVIDADES.find((a) => a.id === m.actividad)?.nombre}
                    </p>
                  </div>
                  <span className="cifra font-bold">{cop(m.valor)}</span>
                  <button type="button" onClick={() => borrar(m)} className="grid h-10 w-10 place-items-center rounded-full text-tierra-media opacity-70 hover:bg-crema hover:text-cereza sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100" aria-label={`Borrar ${m.concepto}`}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            {lista.length > 60 && <p className="mt-3 text-sm text-tierra-media">Se muestran 60 de {lista.length}. Descarga el CSV para verlos todos.</p>}
          </Seccion>
        </div>
      )}
    </>
  );
}
