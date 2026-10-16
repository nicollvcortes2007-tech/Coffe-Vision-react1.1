import { createReadStream, existsSync, mkdirSync, copyFileSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath, URL } from "node:url";
import { join, relative, sep } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/*
  El diagnóstico por foto usa LiteRT.js. Su runtime en WebAssembly (dos variantes:
  con SIMD relajado y compatible) se publica en /ia/litert/ desde node_modules, sin
  copiarlo al repo: en desarrollo se sirve directo y en el build se copia a dist.
*/
const ORIGEN_LITERT = fileURLToPath(new URL("./node_modules/@litertjs/core/wasm/", import.meta.url));
const ARCHIVOS_LITERT = [
  "litert_wasm_internal.js",
  "litert_wasm_internal.wasm",
  "litert_wasm_compat_internal.js",
  "litert_wasm_compat_internal.wasm",
];

function runtimeLiteRt() {
  let salida = "dist";
  return {
    name: "cv-runtime-litert",
    configResolved(config) {
      salida = config.build.outDir;
    },
    configureServer(servidor) {
      servidor.middlewares.use("/ia/litert/", (peticion, respuesta, siguiente) => {
        const nombre = decodeURIComponent((peticion.url ?? "").split("?")[0].replace(/^\//, ""));
        if (!ARCHIVOS_LITERT.includes(nombre)) return siguiente();
        respuesta.setHeader("Content-Type", nombre.endsWith(".wasm") ? "application/wasm" : "text/javascript");
        createReadStream(join(ORIGEN_LITERT, nombre)).pipe(respuesta);
      });
    },
    closeBundle() {
      const destino = join(salida, "ia", "litert");
      mkdirSync(destino, { recursive: true });
      for (const nombre of ARCHIVOS_LITERT) copyFileSync(join(ORIGEN_LITERT, nombre), join(destino, nombre));
    },
  };
}

/*
  Service worker: precarga la app (no el modelo ni el runtime de IA, que pesan y se
  guardan aparte la primera vez que se usa el diagnóstico). Se publica como /sw.js
  con la lista exacta de archivos del build y una versión derivada de su contenido.
*/
const PRECARGAR = /\.(html|js|css|woff2|svg|png|webp|avif|ico|webmanifest)$/;
const NO_PRECARGAR = /^(ia\/|sw\.js$)/;

function archivos(dir) {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    return statSync(ruta).isDirectory() ? archivos(ruta) : [ruta];
  });
}

function trabajadorSinConexion() {
  let salida = "dist";
  return {
    name: "cv-trabajador-sin-conexion",
    apply: "build",
    configResolved(config) {
      salida = config.build.outDir;
    },
    closeBundle: {
      order: "post",
      handler() {
        if (!existsSync(salida)) return;
        const lista = archivos(salida)
          .map((ruta) => relative(salida, ruta).split(sep).join("/"))
          .filter((ruta) => PRECARGAR.test(ruta) && !NO_PRECARGAR.test(ruta))
          .sort();
        const huella = createHash("sha256");
        for (const ruta of lista) huella.update(ruta).update(readFileSync(join(salida, ruta)));
        const plantilla = readFileSync(new URL("./src/pwa/sw.plantilla.js", import.meta.url), "utf8");
        const codigo = plantilla
          .replace("const VERSION = __VERSION__;", `const VERSION = ${JSON.stringify(huella.digest("hex").slice(0, 12))};`)
          .replace("const PRECARGA = __PRECARGA__;", `const PRECARGA = ${JSON.stringify(["/", ...lista.map((ruta) => `/${ruta}`)])};`);
        if (/= __[A-Z]+__;/.test(codigo)) throw new Error("sw.plantilla.js: quedó un marcador sin reemplazar");
        writeFileSync(join(salida, "sw.js"), codigo);
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), runtimeLiteRt(), trabajadorSinConexion()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
});
