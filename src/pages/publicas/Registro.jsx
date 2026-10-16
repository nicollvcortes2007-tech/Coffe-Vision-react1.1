import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crosshair, CircleCheck, UserPlus } from "lucide-react";
import PlantillaPublica from "@/plantillas/PlantillaPublica";
import Campo from "@/components/ui/Campo";
import { registrarCuenta, ROLES, useSesion } from "@/utilidades/autenticacion";
import { problemaDeClave } from "@/utilidades/claves";
import { crear, eliminar, nuevoId } from "@/datos/almacen";
import { obtenerAltitud } from "@/datos/abiertos";
import { ent } from "@/utilidades/formato";

const MUNICIPIOS_CAUCA = [
  "Popayán",
  "Timbío",
  "Cajibío",
  "El Tambo",
  "Piendamó - Tunía",
  "Morales",
  "Inzá",
  "Páez",
  "La Sierra",
  "La Vega",
  "Rosas",
  "Sotará",
  "Totoró",
  "Caldono",
  "Santander de Quilichao",
  "Buenos Aires",
  "Suárez",
  "Mercaderes",
  "Bolívar",
  "Argelia",
];

export default function Registro() {
  const navegar = useNavigate();
  const sesion = useSesion();
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", clave: "", confirmar: "", finca: "", departamento: "Cauca", municipio: "Timbío", vereda: "" });
  const [ubicacion, setUbicacion] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [acepta, setAcepta] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const cambiar = (campo) => (evento) => setForm((actual) => ({ ...actual, [campo]: evento.target.value }));

  useEffect(() => {
    document.title = "Crear mi cuaderno · Coffee+Visión";
  }, []);
  useEffect(() => {
    if (sesion) navegar(ROLES[sesion.rol]?.inicio ?? "/", { replace: true });
  }, [sesion, navegar]);

  const problemaClave = form.clave ? problemaDeClave(form.clave) : null;
  const noCoinciden = form.confirmar && form.clave !== form.confirmar;

  const ubicar = () => {
    if (!("geolocation" in navigator)) return setError("Este navegador no da acceso al GPS. Puedes ubicar la finca después.");
    setBuscando(true);
    navigator.geolocation.getCurrentPosition(
      async (posicion) => {
        const lat = posicion.coords.latitude;
        const lon = posicion.coords.longitude;
        const altitud = await obtenerAltitud(lat, lon).catch(() => (Number.isFinite(posicion.coords.altitude) ? Math.round(posicion.coords.altitude) : null));
        setUbicacion({ lat, lon, altitud });
        setBuscando(false);
      },
      () => {
        setBuscando(false);
        setError("No se pudo leer el GPS. Puedes ubicar la finca después desde «Mi cuenta».");
      },
      { enableHighAccuracy: true, timeout: 20000 },
    );
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");
    if (form.clave !== form.confirmar) return setError("Las contraseñas no coinciden.");
    if (!acepta) return setError("Para crear el cuaderno necesitas aceptar el tratamiento de tus datos.");
    setEnviando(true);
    const fincaId = nuevoId("fin");
    const finca = crear("fincas", {
      id: fincaId,
      nombre: form.finca.trim() || "Mi finca",
      propietario: form.nombre.trim(),
      departamento: form.departamento.trim(),
      municipio: form.municipio.trim(),
      vereda: form.vereda.trim(),
      lat: ubicacion?.lat ?? null,
      lon: ubicacion?.lon ?? null,
      altitud: ubicacion?.altitud ?? null,
      consentimiento: { fecha: new Date().toISOString(), version: "2026-10-15", finalidades: ["gestión de la finca", "cálculos y reportes propios"] },
    });
    const resultado = await registrarCuenta({ nombre: form.nombre, correo: form.correo, telefono: form.telefono, clave: form.clave, fincaId: finca.id });
    setEnviando(false);
    if (!resultado.ok) {
      eliminar("fincas", finca.id);
      setError(resultado.error);
    }
  };

  return (
    <PlantillaPublica titulo="Crea tu cuaderno" bajada="Dos minutos. Todo queda guardado en este celular." ancho="max-w-lg">
      <form onSubmit={enviar} className="grid gap-5">
        <fieldset className="grid gap-4">
          <legend className="rotulo mb-1">Tú</legend>
          <Campo etiqueta="Nombre y apellidos">{(props) => <input {...props} required autoComplete="name" className="campo" value={form.nombre} onChange={cambiar("nombre")} />}</Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Correo">{(props) => <input {...props} type="email" required autoComplete="email" className="campo" value={form.correo} onChange={cambiar("correo")} />}</Campo>
            <Campo etiqueta="Celular" opcional>{(props) => <input {...props} type="tel" autoComplete="tel" className="campo" value={form.telefono} onChange={cambiar("telefono")} />}</Campo>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Contraseña" ayuda="8 o más, con mayúscula, minúscula y número." error={problemaClave}>
              {(props) => <input {...props} type="password" required autoComplete="new-password" className="campo" value={form.clave} onChange={cambiar("clave")} />}
            </Campo>
            <Campo etiqueta="Repite la contraseña" error={noCoinciden ? "No coinciden." : null}>
              {(props) => <input {...props} type="password" required autoComplete="new-password" className="campo" value={form.confirmar} onChange={cambiar("confirmar")} />}
            </Campo>
          </div>
        </fieldset>

        <fieldset className="grid gap-4">
          <legend className="rotulo mb-1">Tu finca</legend>
          <Campo etiqueta="Nombre de la finca">{(props) => <input {...props} required className="campo" value={form.finca} onChange={cambiar("finca")} placeholder="Ej. La Esperanza" />}</Campo>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo etiqueta="Municipio">
              {(props) => (
                <>
                  <input {...props} list="municipios" required className="campo" value={form.municipio} onChange={cambiar("municipio")} />
                  <datalist id="municipios">
                    {MUNICIPIOS_CAUCA.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </>
              )}
            </Campo>
            <Campo etiqueta="Vereda" opcional>{(props) => <input {...props} className="campo" value={form.vereda} onChange={cambiar("vereda")} />}</Campo>
          </div>
          <Campo etiqueta="Departamento">{(props) => <input {...props} required className="campo" value={form.departamento} onChange={cambiar("departamento")} />}</Campo>
          <div className="grid gap-2">
            <button type="button" className="boton-secundario" onClick={ubicar} disabled={buscando}>
              <Crosshair className="h-5 w-5" aria-hidden="true" /> {buscando ? "Leyendo el GPS…" : ubicacion ? "Volver a ubicar" : "Ubicar la finca con el GPS (para el clima)"}
            </button>
            {ubicacion && (
              <p className="flex items-center gap-2 text-[0.95rem] font-bold text-tinta" role="status">
                <CircleCheck className="h-5 w-5" aria-hidden="true" /> Ubicada{ubicacion.altitud ? ` a ${ent(ubicacion.altitud)} m de altitud` : ""}.
              </p>
            )}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-linea bg-lamina p-4 text-[0.95rem]">
          <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-cereza" checked={acepta} onChange={(evento) => setAcepta(evento.target.checked)} />
          <span>
            Autorizo guardar mis datos y los de mi finca <strong>en este equipo</strong> para llevar mi cuaderno de campo y calcular mis reportes. Puedo descargarlos o borrarlos cuando quiera.{" "}
            <Link to="/privacidad" className="font-bold underline" target="_blank">
              Cómo se tratan mis datos
            </Link>
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-md bg-cereza-tenue px-4 py-3 font-bold text-cereza-honda">
            {error}
          </p>
        )}
        <button type="submit" className="boton-primario text-lg" disabled={enviando || !acepta || Boolean(problemaClave) || noCoinciden}>
          <UserPlus className="h-5 w-5" aria-hidden="true" /> {enviando ? "Creando…" : "Crear mi cuaderno"}
        </button>
        <p className="text-center text-grafito">
          ¿Ya tienes cuaderno?{" "}
          <Link to="/acceso" className="font-bold text-cereza underline decoration-2 underline-offset-2">
            Entra
          </Link>
        </p>
      </form>
    </PlantillaPublica>
  );
}
