import { useState } from "react";
import { KeyRound, Trash2, UserCheck, UserX } from "lucide-react";
import { EncabezadoPagina } from "@/components/ui/Pagina";
import Hoja from "@/components/ui/Hoja";
import Campo from "@/components/ui/Campo";
import { useAvisos } from "@/components/ui/Avisos";
import { useCuentas, useSesion, actualizarCuenta, cambiarClave, eliminarCuenta } from "@/utilidades/autenticacion";
import { useDatos } from "@/datos/almacen";
import { hace } from "@/utilidades/formato";

export default function Cuentas() {
  const cuentas = useCuentas();
  const sesion = useSesion();
  const { fincas } = useDatos();
  const avisos = useAvisos();
  const [busqueda, setBusqueda] = useState("");
  const [clave, setClave] = useState({ cuenta: null, nueva: "", error: "" });
  const [borrar, setBorrar] = useState({ cuenta: null, texto: "" });
  const nombreFinca = (id) => fincas.find((f) => f.id === id)?.nombre ?? "—";
  const lista = cuentas.filter((c) => `${c.nombre} ${c.correo} ${nombreFinca(c.fincaId)}`.toLowerCase().includes(busqueda.toLowerCase()));

  const asignarClave = async (evento) => {
    evento.preventDefault();
    const r = await cambiarClave(clave.cuenta.id, { nueva: clave.nueva });
    if (!r.ok) return setClave((c) => ({ ...c, error: r.error }));
    avisos.registrado("Contraseña asignada", `Entrégasela a ${clave.cuenta.nombre} en persona.`);
    setClave({ cuenta: null, nueva: "", error: "" });
  };

  return (
    <>
      <EncabezadoPagina rotulo="Administración" titulo="Cuentas" bajada="Las cuentas viven en este equipo. Desactivar impide entrar; borrar no borra los datos de la finca." />
      <label className="mb-4 block max-w-md">
        <span className="sr-only">Buscar cuentas</span>
        <input type="search" className="campo" placeholder="Buscar por nombre, correo o finca" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
      </label>
      <ul className="grid gap-3">
        {lista.map((c) => {
          const propia = c.id === sesion?.id;
          return (
            <li key={c.id} className="placa flex flex-wrap items-center gap-4 p-4">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-bold ${c.rol === "administrador" ? "bg-tinta text-niebla" : "bg-cal-honda text-tinta"}`}>
                {c.nombre.split(" ").slice(0, 2).map((p) => p[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {c.nombre} {propia && <span className="text-sm font-normal text-grafito">(tú)</span>}
                </p>
                <p className="truncate text-sm text-grafito">
                  {c.correo} · {c.rol === "administrador" ? "Administrador" : `Caficultor · ${nombreFinca(c.fincaId)}`} · creada {hace(c.creado)}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-sm font-bold ${c.activa ? "bg-cal-honda text-tinta" : "bg-niebla text-ceniza-honda"}`}>{c.activa ? "Activa" : "Desactivada"}</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="boton-secundario min-h-11 px-3 text-sm" onClick={() => setClave({ cuenta: c, nueva: "", error: "" })}>
                  <KeyRound className="h-4 w-4" aria-hidden="true" /> Contraseña
                </button>
                {!propia && (
                  <>
                    <button
                      type="button"
                      className="boton-secundario min-h-11 px-3 text-sm"
                      onClick={() => {
                        actualizarCuenta(c.id, { activa: !c.activa });
                        avisos.info(`${c.nombre}: cuenta ${c.activa ? "desactivada" : "activada"}.`);
                      }}
                    >
                      {c.activa ? <UserX className="h-4 w-4" aria-hidden="true" /> : <UserCheck className="h-4 w-4" aria-hidden="true" />}
                      {c.activa ? "Desactivar" : "Activar"}
                    </button>
                    <button type="button" className="boton-secundario min-h-11 px-3 text-sm text-cereza" onClick={() => setBorrar({ cuenta: c, texto: "" })} aria-label={`Borrar la cuenta de ${c.nombre}`}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <Hoja abierta={Boolean(clave.cuenta)} alCerrar={() => setClave({ cuenta: null, nueva: "", error: "" })} titulo="Asignar contraseña" descripcion={clave.cuenta ? `Para ${clave.cuenta.nombre}. Entrégasela en persona: la app no envía correos.` : ""}>
        <form onSubmit={asignarClave} className="grid gap-4">
          <Campo etiqueta="Contraseña nueva" ayuda="8 o más, con mayúscula, minúscula y número." error={clave.error || null}>
            {(p) => <input {...p} type="text" autoComplete="off" required className="campo" value={clave.nueva} onChange={(e) => setClave((c) => ({ ...c, nueva: e.target.value, error: "" }))} />}
          </Campo>
          <button type="submit" className="boton-primario">
            Asignar
          </button>
        </form>
      </Hoja>

      <Hoja abierta={Boolean(borrar.cuenta)} alCerrar={() => setBorrar({ cuenta: null, texto: "" })} titulo="¿Borrar la cuenta?" descripcion={borrar.cuenta ? `Escribe «${borrar.cuenta.correo}» para confirmar. Los datos de la finca se conservan.` : ""}>
        <div className="grid gap-4">
          <Campo etiqueta="Correo de la cuenta">{(p) => <input {...p} className="campo" autoComplete="off" value={borrar.texto} onChange={(e) => setBorrar((b) => ({ ...b, texto: e.target.value }))} />}</Campo>
          <button
            type="button"
            className="boton-primario"
            disabled={borrar.texto.trim().toLowerCase() !== borrar.cuenta?.correo}
            onClick={() => {
              eliminarCuenta(borrar.cuenta.id);
              avisos.info(`Se borró la cuenta de ${borrar.cuenta.nombre}.`);
              setBorrar({ cuenta: null, texto: "" });
            }}
          >
            Borrar definitivamente
          </button>
        </div>
      </Hoja>
    </>
  );
}
