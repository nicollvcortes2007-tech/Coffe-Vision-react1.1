/* Descargar un archivo generado en el navegador (respaldo, CSV, GeoJSON). */
export function descargar(nombre, contenido, tipo = "application/json") {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* CSV con separador «;» y BOM, para que Excel en español lo abra bien. */
export function aCSV(filas, columnas) {
  const escapar = (valor) => {
    if (valor === null || valor === undefined) return "";
    const texto = typeof valor === "number" ? String(valor).replace(".", ",") : String(valor);
    return /[;"\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };
  const encabezado = columnas.map((c) => escapar(c.titulo)).join(";");
  const cuerpo = filas.map((fila) => columnas.map((c) => escapar(typeof c.valor === "function" ? c.valor(fila) : fila[c.valor])).join(";"));
  return `${String.fromCharCode(0xfeff)}${[encabezado, ...cuerpo].join("\n")}`;
}

/* Compartir un texto (WhatsApp u otra app). Si el navegador no puede, abre WhatsApp web. */
export async function compartirTexto(titulo, texto) {
  if (navigator.share) {
    try {
      await navigator.share({ title: titulo, text: texto });
      return "compartido";
    } catch (error) {
      if (error?.name === "AbortError") return "cancelado";
    }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  return "whatsapp";
}
