import Sidebar from "@/components/navegacion/Sidebar";

/**
 * Plantilla principal de las páginas internas.
 * Conserva el menú lateral y el fondo general.
 */
function PlantillaPrincipal({ role = "caficultor", children }) {
  return (
    <div className="flex min-h-screen w-full bg-page">
      <Sidebar role={role} />

      <div className="flex min-w-0 flex-1 flex-col gap-6 bg-page p-5 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}

export default PlantillaPrincipal;
