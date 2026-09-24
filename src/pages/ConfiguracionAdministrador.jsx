import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';

const pestanas = ["Datos del administrador", "Seguridad", "Métricas del chat bot"];

const datos_administrador = [
    { id: "nombres", label: "Nombres y Apellidos", tipo: "text" },
    { id: "direccion", label: "Dirección del administrador", tipo: "text" },
    { id: "correo", label: "Correo Electrónico", tipo: "email" },
    { id: "finca", label: "Nombre de la finca", tipo: "text" },
];

function ConfiguracionAdministrador() {
    return (
        <PlantillaPrincipal role="administrador">
            <Topbar
                admin
                eyebrow="Configuración"
                title="Configuración del administrador"
            />
            <main className="min-h-screen bg-[#f7f3ea] p-7 pr-10 text-[#333]">
                <h1 className="mb-5 text-[45px] font-bold text-[#7a1f1f]">Configuración</h1>
                {/* Pestañas */}
                <nav className="mb-6 flex gap-10 border-b border-[#ddd]">
                    {pestanas.map((p, i) => (
                        <article
                            key={p}
                            className={`cursor-pointer pb-3 text-xl ${i === 0 ? "border-b-3 border-[#4a9c2f] font-bold text-[#333]" : "text-[#777]"
                                }`}
                        >

                            {p}
                        </article>
                    ))}
                </nav>

                {/* Datos del administrador */}
                <section className="mt-5">
                    <h2 className="mb-1 text-[23px] font-bold text-[#7a1f1f]">Información del Administrador y Finca</h2>
                    <p className="mb-5 text-lg text-[#888]">Actualice sus datos personales y de contacto</p>
                    <form className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {datos_administrador.map((campo) => (
                            <section key={campo.id} className="flex flex-col gap-2">
                                <label htmlFor={campo.id} className="text-[22px] font-bold">
                                    {campo.label}
                                </label>
                                <input
                                    id={campo.id}
                                    type={campo.tipo}
                                    className="w-full rounded-md border border-[#ccc] p-2.5 text-base focus:border-[#4a9c2f] focus:outline-none sm:w-[80%]"
                                />
                            </section>
                        ))}
                    </form>

                    <button
                        type="submit"
                        className="mb-7 cursor-pointer rounded-md bg-[#4a7c2f] px-5.5 py-2.5 text-base text-white hover:bg-[#3d6826]"
                    >
                        Guardar
                    </button>
                </section>

                <hr className="mb-7 border-t border-[#e0dccf]" />

                {/* Cambiar Contraseña */}
                <section className="rounded-lg">
                    <h2 className="mb-1 text-[23px] font-bold text-[#7a1f1f]">Cambiar Contraseña</h2>
                    <p className="mb-5 text-lg text-[#666]"></p>
                        Actualice su contraseña periódicamente para mantener su cuenta segura.

                        <form className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                            <section className="flex flex-col gap-1.5 sm:col-span-2">
                                <label htmlFor="current-pass" className="text-lg font-bold text-[#333]">Contraseña actual *</label>
                                <input
                                    type="password"
                                    id="current-pass"
                                    placeholder="Ingrese su contraseña actual"
                                    required
                                    className="w-full rounded border border-[#ccc] bg-white p-2.5 text-lg focus:border-[#a94442] focus:outline-none"
                                />
                            </section>

                            <section className="flex flex-col gap-1.5">
                                <label htmlFor="new-pass" className="text-lg font-bold text-[#333]">Nueva contraseña *</label>
                                <input
                                    type="password"
                                    id="new-pass"
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    className="w-full rounded border border-[#ccc] bg-white p-2.5 text-lg focus:border-[#a94442] focus:outline-none"
                                />
                            </section>

                            <section className="flex flex-col gap-1.5">
                                <label htmlFor="confirm-pass" className="text-lg font-bold text-[#333]">Confirmar nueva contraseña *</label>
                                <input
                                    type="password"
                                    id="confirm-pass"
                                    placeholder="Repita la nueva contraseña"
                                    required
                                    className="w-full rounded border border-[#ccc] bg-white p-2.5 text-lg focus:border-[#a94442] focus:outline-none"
                                />
                            </section>


                            <section className="sm:col-span-2">
                                <ul className="ml-[18px] text-base text-[#777]">
                                    <li>La contraseña debe tener al menos 8 caracteres, incluir un número y una letra mayúscula.</li>
                                </ul>
                            </section>

                            <section className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="mb-7 cursor-pointer rounded bg-[#3e7b34] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#2e5c27]"
                                >
                                    Actualizar contraseña
                                </button>
                            </section>
                        </form>
                </section>

                <hr className="mb-7 border-t border-[#e0dccf]" />

                {/* Eliminación de cuenta */}
                <section className="mt-7 rounded-lg">
                    <h2 className="mb-1 text-[23px] font-bold text-[#7a1f1f]">Eliminación de cuenta</h2>
                    <p className="mb-5 text-lg text-[#666]">
                        Esta acción es irreversible y borrará los datos de la finca y el administrador. </p>

                        <form className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
                            <section className="flex flex-col gap-1.5">
                                <label htmlFor="motivo" className="text-lg font-bold text-[#333]">Motivo de cancelación (Opcional)</label>
                                <select id="motivo" className="w-full rounded border border-[#ccc] bg-white p-2.5 text-lg focus:border-[#a94442] focus:outline-none">
                                    <option value="">Seleccione un motivo</option>
                                    <option value="no-uso">Ya no utilizo el sistema</option>
                                    <option value="finca">Cambié de finca o administración</option>
                                    <option value="otro">Otro motivo</option>
                                </select>
                            </section>

                            <section className="flex flex-col gap-1.5">
                                <label htmlFor="pass-confirm" className="text-lg font-bold text-[#333]">Contraseña actual *</label>
                                <input
                                    type="password"
                                    id="pass-confirm"
                                    placeholder="Ingrese su contraseña"
                                    required
                                    className="w-full rounded border border-[#ccc] bg-white p-2.5 text-lg focus:border-[#a94442] focus:outline-none"
                                />
                            </section>

                            <section className="flex items-center gap-2.5 sm:col-span-2">
                                <input type="checkbox" id="check-riesgo" required className="cursor-pointer" />
                                <label htmlFor="check-riesgo" className="cursor-pointer text-base text-[#555]"/>
                                    Confirmo que deseo eliminar permanentemente los registros e historial de esta cuenta.

                            </section>

                            <section className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="cursor-pointer rounded bg-[#d9534f] px-5 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#c9302c]"
                                >
                                    Eliminar cuenta definitivamente
                                </button>
                            </section>
                        </form>
                </section>
            </main>
        </PlantillaPrincipal>
    );
}

export default ConfiguracionAdministrador;



