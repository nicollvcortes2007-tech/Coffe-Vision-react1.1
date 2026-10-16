/*
  Respaldo sin WebGL: el mismo relieve real dibujado en 2D sobre un canvas común,
  con sombreado de colinas (hillshade), curvas de nivel cada 10 m (índice cada 50 m)
  y los lotes. Las alturas se interpolan entre muestras y las curvas se suavizan con
  la pendiente local, como en el shader 3D, para que no salgan en escalera.
*/

const hexARgb = (hex) => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

/* Cobertura (0–1) de la curva más cercana de `intervalo` metros, con ~`grosor` px de ancho. */
function curva(altura, intervalo, metrosPorPx, grosor) {
  const f = altura / intervalo;
  const distancia = Math.abs(f - Math.round(f)) * intervalo; // metros hasta la curva
  const px = distancia / Math.max(metrosPorPx, 1e-6);
  return Math.max(0, Math.min(1, grosor - px));
}

export function dibujarRelieve2D(lienzo, relieve, lotes, { bajo = "#1C1D19", alto = "#A9ABA2", linea = "#E9EAE4", estados = {} } = {}) {
  const { alturas, lado, minimo, maximo, limites, extension } = relieve;
  const tam = lienzo.width;
  const ctx = lienzo.getContext("2d");
  const imagen = ctx.createImageData(tam, tam);
  const [r0, g0, b0] = hexARgb(bajo);
  const [r1, g1, b1] = hexARgb(alto);
  const [rl, gl, bl] = hexARgb(linea);
  const paso = extension / (lado - 1);
  const h = (i, j) => alturas[Math.min(lado - 1, Math.max(0, j)) * lado + Math.min(lado - 1, Math.max(0, i))];
  // Altura bilineal en coordenadas continuas de la grilla.
  const hb = (fi, fj) => {
    const i = Math.floor(fi);
    const j = Math.floor(fj);
    const fx = fi - i;
    const fy = fj - j;
    return (h(i, j) * (1 - fx) + h(i + 1, j) * fx) * (1 - fy) + (h(i, j + 1) * (1 - fx) + h(i + 1, j + 1) * fx) * fy;
  };
  const luz = [-0.6, 0.6, 0.53];
  const escala = (lado - 1) / (tam - 1);
  for (let y = 0; y < tam; y += 1) {
    for (let x = 0; x < tam; x += 1) {
      const fi = x * escala;
      const fj = y * escala;
      const altura = hb(fi, fj);
      // Pendiente en metros por metro (diferencias centrales de una muestra).
      const dx = (hb(fi + 1, fj) - hb(fi - 1, fj)) / (2 * paso);
      const dy = (hb(fi, fj + 1) - hb(fi, fj - 1)) / (2 * paso);
      const largo = Math.hypot(dx * 2.2, dy * 2.2, 1);
      const sombra = Math.max(0, (-dx * 2.2 * luz[0] + -dy * 2.2 * luz[1] + luz[2]) / largo);
      const t = (altura - minimo) / Math.max(maximo - minimo, 1);
      let r = (r0 + (r1 - r0) * t) * (0.45 + 0.7 * sombra);
      let g = (g0 + (g1 - g0) * t) * (0.45 + 0.7 * sombra);
      let b = (b0 + (b1 - b0) * t) * (0.45 + 0.7 * sombra);
      // Metros de altura que cambian en un píxel: así la curva mide lo mismo en llano y en ladera.
      const metrosPorPx = Math.hypot(dx, dy) * paso * escala + 1e-3;
      const k = Math.max(curva(altura, 10, metrosPorPx, 0.9) * 0.28, curva(altura, 50, metrosPorPx, 1.5) * 0.7);
      r = r * (1 - k) + rl * k;
      g = g * (1 - k) + gl * k;
      b = b * (1 - k) + bl * k;
      const p = (y * tam + x) * 4;
      imagen.data[p] = r;
      imagen.data[p + 1] = g;
      imagen.data[p + 2] = b;
      imagen.data[p + 3] = 255;
    }
  }
  ctx.putImageData(imagen, 0, 0);
  const aPx = ([lon, lat]) => [((lon - limites.oeste) / (limites.este - limites.oeste)) * tam, ((limites.norte - lat) / (limites.norte - limites.sur)) * tam];
  ctx.lineJoin = "round";
  for (const lote of lotes) {
    const geo = lote.geometria;
    if (!geo) continue;
    const color = estados[lote.estado] ?? "#9A9C94";
    ctx.beginPath();
    if (geo.tipo === "poligono") {
      geo.puntos.forEach((pto, i) => (i ? ctx.lineTo(...aPx(pto)) : ctx.moveTo(...aPx(pto))));
      ctx.closePath();
    } else {
      const [x, y] = aPx(geo.punto);
      ctx.arc(x, y, Math.max(6, (Math.sqrt(((lote.areaHa || 0.5) * 10000) / Math.PI) / extension) * tam), 0, Math.PI * 2);
    }
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(14,15,12,0.75)";
    ctx.stroke();
  }
}
