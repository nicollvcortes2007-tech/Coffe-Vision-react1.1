
import Sidebar from "@/components/navegacion/Sidebar";

function PlantillaPrincipal({ role = "caficultor", children }) {
  return (
    <div
      className="flex min-h-screen w-full"
      style={{
        backgroundColor: "#f7f8f2",
      }}
    >
      <Sidebar role={role} />

      <main
        className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8"
        style={{
          maxWidth: "none",
          overflowX: "hidden",
          backgroundColor: "#f7f8f2",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default PlantillaPrincipal;
