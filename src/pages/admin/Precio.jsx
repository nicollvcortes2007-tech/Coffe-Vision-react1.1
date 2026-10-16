import { useState } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { EncabezadoPagina, Seccion } from "@/components/ui/Pagina";
import Campo from "@/components/ui/Campo";
import Cifra from "@/components/ui/Cifra";
import { CampoNumero, aNumero } from "@/components/ui/Numero";
import { useAvisos } from "@/components/ui/Avisos";
import { useDatos, crear, eliminar } from "@/datos/almacen";
import { obtenerTRM, useAbierto } from "@/datos/abiertos";
import { precioCargaPorFR } from "@/datos/agronomia";
import { useSesion } from "@/utilidades/autenticacion";
import { cop, num, fLarga, hoyISO } from "@/utilidades/formato";

const URL_FNC = "https://federaciondecafeteros.org/wp/estadisticas-cafeteras/";

/*
  La FNC no tiene API y sus términos prohíben reproducir su contenido con robots:
  el administrador escribe el precio del día, con la fecha y el enlace a la fuente.
*/
export default function Precio() {
  const { precios } = useDatos();
  const sesion = useSesion();
  const avisos = useAvisos();
  const trm = useAbierto(obtenerTRM, []);
  const [form, setForm] = useState({ fecha: hoyISO(), precioCarga: "", pasillaKg: "12000", bolsaNY: "" });
  const cambiar = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const lista = [...precios].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const base = aNumero(form.precioCarga);

  const guardar = (evento) => {
    evento.preventDefault();
    crear(
      "precios",
      {
        fecha: form.fecha,
        precioCarga: base,
        pasillaKg: aNumero(form.pasillaKg) || 12000,
        bolsaNY: aNumero(form.bolsaNY) || null,
        trm: trm.datos?.valor?.[0]?.valor ?? null,
        fuente: "FNC, precio interno de referencia",
        url: URL_FNC,
        registradoPor: sesion?.nombre,
      },
      "pre",
    );
    avisos.registrado("Precio registrado", `${cop(base)} la carga FR 94 · ${fLarga(form.fecha)}`);
    setForm((f) => ({ ...f, precioCarga: "", bolsaNY: "" }));
  };

  return (
    <>
      <EncabezadoPagina rotulo="Administración" titulo="Precio del café" bajada="Los caficultores usan este precio para estimar sus ventas y su margen. Cópialo de la FNC cada día hábil." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Seccion titulo="Registrar el precio de hoy">
          <a href={URL_FNC} target="_blank" rel="noreferrer" className="boton-secundario mb-5 w-full">
            <ExternalLink className="h-5 w-5" aria-hidden="true" /> Abrir el precio en la página de la FNC
          </a>
          <form onSubmit={guardar} className="grid gap-4">
            <Campo etiqueta="Fecha">{(p) => <input {...p} type="date" className="campo" value={form.fecha} max={hoyISO()} onChange={(e) => cambiar("fecha")(e.target.value)} required />}</Campo>
            <Campo etiqueta="Precio interno por carga (FR 94)" ayuda="Carga de 125 kg de pergamino seco, como lo publica la FNC.">
              {(p) => <CampoNumero {...p} prefijo="$" valor={form.precioCarga} alCambiar={cambiar("precioCarga")} required />}
            </Campo>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo etiqueta="Pasilla por kilo">{(p) => <CampoNumero {...p} prefijo="$" valor={form.pasillaKg} alCambiar={cambiar("pasillaKg")} />}</Campo>
              <Campo etiqueta="Bolsa de NY" opcional>{(p) => <CampoNumero {...p} sufijo="¢/lb" valor={form.bolsaNY} alCambiar={cambiar("bolsaNY")} />}</Campo>
            </div>
            {base > 0 && (
              <ul className="grid gap-1 rounded-md bg-cal px-4 py-3 text-[0.95rem]">
                {[88, 92, 94, 96, 100].map((fr) => (
                  <li key={fr} className="flex justify-between">
                    <span>Factor {fr}</span>
                    <span className="cifra font-bold">{cop(precioCargaPorFR(base, fr, aNumero(form.pasillaKg) || 12000))}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-sm text-grafito">
              TRM de hoy: {trm.datos ? `${cop(trm.datos.valor[0].valor)} (datos.gov.co)` : trm.cargando ? "consultando…" : "sin conexión"}. Se guarda junto al precio.
            </p>
            <button type="submit" className="boton-primario" disabled={!(base > 500000)}>
              Guardar precio
            </button>
          </form>
        </Seccion>
        <Seccion titulo="Historial">
          {lista.length ? (
            <ul className="grid">
              {lista.map((p, i) => (
                <li key={p.id} className="group flex items-center gap-3 border-b border-linea/70 py-3">
                  <div className="min-w-0 flex-1">
                    {i === 0 ? <Cifra rotulo={fLarga(p.fecha)} valor={cop(p.precioCarga)} tamano="sm" detalle={`Pasilla ${cop(p.pasillaKg)}/kg${p.bolsaNY ? ` · NY ${num(p.bolsaNY)} ¢/lb` : ""}${p.trm ? ` · TRM ${cop(p.trm)}` : ""}`} /> : (
                      <>
                        <p className="cifra font-bold">{cop(p.precioCarga)}</p>
                        <p className="text-sm text-grafito">{fLarga(p.fecha)} · {p.registradoPor}</p>
                      </>
                    )}
                  </div>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full text-grafito hover:bg-cal-honda hover:text-cereza" aria-label={`Borrar el precio del ${fLarga(p.fecha)}`} onClick={() => { eliminar("precios", p.id); avisos.conDeshacer("Precio borrado", () => crear("precios", p)); }}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-grafito">Sin precios registrados.</p>
          )}
        </Seccion>
      </div>
    </>
  );
}
