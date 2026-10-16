import { useState } from "react";
import { Plus, Share2, Download, Calculator } from "lucide-react";
import { EncabezadoPagina, Seccion, Vacio } from "@/components/ui/Pagina";
import Cifra from "@/components/ui/Cifra";
import Barras from "@/components/ui/Barras";
import Campo from "@/components/ui/Campo";
import { CampoNumero, aNumero } from "@/components/ui/Numero";
import { useRegistro } from "@/components/registro/ContextoRegistro";
import { Canasto } from "@/components/marca/Pictogramas";
import { useFinca } from "@/datos/useFinca";
import { produccion, kgPorRecolector, precioVigente, enRango } from "@/datos/calculos";
import { anioCafetero, aArrobas, aCargas, FUENTES, FACTOR_CEREZA_CPS, FACTOR_CPS_VERDE, precioCargaPorFR, FR_BASE } from "@/datos/agronomia";
import { aCSV, descargar, compartirTexto } from "@/utilidades/descargas";
import { cop, num, ent, fCorta, fLarga, hoyISO, sumarDias, aFecha } from "@/utilidades/formato";

function semanas(recolecciones, lotes, desde, hasta) {
  const porLote = new Map(lotes.map((l) => [l.id, l]));
  const mapa = new Map();
  for (const r of recolecciones) {
    if (!enRango(r.fecha, desde, hasta)) continue;
    const f = aFecha(r.fecha);
    const lunes = sumarDias(f, -((f.getDay() + 6) % 7));
    const clave = hoyISO(lunes);
    const kg = (Number(r.kgCereza) || 0) * (porLote.get(r.loteId)?.factorCps || FACTOR_CEREZA_CPS);
    mapa.set(clave, (mapa.get(clave) ?? 0) + kg);
  }
  return [...mapa.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([fecha, kgCps]) => ({ etiqueta: fCorta(fecha), valor: Math.round(aArrobas(kgCps)) }));
}

