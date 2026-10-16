import { useState } from "react";
import Campo from "@/components/ui/Campo";
import { CampoNumero, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import { CampoFecha, Pie } from "./comunes";
import { useMiFinca } from "@/datos/miFinca";
import { crear } from "@/datos/almacen";
import { aCargas, FR_BASE, FUENTES, precioCargaPorFR } from "@/datos/agronomia";
import { precioVigente } from "@/datos/calculos";
import { cop, num, fLarga, hoyISO } from "@/utilidades/formato";

export default function FormVenta({ alTerminar }) {
  const { finca, precios } = useMiFinca();
  const avisos = useAvisos();
  const precio = precioVigente(precios);
  const [fecha, setFecha] = useState(hoyISO());
  const [kg, setKg] = useState("");
  const [fr, setFr] = useState(String(FR_BASE));
  const [humedad, setHumedad] = useState("");
  const [comprador, setComprador] = useState(finca?.puntoCompra ?? "");
  const [total, setTotal] = useState("");

  const kgCps = aNumero(kg) || 0;
  const factor = aNumero(fr) || FR_BASE;
  const hum = aNumero(humedad);
  const estimado = precio && kgCps > 0 ? aCargas(kgCps) * precioCargaPorFR(precio.precioCarga, factor, precio.pasillaKg) : null;
  const pagado = aNumero(total);
  const humedadFuera = Number.isFinite(hum) && (hum < 10 || hum > 12);

  const guardar = (evento) => {
    evento.preventDefault();
    const valor = Number.isFinite(pagado) && pagado > 0 ? pagado : Math.round(estimado ?? 0);
    crear("ventas", { fincaId: finca.id, fecha, kgCps, factorRendimiento: factor, humedad: Number.isFinite(hum) ? hum : null, comprador: comprador.trim(), precioBase: precio?.precioCarga ?? null, total: valor }, "ven");
    avisos.registrado("Venta registrada", `${num(kgCps)} kg de pergamino · ${cop(valor)}`);
    alTerminar();
  };

  return (
    <form onSubmit={guardar} className="grid gap-5">
      <CampoFecha valor={fecha} alCambiar={setFecha} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Kilos de pergamino seco">{(props) => <CampoNumero {...props} sufijo="kg" valor={kg} alCambiar={setKg} className="[&_input]:text-2xl [&_input]:font-bold" />}</Campo>
        <Campo etiqueta="Factor de rendimiento" ayuda="El que te dio la prueba del comprador. La base es 94.">
          {(props) => <CampoNumero {...props} valor={fr} alCambiar={setFr} />}
        </Campo>
      </div>
      <Campo etiqueta="Humedad del pergamino" opcional error={humedadFuera ? "Fuera de norma: el pergamino se vende entre 10 % y 12 % de humedad." : null}>
        {(props) => <CampoNumero {...props} sufijo="%" valor={humedad} alCambiar={setHumedad} />}
      </Campo>
      <Campo etiqueta="Comprador" opcional>
        {(props) => <input {...props} className="campo" value={comprador} onChange={(evento) => setComprador(evento.target.value)} />}
      </Campo>
      {kgCps > 0 && (
        <div className="rounded-lg border border-linea bg-cal p-4 text-[0.95rem]">
          <p>
            {num(kgCps)} kg = <strong className="cifra">{num(aCargas(kgCps))} cargas</strong> ({num(kgCps / 12.5)} @)
          </p>
          {estimado ? (
            <p className="mt-1">
              Con el precio de referencia del {fLarga(precio.fecha)} ({cop(precio.precioCarga)} la carga FR 94), a FR {num(factor)} serían unos{" "}
              <strong className="cifra">{cop(estimado)}</strong>.
            </p>
          ) : (
            <p className="mt-1 text-grafito">El administrador todavía no ha registrado el precio de referencia.</p>
          )}
          <a href={FUENTES.fr.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-grafito underline">
            Cálculo con la tabla por factor de rendimiento de la FNC
          </a>
        </div>
      )}
      <Campo etiqueta="Lo que te pagaron" ayuda="Si lo dejas vacío se guarda el valor estimado.">
        {(props) => <CampoNumero {...props} prefijo="$" valor={total} alCambiar={setTotal} />}
      </Campo>
      <Pie texto="Guardar venta" deshabilitado={!(kgCps > 0) || (!estimado && !(pagado > 0))} />
    </form>
  );
}
