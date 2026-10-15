
import { useState } from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";
import persona from "@/assets/imagenes/persona.jpg";

const filtros = [
  "Información personal",
  "Seguridad",
  "Notificaciones",
  "Actividad reciente",
];

const formularioInicial = {
  nombres: "Administrador",
  apellidos: "Sistema",
  correo: "admin@coffeetech.com",
  rol: "admin",
  telefono: "+57 300 123 4567",
  direccion: "Calle 5 #12-45, Centro",
  municipio: "Popayán",
  departamento: "cauca",
};

export default function PerfilAdministrador() {
  const [fotoPerfil, setFotoPerfil] = useState(persona);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [pestanaActiva, setPestanaActiva] = useState(
    "Información personal"
  );
  const [errores, setErrores] = useState({});

  const nombreCompleto =
    `${formulario.nombres} ${formulario.apellidos}`.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;

    const nuevoValor =
      name === "telefono"
        ? value.replace(/[^0-9+ ]/g, "")
        : value;

    setFormulario((prev) => ({
      ...prev,
      [name]: nuevoValor,
    }));

    if (nuevoValor.trim() !== "") {
      setErrores((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const guardarCambios = (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    Object.entries(formulario).forEach(([campo, valor]) => {
      if (typeof valor === "string" && valor.trim() === "") {
        nuevosErrores[campo] = true;
      }
    });

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      alert("¡Todos los campos son obligatorios!");
      return;
    }

    alert("¡Información actualizada con éxito!");
  };

  const cancelarCambios = () => {
    setFormulario({ ...formularioInicial });
    setErrores({});
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(archivo.type)) {
      alert("Selecciona una imagen JPG, PNG o WEBP.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }

    const lector = new FileReader();

    lector.onload = (evento) => {
      setFotoPerfil(evento.target.result);
    };

    lector.readAsDataURL(archivo);
    e.target.value = "";
  };

  const eliminarFoto = () => {
    setFotoPerfil(persona);
  };

  const campoClase = (campo) =>
    `w-full min-w-0 rounded-lg border ${
      errores[campo] ? "border-red-500" : "border-line"
    } bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-green focus:ring-2 focus:ring-green/20`;

  return (
    <PlantillaPrincipal>
      <Topbar />

      <main className="box-border min-w-0 w-full flex-1 bg-page p-4 sm:p-5 lg:p-6">
        <div className="mx-auto w-full max-w-[1600px] space-y-4">

          {/* TÍTULO DEL PERFIL */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-ink">
                Mi perfil
              </h2>

              <p className="mt-1 text-sm text-muted">
                Gestiona tu información personal y configuración de la cuenta.
              </p>
            </div>
          </div>

          {/* TRES COLUMNAS ALINEADAS Y BALANCEADAS EN ALTURA */}
          <section className="grid min-w-0 grid-cols-1 items-stretch gap-5 xl:grid-cols-[280px_minmax(0,1fr)_300px]">

            {/* COLUMNA IZQUIERDA: PERFIL Y FOTO */}
            <article className="flex flex-col justify-between h-full min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
              <div>
                <div className="flex flex-col items-center border-b border-line p-4">
                  <img
                    src={fotoPerfil}
                    alt="Foto del administrador"
                    className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                  />

                  <h3 className="mt-2 text-center text-sm font-bold text-coffee">
                    {nombreCompleto}
                  </h3>

                  <p className="mt-2 rounded-full bg-green-soft px-3 py-1 text-center text-xs font-semibold text-green-deep">
                    Administrador del Sistema
                  </p>

                  <p className="mt-2 break-all text-center text-xs text-muted">
                    {formulario.correo}
                  </p>
                </div>

                {/* CAMBIAR FOTO */}
                <div className="space-y-2 border-b border-line p-4">
                  <h3 className="text-sm font-bold text-ink">
                    Foto del administrador
                  </h3>

                  <p className="text-xs leading-relaxed text-muted">
                    Formatos JPG, PNG y WEBP. Máximo 5 MB.
                  </p>

                  <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-green px-2 py-2 text-center text-xs font-semibold text-white transition hover:bg-green-deep">
                    ↑ Seleccionar imagen
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={seleccionarImagen}
                    />
                  </label>

                  <button
                    type="button"
                    className="w-full rounded-lg border border-line px-2 py-2 text-xs font-semibold text-danger transition hover:bg-red-50"
                    onClick={eliminarFoto}
                  >
                    Eliminar foto
                  </button>
                </div>
              </div>

              {/* CONTACTO */}
              <div className="space-y-2.5 p-4 bg-page/30">
                <div className="flex items-start gap-2 text-xs text-muted">
                  <span>📞</span>
                  <span className="break-words">
                    {formulario.telefono}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-muted">
                  <span>📍</span>
                  <span>
                    {formulario.municipio},{" "}
                    {formulario.departamento === "cauca"
                      ? "Cauca"
                      : "Valle del Cauca"}, Colombia
                  </span>
                </div>

                <div className="border-t border-line pt-2.5 text-xs text-muted">
                  📅 Miembro desde: 15/01/2024
                </div>
              </div>
            </article>

            {/* COLUMNA CENTRAL: FORMULARIO */}
            <div className="flex flex-col h-full min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
              <form onSubmit={guardarCambios} className="flex h-full flex-col justify-between">

                <div>
                  {/* PESTAÑAS */}
                  <nav className="border-b border-line bg-white px-3 sm:px-4">
                    <ul className="flex flex-wrap gap-x-1">
                      {filtros.map((filtro) => (
                        <li key={filtro}>
                          <button
                            type="button"
                            className={`border-b-2 px-3 py-3 text-xs font-medium transition-colors sm:text-sm ${
                              pestanaActiva === filtro
                                ? "border-green text-green-deep font-semibold"
                                : "border-transparent text-muted hover:text-ink"
                            }`}
                            onClick={() => setPestanaActiva(filtro)}
                          >
                            {filtro}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {/* INFORMACIÓN PERSONAL */}
                  {pestanaActiva === "Información personal" && (
                    <fieldset className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-4 p-4 sm:grid-cols-2 sm:p-5">
                      <legend className="sr-only">
                        Datos personales
                      </legend>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="nombres" className="block text-sm font-semibold text-ink">
                          Nombres
                        </label>
                        <input
                          className={campoClase("nombres")}
                          id="nombres"
                          name="nombres"
                          type="text"
                          value={formulario.nombres}
                          onChange={handleChange}
                          aria-invalid={Boolean(errores.nombres)}
                        />
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="apellidos" className="block text-sm font-semibold text-ink">
                          Apellidos
                        </label>
                        <input
                          className={campoClase("apellidos")}
                          id="apellidos"
                          name="apellidos"
                          type="text"
                          value={formulario.apellidos}
                          onChange={handleChange}
                          aria-invalid={Boolean(errores.apellidos)}
                        />
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="correo" className="block text-sm font-semibold text-ink">
                          Correo electrónico
                        </label>
                        <input
                          className={campoClase("correo")}
                          id="correo"
                          name="correo"
                          type="email"
                          value={formulario.correo}
                          onChange={handleChange}
                          aria-invalid={Boolean(errores.correo)}
                        />
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="rol" className="block text-sm font-semibold text-ink">
                          Rol
                        </label>
                        <select
                          className={campoClase("rol")}
                          id="rol"
                          name="rol"
                          value={formulario.rol}
                          onChange={handleChange}
                        >
                          <option value="admin">Administrador</option>
                          <option value="editor">Editor</option>
                        </select>
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="telefono" className="block text-sm font-semibold text-ink">
                          Teléfono
                        </label>
                        <input
                          className={campoClase("telefono")}
                          id="telefono"
                          name="telefono"
                          type="tel"
                          value={formulario.telefono}
                          onChange={handleChange}
                          aria-invalid={Boolean(errores.telefono)}
                        />
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="direccion" className="block text-sm font-semibold text-ink">
                          Dirección
                        </label>
                        <input
                          className={campoClase("direccion")}
                          id="direccion"
                          name="direccion"
                          type="text"
                          value={formulario.direccion}
                          onChange={handleChange}
                          aria-invalid={Boolean(errores.direccion)}
                        />
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="municipio" className="block text-sm font-semibold text-ink">
                          Municipio
                        </label>
                        <input
                          className={campoClase("municipio")}
                          id="municipio"
                          name="municipio"
                          type="text"
                          value={formulario.municipio}
                          onChange={handleChange}
                          aria-invalid={Boolean(errores.municipio)}
                        />
                      </div>

                      <div className="min-w-0 space-y-1.5">
                        <label htmlFor="departamento" className="block text-sm font-semibold text-ink">
                          Departamento
                        </label>
                        <select
                          className={campoClase("departamento")}
                          id="departamento"
                          name="departamento"
                          value={formulario.departamento}
                          onChange={handleChange}
                        >
                          <option value="cauca">Cauca</option>
                          <option value="valle">Valle del Cauca</option>
                        </select>
                      </div>
                    </fieldset>
                  )}

                  {pestanaActiva === "Seguridad" && (
                    <section className="p-5">
                      <h3 className="font-semibold text-ink">
                        Seguridad de la cuenta
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Administra la seguridad y protección de tu cuenta.
                      </p>
                      <div className="mt-4 rounded-lg border border-line p-4">
                        <p className="text-sm font-semibold text-ink">
                          Protección de la cuenta
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          Mantén tus datos de acceso seguros y actualizados.
                        </p>
                      </div>
                    </section>
                  )}

                  {pestanaActiva === "Notificaciones" && (
                    <section className="p-5">
                      <h3 className="font-semibold text-ink">
                        Notificaciones
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Configuración de las notificaciones de la cuenta.
                      </p>
                      <div className="mt-4 rounded-lg border border-line p-4">
                        <p className="text-sm font-semibold text-ink">
                          Alertas del sistema
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          Consulta las novedades y mantente al tanto de la actividad de la plataforma.
                        </p>
                      </div>
                    </section>
                  )}

                  {pestanaActiva === "Actividad reciente" && (
                    <section className="p-5">
                      <h3 className="font-semibold text-ink">
                        Actividad reciente
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Consulta la información general de la actividad de tu cuenta.
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-lg border border-line p-3">
                          <p className="text-sm font-semibold text-ink">
                            Perfil consultado
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            Información del administrador.
                          </p>
                        </div>
                        <div className="rounded-lg border border-line p-3">
                          <p className="text-sm font-semibold text-ink">
                            Cuenta activa
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            El perfil está disponible para su administración.
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                <footer className="flex flex-wrap justify-end gap-3 border-t border-line bg-page/60 p-4">
                  <button
                    type="button"
                    className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-page"
                    onClick={cancelarCambios}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-green px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-deep"
                  >
                    ✓ Guardar cambios
                  </button>
                </footer>
              </form>
            </div>

            {/* COLUMNA DERECHA: RESUMEN */}
            <aside className="flex flex-col h-full min-w-0">
              <article className="flex flex-col justify-between h-full rounded-xl border border-line bg-surface p-4 shadow-panel">
                <div>
                  <div className="flex items-center gap-3 border-b border-line pb-3">
                    <img
                      src={fotoPerfil}
                      alt="Foto del administrador"
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-ink">
                        Administrador
                      </h3>
                      <p className="text-xs text-green-deep">
                        Administrador del Sistema
                      </p>
                    </div>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-ink">
                    Resumen de la cuenta
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Información general del perfil administrador de Coffee + Visión.
                  </p>

                  <div className="mt-3 space-y-2.5">
                    <div>
                      <p className="text-[11px] text-muted">Nombre completo</p>
                      <p className="text-xs font-semibold text-ink">
                        {nombreCompleto}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-muted">Correo electrónico</p>
                      <p className="text-xs font-semibold text-ink break-all">
                        {formulario.correo}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-muted">Rol asignado</p>
                      <p className="text-xs font-semibold text-green-deep">
                        {formulario.rol === "admin" ? "Administrador" : "Editor"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-muted">Teléfono de contacto</p>
                      <p className="text-xs font-semibold text-ink">
                        {formulario.telefono}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-muted">Dirección</p>
                      <p className="text-xs font-semibold text-ink">
                        {formulario.direccion}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-muted">Ubicación</p>
                      <p className="text-xs font-semibold text-ink">
                        {formulario.municipio},{" "}
                        {formulario.departamento === "cauca"
                          ? "Cauca"
                          : "Valle del Cauca"}, Colombia
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-line mt-3">
                  <div>
                    <h4 className="text-sm font-bold text-ink">
                      Estado de la cuenta
                    </h4>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                      <span className="h-2 w-2 rounded-full bg-green" />
                      Cuenta activa
                    </p>
                    <p className="text-xs text-muted">
                      Miembro desde: 15/01/2024
                    </p>
                  </div>

                  <div className="border-t border-line pt-2">
                    <h4 className="text-sm font-bold text-ink">
                      Recomendaciones
                    </h4>
                    <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-muted">
                      <li>✓ Mantén actualizados tus datos.</li>
                      <li>✓ Utiliza un correo válido.</li>
                    </ul>
                  </div>
                </div>
              </article>
            </aside>
          </section>
        </div>
      </main>
    </PlantillaPrincipal>
  );
}
