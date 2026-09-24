import PlantillaPrincipal from '@/plantillas/PlantillaPrincipal';
import Topbar from '@/components/navegacion/Topbar';
import AsistenteFlotante from '@/components/chatbot/AsistenteFlotante';


//Iconos de la sidebar
import logo from '@/assets/imagenes/logo2.png';
import caficultor from '@/assets/imagenes/caficultor.jpg';
import avatar from '@/assets/imagenes/image.png';
import chatIA from '@/assets/iconos/chatIA.png';
import plagas from '@/assets/iconos/plagas.png';
import cosecha from '@/assets/iconos/cosecha.png';
import galeria from '@/assets/iconos/galeria.png';
import favorito from '@/assets/iconos/favorito.png';
import historia from '@/assets/iconos/historia.png';
import notificaciones from '@/assets/iconos/notificaciones.png';
import ayuda from '@/assets/iconos/ayuda.png';
import ajustes from '@/assets/iconos/ajuste.png';

const secciones = [
    {
        titulo: "Asistencia IA",
        items: [
            { img: chatIA, label: "Chat IA" },
            { img: plagas, label: "Detectar Plagas" },
            { img: cosecha, label: "Predicción de cosecha" },
        ],
    },

    {
        titulo: "Contenido",
        items: [
            { img: galeria, label: "Galeria IA" },
            { img: favorito, label: "Favoritos" },
            { img: historia, label: "Historial" },
        ],
    },

    {
        titulo: "Cuenta Cafi",
        items: [
            { img: notificaciones, label: "Notificaciones" },
            { img: ayuda, label: "Ayuda" },
            { img: ajustes, label: "Ajustes" },
        ],
    },
]

function ChatBot() {
    return (
        <PlantillaPrincipal role="caficultor">
            <Topbar
                eyebrow="Asistente IA"
                title="Chatbot de asistencia"
                notiflo="/notificaciones"
                perfilto="/perfil"
                caficultor={caficultor}
                nombre="Caficultor"
                rol="Finca El Paraiso"
            />


            {/* Nav */}
            <aside className="w-[280px] flex-none rounded-lg border border-line bg-white p-5">
                <header className="mb-4 flex items-center justify-center">
                    <img src={logo} alt="Coffee+visión" className="h-[60px] w-auto object-contain" />
                </header>

                {secciones.map((seccion) => (
                    <section key={seccion.titulo} className="mb-3">
                        <h4 className="mb-2 text-xs font-bold uppercase text-muted">{seccion.titulo}</h4>
                        <ul className="grid gap-2">
                            {seccion.items.map((item) => (
                                <li
                                    key={item.label}
                                    className="group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[20px] font-semibold text-[#4e2a15] hover:text-[#3f9318]"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.label}
                                        className="h-5 w-5 object-contain transition duration-300 group-hover:brightness-0 group-hover:contrast-200 group-hover:saturate-200 group-hover:scale-110"
                                    />
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}

                <footer className="mt-4 border-t border-line pt-3">
                    <section className="flex items-center gap-2.5">
                        <img src={avatar} alt="Jorge Martinez" className="h-9 w-9 rounded-full object-cover" />
                        <section>
                            <strong className="block text-sm text-coffee">Jorge Martinez</strong>
                            <small className="text-xs text-muted">jorgemartinez@gmail.com</small>
                        </section>
                    </section>
                </footer>
            </aside>




            {/* Chat */}
            <section className="grid gap-4">
                <section className="rounded-lg border border-line bg-white p-6">
                    <h2 className="text-xl font-bold text-coffee">Asistente inteligente</h2>
                    <p className="mt-2 text-muted">
                        Consulta dudas sobre plagas, fertilización, cosecha y buenas prácticas cafeteras.
                    </p>
                </section>
                <AsistenteFlotante />
            </section>
        </PlantillaPrincipal>
    );
}

export default ChatBot;
