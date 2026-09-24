import { useState } from "react";
import PlantillaPrincipal from "@/plantillas/PlantillaPrincipal";
import Topbar from "@/components/navegacion/Topbar";
import persona from "@/assets/imagenes/persona.jpg";
import "@/estilos/perfil.css";

const tarjetas = [
  {
    titulo: "Administrador",
    dato: "Administrador del Sistema",
    descripcion: "Usuario administrador de Coffee + Visión",
  },
];

const barras = [
  {
    alto: "100%",
    clase: "bg-[#769f1a]",
  },
];

const recomendaciones = [
  "Gestiona tu información personal",
  "Actualiza tus datos de contacto",
  "Mantén segura tu cuenta",
  "Actualiza tu foto de perfil",
];

const filtros = [
  "Información personal",
  "Seguridad",
  "Notificaciones",
  "Actividad reciente",
];

const registros = [
  {
    titulo: "Nombres",
    valor: "Administrador",
  },
  {
    titulo: "Apellidos",
    valor: "Sistema",
  },
  {
    titulo: "Correo electrónico",
    valor: "admin@coffeetech.com",
  },
  {
    titulo: "Rol",
    valor: "Administrador",
  },
  {
    titulo: "Teléfono",
    valor: "+57 300 123 4567",
  },
  {
    titulo: "Dirección",
    valor: "Calle 5 #12-45, Centro",
  },
  {
    titulo: "Municipio",
    valor: "Popayán",
  },
  {
    titulo: "Departamento",
    valor: "Cauca",
  },
];

