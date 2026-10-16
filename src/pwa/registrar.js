/*
  Registra el service worker solo en producción. Cuando hay una versión nueva, avisa
  con el evento «cv-version-nueva»; la app ofrece actualizar cuando la persona quiera.
*/
let registrado = false;

export function registrarTrabajador() {
  if (registrado || !import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  registrado = true;
  let recargando = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (recargando) return;
    recargando = true;
    window.location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registro) => {
        const avisar = (trabajador) => window.dispatchEvent(new CustomEvent("cv-version-nueva", { detail: trabajador }));
        if (registro.waiting && navigator.serviceWorker.controller) avisar(registro.waiting);
        registro.addEventListener("updatefound", () => {
          const nuevo = registro.installing;
          nuevo?.addEventListener("statechange", () => {
            if (nuevo.state === "installed" && navigator.serviceWorker.controller) avisar(nuevo);
          });
        });
      })
      .catch((error) => console.warn("No se pudo activar el modo sin conexión", error));
  });
}

export function activarVersion(trabajador) {
  trabajador?.postMessage({ tipo: "ACTIVAR_VERSION" });
}
