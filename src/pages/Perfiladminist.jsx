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
    <PlantillaPrincipal role="administrador">
      <Topbar
        admin
        eyebrow="Cuenta de administrador"
        title="Mi perfil"
      />

      <main className="box-border min-w-0 w-full flex-1 bg-page p-4 sm:p-5 lg:p-6">
        <section className="mx-auto w-full max-w-[1600px] space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <hgroup>

              <p className="mt-1 text-sm text-muted">
                Gestiona tu información personal y configuración de la cuenta.
              </p>
            </hgroup>
          </header>

          <section className="admin-profile-grid grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
            {/* TARJETA IZQUIERDA: FOTO Y DATOS RÁPIDOS */}
            <article className="flex flex-col justify-between h-full min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
              <header>
                <figure className="flex flex-col items-center border-b border-line p-4 m-0">
                  <img
                    src={fotoPerfil}
                    alt="Foto del administrador"
                    className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                  />

                  <figcaption className="mt-2 text-center text-sm font-bold text-coffee">
                    {nombreCompleto}
                  </figcaption>

                  <p className="mt-2 rounded-full bg-green-soft px-3 py-1 text-center text-xs font-semibold text-green-deep">
                    Administrador del Sistema
                  </p>

                  <p className="mt-2 break-all text-center text-xs text-muted">
                    {formulario.correo}
                  </p>
                </figure>

                <fieldset className="space-y-2 border-b border-line p-4 border-0 m-0">
                  <legend className="text-sm font-bold text-ink float-left w-full mb-1">
                    Foto del administrador
                  </legend>

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
                </fieldset>
              </header>

              <footer className="space-y-2.5 p-4 bg-page/30">
                <p className="flex items-start gap-2 text-xs text-muted m-0">
                  <span>📞</span>
                  <span className="break-words">
                    {formulario.telefono}
                  </span>
                </p>

                <p className="flex items-start gap-2 text-xs text-muted m-0">
                  <span>📍</span>
                  <span>
                    {formulario.municipio},{" "}
                    {formulario.departamento === "cauca"
                      ? "Cauca"
                      : "Valle del Cauca"}, Colombia
                  </span>
                </p>

                <time className="block border-t border-line pt-2.5 text-xs text-muted">
                  📅 Miembro desde: 15/01/2024
                </time>
              </footer>
            </article>

            {/* SECCIÓN CENTRAL: FORMULARIO */}
            <section className="admin-profile-editor min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-panel">
              <header className="border-b border-line bg-white px-5 py-4">
                <p className="eyebrow">Configuración de cuenta</p>
                <h2 className="mt-1 text-lg font-bold text-coffee">Datos y preferencias</h2>
                <p className="mt-1 text-sm text-muted">Actualiza tu información y administra las opciones de tu cuenta.</p>
              </header>
              <form onSubmit={guardarCambios}>
                <fieldset className="border-0 p-0 m-0">
                  <legend className="sr-only">Formulario de edición de perfil</legend>

                  <nav className="border-b border-line bg-white px-3 sm:px-4">
                    <ul className="flex flex-wrap gap-x-1 list-none p-0 m-0">
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

                  {pestanaActiva === "Información personal" && (
                    <fieldset className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-4 p-4 sm:grid-cols-2 sm:p-5 border-0 m-0">
                      <legend className="sr-only">
                        Datos personales
                      </legend>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>

                      <p className="min-w-0 space-y-1.5 m-0">
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
                      </p>
                    </fieldset>
                  )}

                  {pestanaActiva === "Seguridad" && (
                    <article className="p-5">
                      <h3 className="font-semibold text-ink">
                        Seguridad de la cuenta
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Administra la seguridad y protección de tu cuenta.
                      </p>
                      <article className="mt-4 rounded-lg border border-line p-4">
                        <h4 className="text-sm font-semibold text-ink">
                          Protección de la cuenta
                        </h4>
                        <p className="mt-1 text-sm text-muted">
                          Mantén tus datos de acceso seguros y actualizados.
                        </p>
                      </article>
                    </article>
                  )}

                  {pestanaActiva === "Notificaciones" && (
                    <article className="p-5">
                      <h3 className="font-semibold text-ink">
                        Notificaciones
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Configuración de las notificaciones de la cuenta.
                      </p>
                      <article className="mt-4 rounded-lg border border-line p-4">
                        <h4 className="text-sm font-semibold text-ink">
                          Alertas del sistema
                        </h4>
                        <p className="mt-1 text-sm text-muted">
                          Consulta las novedades y mantente al tanto de la actividad de la plataforma.
                        </p>
                      </article>
                    </article>
                  )}

                  {pestanaActiva === "Actividad reciente" && (
                    <article className="p-5">
                      <h3 className="font-semibold text-ink">
                        Actividad reciente
                      </h3>
                      <p className="mt-2 text-sm text-muted">
                        Consulta la información general de la actividad de tu cuenta.
                      </p>
                      <section className="mt-4 space-y-3">
                        <article className="rounded-lg border border-line p-3">
                          <h4 className="text-sm font-semibold text-ink">
                            Perfil consultado
                          </h4>
                          <p className="mt-1 text-xs text-muted">
                            Información del administrador.
                          </p>
                        </article>
                        <article className="rounded-lg border border-line p-3">
                          <h4 className="text-sm font-semibold text-ink">
                            Cuenta activa
                          </h4>
                          <p className="mt-1 text-xs text-muted">
                            El perfil está disponible para su administración.
                          </p>
                        </article>
                      </section>
                    </article>
                  )}
                </fieldset>

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
            </section>
          </section>
        </section>
      </main>
    </PlantillaPrincipal>
  );
}
