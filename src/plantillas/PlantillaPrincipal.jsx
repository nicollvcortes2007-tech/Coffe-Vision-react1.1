import Sidebar from "@/components/navegacion/Sidebar";

/**
 * Plantilla principal de las páginas internas.
 * Conserva el menú lateral y el fondo general.
 */
function PlantillaPrincipal({ role = "caficultor", children }) {
  return (
    <div className="flex min-h-screen w-full bg-page">
      <Sidebar role={role} />

      <div className="flex-1 min-w-0 flex flex-col bg-page">
        {children}
      </div>
    </div>
  );
}

export default PlantillaPrincipal;