import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';
import caficultor from '@/assets/imagenes/caficultor.jpg';


const datos_personales = [
    { id: "nombre", label: "Nombre", valor: "José Caesar" },
    { id: "apellido", label: "Apellido", valor: "Martinez Gutierrez" },
    { id: "teléfono", label: "Teléfono", valor: "3214567890" },
    { id: "municipio", label: "Municipio", valor: "Popayan" },
    { id: "gmail", label: "Gmail", valor: "josemartinez@gmail.com" },
];

const datos_finca = [
    { id: "nombrefinca", label: "Nombre Finca", valor: "La Mulata" },
    { id: "ubicacion", label: "Ubicación", valor: "Cajete" },
];

function Inicio() {
    return (
        <PlantillaPrincipal role="caficultor">
            <Topbar
                eyebrow="Bienvenido"
                title="Mi finca cafetera"
                notifTo="/notificaciones"
                perfilTo="/perfil"
                caficultor={caficultor}
                nombre="Caficultor"
                rol="Finca El Paraíso"
            />

            <main className="mx-auto w-full max-w-[800px] rounded-xl bg-white p-7 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                {/* Header */}
                <header className="mb-5.5 flex items-center justify-between text-[#601818]">
                    <h2 className="font-calibri text-2xl font-bold">Información de perfil</h2>
                </header>


                {/* Foto y nombre */}
                <section className="mb-5 flex items-center gap-3.5">
                    <img src={caficultor} alt="Foto caficultor" className="h-15 w-15 rounded-full object-cover" />
                    <h3 className="text-lg font-semibold text-[#111]">José Caesar Martinez Gutierrez</h3>
                </section>

                <hr className='mb-7 border-t border-[#eee]' />

                {/* Datos personales */}
                <section className="mb-7">
                    <h4 className="mb-5 text-lg font-semibold text-[#111]">Datos personales</h4>

                    <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {datos_personales.map((campo) => (
                            <section key={campo.id} className="flex flex-col gap-2">
                                <label htmlFor={campo.id} className="font-calibri">{campo.label}</label>
                                <input
                                    id={campo.id}
                                    type={campo.id === "gmail" ? "email" : "text"}
                                    defaultValue={campo.valor}
                                    className="rounded-lg border border-[#c5e7eb] bg-white p-3 text-sm text-[#333]"
                                />
                            </section>
                        ))}
                    </form>
                </section>

                {/* Datos Finca */}
                <section className="mt-2">
                    <h4 className="mb-5 text-lg font-semibold text-[#111]">Datos Finca</h4>

                    <form className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {datos_finca.map((campo) => (
                            <section key={campo.id} className="flex flex-col gap-2">
                                <label htmlFor={campo.id} className="font-calibri">{campo.label}</label>
                                <input
                                    id={campo.id}
                                    type="text"
                                    defaultValue={campo.valor}
                                    className="rounded-lg border border-[#c5e7eb] bg-white p-3 text-sm text-[#333]"
                                />
                            </section>
                        ))}
                    </form>
                </section>
            </main>
        </PlantillaPrincipal>
    );
}

export default Inicio