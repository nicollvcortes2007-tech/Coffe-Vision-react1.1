/* Service worker de Coffee+Visión. El plugin `trabajadorSinConexion` de vite.config.js
   reemplaza __VERSION__ y __PRECARGA__ en cada build y lo publica como /sw.js.
   Los datos ya viven en el navegador; esto guarda la aplicación para que abra completa
   en la finca aunque no haya señal. El modelo y el runtime del diagnóstico (/ia/) se
   guardan aparte la primera vez que se usan, y sobreviven a las versiones nuevas. */

/* global __VERSION__, __PRECARGA__ */
const VERSION = __VERSION__;
const PRECARGA = __PRECARGA__;
const CACHE_APP = `cv-app-${VERSION}`;
const CACHE_IA = "cv-ia-v1";
const CACHE_EXTRA = "cv-extra";
const MAXIMO_EXTRA = 60;

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE_APP).then((cache) => cache.addAll(PRECARGA)));
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((claves) =>
        Promise.all(
          claves
            .filter((clave) => (clave.startsWith("cv-app-") && clave !== CACHE_APP) || clave === CACHE_EXTRA)
            .map((clave) => caches.delete(clave)),
        ),
      ),
  );
});

// La versión nueva espera a que la persona decida actualizar: así no cambia la app
// en medio de un registro de campo.
self.addEventListener("message", (evento) => {
  if (evento.data?.tipo === "ACTIVAR_VERSION") self.skipWaiting();
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname === "/sw.js") return;
  if (request.mode === "navigate") {
    evento.respondWith(navegacion(request));
  } else if (url.pathname.startsWith("/ia/")) {
    evento.respondWith(primeroGuardado(request, CACHE_IA));
  } else {
    evento.respondWith(recurso(request));
  }
});

async function navegacion(request) {
  try {
    return await fetch(request);
  } catch {
    const cache = await caches.open(CACHE_APP);
    return (await cache.match("/index.html", { ignoreVary: true })) || (await cache.match("/", { ignoreVary: true })) || Response.error();
  }
}

async function primeroGuardado(request, nombre) {
  const cache = await caches.open(nombre);
  const guardado = await cache.match(request, { ignoreVary: true });
  if (guardado) return guardado;
  const respuesta = await fetch(request);
  if (respuesta.ok) await cache.put(request, respuesta.clone());
  return respuesta;
}

async function recurso(request) {
  const guardado = await caches.match(request, { ignoreVary: true });
  if (guardado) return guardado;
  const respuesta = await fetch(request);
  if (respuesta.ok) {
    const cache = await caches.open(CACHE_EXTRA);
    await cache.put(request, respuesta.clone());
    const claves = await cache.keys();
    await Promise.all(claves.slice(0, Math.max(0, claves.length - MAXIMO_EXTRA)).map((clave) => cache.delete(clave)));
  }
  return respuesta;
}
