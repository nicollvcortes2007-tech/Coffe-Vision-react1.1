## 6. La finca en 3D: relieve real, satélite y GPS

**Conclusión.** Se puede mostrar la montaña real de cada finca en 3D desde el navegador, sin clave ni servidor:
- **Relieve:** AWS Terrain Tiles «terrarium» en **z=13** (CORS `*`, SRTM ~30 m de dominio público; **76 KB** para 3 × 3 km).
- **Satélite opcional:** EOX Sentinel-2 cloudless 2025 (CORS, CC BY-NC-SA, 10 m).
- **Motor:** three.js 0.186.1 (MIT, WebGL2, ya está en `package.json`; **~140–150 KB gzip** cargado de forma diferida).
- **Respaldo:** póster o mapa 2D con sombreado calculado del mismo heightmap.

Un hallazgo cambia la puesta en escena: el relieve de Timbío es suave (**76 m en 1,5 km; 113 m en 3 km**). Además, el punto 2,351, −76,683 cae **en el casco urbano**. Hacen falta un área de ~3 km, exageración ×2–3 con aviso y un punto rural.

Fecha de consulta: **2026-10-15**. Las pruebas se hicieron con `curl`, `npm`, `esbuild` y Python (PIL/numpy) desde macOS. Los scripts y datos de apoyo se usaron en una carpeta temporal de la sesión y no se conservan en el repositorio. No se modificó ningún archivo del proyecto.

Convenciones: **[H]** = hecho con fuente o prueba propia (se indica cuál). **[I]** = interpretación propia.

---

### 6.0 Teselas que cubren la finca de ejemplo (Timbío, 2,351 N, −76,683 O)

[H] Cálculo propio con la fórmula de Web Mercator (`x = (lon+180)/360·2^z`, `y = (1 − asinh(tan φ)/π)/2·2^z`), script en línea con `python3`:

| z | x | y | m/píxel (256 px) en 2,35° N | lado de la tesela | Observación |
|---|---|---|---|---|---|
| 13 | 2351 | 4042 | 19,1 | 4,9 km | la finca cae en el borde oeste (fracción x = 0,036) → hace falta también x=2350 |
| 14 | 4702 | 8084 | 9,6 | 2,4 km | borde sur (fracción y = 0,973) → hace falta y=8085 |
| 15 | 9404 | 16169 | 4,8 | 1,2 km | borde sur → 2×2 teselas para 1,5 km |
| 16 | 18808 | 32339 | 2,4 | 0,6 km | — |

[I] Casi nunca basta una tesela; el código debe unir 2–4 teselas vecinas (el borrador actual ya lo hace).

---

### 6.1 Elevación desde el navegador, sin clave

#### a) AWS Terrain Tiles (Mapzen/Tilezen «joerd»): **funciona, recomendada**

**CORS.** [H] Comandos `curl -I -H "Origin: http://localhost:5173" …` y `curl -s -D - -o /dev/null -H "Origin: …" …`:

| Petición | Resultado |
|---|---|
| `HEAD` terrarium z13/14/15 | 200, **sin** `Access-Control-Allow-Origin` |
| `GET` terrarium 13/2351/4042, 14/4702/8084, 15/9404/16169 | 200, `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET`, `Access-Control-Max-Age: 3000` |
| `OPTIONS` (preflight) | 200, `Access-Control-Allow-Origin: *` |
| `GET` normal z13/14/15, geotiff 14, skadi N02W077 | 200 con `Access-Control-Allow-Origin: *` |
| `GET` terrarium **z16** | **404** → el zoom máximo es 15 |

