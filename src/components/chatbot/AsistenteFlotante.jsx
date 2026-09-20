import { useState } from "react";
import StatusBadge from "@/components/comunes/StatusBadge";

const MENSAJES_INICIALES = [
  {
    autor: "bot",
    texto:
      "Hola. Puedes preguntarme sobre plagas, enfermedades, fertilizacion, cosecha o buenas practicas del cafe.",
  },
  { autor: "user", texto: "Mis hojas tienen manchas amarillas. Que debo revisar?" },
  {
    autor: "bot",
    texto:
      "Podria estar relacionado con roya o deficiencias nutricionales. Sube una foto clara de la hoja para apoyar el analisis.",
  },
];


function AsistenteFlotante() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState(MENSAJES_INICIALES);
  const [consulta, setConsulta] = useState("");

  const enviarConsulta = (e) => {
    e.preventDefault();
    if (!consulta.trim()) return;
    setMensajes((prev) => [...prev, { autor: "user", texto: consulta }]);
    setConsulta("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir asistente IA"
        className="fixed bottom-7 right-7 z-30 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-green to-green-deep text-2xl text-white shadow-hero transition-transform hover:-translate-y-0.5"
      >
        <i className="fa-solid fa-robot"></i>
      </button>

      {abierto && (
        <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm" onClick={() => setAbierto(false)}>
          <article
            className="absolute bottom-24 right-6 w-[min(760px,calc(100vw-32px))] max-h-[calc(100vh-40px)] overflow-y-auto rounded-lg border border-line bg-white p-5 shadow-hero"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar asistente IA"
                className="grid h-9 w-9 place-items-center rounded-lg bg-green-soft text-coffee hover:text-green-deep"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </header>

            <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <section>
                <header className="mb-3.5 flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Asistente inteligente</p>
                    <h3>Chatbot agricola Coffee+vision</h3>
                  </div>
                  <StatusBadge tipo="ok">Prototipo</StatusBadge>
                </header>

                <section className="grid min-h-[260px] gap-3 rounded-lg border border-line bg-[#fbfaf7] p-3">
                  {mensajes.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[85%] rounded-lg p-3 text-sm ${
                        m.autor === "bot"
                          ? "self-start bg-green-soft text-ink"
                          : "self-end bg-coffee text-white"
                      }`}
                    >
                      <strong className="mb-1 block text-xs uppercase opacity-70">
                        {m.autor === "bot" ? "Asistente IA" : "Caficultor"}
                      </strong>
                      <p>{m.texto}</p>
                    </div>
                  ))}
                </section>

                <form onSubmit={enviarConsulta} className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2">
                  <input
                    type="text"
                    value={consulta}
                    onChange={(e) => setConsulta(e.target.value)}
                    placeholder="Escribe tu consulta sobre el cultivo..."
                    className="min-h-[46px] rounded-lg border border-line px-3 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/20"
                  />
                  <label className="grid min-h-[46px] w-11 cursor-pointer place-items-center rounded-lg border border-line text-coffee">
                    <i className="fa-solid fa-paperclip"></i>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-green px-4 font-extrabold text-white"
                  >
                    <i className="fa-solid fa-paper-plane"></i> Enviar
                  </button>
                </form>
              </section>

              <section>
                <header className="mb-3.5">
                  <p className="eyebrow">Vision artificial</p>
                  <h3>Deteccion de plagas por foto</h3>
                </header>

                <label className="grid min-h-[220px] cursor-pointer place-items-center gap-2.5 rounded-lg border-2 border-dashed border-green/45 bg-green-soft p-5 text-center text-coffee">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl text-green"></i>
                  <strong>Sube una imagen del cultivo</strong>
                  <span className="text-muted">Hojas, frutos, tallos o ramas en JPG, PNG o WEBP</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>

                <section className="mt-4 rounded-lg border border-[#f5dfac] bg-[#fff8e8] p-4">
                  <p className="eyebrow">Resultado simulado</p>
                  <h3>Posible broca del cafe</h3>
                  <p className="mt-1.5 leading-relaxed text-muted">
                    Nivel de riesgo: medio. Se recomienda revisar frutos afectados y registrar el lote para
                    seguimiento.
                  </p>
                </section>
              </section>
            </section>
          </article>
        </div>
      )}
    </>
  );
}

export default AsistenteFlotante;