export default function PerfilAdministrador() {
  const [fotoPerfil, setFotoPerfil] = useState(persona);

  const [formulario, setFormulario] = useState({
    nombres: "Administrador",
    apellidos: "Sistema",
    correo: "admin@coffeetech.com",
    rol: "admin",
    telefono: "+57 300 123 4567",
    direccion: "Calle 5 #12-45, Centro",
    municipio: "Popayán",
    departamento: "cauca",
  });

  const [pestanaActiva, setPestanaActiva] = useState(
    "Información personal"
  );

  const [menuActivo, setMenuActivo] = useState("Notificaciones");

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    // Solo números, + y espacios para teléfono
    if (name === "telefono") {
      nuevoValor = value.replace(/[^0-9+ ]/g, "");
    }

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
      alert("¡Todos los campos de esta sección son obligatorios!");
      return;
    }

    alert("¡Información actualizada con éxito!");
  };

  const cancelarCambios = () => {
    setFormulario({
      nombres: "Administrador",
      apellidos: "Sistema",
      correo: "admin@coffeetech.com",
      rol: "admin",
      telefono: "+57 300 123 4567",
      direccion: "Calle 5 #12-45, Centro",
      municipio: "Popayán",
      departamento: "cauca",
    });

    setErrores({});
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = (evento) => {
      setFotoPerfil(evento.target.result);
    };

    lector.readAsDataURL(archivo);
  };

  const eliminarFoto = () => {
    setFotoPerfil(persona);
  };

  const nombreCompleto =
    `${formulario.nombres} ${formulario.apellidos}`.trim();

  return (
    <PlantillaPrincipal role="administrador">
      <Topbar
        admin
        eyebrow="Cuenta de administrador"
        title="Mi perfil"
      />

      <main className="main-content">
        {/* CONTENIDO DEL PERFIL */}
        <section className="profile-grid">

          {/* TARJETA RESUMEN */}
          <article className="card profile-summary">

            <figure className="summary-logo">
              <img
                src={fotoPerfil}
                alt="Foto de perfil de administrador"
              />
            </figure>

            <h3>{nombreCompleto}</h3>

            <p className="role-tag">
              Administrador del Sistema
            </p>

            <address className="contact-info">
              <ul>

                <li>
                  <span className="icon"></span>
                  admin@coffeetech.com
                </li>

                <li>
                  <span className="icon"></span>
                  +57 300 123 4567
                </li>

                <li>
                  <span className="icon"></span>
                  Popayán, Cauca, Colombia
                </li>

              </ul>
            </address>

            <footer className="member-since">
              <time dateTime="2024-01-15">
                <span className="icon"></span>
                Miembro desde: 15/01/2024
              </time>
            </footer>

          </article>

          {/* FORMULARIO */}
          <form
            className="card profile-form"
            onSubmit={guardarCambios}
          >

            {/* PESTAÑAS */}
            <nav className="form-tabs">
              <ul>

                {filtros.map((filtro) => (
                  <li key={filtro}>

                    <a
                      href="#"
                      className={
                        pestanaActiva === filtro
                          ? "active-tab"
                          : ""
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setPestanaActiva(filtro);
                      }}
                    >
                      {filtro}
                    </a>

                  </li>
                ))}

              </ul>
            </nav>

            {/* INFORMACIÓN PERSONAL */}
            {pestanaActiva === "Información personal" && (
              <>

                <fieldset className="form-grid">

                  <legend className="visually-hidden">
                    Datos Personales
                  </legend>

                  {/* NOMBRES */}
                  <p>
                    <label htmlFor="nombres">
                      Nombres
                    </label>

                    <input
                      type="text"
                      id="nombres"
                      name="nombres"
                      value={formulario.nombres}
                      onChange={handleChange}
                      style={{
                        borderColor: errores.nombres
                          ? "#e53e3e"
                          : undefined,
                      }}
                    />
                  </p>

                  {/* APELLIDOS */}
                  <p>
                    <label htmlFor="apellidos">
                      Apellidos
                    </label>

                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formulario.apellidos}
                      onChange={handleChange}
                      style={{
                        borderColor: errores.apellidos
                          ? "#e53e3e"
                          : undefined,
                      }}
                    />
                  </p>

                  {/* CORREO */}
                  <p>
                    <label htmlFor="correo">
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={formulario.correo}
                      onChange={handleChange}
                      style={{
                        borderColor: errores.correo
                          ? "#e53e3e"
                          : undefined,
                      }}
                    />
                  </p>

                  {/* ROL */}
                  <p className="select-wrapper">
                    <label htmlFor="rol">
                      Rol
                    </label>

                    <select
                      id="rol"
                      name="rol"
                      value={formulario.rol}
                      onChange={handleChange}
                    >
                      <option value="admin">
                        Administrador
                      </option>

                      <option value="editor">
                        Editor
                      </option>
                    </select>
                  </p>

                  {/* TELÉFONO */}
                  <p>
                    <label htmlFor="telefono">
                      Teléfono
                    </label>

                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formulario.telefono}
                      onChange={handleChange}
                      style={{
                        borderColor: errores.telefono
                          ? "#e53e3e"
                          : undefined,
                      }}
                    />
                  </p>

                  {/* DIRECCIÓN */}
                  <p>
                    <label htmlFor="direccion">
                      Dirección
                    </label>

                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formulario.direccion}
                      onChange={handleChange}
                      style={{
                        borderColor: errores.direccion
                          ? "#e53e3e"
                          : undefined,
                      }}
                    />
                  </p>

                  {/* MUNICIPIO */}
                  <p>
                    <label htmlFor="municipio">
                      Municipio
                    </label>

                    <input
                      type="text"
                      id="municipio"
                      name="municipio"
                      value={formulario.municipio}
                      onChange={handleChange}
                      style={{
                        borderColor: errores.municipio
                          ? "#e53e3e"
                          : undefined,
                      }}
                    />
                  </p>

                  {/* DEPARTAMENTO */}
                  <p className="select-wrapper">
                    <label htmlFor="departamento">
                      Departamento
                    </label>

                    <select
                      id="departamento"
                      name="departamento"
                      value={formulario.departamento}
                      onChange={handleChange}
                    >
                      <option value="cauca">
                        Cauca
                      </option>

                      <option value="valle">
                        Valle del Cauca
                      </option>
                    </select>
                  </p>

                </fieldset>

                {/* BOTONES */}
                <footer className="form-actions">

                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={cancelarCambios}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="btn-save"
                  >
                    <svg
                      className="save-icon"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                    >
                      <path
                        fill="currentColor"
                        d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
                      />
                    </svg>

                    Guardar cambios
                  </button>

                </footer>

              </>
            )}

            {/* SEGURIDAD */}
            {pestanaActiva === "Seguridad" && (
              <section className="tab-pane active-pane">
                <p>
                  Configuración de seguridad de la cuenta.
                </p>
              </section>
            )}

            {/* NOTIFICACIONES */}
            {pestanaActiva === "Notificaciones" && (
              <section className="tab-pane active-pane">
                <p>
                  Configuración de notificaciones de la cuenta.
                </p>
              </section>
            )}

            {/* ACTIVIDAD RECIENTE */}
            {pestanaActiva === "Actividad reciente" && (
              <section className="tab-pane active-pane">
                <p>
                  Actividad reciente de la cuenta.
                </p>
              </section>
            )}

          </form>

          {/* CAMBIAR FOTO */}
          <article className="card profile-photo-upload">

            <h3>
              Cambiar foto de perfil
            </h3>

            <p className="upload-instructions">
              Formatos permitidos: JPG, PNG, WEBP.
              Máx. 5 MB.
            </p>

            <figure className="avatar-large">
              <img
                src={fotoPerfil}
                alt="Foto de perfil del administrador"
              />
            </figure>

            <footer className="photo-actions">

              {/* SELECCIONAR IMAGEN */}
              <label className="btn-upload">

                <input
                  type="file"
                  accept="image/*"
                  className="visually-hidden"
                  onChange={seleccionarImagen}
                />

                <span>
                  ↑ Seleccionar imagen
                </span>

              </label>

              {/* ELIMINAR FOTO */}
              <button
                type="button"
                className="btn-delete"
                onClick={eliminarFoto}
              >
                Eliminar foto
              </button>

            </footer>

          </article>

        </section>

      </main>
    </PlantillaPrincipal>
  );
}