function Calculadora({ precio }) {
  const [cereza, setCereza] = useState("1000");
  const [fr, setFr] = useState(String(FR_BASE));
  const kg = aNumero(cereza) || 0;
  const cps = kg * FACTOR_CEREZA_CPS;
  const valor = precio ? aCargas(cps) * precioCargaPorFR(precio.precioCarga, aNumero(fr) || FR_BASE, precio.pasillaKg) : null;
  return (
    <Seccion titulo={<span className="flex items-center gap-2"><Calculator className="h-6 w-6 text-cereza" aria-hidden="true" /> Calculadora</span>} bajada="De cereza a pergamino y a pesos, con los factores de Cenicafé y la tabla de la FNC.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Kilos de cereza">{(props) => <CampoNumero {...props} sufijo="kg" valor={cereza} alCambiar={setCereza} />}</Campo>
        <Campo etiqueta="Factor de rendimiento">{(props) => <CampoNumero {...props} valor={fr} alCambiar={setFr} />}</Campo>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.95rem] sm:grid-cols-4">
        {[
          ["Pergamino seco", `${num(cps)} kg`],
          ["Arrobas", num(aArrobas(cps))],
          ["Cargas", num(aCargas(cps))],
          ["Café verde", `${num(cps * FACTOR_CPS_VERDE)} kg`],
        ].map(([t, v]) => (
          <div key={t} className="rounded-xl bg-pergamino p-3">
            <dt className="text-sm text-tierra-media">{t}</dt>
            <dd className="cifra text-lg font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      {valor !== null && (
        <p className="mt-3 text-lg">
          Valor estimado: <strong className="cifra">{cop(valor)}</strong>
          <span className="block text-sm text-tierra-media">Con el precio de referencia del {fLarga(precio.fecha)}. La cooperativa descuenta el acopio y los defectos de taza.</span>
        </p>
      )}
      <a href={FUENTES.conversion.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-tierra-media underline">
        Fuente: {FUENTES.conversion.texto}
      </a>
    </Seccion>
  );
}

export default function Cosecha() {
  const datos = useFinca({ conClima: false });
  const { finca, lotes, recolecciones, ventas, precios } = datos;
  const { abrir } = useRegistro();
  const anio = anioCafetero();
  const prod = produccion(datos, { desde: anio.inicio, hasta: anio.fin });
  const porRecolector = kgPorRecolector(recolecciones, { desde: anio.inicio, hasta: anio.fin });
  const serie = semanas(recolecciones, lotes, anio.inicio, anio.fin);
  const ventasAnio = ventas.filter((v) => enRango(v.fecha, anio.inicio, anio.fin)).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const kgVendidos = ventasAnio.reduce((s, v) => s + (Number(v.kgCps) || 0), 0);
  const ingresos = ventasAnio.reduce((s, v) => s + (Number(v.total) || 0), 0);
  const pagoTotal = porRecolector.reduce((s, r) => s + r.pago, 0);
  const precio = precioVigente(precios);
  const hace7 = hoyISO(sumarDias(new Date(), -6));
  const semanaActual = kgPorRecolector(recolecciones, { desde: hace7 });

  const compartirSemana = () => {
    const lineas = semanaActual.map((r) => `• ${r.nombre}: ${ent(r.kg)} kg · ${cop(r.pago)}`);
    const total = semanaActual.reduce((s, r) => s + r.kg, 0);
    compartirTexto(
      `Recolección ${finca?.nombre}`,
      `Recolección en ${finca?.nombre}, semana del ${fCorta(hace7)} al ${fCorta(hoyISO())}:\n${lineas.join("\n")}\nTotal: ${ent(total)} kg de cereza (≈ ${num(aArrobas(total * FACTOR_CEREZA_CPS))} @ de pergamino).\n— Coffee+Visión`,
    );
  };

  const exportar = () => {
    const nombreLote = new Map(lotes.map((l) => [l.id, l.nombre]));
    const csv = aCSV(
      recolecciones.filter((r) => enRango(r.fecha, anio.inicio, anio.fin)).sort((a, b) => a.fecha.localeCompare(b.fecha)),
      [
        { titulo: "Fecha", valor: "fecha" },
        { titulo: "Lote", valor: (r) => nombreLote.get(r.loteId) },
        { titulo: "Recolector", valor: "recolector" },
        { titulo: "Kg cereza", valor: "kgCereza" },
        { titulo: "Pago por kg", valor: "pagoKg" },
        { titulo: "Pago", valor: (r) => (Number(r.kgCereza) || 0) * (Number(r.pagoKg) || 0) },
      ],
    );
    descargar(`recoleccion-${anio.nombre.replace("/", "-")}.csv`, csv, "text/csv");
  };

  return (
    <>
      <EncabezadoPagina
        rotulo={`Año cafetero ${anio.nombre}`}
        titulo="Cosecha y ventas"
        acciones={
          <>
            <button type="button" className="boton-secundario" onClick={() => abrir("venta")}>
              Registrar venta
            </button>
            <button type="button" className="boton-primario" onClick={() => abrir("recoleccion")}>
              <Plus className="h-5 w-5" aria-hidden="true" /> Recolección
            </button>
          </>
        }
      />

      <div className="papel mb-6 grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        <Cifra rotulo="Cereza recogida" valor={ent(prod.kgCereza)} unidad="kg" detalle={`${ent(semanaActual.reduce((s, r) => s + r.kg, 0))} kg en los últimos 7 días`} />
        <Cifra rotulo="Pergamino seco" valor={num(prod.arrobas)} unidad="@" detalle={`${num(prod.cargas)} cargas`} fuente={FUENTES.conversion.texto} />
        <Cifra rotulo="Vendido" valor={num(aCargas(kgVendidos))} unidad="cargas" detalle={`${cop(ingresos)} · quedan ≈ ${num(Math.max(0, prod.cargas - aCargas(kgVendidos)))} cargas`} tono="hoja" />
        <Cifra rotulo="Pago a recolectores" valor={cop(pagoTotal)} detalle={prod.kgCereza ? `${cop(pagoTotal / prod.kgCereza)} por kg en promedio` : null} fuente={FUENTES.recoleccion.texto} />
      </div>

      {!recolecciones.length ? (
        <Vacio Icono={Canasto} titulo="Sin recolecciones" texto="Registra cada día los kilos de cereza por recolector." accion={<button type="button" className="boton-primario" onClick={() => abrir("recoleccion")}>Registrar recolección</button>} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="grid content-start gap-6">
            <Seccion titulo="Pergamino por semana" bajada="Arrobas de café pergamino seco estimadas a partir de la cereza recogida.">
              {serie.length ? <Barras titulo="Arrobas de pergamino por semana" datos={serie.slice(-16)} formato={(v) => ent(v)} /> : <p className="text-tierra-media">Sin recolecciones este año cafetero.</p>}
            </Seccion>
            <Seccion titulo="Ventas" bajada={`${ventasAnio.length} ventas en el año cafetero.`}>
              {ventasAnio.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[34rem] text-left text-[0.95rem]">
                    <thead className="text-sm text-tierra-media">
                      <tr className="border-b border-linea">
                        <th className="py-2 pr-3 font-bold">Fecha</th>
                        <th className="py-2 pr-3 font-bold">Pergamino</th>
                        <th className="py-2 pr-3 font-bold">FR</th>
                        <th className="py-2 pr-3 font-bold">Humedad</th>
                        <th className="py-2 text-right font-bold">Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasAnio.map((v) => (
                        <tr key={v.id} className="border-b border-linea/70">
                          <td className="py-2.5 pr-3">{fCorta(v.fecha)}</td>
                          <td className="cifra py-2.5 pr-3">{ent(v.kgCps)} kg</td>
                          <td className="cifra py-2.5 pr-3">{v.factorRendimiento}</td>
                          <td className={`cifra py-2.5 pr-3 ${v.humedad && (v.humedad < 10 || v.humedad > 12) ? "font-bold text-cereza" : ""}`}>{v.humedad ? `${num(v.humedad)} %` : "—"}</td>
                          <td className="cifra py-2.5 text-right font-bold">{cop(v.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-tierra-media">Sin ventas registradas.</p>
              )}
            </Seccion>
          </div>
          <div className="grid content-start gap-6">
            <Seccion
              titulo="Recolectores"
              bajada="Kilos y pago del año cafetero."
              acciones={
                <button type="button" className="boton-fantasma text-sm" onClick={exportar}>
                  <Download className="h-4 w-4" aria-hidden="true" /> CSV
                </button>
              }
            >
              <ul className="grid gap-2">
                {porRecolector.map((r) => (
                  <li key={r.nombre} className="flex items-center justify-between gap-3 rounded-xl bg-pergamino px-3 py-2.5">
                    <span>
                      <span className="block font-bold">{r.nombre}</span>
                      <span className="text-sm text-tierra-media">
                        {r.dias} días · {ent(r.kg / Math.max(r.dias, 1))} kg/día
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="cifra block font-bold">{ent(r.kg)} kg</span>
                      <span className="cifra text-sm text-tierra-media">{cop(r.pago)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              {semanaActual.length > 0 && (
                <button type="button" className="boton-hoja mt-4 w-full" onClick={compartirSemana}>
                  <Share2 className="h-5 w-5" aria-hidden="true" /> Enviar la semana por WhatsApp
                </button>
              )}
            </Seccion>
            <Calculadora precio={precio} />
          </div>
        </div>
      )}
    </>
  );
}
