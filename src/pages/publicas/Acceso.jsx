import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LogIn, Sprout, ShieldCheck } from "lucide-react";
import PlantillaPublica from "@/plantillas/PlantillaPublica";
import Campo from "@/components/ui/Campo";
import { iniciarSesion, ROLES, useSesion } from "@/utilidades/autenticacion";

const DEMO = [
  { correo: "caficultor@coffeevision.test", texto: "Finca de ejemplo (caficultora)", Icono: Sprout },
  { correo: "admin@coffeevision.test", texto: "Administrador", Icono: ShieldCheck },
];
const CLAVE_DEMO = "Cafetal2026";

export default function Acceso() {
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const sesion = useSesion();
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [ver, setVer] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    document.title = "Entrar · Coffee+Visión";
  }, []);

  useEffect(() => {
    if (sesion) navegar(parametros.get("siguiente") || ROLES[sesion.rol]?.inicio || "/", { replace: true });
  }, [sesion, navegar, parametros]);

  const entrar = async (datos) => {
    setEnviando(true);
    setError("");
    const resultado = await iniciarSesion(datos);
    setEnviando(false);
    if (!resultado.ok) setError(resultado.error);
  };

  return (
    <PlantillaPublica titulo="Entrar" bajada="Tu cuaderno de campo, en este celular o computador.">
      <form
        className="grid gap-5"
        onSubmit={(evento) => {
          evento.preventDefault();
          entrar({ correo, clave, recordar });
        }}
      >
        <Campo etiqueta="Correo">
          {(props) => <input {...props} type="email" autoComplete="email" required className="campo" value={correo} onChange={(evento) => setCorreo(evento.target.value)} />}
        </Campo>
        <Campo etiqueta="Contraseña" error={error || null}>
          {(props) => (
            <span className="relative block">
              <input {...props} type={ver ? "text" : "password"} autoComplete="current-password" required className="campo pr-14" value={clave} onChange={(evento) => setClave(evento.target.value)} />
              <button type="button" onClick={() => setVer((v) => !v)} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-tierra-media" aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={ver}>
                {ver ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </span>
          )}
        </Campo>
        <label className="flex min-h-12 cursor-pointer items-center gap-3">
          <input type="checkbox" className="h-5 w-5 accent-cereza" checked={recordar} onChange={(evento) => setRecordar(evento.target.checked)} />
          Mantener la sesión abierta 30 días en este equipo
        </label>
        <button type="submit" className="boton-primario text-lg" disabled={enviando}>
          <LogIn className="h-5 w-5" aria-hidden="true" /> {enviando ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <section className={`mt-8 rounded-2xl border p-4 ${parametros.get("demo") ? "border-cereza bg-cereza-tenue/50" : "border-linea bg-papel"}`}>
        <h2 className="font-bold">Probar con datos de ejemplo</h2>
        <p className="mt-1 text-sm text-tierra-media">Una finca ficticia en Timbío, Cauca, con un año de registros. Contraseña de prueba: {CLAVE_DEMO}</p>
        <div className="mt-3 grid gap-2">
          {DEMO.map(({ correo: demoCorreo, texto, Icono }) => (
            <button key={demoCorreo} type="button" className="boton-secundario justify-start" disabled={enviando} onClick={() => entrar({ correo: demoCorreo, clave: CLAVE_DEMO })}>
              <Icono className="h-5 w-5 text-cereza" aria-hidden="true" /> {texto}
            </button>
          ))}
        </div>
      </section>

      <p className="mt-6 text-center text-tierra-media">
        ¿Primera vez?{" "}
        <Link to="/registro" className="font-bold text-cereza underline decoration-2 underline-offset-2">
          Crea tu cuaderno
        </Link>
      </p>
      <p className="mt-4 text-center text-sm text-tierra-media">
        Las cuentas viven en este navegador: no es un sistema de producción. Si olvidas la contraseña, el administrador de este equipo puede asignar una nueva.
      </p>
    </PlantillaPublica>
  );
}
