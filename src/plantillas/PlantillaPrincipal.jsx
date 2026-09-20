import Sidebar from "@/components/navegacion/Sidebar";

/**
 * PLANTILLA DE ESTILO PRINCIPAL
 * -----------------------------
 * Toda pantalla interna (caficultor o administrador) se envuelve con esta
 * plantilla para que TODAS luzcan igual: mismo sidebar, mismo fondo,
 * mismo ancho de contenido. Si un módulo nuevo necesita una pantalla,
 * solo se coloca su contenido como children de este componente.
 *
 * Uso:
 *   <PlantillaPrincipal role="caficultor">
 *     ...contenido de la pagina...
 *   </PlantillaPrincipal>
 */
function PlantillaPrincipal({ role = "caficultor", children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role={role} />
      <main className="grid flex-1 gap-6 p-6 sm:p-8">{children}</main>
    </div>
  );
}

export default PlantillaPrincipal;
