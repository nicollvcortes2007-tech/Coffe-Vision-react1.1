
import Sidebar from "@/components/navegacion/Sidebar";

/**
 * Plantilla principal de las páginas internas.
 * Conserva el menú lateral y el fondo general.
 */
function PlantillaPrincipal({ role = "caficultor", children }) {
  return (
    <div className="flex min-h-screen w-full bg-page">
      <Sidebar role={role} />

      <main className="flex-1 min-w-0 w-full overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-page">
        {children}
      </main>
    </div>
  );
}

export default PlantillaPrincipal;