- [H] La regla CORS del bucket solo permite `GET`, por eso `curl -I` (HEAD) no muestra la cabecera. [I] Esto no afecta al navegador, que usa GET. Pero cualquier prueba de CORS con `-I` dará un falso negativo.
- [H] Cabecera `x-amz-meta-x-imagery-sources: srtm/N02W077.tif` en z13, z14 y z15: la fuente en Timbío es **SRTM**.
- [H] La respuesta no trae `Cache-Control`, solo `Last-Modified: Sun, 12 Nov 2017`. [I] La caché HTTP del navegador será heurística. Para uso sin señal hay que guardarlas explícitamente (ver 6.4).
- [H] Hay réplica en la UE: `arn:aws:s3:::elevation-tiles-prod-eu` ([AWS Registry](https://registry.opendata.aws/terrain-tiles/)).

**Formatos y decodificación** [H] ([formats.md](https://github.com/tilezen/joerd/blob/master/docs/formats.md)):
- **Terrarium PNG**: `altura = (R·256 + G + B/256) − 32768` metros, en EPSG:3857.
- **Normal PNG**: RGB = vector normal. El canal alfa es una altura **cuantizada en escalones de 20 m hasta 3.000 m**. [I] No sirve para fincas con 76 m de desnivel: saldrían ~4 escalones. Se descarta.
- **GeoTIFF**: 512×512 en EPSG:3857 (518 KB la tesela z14 medida). **Skadi**: celdas 1°×1° en WGS84 (17,8 MB comprimida N02W077). [I] Ambos son demasiado pesados para un móvil.

**Resolución efectiva en Colombia.**
- [H] Según [data-sources.md](https://github.com/tilezen/joerd/blob/master/docs/data-sources.md), en tierra desde z7 se usa SRTM («30 m, calidad nominal 90 m»).
- [H] Decodifiqué las teselas con `python3 -I decode_terrarium.py`:

| Tesela | Rango en la tesela | Valores con decimales | Altura en el punto de la finca |
|---|---|---|---|
| z13 2351/4042 | 1.773–2.070 m | **0 %** | 1.805,0 m |
| z14 4702/8084 | 1.772,8–1.931,2 m | 99,5 % | 1.804,8 m |
| z15 9404/16169 | 1.778,7–1.849,5 m | 99,5 % | 1.804,7 m |

- [I] z13 trae enteros (muestreo directo, ~19 m/píxel). z14 y z15 son **interpolaciones** de la misma fuente de ~30 m. No añaden detalle real y cuestan ~5× más bytes (ver 6.4). **Usar z13.**
- [I] El archivo skadi `N02W077.hgt.gz` mide 17,8 MB comprimido. Un HGT de 3″ ocupa 2,9 MB sin comprimir y uno de 1″ ocupa 25,9 MB, así que la celda es de **1″ (~30 m)**. Coincide con el texto de joerd.

**Licencia y atribución** [H] ([attribution.md](https://github.com/tilezen/joerd/blob/master/docs/attribution.md)):
- SRTM es de dominio público; el USGS pide el crédito «SRTM data courtesy of the U.S. Geological Survey».
- Línea global que exige el documento: «…global GMTED2010 and SRTM terrain data courtesy of the U.S. Geological Survey.»
- ETOPO1 (NOAA) solo aplica a batimetría y no afecta al Cauca.
- [I] Atribución propuesta en pantalla: «Relieve: SRTM (USGS) vía AWS Terrain Tiles / Mapzen».

#### b) Mapterhorn (`tiles.mapterhorn.com`): **funciona, buena alternativa o respaldo**

- [H] `curl` a `https://tiles.mapterhorn.com/tilejson.json` devolvió `"encoding":"terrarium"`, `"tileSize":512` y `access-control-allow-origin: *`.
  - Teselas WebP de 512 px.
  - z10, z11 y z12 responden 200 en Timbío; **z13 da 404**, así que el máximo en Colombia es **z12/512 px ≈ 19 m/píxel**.
  - Cabecera `cache-control: public, max-age=604800`.
- [H] Su `attribution.json` lista para el mundo la fuente **COPERNICUS GLO-30**, 30 m, «COPERNICUS full, free and open license». Productor: «DLR e.V. 2010-2014, Airbus Defence and Space GmbH 2014-2018, provided under COPERNICUS by the European Union and ESA».
  - Código bajo BSD-3 ([repo](https://github.com/mapterhorn/mapterhorn)).
  - Atribución del tilejson: «© Mapterhorn».
- [H] Decodifiqué la tesela z12 1175/2021: **1.801,5 m** en la finca (rango de la tesela: 1.265–2.286 m).
- [H] Los ejemplos oficiales de [MapLibre «3D terrain»](https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/) y de [deck.gl TerrainLayer](https://deck.gl/examples/terrain-layer) usan hoy Mapterhorn como fuente de relieve.
- [H] **No encontré** términos de uso del endpoint público (límites, uso en producción). Ni [data-access](https://mapterhorn.com/data-access) ni el README los mencionan. [I] Úsese como respaldo y no como única fuente.

#### c) Open-Meteo Elevation API: **útil para puntos sueltos, no para la malla**

- [H] `curl -H "Origin: …" "https://api.open-meteo.com/v1/elevation?latitude=…&longitude=…"`:
  - Respondió 200 con `access-control-allow-origin: *`.
  - Altura en la finca: **1.795 m**.
  - Con **100 puntos**: 200, 814 bytes, 0,50 s.
  - Con **101 puntos**: 400 `"must not exceed 100 coordinates"`.
- [H] Usa «Copernicus DEM 2021 release GLO-90 with 90 meters resolution». Exige atribución a Copernicus y una referencia a Open-Meteo ([docs](https://open-meteo.com/en/docs/elevation-api)).
- [H] El uso gratuito es solo **no comercial**: menos de 10.000 llamadas al día, 5.000 por hora y 600 por minuto ([términos](https://open-meteo.com/en/terms)). Los términos no dicen nada sobre cachear.
- [I] Una malla 10×10 a 90 m no dibuja una ladera. Sirve para comprobar la altitud de la casa o del centroide de cada lote, o como respaldo si S3 falla.

#### d) Copernicus DEM GLO-30/GLO-90 en COG (AWS Open Data): **no sirve desde el navegador**

- [H] `curl -H "Origin: …" -H "Range: bytes=0-16383" https://copernicus-dem-30m.s3.amazonaws.com/Copernicus_DSM_COG_10_N02_00_W077_00_DEM/…tif`:
  - Devuelve 206 **sin** `Access-Control-Allow-Origin`.
  - El preflight con `Range` devuelve **403**.
  - Lo mismo ocurre con el endpoint regional `eu-central-1` y con GLO-90.
- [H] Cada archivo de 1°×1° pesa 42,5 MB.
- [H] Licencia: «free basis … under the terms and conditions of the Licence» ([AWS Registry](https://registry.opendata.aws/copernicus-dem/)).
- [I] Para GLO-30 desde el navegador, Mapterhorn ya lo sirve en teselas.

#### e) Descartadas o sin verificar
- [H] Mapbox Terrain-RGB y MapTiler exigen clave; se descartan por la regla del repo público. [I] Esri World Elevation tiene el mismo problema de token que Esri Imagery (ver 6.2).
- [H] El IGAC adoptó CC BY 4.0 para sus datos abiertos (Res. 616 de 2020, según resultados de búsqueda; no leí la resolución). **No encontré un endpoint** de MDT u ortoimagen con CORS: no verificado.

**Resumen de elevación**

| Fuente | CORS | Clave | Resolución real en Timbío | Bytes para 3 × 3 km | Licencia |
|---|---|---|---|---|---|
| **AWS terrarium z13** | Sí (`*`) | No | SRTM 1″ ≈ 30 m (19 m/px) | **2 teselas, 76 KB** | Dominio público (USGS) |
| AWS terrarium z14/z15 | Sí | No | Interpolado de lo mismo | 430 KB / 1,55 MB | Igual |
| Mapterhorn z12 (512) | Sí (`*`) | No | GLO-30 (19 m/px) | 1 tesela, 125 KB | Copernicus libre + «© Mapterhorn» |
| Open-Meteo | Sí (`*`) | No | GLO-90 (90 m) | 100 puntos/petición | CC BY 4.0, no comercial |
| Copernicus COG en S3 | **No** | No | 30 m | — | Copernicus libre |

---

### 6.2 Imagen satelital para «vestir» el terreno

#### a) EOX Sentinel-2 cloudless: **funciona, recomendada (licencia no comercial)**

- [H] Las capacidades WMTS (`https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml`) listan `s2cloudless-2016` a `s2cloudless-2025`, cada capa en 4326 y 3857, más la matriz `GoogleMapsCompatible`.
  - Plantilla: `…/wmts/1.0.0/s2cloudless-2025_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg` (fila antes que columna).
- [H] `curl -H "Origin: http://localhost:5173"` en z14, 15, 16 y 17 sobre Timbío:
  - 200 con `access-control-allow-origin: http://localhost:5173`, `access-control-allow-credentials: true` y `cache-control: max-age=604800`.
  - Pesos: 14,1 / 10,4 / 9,1 / 6,5 KB por tesela.
- [H] **Licencia por año**, según el `Abstract` de cada capa en las capacidades:
  - 2016: **CC BY 4.0**.
  - 2017–2025: **CC BY-NC-SA 4.0** («For commercial usage please see https://cloudless.eox.at»).
- [H] La [página de licencia](https://cloudless.eox.at/documentation/license) da la cadena de atribución: «EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data "year")». Debe estar «clearly visible wherever the imagery is displayed», dentro de la interfaz del mapa. El uso comercial exige la licencia «EOX Commercial Attribution-RestrictedUse 1.2».
- [H] La página de uso no menciona límites de peticiones ni cacheo ([usage](https://cloudless.eox.at/documentation/usage)). No verificado.
- [H] Resolución: las bandas RGB de Sentinel-2 (B2, B3, B4) son de 10 m ([SentiWiki](https://sentiwiki.copernicus.eu/web/s2-mission)).
- [I] **Para Coffee+Visión** (académico, sin anuncios ni suscripciones) la capa 2025 encaja. Si algún día cobra, hay que cambiar a la capa 2016 (CC BY) o comprar licencia. La «SA» obliga a publicar bajo la misma licencia cualquier textura derivada que se hornee (ver 6.6).

#### b) Esri World Imagery: **técnicamente responde, pero se descarta**

- [H] `curl -H "Origin: …" https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` en z14, z16 y z18: 200, `Access-Control-Allow-Origin: *`, sin token.
  - A z18 se ven casas y patios de Timbío.
  - El servicio declara «Vantor imagery … 1m resolution imagery across the rest of the world».
- [H] La ficha del ítem dice «licensed under the Esri Master License Agreement» y «This layer is not intended to be used to export tiles for offline» (`arcgis.com/sharing/rest/content/items/10df2279f9684e4a9f6a7f08febac2a9?f=json`).
- [H] La documentación de desarrolladores de Esri exige un **token** con privilegio `premium:user:basemaps` o `staticbasemaptiles` para los servicios de mapas base ([Basemap styles](https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/services/basemap-layer-service/), [Static basemap tiles](https://developers.arcgis.com/rest/static-basemap-tiles/get-started/)).
- [I] El uso anónimo del endpoint antiguo es una zona gris. Además prohíbe el uso sin conexión y requeriría clave para la vía oficial: **se descarta** en un repo público sin claves.

#### c) Sentinel-2 L2A COG en AWS (Element 84 Earth Search): **CORS sí, nubes también**

- [H] `GET` con `Range` y `Origin` a `sentinel-cogs.s3.us-west-2.amazonaws.com/…/TCI.tif`: 206 con `Access-Control-Allow-Origin: *`. El preflight con `range` también es 200.
- [H] Consulta STAC `POST https://earth-search.aws.element84.com/v1/search` (también con CORS `*`) sobre el punto de Timbío, del 2025-01-01 al 2026-10-15, mosaico MGRS **18NUH**:
  - **157 escenas**, con nubosidad **mediana del 79,5 %**.
  - **Ninguna** por debajo del 10 %; solo 5 por debajo del 20 % (mejor: 11,3 %, el 2025-12-06).
  - Cada TCI pesa ~108 MB.
- [I] En el Cauca no hay escena limpia sin hacer un compuesto propio, que es justamente lo que vende EOX. Se descarta para uso en vivo.

#### d) Otras
- [H] VersaTiles satellite (`tiles.versatiles.org/tiles/satellite/…`, la que usa el ejemplo de deck.gl): CORS `*`, pero en Timbío **solo llega a z12** (z13–16 dan 404). Se descarta para 1,5–3 km.

#### e) ¿Cómo se vería?
- [H] Recorte propio de 3 × 3 km con EOX 2025 z16, reescalado a 1024 px (`bake_sat.py`): se distinguen el casco urbano, las vías, las manchas de bosque y los potreros. Los lotes de café de 1 ha ocupan **~10×10 píxeles nativos**.
- [I] Con 10 m se ve la «mancha» del lote (verde oscuro de sombrío frente a potrero claro), pero no los surcos ni los árboles. Con Esri a ~1 m se verían copas y caminos, pero no es usable aquí. Para una maqueta, 10 m basta y combina mejor con un estilo cartográfico que con uno fotorrealista.

---

### 6.3 Técnica en three.js

**Versión, licencia y peso**
- [H] `npm view three`: **0.186.1** (publicada el 2026-09-24), licencia **MIT**, `sideEffects: ["./src/nodes/**/*"]`. El proyecto ya la declara: `"three": "0.186.1"` en `package.json`.
- [H] Tamaño medido con `esbuild@0.25.10 --bundle --minify --format=esm` y `gzip -9`:

| Entrada | min | **gzip** |
|---|---|---|
| WebGLRenderer + ShaderMaterial + PlaneGeometry + CanvasTexture + Raycaster + OrbitControls | 556 KB | **139,8 KB** |
| Lo anterior + MeshStandardMaterial + luces + sombras + ShapeGeometry + EdgesGeometry + CSS2DRenderer | 594 KB | **150,4 KB** |
| `import * as THREE` (todo el core) | 745 KB | 191,0 KB |

  [I] La mayor parte del peso lo arrastra `WebGLRenderer`; añadir piezas cuesta poco.
- [H] Desde r163 **WebGLRenderer ya no admite WebGL 1** ([Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide); [foro](https://discourse.threejs.org/t/r163-workaround-to-keep-supporting-webgl-1/63547)). En el código fuente local, `contextName = 'webgl2'` en `WebGLRenderer.js:409`.
- [H] Cobertura según caniuse (JSON de Fyrd/caniuse):
  - WebGL2: **97,13 %** global, «y» en Chrome Android 154 y Samsung Internet 28–30.
  - WebGPU: 85,8 %. Chrome lo activó en Android solo con **Android 12+ y GPU Qualcomm o ARM** ([Chrome 121](https://developer.chrome.com/blog/new-in-webgpu-121)).
  - [I] Esto confirma descartar vgpu (solo WebGPU) para gama media rural.
- [H] Comparación con MapLibre GL JS **6.14.0** (BSD-3): `maplibre-gl.mjs` 285,7 KB gzip + `maplibre-gl-worker.mjs` 143,7 KB + CSS 10,5 KB ≈ **440 KB**. También es solo WebGL2: la única llamada es `getContext('webgl2')`.
  - [I] MapLibre trae de serie relieve, sombreado, polígonos drapeados, clics en entidades y atribución, pero pesa 3× más y deja menos control artístico. Para una «maqueta» de 3 km, three.js es mejor apuesta. MapLibre conviene si se necesita un mapa navegable con calles y zoom libre.
- [H] React Three Fiber 9.8.2 admite `react >=19 <19.4` (el proyecto usa `^19.3.1`). [I] No hace falta: el componente ya está escrito en three.js directo y R3F/drei sumarían peso sin aportar a una sola escena.

**Piezas de la técnica** (D = dependencia de three.js; P = código propio)

| Pieza | Cómo | D/P | Referencia |
|---|---|---|---|
| Malla desde heightmap | `PlaneGeometry(ext, ext, n−1, n−1)`, `rotateX(−π/2)`. Se escribe la altura en `position.y` **en CPU** y luego `computeVertexNormals()`. En CPU (y no en shader) el raycasting acierta sobre el relieve | D + P | [H] Ejemplos oficiales [webgl_geometry_terrain](https://threejs.org/examples/#webgl_geometry_terrain) y [webgl_geometry_terrain_raycast](https://threejs.org/examples/#webgl_geometry_terrain_raycast). Si se desplaza en shader, el rayo choca con el plano plano ([sbcode](https://sbcode.net/threejs/raycast-to-displacementmap/)) |
| Decodificar teselas | `fetch(mode:'cors')` → `createImageBitmap` → `OffscreenCanvas` → `getImageData` → fórmula terrarium; unir teselas y muestrear bilinealmente | P | [H] Fórmula de formats.md |
| Malla adaptativa (opcional) | RTIN/Martini: menos triángulos en zonas planas | D externa | [H] [mapbox/martini](https://github.com/mapbox/martini), ISC |
| Exageración vertical | Multiplicar `(h − hmin)·k`. [I] Elegir `k` según el desnivel (desnivel/ancho ≈ 0,1–0,15) y mostrar «relieve ×k» | P | [H] Stamen advierte que exagerar puede engañar ([artículo](https://stamen.com/shadows-on-maps-are-getting-a-lot-more-exciting-and-heres-why/)) |
| Iluminación de maqueta | `ShaderMaterial` con luz fija en **espacio mundo** (acimut 315°, 45°), tinte hipsométrico y un mínimo de ambiente. Alternativa: `MeshStandardMaterial` + `onBeforeCompile` | D + P | [I] |
| Curvas de nivel en shader | `f = h/intervalo; d = abs(fract(f−0.5)−0.5)/fwidth(f); línea = 1−smoothstep(0, grosor, d)`; curva índice cada 5 intervalos | P | [H] Técnica de «anti-aliased grid» de Evan Wallace ([madebyevan.com/shaders/grid](https://madebyevan.com/shaders/grid/)), recomendada en el [foro de three.js](https://discourse.threejs.org/t/how-to-add-contour-lines-to-terrain/58484) |
| Hillshade | En el shader con la normal, o **horneado** a una textura (canvas 2D) desde el heightmap; también sirve para el respaldo 2D | P | [H] Estilo suizo: [Eduard](https://eduard.earth/) (relieve suizo con aprendizaje automático, ETH/Monash) para inspirarse |
| Sombras suaves | [I] Una `DirectionalLight` con `shadowMap` (PCF) sobre 30–60 k triángulos es viable, pero cuesta en gama media. Mejor **hornear** oclusión ambiental y sombra proyectada en la textura de hillshade (calculadas una vez en CPU) | D o P | [H] Ejemplos [webgl_shadowmap_vsm](https://threejs.org/examples/#webgl_shadowmap_vsm), [webgl_shadowmap_pcss](https://threejs.org/examples/#webgl_shadowmap_pcss) |
| lon/lat → malla | Para 3 km basta una proyección local equirectangular: `x = (lon−lon0)·111320·cos φ0`, `z = −(lat−lat0)·111320`. Web Mercator solo para indexar teselas | P | [H] `escalaLocal()` del borrador |
| Drapear lotes | **Opción A (recomendada):** dibujar los polígonos en un `CanvasTexture` 1024² del mismo encuadre y mezclarlo en el shader. Sigue el relieve sin geometría extra y se actualiza con `needsUpdate`. **Opción B:** `ShapeGeometry` triangulada, con cada vértice elevado a `alturaEn()+0,5 m`. Falla en lotes grandes con pocas aristas (cortan la ladera); hay que subdividir. **Opción C:** `DecalGeometry` | D + P | [H] Manual [Canvas textures](https://threejs.org/manual/#en/canvas-textures); ejemplo [webgl_decals](https://threejs.org/examples/#webgl_decals) |
| Bordes luminosos | En el canvas: trazo grueso con `shadowBlur` para el halo, o un pase del borde en otra textura con brillo aditivo | P | [I] |
| Etiquetas HTML | Proyectar `Vector3.project(camera)` a píxeles y mover `<span>` con `transform`. Alternativa: `CSS2DRenderer` (addon) | P o D | [H] Manual [Aligning HTML Elements to 3D](https://threejs.org/manual/#en/align-html-elements-to-3d) |
| Tocar un lote | `Raycaster` contra la malla → punto → lon/lat → punto-en-polígono. Distinguir toque de arrastre (< 6 px) | D + P | [H] Manual [Picking](https://threejs.org/manual/#en/picking); [three-mesh-bvh](https://github.com/gkjohnson/three-mesh-bvh) (MIT) si hiciera falta acelerar |
| Cámara orbital con límites | `OrbitControls`: `minDistance`, `maxDistance`, `maxPolarAngle`, `enableDamping` y `maxTargetRadius` (limita el paneo). Un dedo gira, dos acercan | D | [H] Propiedades encontradas en `OrbitControls.js` de 0.186.1 (líneas 125–318); `MapControls` también existe |
| Entrada «fly-in» | Interpolar posición y objetivo de la cámara: cenital (como un mapa 2D) → oblicua, 2–3 s, `easeOutCubic`; barrido de «escaneo GPS» en el shader | P | [H] Patrón de capítulos de cámara de [Mapbox storytelling](https://www.mapbox.com/blog/interactive-storytelling-3d-maps-with-mapbox-gl-js-v2) y [Cesium Stories](https://cesium.com/platform/cesium-ion/cesium-stories/) |
| `prefers-reduced-motion` | Sin fly-in, sin autorrotación y sin pulsos; pose final directa | P | [I] |
| Render a demanda | Solo `requestAnimationFrame` cuando hay `change` de controles, animación activa o `needsUpdate`. Pausar fuera del viewport (`IntersectionObserver`) y con la pestaña oculta | P | [H] Manual [Rendering on Demand](https://threejs.org/manual/#en/rendering-on-demand) |
| DPR limitado | `setPixelRatio(Math.min(devicePixelRatio, 1.5–2))` | D | [H] Manual [Responsive](https://threejs.org/manual/#en/responsive) |
| Pérdida de contexto | `WebGLRenderer` ya escucha `webglcontextlost`/`webglcontextrestored` (`WebGLRenderer.js:403-404`) y expone `forceContextLoss()`. **La app** debe escuchar los mismos eventos en el canvas, mostrar el póster o el 2D y reconstruir | P | [H] Código fuente 0.186.1 |
| Detectar GPU débil | `failIfMajorPerformanceCaveat: true` en el contexto de prueba → si falla (render por software), usar el 2D | D (opción del renderer, línea 82) | [I] |

Fragmento de shader (curvas de nivel + luz fija en mundo). [I] Es lo esencial; el borrador ya usa una variante:

```glsl
// vértice
vNormalMundo = normalize(mat3(modelMatrix) * normal); // no normalMatrix (espacio cámara)
// fragmento
float linea(float h, float paso, float grosor){
  float f = h / paso;
  float d = abs(fract(f - 0.5) - 0.5) / fwidth(f);
  return 1.0 - smoothstep(0.0, grosor, d);
}
```

---

### 6.4 Rendimiento real en móviles de gama media

**Malla** [I]
- **128×128** vértices: 32 k triángulos. Sobra para 3 km con fuente de 30 m: hay 157 muestras reales por lado en z13, y un intervalo de malla de 23 m no pierde nada visible.
- **256×256**: 130 k triángulos. Solo aporta suavidad y cuesta más memoria y tiempo de raycasting.
- Recomendación: 128–160 en móvil y 192 en escritorio.

**Descarga medida** [H] (script `budget.py`: suma de `Content-Length` por `HEAD` de las teselas que cubren el área):

| Fuente | 1,5 × 1,5 km | 3 × 3 km |
|---|---|---|
| AWS terrarium z13 | 2 teselas, 76 KB | **2 teselas, 76 KB** |
| AWS terrarium z14 | 4 teselas, 430 KB | 4 teselas, 430 KB |
| AWS terrarium z15 | 4 teselas, 384 KB | 16 teselas, 1,55 MB |
| Mapterhorn z12/512 | 1 tesela, 125 KB | 1 tesela, 125 KB |
| EOX 2025 z15 | 4 teselas, 40 KB | **16 teselas, 150 KB** |
| EOX 2025 z16 | 12 teselas, 90 KB | 36 teselas, 248 KB |
| Esri z17 (referencia) | 36 teselas, 499 KB | 121 teselas, 1,48 MB |

**Horneado para la landing** [H] (script `bake.py` / `bake_sat.py`, área de 3 km):
- Heightmap terrarium PNG: **31 KB** a 128² y **106 KB** a 256². Como Uint16 en decímetros con gzip: 22 KB y 80 KB.
- Satélite EOX recortado a WebP q78: **26 KB** a 512² y **57 KB** a 1024².

**Relieve real del ejemplo** [H] (`bake.py`, `relief.py` sobre AWS z13):

| Área | Mínimo | Máximo | Desnivel | Pendiente mediana / p90 |
|---|---|---|---|---|
| 1,5 km | 1.775 m | 1.851 m | **76 m** | — |
| 3 km | 1.768 m | 1.881 m | **113 m** | 9,0° / 16,6° |
| 6 km | 1.748 m | 2.102 m | 354 m | 10,5° / 18,3° |
| 10 km | 1.547 m | 2.238 m | 691 m | 11,9° / 22,8° |

[I] Con 1,6 km y ×1,8 el bloque se verá casi plano: 140 m de alto sobre 1.600 m de ancho. Con 3 km y ×3 (≈ 340 m sobre 3.000 m) aparecen las cañadas, como muestra el hillshade de prueba `datos06/hillshade_6km_x3.png`.

**Caché sin conexión**
- [H] Las tres fuentes elegidas responden con CORS. Por tanto `cache.put()` guarda respuestas **no opacas**. Las respuestas opacas (sin CORS) cuentan ~7 MB cada una en la cuota de Chrome ([Chrome Workbox](https://developer.chrome.com/docs/workbox/understanding-storage-quota)).
- [H] El service worker actual (`src/pwa/sw.plantilla.js`, línea con `url.origin !== self.location.origin … return`) **ignora las peticiones de otros dominios**: las teselas no quedan en la caché del SW, solo en la caché HTTP, que se puede desalojar.
- [I] Añadir una ruta «primero guardado» para `elevation-tiles-prod`, `tiles.mapterhorn.com` y `tiles.maps.eox.at` en una caché propia (`cv-relieve-v1`, con un tope de ~40 entradas). Además, guardar en IndexedDB el heightmap ya decodificado de cada finca (Float32 o Uint16, ~32–128 KB), para no decodificar ni descargar de nuevo.

**¿Se permite cachear?**

| Proveedor | Respuesta |
|---|---|
| AWS/SRTM | [I] Sí: dominio público, sin términos que lo limiten (no encontré ninguno). |
| Mapterhorn | [H] Ofrece PMTiles para uso sin conexión y tiene `max-age=604800`. Términos del endpoint no encontrados. |
| EOX | [I] La licencia CC BY-NC-SA permite copiar y redistribuir sin fin comercial y con atribución; cachear en el dispositivo encaja. [H] No hallé política de límites del WMTS. |
| Open-Meteo | [H] Los términos no tratan el cacheo. |
| Esri | [H] «not intended to be used to export tiles for offline» → no. |

---

### 6.5 Referencias visuales (16, con la idea concreta a tomar)

1. **The Symphony of Vines** — Unseen Studio, [symphonyofvines.unseen.co](https://symphonyofvines.unseen.co/). [H] Awwwards **Site of the Day**, 15-ago-2025 ([ficha](https://www.awwwards.com/sites/the-symphony-of-vines)). Usa Three.js y Cinema 4D y cuenta el terroir del Château Oublié «across millennia». Tiene elementos llamados «Terrain Formation», «Terrain Deforming» e «Interactive Rivers». **Tomar** [I]: la entrada en la que el terreno «se forma» (la malla sube desde plano hasta el relieve real en 1,5 s) como gancho de la landing.
2. **Chartogne-Taillet** — en el portafolio de Immersive Garden ([ficha](https://immersive-g.com/projects/chartogne-taillet-1); la página indica «Credits: Mooders»; sitio: [chartogne-taillet.com](https://chartogne-taillet.com/)). [H] Site of the Day en Awwwards, FWA y CSSDA. Mapa dibujado a mano de las parcelas de viñedo; al pasar sobre cada parcela aparece su historia; partículas de acuarela y 3D low-poly. **Tomar** [I]: «tocar lote → ficha» con microhistoria (variedad, edad, última visita) y un estilo cartográfico ilustrado en vez de fotorrealista.
3. **World Winery Map** — [worldwinerymap.com](https://worldwinerymap.com/). [H] 4,3 millones de parcelas, con elevación, pendiente y orientación calculadas desde **Copernicus GLO-30**, más radiación solar ([nota](https://wineindustryadvisor.com/2026/09/18/world-winery-map-digitizes-4-3-million-vineyards-and-their-terroir-data-amid-climate-change-2/)). **Tomar** [I]: mostrar por lote «altitud media, pendiente y orientación de la ladera», que son datos agronómicos del café, calculados del mismo heightmap.
4. **Ejemplo TerrainLayer de deck.gl** — [deck.gl/examples/terrain-layer](https://deck.gl/examples/terrain-layer). [H] Relieve de Mapterhorn (terrarium) con textura satelital y `elevationDecoder {rScaler:256, gScaler:1, bScaler:1/256, offset:−32768}` ([código](https://github.com/visgl/deck.gl/blob/master/examples/website/terrain/app.tsx)). **Tomar**: la cadena de datos idéntica a la nuestra; sirve de referencia para comparar el resultado visual.
5. **MapLibre «3D terrain»** — [ejemplo](https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/). [H] `raster-dem` de Mapterhorn, capa `hillshade` con sombra `#473B24`, `TerrainControl` y `NavigationControl` con `visualizePitch`. **Tomar** [I]: la brújula que muestra inclinación y rumbo, y el color cálido de las sombras para la maqueta.
6. **Plantilla de storytelling 3D de Mapbox** — [blog](https://www.mapbox.com/blog/interactive-storytelling-3d-maps-with-mapbox-gl-js-v2). [H] Capítulos que mueven la cámara al hacer scroll y «slow map rotation» por capítulo. Prevé **saltarse la transición larga** en regiones con poco ancho de banda. **Tomar**: en la landing, scroll → «la finca» → «los lotes» → «el lote en alerta», con salto directo si el equipo es lento.
7. **Cesium Stories** — [cesium.com](https://cesium.com/platform/cesium-ion/cesium-stories/). [H] Presentaciones 3D por diapositivas con vistas de cámara capturadas; adaptadas a móvil ([tutorial](https://cesium.com/learn/ion/stories-introduction/)). **Tomar**: guardar 3–4 «poses» de cámara con nombre (Vista general, Desde arriba, Lote X) y animar entre ellas.
8. **NYT «Snow Fall» (2012)** — [proyecto](https://www.nytimes.com/projects/2012/snow-fall/index.html). [H] Tres sobrevuelos 3D de Tunnel Creek hechos con LiDAR del condado de King, elevación del USGS y foto satelital («fake snow» incluida). Eran animaciones **prerenderizadas** ([OpenNews](https://source.opennews.org/articles/how-we-made-snow-fall/)). **Tomar** [I]: el respaldo para móviles débiles puede ser un vídeo o póster prerenderizado del mismo terreno; también impresiona.
9. **PeakFinder** — [peakfinder.com](https://www.peakfinder.com/). [H] Panorama de montañas dibujado en líneas con nombres de picos, modelo de elevación embebido y **funcionamiento sin conexión** (descarga por región; ~20 MB el Reino Unido, según reseña). Tocar un pico abre su ficha; hay API web en canvas ([API](https://github.com/Fabiz/PeakFinder-API)). **Tomar**: estética de línea limpia para el modo «sin satélite» y etiquetas ancladas que no se solapan.
10. **Strava 3D (tecnología de FATMAP)** — [TechRadar](https://www.techradar.com/health-fitness/strava-has-added-four-new-features-users-will-love-including-a-massive-map-rendering-overhaul). [H] Desde abril de 2025, motor propio con terreno 3D, satélite y capas de **pendiente** y **orientación** de ladera. **Tomar** [I]: un interruptor de capa «Pendiente» y «Orientación» (sol de mañana o de tarde) en la maqueta, útil para hablar de sombrío y erosión.
11. **Codrops — «Interactive Animated Landscape» (2018)** — [artículo](https://tympanus.net/codrops/2018/12/20/interactive-animated-landscape/). [H] Plano subdividido con `ShaderMaterial` y desplazamiento en el vertex shader con ruido; el ratón o el toque modifican las variables. **Tomar**: el «aliento» sutil del terreno en la entrada (solo si no hay reduced-motion).
12. **Codrops — «Creating Dynamic Terrain Deformation with React Three Fiber» (2024)** — [artículo](https://tympanus.net/codrops/2024/11/27/creating-dynamic-terrain-deformation-with-react-three-fiber/). [H] Plano dividido en trozos y normales recalculadas tras deformar. **Tomar**: recalcular normales solo en la zona tocada si se anima «levantar el lote seleccionado».
13. **Codrops — «False Earth: From WebGL Limits to a WebGPU-Driven World» (2026)** — [artículo](https://tympanus.net/codrops/2026/04/21/false-earth-from-webgl-limits-to-a-webgpu-driven-world/). [H] Paisaje procedural con WebGPU y TSL. **Tomar** [I]: como contraejemplo; lo «brutal» de WebGPU deja fuera a los Android de gama media, así que no hay que copiarlo.
14. **Relieve en Blender (Stamen; Scott Reinhard; Daniel Huffman)** — [Stamen](https://stamen.com/shadows-on-maps-are-getting-a-lot-more-exciting-and-heres-why/). [H] Sombras proyectadas con trazado de rayos, «maps for dawdling, not for navigation». Advierte que exagerar puede engañar y aconseja **prerenderizar** sombras como capa. **Tomar**: hornear sombra proyectada y oclusión en la textura de hillshade, con aviso «relieve ×3».
15. **Eduard** — [eduard.earth](https://eduard.earth/). [H] Relieve sombreado de estilo suizo generado con aprendizaje automático desde DEM (ETH Zúrich, Monash). **Tomar** [I]: paleta y dirección de luz de la escuela suiza (luz del noroeste, sombras azuladas y luces cálidas) para la textura horneada.
16. **«Hype-realistic landscape» (DDB Paris)** — [Awwwards](https://www.awwwards.com/inspiration/hype-realistic-landscape). [H] Mapa interactivo WebGL de un juego, Honorable Mention 2019. **Tomar**: maqueta estilizada con interacción directa sobre el territorio.

Complementos técnicos: [I] [maplibre-contour](https://github.com/onthegomap/maplibre-contour) (curvas de nivel desde teselas DEM en el cliente) y [geo-three](https://github.com/tentone/geo-three) (MIT, mapas por teselas en three.js; sus proveedores comerciales piden clave). [H] Licencias y actividad consultadas con la API de GitHub.

---

### 6.6 Propuesta concreta: «La finca en 3D» de Coffee+Visión [I]

**Datos**
- **Área:** 3 × 3 km centrada en la casa. Configurable a 1,5 km si la finca es pequeña o el relieve es fuerte.
- **Relieve:**
  - Fuente principal: AWS terrarium **z13** (2–4 teselas, 76–150 KB).
  - Respaldo automático: Mapterhorn z12/512 (1–2 teselas, ~125–250 KB).
  - Open-Meteo solo para validar la altitud de la casa y de los lotes (1 petición).
- **Satélite:** opcional, desactivado por defecto en datos móviles. EOX 2025 z15 para 3 km (16 teselas, ~150 KB), o horneado a 1024² en la landing (~57 KB). Atribución EOX visible solo cuando la capa está activa.
- **Landing:** todo horneado en `public/finca-demo/` para no depender de terceros en la primera impresión ni gastar sus cuotas:
  - `relieve-256.png` terrarium (~106 KB) o 128² (~31 KB).
  - `satelite-1024.webp` (~57 KB, CC BY-NC-SA con atribución).
  - `poster.webp` (~60–100 KB, estimado).
- **Punto de ejemplo:** **moverlo fuera del casco urbano** de Timbío. 2,351, −76,683 es el centro del pueblo (lo muestra la imagen EOX). Hace falta una finca real con permiso o un punto rural verosímil, y lotes de ejemplo dibujados sobre zonas verdes.

**Estilo**
- Por defecto, una **maqueta topográfica de papel**:
  - Tinte hipsométrico verde → ocre (los tokens de marca del proyecto).
  - Curvas cada 10 m, con curva índice cada 50 m más oscura.
  - Hillshade con luz fija del noroeste y sombras cálidas.
  - **Zócalo**: paredes laterales del bloque con «estratos» de tierra, que dan el aspecto de maqueta.
  - Niebla suave en el horizonte.
- **Lotes:** relleno translúcido del color de estado (al día `#7FA36B`, vigilar `#E0A93B`, actuar `#E5483A`) con **borde luminoso**. El lote seleccionado sube 2–3 m con un halo blanco.
- **Modo «Satélite»:** mezcla la textura EOX con el hillshade al 60 % y mantiene curvas y lotes.
- **Exageración adaptativa:** `k = clamp(0.12·ancho/desnivel, 1.2, 3)`, con la etiqueta «Relieve exagerado ×k».

**Interacción**
- **Girar:** un dedo. **Acercar y desplazar:** dos dedos. Límites con `minDistance`, `maxDistance`, `maxPolarAngle ≈ 70°` y `maxTargetRadius`.
- **Tocar el terreno o un lote:** ficha inferior con nombre, estado y acción recomendada, más **coordenadas** (5 decimales), **altitud** (msnm del DEM, con «± 10 m» aproximado), pendiente y orientación.
- **Botones:**
  - «Ver desde arriba»: pose cenital, útil como mapa.
  - «Volver».
  - **Brújula** que gira con el acimut de la cámara; al tocarla, orienta al norte.
  - **Barra de escala** calculada con la distancia de la cámara; aproximada en vista oblicua, exacta en cenital.
  - Interruptor «Satélite» y «Curvas».
- **Accesibilidad:** lista textual de lotes debajo del canvas (el canvas tiene `aria-hidden`), botones con `aria-label` y lectura `aria-live` del punto tocado.

**Animación de entrada (landing)**
1. Póster estático de inmediato (LCP).
2. Al entrar en pantalla, carga diferida de three.js y los datos (`import()` + `IntersectionObserver`).
3. «Formación»: la malla sube de plana a relieve real (0,8 s).
4. Fly-in de cenital a oblicua (2,2 s, `easeOutCubic`) con el barrido GPS.
5. Los lotes «se encienden» uno a uno (60 ms de escalonado).
6. Media vuelta lenta de autorrotación que se detiene al primer toque o a los 8 s.
7. Con `prefers-reduced-motion`: solo la pose final, sin pulsos.
8. El render se detiene por completo cuando la escena está quieta, fuera de pantalla o en una pestaña oculta.

**Respaldo** (en orden)
1. **Sin WebGL2 o con render por software** (`failIfMajorPerformanceCaveat`): mapa 2D en SVG con los polígonos sobre un **hillshade 2D en canvas**, calculado del mismo heightmap (sin three.js; ~3 KB de código propio), con curvas de nivel opcionales. En la landing, el póster.
2. **Sin red y sin caché:** el SVG de lotes sin relieve, con el aviso «Sin señal para cargar el relieve».
3. **Pérdida de contexto WebGL:** mostrar el póster o el 2D y reconstruir la escena en `webglcontextrestored`.

**Presupuesto de peso**

| Concepto | Landing | App (primera vez) | App (siguientes) |
|---|---|---|---|
| JS three.js (chunk diferido) | ~140–150 KB gzip | igual | 0 (caché del SW) |
| JS propio (escena, terreno, UI) | ~10–15 KB | igual | 0 |
| Relieve | 31–106 KB (horneado) | 76–150 KB (z13) | 0 (IndexedDB/SW) |
| Satélite (opcional) | ~57 KB (horneado) | ~150 KB (z15, 3 km) | 0 |
| Póster | ~60–100 KB | — | — |
| **Total** | **≈ 300–430 KB** | **≈ 230–470 KB** | **≈ 0** |

**Pasos de implementación**
1. Elegir y fijar el punto rural de ejemplo y los lotes de demostración. Hornear `relieve-256.png`, `satelite-1024.webp` y `poster.webp` con un script de build (Python/Node fuera del bundle) y guardar las atribuciones junto a los archivos.
2. `terreno.js`: z13 por defecto; respaldo a Mapterhorn (512 px y WebP); cachear el heightmap decodificado en IndexedDB; funciones `pendiente()` y `orientacion()` por punto y por lote.
3. Service worker: ruta «primero guardado» para los tres dominios de teselas, en la caché `cv-relieve-v1` con tope.
4. `escena.js`:
   - Normal en espacio mundo.
   - Exageración adaptativa y zócalo.
   - Modo satélite.
   - Render estrictamente a demanda (quitar el pulso continuo).
   - Manejo de `webglcontextlost` y `webglcontextrestored`.
   - Detector de GPU débil.
   - Liberar el contexto de prueba.
5. UI: ficha de lote; brújula, escala e interruptores; lista accesible de lotes; atribuciones (SRTM/USGS, EOX si hay satélite, Open-Meteo si se usa).
6. Respaldo 2D: SVG de lotes + hillshade en canvas 2D desde el mismo heightmap.
7. Landing: póster → carga diferida → secuencia de entrada; tamaño reservado con `aspect-ratio` para no mover el diseño.
8. Medir en un Android de gama media real: tiempo hasta interacción, FPS al girar (objetivo ≥ 30) y consumo con la escena quieta (debe ser ~0 rAF por segundo).

---

### 6.7 Revisión del borrador que ya existe en el repo [I]

[H] Leí `src/components/finca3d/{Finca3D.jsx, escena.js, terreno.js}`: carpeta sin seguimiento en git, modificada hoy hacia las 19:07–19:09 (posiblemente otro agente trabajando en paralelo). Va en la dirección correcta: terrarium + CORS, shader con curvas `fwidth`, lotes en `CanvasTexture`, raycasting, DPR ≤ 1,75, carga diferida con `IntersectionObserver`, `prefers-reduced-motion` y respaldo. Observaciones concretas:

1. **`terreno.js:63` usa `z = 14`.** Para ~1,6 km son 4 teselas, ~430 KB. Con `z = 13` son 2 teselas, ~76 KB, con la **misma** información de origen (SRTM ~30 m). Ahorro de ~5×.
2. **`escena.js:42` calcula `vNormal` con `normalMatrix`** (espacio cámara), mientras `uLuz` es fija. La luz «gira» con la cámara, y la maqueta cambia de sombreado al rotarla. Usar `mat3(modelMatrix) * normal`.
3. **`escena.js:278-283`:** si no hay reduced-motion, el pulso del anillo pone `seguir = true` en cada cuadro. El bucle **nunca se detiene** (anula el render a demanda y gasta batería) y además llama a `proyectar()` cada cuadro. Mejor un pulso CSS en la etiqueta HTML de la casa, que ya existe.
4. **Sin manejo de `webglcontextlost`/`webglcontextrestored`** en la app: en Android, al volver de otra app puede quedar el canvas negro.
5. **`escena.js:376-381` (`hayWebGL2`)** crea un contexto que nunca libera. Usar `getExtension('WEBGL_lose_context')?.loseContext()`; considerar `failIfMajorPerformanceCaveat: true`.
6. **`terreno.js:52`** comenta que el service worker guarda las teselas, pero `sw.plantilla.js` descarta las peticiones de otros orígenes. Además S3 no envía `Cache-Control`. Sin conexión hoy depende de la caché HTTP heurística.
7. **Relieve casi plano en el ejemplo:** con `extension = 1600` y `exageracion = 1.8` sobre Timbío (~76–80 m de desnivel) el bloque mide ~140 m de alto sobre 1.600 m de ancho. Ver 6.6 (3 km, ×k adaptativo, punto rural).
8. **Atribución:** el texto actual es correcto para el relieve. Conviene añadir el crédito que pide joerd para SRTM («courtesy of the U.S. Geological Survey») y, si se activa satélite, la cadena de EOX.

---

### Anexo: pruebas y fuentes

**Comandos y scripts propios**
- `curl -sI` y `curl -s -D - -o /dev/null -H "Origin: http://localhost:5173"`, con GET, HEAD, OPTIONS y `Range`, contra:
  - AWS terrarium, normal, geotiff y skadi
  - Mapterhorn
  - Copernicus COG 30 m y 90 m
  - EOX WMTS
  - Esri World Imagery
  - sentinel-cogs
  - Earth Search STAC
  - VersaTiles
  - Open-Meteo
- Scripts de apoyo (carpeta temporal, no conservada):
  - `decode_terrarium.py` y `decode_mh.py`: decodificación y altura en la finca.
  - `budget.py`: bytes por área.
  - `bake.py`, `relief.py` y `bake_sat.py`: horneado, desnivel, pendiente y recorte EOX.
- Medición de peso (carpeta temporal): `npm install three@0.186.1 esbuild@0.25.10 maplibre-gl@6.14.0` y build de tres entradas para medir gzip.
- Datos de caniuse: `raw.githubusercontent.com/Fyrd/caniuse/main/features-json/{webgl2,webgpu,webgl}.json`.
- Licencias de repos: `api.github.com/repos/{owner}/{repo}`.

**Fuentes web** (consultadas el 2026-10-15)
- Tilezen joerd: [attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md), [data-sources](https://github.com/tilezen/joerd/blob/master/docs/data-sources.md), [formats](https://github.com/tilezen/joerd/blob/master/docs/formats.md); [AWS Registry terrain-tiles](https://registry.opendata.aws/terrain-tiles/)
- [AWS Registry Copernicus DEM](https://registry.opendata.aws/copernicus-dem/)
- Open-Meteo: [elevation API](https://open-meteo.com/en/docs/elevation-api), [términos](https://open-meteo.com/en/terms)
- Mapterhorn: [attribution.json](https://download.mapterhorn.com/attribution.json), [data access](https://mapterhorn.com/data-access), [repo](https://github.com/mapterhorn/mapterhorn)
- EOX: [licencia](https://cloudless.eox.at/documentation/license), [uso](https://cloudless.eox.at/documentation/usage), [WMTS capabilities](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml)
- Esri: [ítem World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9), [Basemap styles service](https://developers.arcgis.com/documentation/mapping-apis-and-services/maps/services/basemap-layer-service/), [Static basemap tiles](https://developers.arcgis.com/rest/static-basemap-tiles/get-started/)
- [SentiWiki S2](https://sentiwiki.copernicus.eu/web/s2-mission)
- [Earth Search STAC](https://earth-search.aws.element84.com/v1)
- three.js: [Migration Guide](https://github.com/mrdoob/three.js/wiki/Migration-Guide), [foro r163](https://discourse.threejs.org/t/r163-workaround-to-keep-supporting-webgl-1/63547), [manual](https://threejs.org/manual/), [ejemplos](https://threejs.org/examples/)
- Chrome: [WebGPU en Android](https://developer.chrome.com/blog/new-in-webgpu-121), [cuota de almacenamiento](https://developer.chrome.com/docs/workbox/understanding-storage-quota)
- Referencias visuales: las URL listadas en 6.5.

**No verificado**
- Términos de uso del endpoint público de Mapterhorn.
- Política de límites del WMTS de EOX.
- Endpoint con CORS del IGAC.
- Peso real del póster (estimado).
- Rendimiento en un Android físico: no medido aquí; queda como paso 8.
