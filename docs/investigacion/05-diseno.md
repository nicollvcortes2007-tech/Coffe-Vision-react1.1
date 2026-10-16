## 5. Referencias de diseño (15 plataformas y dominio)

Fecha de consulta: 2026-10-15. Convenciones: **[H]** hecho verificado con enlace; **[I]** interpretación propia. Columna «Cómo entra»: **dependencia** (paquete o asset instalado), **técnica reescrita** (código propio inspirado en la técnica, sin copiar fuente) o **solo idea**.

### Conclusión

vgpu sigue vigente y madura rápido: **v0.6.0 estable del 2026-10-12**, MIT, con 39 ejemplos legibles por API, y ya trae lo que necesita una ladera cafetera (rejilla de alturas, instancing, picking por GPU, calidad adaptativa). Aun así es pre-1.0 y no tiene respaldo propio sin WebGPU: `init()` lanza `VGPU-RING1-UNSUPPORTED` y el respaldo lo pone la app. Recomiendo la dirección **«Pergamino de ladera»** [I]: clara (se usa a pleno sol), editorial (Fraunces + Atkinson Hyperlegible Next, ambas OFL), con la cereza como color de acción y las curvas de nivel como sistema gráfico. La ladera 3D queda como mejora diferida, nunca como única vía para ver el estado de los lotes. De las 15 plataformas, 5 no se pudieron leer (Behance, Pinterest, Refero, Layers, sagoi.dev) y quedan declaradas; Skiper UI, Aceternity, Iconly y Canvas UI entran solo como idea o técnica reescrita por sus licencias.

---

### 5.0 Punto de partida verificado en el repo

- [H] El repo usa hoy **React ^19.3.1, Tailwind ^4.3.3 (`@tailwindcss/vite`), Vite ^8.3.4 y `lucide-react` ^1.57.0** (`package.json`). El brief dice React 18: hay una discrepancia que conviene corregir en los documentos.
- [H] `index.html` carga **Font Awesome 6.5.1 desde cdnjs** y 10 archivos de `src/` usan clases de Font Awesome (por ejemplo `src/pages/DashboardCaficultor.jsx` y `src/components/navegacion/Sidebar.jsx`).
- [H] `PRODUCT.md` fija el contexto: «uso en campo, con sol directo, manos ocupadas y señal débil o nula», funciona sin conexión después de la primera visita, objetivos táctiles de 44 px o más, repo público «sin código con licencia que prohíba redistribuirlo». Menciona un `DESIGN.md` que todavía no existe.
- [I] Consecuencias para el diseño: el tema por defecto debe ser **claro y de alto contraste**, sin dependencias de CDN (rompen el modo sin conexión) y con el 3D como capa opcional.

---

### 5.1 Resumen de las 15 plataformas

| # | Plataforma | ¿Se pudo abrir? | Hallazgo principal | Licencia / costo | Cómo entra |
|---|---|---|---|---|---|
| 1 | Awwwards | Sí | 31 sitios de café; Escape Coffee fue SOTD 2024; Farm Minerals (agtech) fue SOTD el 2026-02-19 | Consulta gratuita | Solo idea |
| 2 | Skiper UI | Parcial (catálogo cargado por JS) | Más de 106 componentes para shadcn; casi todos premium (USD 129) | Términos: «uso personal», todos los derechos reservados | Solo idea |
| 3 | Behance | **No** (HTTP 403 en búsqueda; 400 en robots.txt) | Solo vía buscador: «Smart Farm Management SaaS» (NexaFi25) | — | Solo idea (sin verificar) |
| 4 | Pinterest | **No** (robots.txt: `User-agent: *` / `Disallow: /`) | Solo carga el armazón de la página | — | No se usa |
| 5 | Refero | **No** (SPA sin contenido legible; robots.txt bloquea GPTBot) | Plan gratuito con búsqueda limitada; Pro de pago; MCP solo en Pro | Suscripción | Pendiente de revisión manual |
| 6 | Layers.to | **No** (el feed no muestra nada sin sesión) | Solo navegación, «Log in» y «Join for free» | — | Pendiente de revisión manual |
| 7 | Design Spells | Sí (con límite 429 intermitente) | 20 microinteracciones; útiles: confirmación de borrado, cierre de actividad | Gratis | Solo idea |
| 8 | withanimation.app | Sí | Biblioteca SwiftUI: «Particles Rainfall», «Activity Heatmap» | Licencia prohíbe redistribuir; Plus USD 7,99/mes | Solo idea |
| 9 | Iconly | Sí | Más de 40.000 iconos; vitalicio USD 189 | Prohíbe compartir archivos originales | **No se usa** |
| 10 | sagoi.dev | **No** (NXDOMAIN en 1.1.1.1 y 8.8.8.8) | Dominio inexistente | — | No se usa |
| 11 | glass.samasante.com | Sí (código en GitHub) | `@samasante/liquid-glass` 0.1.1, 0 dependencias | **MIT** | Dependencia opcional |
| 12 | Aceternity UI | Sí | Sticky Scroll Reveal, Timeline, Noise Background | Prohíbe redistribuir el código fuente | Técnica reescrita |
| 13 | Canvas UI | Sí | 35 efectos «html-in-canvas»; ahora renderiza con vgpu | MIT + Commons Clause | Técnica reescrita |
| 14 | **vgpu** | Sí (repo, npm, API, docs) | **v0.6.0** (2026-10-12), 39 ejemplos | **MIT** | **Dependencia (diferida)** |
| 15 | Spline | Sí | Runtime 2.0.85 de 36 MB sin licencia declarada | Gratis con marca de agua; Hobby USD 12-15 | Solo idea (se recrea con vgpu) |

---

### 5.2 vgpu en detalle (plataforma prioritaria)

#### Estado y versión

- [H] La última versión es **0.6.0**, publicada en npm el 2026-10-12 (`dist-tags`: `latest` 0.6.0, `next` 0.6.0-rc.2), con 30 versiones desde el 2026-05-26 ([registro npm](https://registry.npmjs.org/vgpu)). Ya no está en v0.5.0 (2026-09-14).
- [H] El repositorio [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) tiene licencia **MIT**, unas 2.539 estrellas, 128 forks y 44 issues abiertas. La rama por defecto es `canary`, con el último push el 2026-10-13. Desde la v0.4 publica releases formales ([v0.6.0](https://github.com/vercel-labs/vgpu/releases/tag/v0.6.0)).
- [H] La v0.6.0 trae cambios incompatibles con la 0.5. Los artefactos `ShaderSource` v2 pasan la reflexión WGSL al build, así que loader y runtime deben actualizarse juntos. También llegan escena con transformaciones explícitas e instancias de capacidad fija, aviso explícito de pérdida de dispositivo (`gpu.lost`) y `canvasMouseTracker`. Hay una guía de migración ([notas de la release](https://github.com/vercel-labs/vgpu/releases/tag/v0.6.0)).
- [H] El índice de ejemplos declara como fuente `github.com/vgpu/vgpu`, que hoy responde 404. El repo canónico sigue siendo `vercel-labs/vgpu` ([índice](https://vgpu.sh/api/examples/v1/latest.json)).

#### API

- [H] Hay un contexto único: `init()` devuelve un `Gpu`, que se pasa como primer argumento a `draw`, `compute`, `effect`, `target`, `uniforms`, `surface`, `clock`, `frame` y `frameLoop` ([README](https://github.com/vercel-labs/vgpu)).
- [H] Los subpaths exportados son `.`, `./core`, `./mock`, `./node`, `./scene`, `./three`, `./client` y `./scene/gpu` (`exports` del paquete 0.6.0). `three` es `peerDependency` opcional (`>=0.180 <0.200`).
- [H] Los `.wgsl` se importan como módulos tipados. Para Vite se usa `wgslVitePlugin()` de `@vgpu/wgsl/loader-vite`, y `@vgpu/wgsl` se instala en la misma versión que `vgpu` ([guía de bundlers](https://vgpu.sh/docs/guides/nextjs)).
- [H] En React, el `useEffect` debe limpiar con `stop()` y `dispose()`: el modo estricto monta dos veces y, si no se limpia, se pierde un dispositivo por cada remontaje ([llms-full](https://vgpu.sh/llms-full.txt)).
- [H] `vgpu/scene` aporta jerarquía, cámara e instancias. **No** trae materiales, luces, culling ni bucle de render: el sombreado lo escribe cada app ([docs, «What vgpu/scene does not do»](https://vgpu.sh/llms-full.txt)).
- [H] Para agentes hay `npx vgpu examples search|pull`, un MCP de solo lectura en `/api/mcp` y `llms.txt` ([vgpu.sh](https://vgpu.sh)).

#### Catálogo de ejemplos (39, leídos por la API)

[H] El catálogo publicado tiene **39 ejemplos** ([índice de la revisión](https://vgpu.sh/.well-known/vgpu-examples.json)). Estos son los relevantes para Coffee+Visión:

| Ejemplo (id) | Qué hace [H] | Uso posible en Coffee+Visión [I] |
|---|---|---|
| `mechanical-garden` | Terreno esculpible: **una rejilla de alturas en CPU** (160×160 celdas) como única fuente de verdad, más instancias de `vgpu/scene` y sombras (`terrain.ts`, `terrain.wgsl`) | Base de la **ladera**: misma estructura de rejilla, ruido fBm con forma de pendiente y alturas en `Float32Array` |
| `modular-city` | Barrios como grupos de instancias; **tocar un edificio lo selecciona con un pase de IDs en GPU** (`picking.ts`, `pick.wgsl`) | **Tocar un lote** en la ladera para abrir su ficha |
| `instanced-rendering` | 125.000 cubos animados con una sola malla y un solo flujo de instancias | Matas de café como instancias, con atributo `madurez` por instancia |
| `adaptive-quality` | Arranca en High y **baja una sola vez a Low** según el nivel de GPU (detect-gpu), la batería (≤30 %) o los FPS presentados | Política de calidad para celulares de gama media |
| `spiral-galaxy`, `fft-ocean` | Partículas movidas por un pase de cómputo con instancing | **Lluvia** ligada al pronóstico |
| `atmosphere` | Cielo físico y nubes volumétricas (Hillaire 2020) | Solo idea: demasiado caro; basta una niebla por altura propia |
| `kinetic-sculpture` | Instancias con sombras en cuatro draws instanciados | Referencia para la sombra suave de las matas (solo en High) |
| `liquid-layout` | Tarjetas DOM con Motion y vidrio renderizado por vgpu | Solo idea |

- [H] Los manifiestos de cada ejemplo no declaran licencia propia, pero viven en el repo MIT ([manifiesto de modular-city](https://vgpu.sh/api/examples/v1/revisions/af8ab2106af8d33b5f10e60b588a0ae5fb0b02de761800e82b85bf82726a3bc4/examples/modular-city/manifest.json)). [I] Para no depender de esa inferencia, los usamos como referencia y escribimos nuestro propio código.
- [H] No hay un ejemplo llamado «heightmap». El terreno de `mechanical-garden` se genera con `fbm` y `simplex2d` desde una semilla, y `@vgpu/wgsl-std/noise/perlin` ofrece fBm «para nubes, terreno, agua» ([docs wgsl-std](https://vgpu.sh/llms-full.txt)).

#### Tamaño y requisitos

- [H] Según el README, «un efecto completo a pantalla completa ocupa 25 KB comprimido con gzip», y ese presupuesto se vigila en CI ([README](https://github.com/vercel-labs/vgpu)).
- [H] El paquete `vgpu` pesa **8,9 MB descomprimido** y declara como dependencias `zod`, `pngjs`, `pixelmatch`, `@modelcontextprotocol/server`, `@vgpu/adapter-node`, `@vgpu/adapter-mock` y `wgpu-matrix` ([registro npm](https://registry.npmjs.org/vgpu)). [I] Casi todo eso es para la CLI, Node y los tests. Hay que **comprobar con el build de Vite** que nada de ello llega al bundle del navegador.
- [H] `detect-gpu` pesa unos 15 KB gzip y la guía lo carga con `import()` dinámico después del primer frame ([guía de calidad adaptativa](https://vgpu.sh/docs/guides/adaptive-quality)).
- [H] Soporte de WebGPU: Chrome 113+, Chrome Android (fila 154), Samsung Internet 24-30 y Safari iOS 26+. Safari de escritorio tiene soporte «parcial» y Firefox figura «desactivado por defecto». Uso global aproximado: 87,8 % ([caniuse](https://caniuse.com/webgpu)).
- [H] En Android, Chrome activa WebGPU **desde la 121, en Android 12+ con GPU Qualcomm o ARM**. Android 11 y otro hardware quedaron para una expansión gradual ([blog de Chrome, 121](https://developer.chrome.com/blog/new-in-webgpu-121)).
- [I] Una parte de los celulares de gama media del Cauca (Android 11 o GPU no soportada) no tendrá WebGPU. El respaldo es obligatorio, no un caso raro.

#### Respaldo cuando no hay WebGPU

- [H] `init()` lanza **`VGPU-RING1-UNSUPPORTED`** cuando no existe WebGPU, cuando la petición de adaptador devuelve `null` o cuando falta la fábrica de adaptadores ([referencia de `init`](https://vgpu.sh/llms-full.txt)).
- [H] La guía de rendimiento recomienda para ese caso «un respaldo estático (póster, degradado CSS)» ([llms-full](https://vgpu.sh/llms-full.txt)).
- [H] `vgpu/mock` es un adaptador determinista para tests y CI, no un respaldo en tiempo de ejecución ([README](https://github.com/vercel-labs/vgpu)).
- [H] `vgpu/node` renderiza sin pantalla con Dawn y lee el resultado con `target.read()` ([README](https://github.com/vercel-labs/vgpu)).
- [I] Idea propia: generar en el build el **póster de respaldo con la misma escena** usando `vgpu/node`, para que el respaldo sea idéntico al 3D y no una imagen aparte.

#### Propuesta para Coffee+Visión: «Ladera viva»

[I] Escena única, ligada a datos de la finca. Se usa en el hero de la landing (con datos de demostración rotulados como ilustración) y como botón «Ver ladera» en el panel de la finca. No es la vista por defecto en el celular.

| Elemento | Técnica en vgpu | Dato que lo mueve | Fuente técnica |
|---|---|---|---|
| Ladera | Rejilla de alturas en CPU (Low 64×64, High 128×128) con fBm y forma de pendiente; normales en CPU | Constante, o altitud de la finca si existe | [H] patrón de `mechanical-garden/terrain.ts`; [I] tamaños |
| Surcos en curva de nivel | En el fragment shader, líneas donde `fract(altura·k)` se acerca a 0. Es el motivo gráfico compartido con el 2D | — | [I] técnica propia |
| Lotes coloreados por estado | Celdas de Voronoi (`@vgpu/wgsl-std/noise`) como lotes; un uniform con el estado de cada lote; tramado además del color | Alertas de broca y roya, cosecha, labores atrasadas | [H] Voronoi en wgsl-std; [I] el mapeo |
| Tocar un lote | Pase de IDs con lectura asíncrona; el mapa se guarda por ID estable, no por slot | Abre la ficha del lote (React/DOM) | [H] `modular-city/picking.ts` y la nota de docs sobre IDs estables |
| Cerezas que maduran | Matas instanciadas con atributo `madurez` 0..1: verde → pintón → cereza → sobremadura | Días desde la floración registrada, según la curva que cite la app (Cenicafé) | [H] instancing de `vgpu/scene`; [I] el mapeo |
| Lluvia | Partículas en un pase de cómputo; cantidad proporcional a los mm/h; inclinación según el viento | Pronóstico horario de Open-Meteo (CC BY 4.0, atribución obligatoria) | [H] [licencia de Open-Meteo](https://open-meteo.com/en/licence); [I] la técnica |
| Niebla de montaña | Niebla exponencial por altura en el shader | Humedad relativa | [I] |
| Calidad | Low por defecto en móvil; render a demanda; tope de 30 fps; DPR 1-1,5; bajar una sola vez y nunca subir solo | detect-gpu (diferido), batería, FPS presentados | [H] [guía de calidad adaptativa](https://vgpu.sh/docs/guides/adaptive-quality) |

Integración [I]:

1. `npm i -E vgpu@0.6.0 @vgpu/wgsl@0.6.0` y `wgslVitePlugin()` en `vite.config.js` ([H] versión exacta por ser pre-1.0).
2. Antes de descargar el chunk 3D se comprueban `'gpu' in navigator`, `navigator.connection?.saveData` y que `effectiveType` no sea `2g` ni `3g`. Si algo falla, no se descarga nada.
3. El componente `LaderaViva` se importa con `React.lazy`, se monta solo cuando entra en pantalla (`IntersectionObserver`) y limpia con `stop()` y `dispose()`.
4. Si `init()` lanza `VGPU-RING1-UNSUPPORTED`, o si se dispara `gpu.lost` dos veces, se muestran el póster AVIF y el mapa 2D.
5. El lienzo lleva `aria-hidden="true"`. Su información está siempre en la lista y el mapa 2D accesibles.
6. Presupuesto del chunk 3D: **90 KB gzip o menos** entre JS y WGSL [I]. Se mide en el build antes de aprobarlo.

Diferencia con AiDEN [I]: en AiDEN la protagonista era la planta (una instancia por planta de vivero). Aquí la protagonista es **el territorio**: la ladera, los lotes como zonas, el clima como atmósfera y la cereza como detalle. Así se reutiliza la técnica (instancing, picking) sin repetir la composición.

Riesgos de vgpu [I]: es pre-1.0, con cambios incompatibles entre versiones menores ([H] 0.5 → 0.6). La escena y el sombreado se escriben a mano porque no hay materiales. La cobertura en Android de gama media es incompleta. El peso de instalación requiere vigilar el tree-shaking. Mitigación: versión fijada, respaldo de primera clase y 3D opcional.

---

### 5.3 Las otras 14 plataformas, una por una

**1. Awwwards**
- [H] El listado de café tiene 31 sitios ([awwwards.com/websites/coffee](https://www.awwwards.com/websites/coffee/)). Solo **Escape Coffee** fue Site of the Day, el 2024-05-15 (7,45/10; Animaciones 8,00), con paleta de dos colores e intros animadas de texto ([ficha](https://www.awwwards.com/sites/escape-coffee)). **Coffee Collective** tiene mención honorífica del 2025-09-26.
- [H] **Farm Minerals**, de ADELT Agency, fue SOTD con Developer Award el 2026-02-19. Tiene un preloader de cultivo de maíz hecho en React ([inspiración](https://www.awwwards.com/inspiration/corn-crop-animation-for-agricultural-minerals-website-farm-minerals), [agencia](https://www.awwwards.com/adelt-agency/)).
- [H] En el listado de agricultura solo Cellular Agriculture Society tiene SOTD, de 2020 ([listado](https://www.awwwards.com/websites/agriculture/)). La «Timeline» de Virtual Farm CleverFarm no muestra detalle legible ([elemento](https://www.awwwards.com/inspiration/timeline-virtual-farm-cleverfarm)).
- Cómo entra: solo idea. [I] Tomamos la contención de Escape Coffee (pocos colores, una intro de texto) y las cifras grandes de Farm Minerals. No usamos preloader: en conexión rural, un esqueleto de carga es más honesto.

**2. Skiper UI**
- [H] Son componentes de un solo archivo para shadcn (Next, Tailwind, Motion). Premium cuesta USD 129 en pago único y «Exclusive» USD 549 (próximamente). Entre los componentes visibles solo «Dynamic island» es gratis ([skiper-ui.com](https://skiper-ui.com)).
- [H] Los términos dicen que todo el material es propiedad de Skiper UI, con «todos los derechos reservados», que el acceso es para uso personal y que se prohíbe republicar o redistribuir. No hay licencia de código explícita ([términos](https://skiper-ui.com/docs/terms-of-service)).
- Cómo entra: **solo idea** (repo público). [I] Idea concreta: revelado de imagen al hacer scroll, para la fotografía de la landing.

**3. Behance**: **no se pudo abrir.**
- [H] La búsqueda devuelve HTTP 403 y `robots.txt` responde 400 al cliente automático ([behance.net](https://www.behance.net/search/projects)). Por buscador solo aparece el perfil [NexaFi25](https://www.behance.net/NexaFi25), con un «Smart Farm Management SaaS — UX UI Dashboard Design» no verificado.
- Cómo entra: solo idea, sin verificar. Pendiente de revisión manual con sesión.

**4. Pinterest**: **no se pudo abrir.**
- [H] `robots.txt` declara `User-agent: *` / `Disallow: /` (solo bots en lista blanca), y la página redirige a co.pinterest.com, que solo entrega el armazón ([robots.txt](https://www.pinterest.com/robots.txt)).
- Cómo entra: no se usa. Se respeta robots.txt.

**5. Refero**: **no se pudo leer.**
- [H] La SPA no entrega contenido sin JavaScript y `robots.txt` bloquea GPTBot ([robots.txt](https://refero.design/robots.txt)). Según su documentación, el plan gratuito tiene búsqueda con resultados limitados y no incluye MCP ni plugin de Figma ([planes](https://doc.refero.design/help/plans)). Las cifras de precio de fuentes secundarias no coinciden entre sí.
- Cómo entra: pendiente. [I] Si David entra con su cuenta, conviene buscar «weather forecast», «camera capture», «offline», «empty state», «map» y «form validation».

**6. Layers.to**: **no se pudo leer.**
- [H] `/explore` solo muestra navegación, «Log in» y «Join for free». No hay publicaciones visibles ([layers.to/explore](https://layers.to/explore)).
- Cómo entra: pendiente de revisión manual con sesión.

**7. Design Spells**
- [H] Hay 20 «spells» visibles. Los útiles son [Delete confirmation animation (Things take time)](https://designspells.com/spells/delete-confirmation-animation-in-things-take-time), [Activity completion transition (Strava)](https://designspells.com/spells/transition-animation-when-completing-an-activity-on-strava) y [Skeuomorphic tear-off calendar (Chengyu Calendar)](https://designspells.com/spells/skeuomorphic-traditional-tear-off-calendar-in-chengyu-calendar). No aparecen spells de clima, mapas, pull-to-refresh ni validación ([designspells.com](https://www.designspells.com)).
- Cómo entra: solo idea. [I] Ideas concretas:
  - Al cerrar el día de recolección, una transición corta con el resumen (kilos de cereza y pago a recolectores).
  - Al borrar un registro, una confirmación con opción de deshacer.
  - Para «días desde la floración», una hoja de calendario.
  - Todo de menos de 300 ms y desactivado con movimiento reducido.

**8. withanimation.app**
- [H] Es una biblioteca de animaciones SwiftUI: gratis en parte, Plus a USD 7,99/mes, vitalicio a USD 29,99. Licencia: uso en apps propias, sin revender, sublicenciar ni redistribuir. Incluye «Particles Rainfall», «Activity Heatmap», «3-D Globe» y «Split Onboarding» ([withanimation.app](https://www.withanimation.app/)).
- Cómo entra: **solo idea** (es SwiftUI y no aplica a la web). [I] El «Activity Heatmap» sirve para un calendario de recolección por día.

**9. Iconly**
- [H] La guía de licencias prohíbe la «redistribución directa» y vender o compartir los archivos originales. Solo el plan vitalicio permite uso comercial ([guía de licencias](https://iconly.pro/pages/licensing-guide)). Precios: Personal USD 8/mes y vitalicio USD 189; hay un plan gratuito de unos 2.000-2.500 iconos ([precios](https://iconly.pro/pricing)).
- Cómo entra: **no se usa**. [I] Un repo público con los SVG equivale a compartir archivos originales. Alternativa: Lucide (ISC, ya instalado) más pictogramas propios del café.

**10. sagoi.dev**: **no se pudo abrir.**
- [H] `dig` devuelve **NXDOMAIN** consultando 1.1.1.1 y 8.8.8.8 (sagoi.dev y www.sagoi.dev), y el buscador no da resultados del dominio.
- Cómo entra: no se usa.

**11. glass.samasante.com (liquid-glass)**
- [H] El paquete es `@samasante/liquid-glass` 0.1.1 (2026-06-23), **MIT**, sin dependencias, con `react >=18` como peer. Su repo [samasante/liquid-glass](https://github.com/samasante/liquid-glass) tiene unas 638 estrellas.
- [H] La técnica es un SDF de rectángulo redondeado convertido en mapa de desplazamiento para `feDisplacementMap`. Curvar la página en vivo solo funciona en Chrome/Edge (`backdrop-filter: url()`); en Safari y Firefox esmerila y tiñe, salvo que se refracte una copia con `refract` ([README](https://github.com/samasante/liquid-glass)).
- Cómo entra: **dependencia opcional y de baja prioridad**. [I] Úsese como mucho en una tarjeta de clima sobre la fotografía de la landing. Riesgos: legibilidad a pleno sol y coste de los filtros SVG en gama media. No va en la app interna.

**12. Aceternity UI**
- [H] Los componentes gratis son de copiar y pegar; entre ellos Sticky Scroll Reveal, Timeline, Noise Background y Bento Grid ([componentes](https://ui.aceternity.com/components)). La licencia prohíbe redistribuir los archivos fuente «independientemente de las modificaciones» ([licencia](https://ui.aceternity.com/licence)).
- Cómo entra: **técnica reescrita**. [I] Ideas concretas:
  - Sticky Scroll Reveal se convierte en «El año cafetero» en la landing (floración → llenado → cosecha → beneficio → pergamino), hecho con `position: sticky` y CSS.
  - Timeline se convierte en una línea de tiempo de labores por lote.
  - Noise Background se convierte en un grano de papel hecho con `feTurbulence` propio.

**13. Canvas UI**
- [H] Tiene 35 componentes, entre ellos «Clouds» (niebla que se aparta con el cursor), «Droplets» (gotas que refractan la página) y «Particle Scroll». Renderiza con GPU a través de vgpu, y el modo «html-in-canvas» requiere una flag experimental de Chrome ([canvasui.dev](https://canvasui.dev), [componentes](https://canvasui.dev/components)).
- [H] La licencia es MIT + Commons Clause: permite usar y distribuir el software «como parte de una aplicación, sitio web o producto», pero no vender, sublicenciar ni redistribuir «los componentes en sí», ni sueltos, ni en paquete, ni portados ([LICENSE](https://github.com/DavidHDev/canvas-ui)).
- Cómo entra: **técnica reescrita**. [I] Tener el archivo del componente en un repo público queda en zona gris, así que se reescribe una niebla y unas gotas propias con vgpu, solo para la landing.

**15. Spline**
- [H] El plan gratuito publica con marca de agua o logo de Spline. Hobby (USD 12-15) la quita en 3D web; la exportación de código es desde Pro y el autoalojado solo en Enterprise ([precios](https://spline.design/pricing)).
- [H] `@splinetool/runtime` 2.0.85 (2026-10-15) no declara licencia en npm y pesa unos **36 MB descomprimido** ([npm](https://www.npmjs.com/package/@splinetool/runtime)).
- Cómo entra: **solo idea**. [I] Pesa demasiado para conexión rural y es propietario; como en AiDEN, lo que haga falta se recrea con vgpu.

---

### 5.4 Referencias de dominio (10)

| # | Referencia | Qué hay [H] | Idea concreta que se toma [I] | Cómo entra |
|---|---|---|---|---|
| 1 | [La Palma y El Tucán](https://lapalmayeltucan.com) (Zipacón, Cundinamarca) | Banners a sangre de la finca, tomas aéreas de bosque de niebla; finca a 1.700 m; lotes de café verde agrupados en programas con nombre | **Composición**: el dato de lugar como titular. En el panel: «Finca La Esperanza · Timbío, Cauca · 1.750 msnm» en serif grande sobre foto aérea | Solo idea |
| 2 | [Onyx Coffee Lab: Colombia Edinson Oidor](https://onyxcoffeelab.com/products/colombia-edinson-oidor) (Inzá, Cauca) | Pares etiqueta-valor (variedad, proceso, elevación, taza) y bloque «Transparency» con iconos: costo del verde, transporte, costo de producción, C Market, puntaje, tamaño del lote | **Visualización de datos**: ficha de lote en pares etiqueta-valor, y un bloque de costos por kilo frente al precio de referencia, cada cifra con su fuente | Solo idea |
| 3 | [Coffee Collective](https://coffeecollective.dk) (mención Awwwards, [ficha](https://www.awwwards.com/sites/coffee-collective)) | Hero sobrio: un café destacado, una línea de sabor, una sola llamada a la acción; enlace a su informe de transparencia | **Composición**: hero de la landing con una sola promesa y un solo botón | Solo idea |
| 4 | [Sey Coffee](https://www.seycoffee.com) | Títulos con patrón fijo «[Año] [Productor] x [Socio] – [País]»; notas de sabor en prosa | **Tipografía y nomenclatura**: nombres de cosecha y lote consistentes («Cosecha 2026 · Lote 3 La Loma · Castillo») | Solo idea |
| 5 | [Farm Minerals](https://www.farmminerals.com/promo) (SOTD 2026-02-19) | Cifras grandes («≥5× return»), mapa de ensayos con marcadores, iconos de beneficio y un preloader de cultivo | **Datos**: cifras grandes en el panel («142 @ c.p.s. en 2026») con una línea de fuente debajo | Solo idea |
| 6 | [OneSoil](https://onesoil.ai) | Mapas satelitales con zonas de salud del cultivo por color; «AI Agronomist» que revisa cada campo a diario y ordena qué necesita atención | **Patrón de producto**: «Hoy en la finca», lista ordenada de lotes que piden acción, más un mapa de lotes coloreado por estado | Solo idea |
| 7 | [Agworld](https://www.agworld.com) | Ficha de campo con secciones fijas (Actividades, Snapshot de costos, Observaciones); estados «Due today»; seguimiento real vs. plan (N 12 de 150); sincronización sin conexión | **Patrón de producto**: ficha de lote con secciones siempre en el mismo orden; estados «Para hoy / Atrasada / Hecha»; barra real vs. plan de fertilización | Solo idea |
| 8 | [Plantix](https://plantix.net/en/) | Flujo foto → diagnóstico y tratamiento «en segundos» → biblioteca → preguntar a expertos | **Flujo**: diagnóstico por foto en tres pasos con guía de encuadre, resultado con nivel de confianza y «qué hacer», y enlace a la guía de Cenicafé | Solo idea |
| 9 | [earth.nullschool.net](https://earth.nullschool.net/about.html) (código en [cambecc/earth](https://github.com/cambecc/earth)) | Mapa animado de viento y clima con capas de color, datos GFS cada 3 horas | **Microinteracción y datos**: la lluvia y el viento del pronóstico como partículas, no como icono de nube | Técnica reescrita (vgpu) |
| 10 | [Making Sense: diseño inclusivo para agricultores](https://makingsense.com/blog/post/inclusive-design-app-case-study-for-farmers-in-emerging-markets) | Iconos e ilustraciones simples, ubicación constante, evitar animaciones, deshabilitar en vez de ocultar, textos de nivel de 6.º grado, onboarding mínimo | **Reglas de UX** para usuarios rurales (apartado 5.7) | Solo idea |

Notas de dominio:
- [H] Cenicafé publica apps propias como «Manejo Agronómico», limitada a caficultores registrados en SICA ([App Store](https://apps.apple.com/us/app/cenicafe-manejo-agron%C3%B3mico/id1522601981)). [I] Es la autoridad que deben citar las guías y alertas.
- [H] Dribbble responde HTTP 202 (reto anti-bot) y no se pudo leer. Por buscador solo aparecieron perfiles de dashboards agrícolas sin verificar. Por eso no se cita ninguno.

---

### 5.5 Tres direcciones visuales candidatas

Contrastes calculados con la fórmula WCAG 2.x (script propio). «Fondo» y «superficie» son los dos tonos de base de cada paleta.

#### A. «Pergamino de ladera» (cuaderno de campo editorial): **recomendada [I]**

- **Concepto**: la app como un cuaderno de campo en papel pergamino. Titulares serif con voz editorial, cifras grandes y claras, fotografía documental del Cauca a sangre en la landing, y una ladera 3D que se lee como mapa. Clara, no oscura: pensada para el sol directo.
- **Paleta y contrastes** [I, calculados]:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `pergamino` | `#F4EDE1` | Fondo | — |
| `papel` | `#FBF7F0` | Tarjetas y superficies | — |
| `tierra` | `#2B1E16` | Texto principal | 13,9:1 sobre fondo; 15,1:1 sobre papel |
| `tierra-media` | `#5E4B3C` | Texto secundario | 7,1:1 |
| `cereza` | `#A3261B` | Acción primaria, «actuar hoy» | 6,3:1 sobre fondo; blanco encima 7,4:1 |
| `cereza-viva` | `#C8372D` | Solo gráficos y 3D (4,47:1, no apto para texto pequeño) | — |
| `hoja` | `#2E5B3A` | Estado «al día» | 6,75:1; blanco encima 7,85:1 |
| `hoja-clara` | `#7FA36B` | Rellenos de gráfico | `tierra` encima 5,66:1 |
| `pinton` | `#C98F2E` | Relleno de «vigilar» | `tierra` encima 5,73:1 |
| `pinton-texto` | `#8A5A12` | Texto de aviso | 5,08:1 |
| `niebla` | `#DDE4E2` | Clima y «sin datos» | `tierra` encima 12,5:1 |
| `borde-campo` | `#8C7A68` | Borde de inputs | 3,86:1 sobre papel (mínimo no textual 3:1) |

- **Semántica** [I]: la escala de maduración del grano sirve también de escala de estado: hoja = al día, pintón = vigilar, cereza = actuar hoy (cosechar o controlar), niebla = sin datos. El rojo significa «madura» y «alerta» a la vez, así que **siempre** va con icono y texto.
- **Tipografía** [H, licencia verificada en el [repo de Google Fonts](https://github.com/google/fonts/tree/main/ofl/fraunces)]:
  - **Fraunces** (OFL; ejes `wght`, `opsz`, `SOFT`, `WONK`) para titulares de 24 px o más, con `WONK 0` y `SOFT` moderado.
  - **Atkinson Hyperlegible Next** (OFL; `wght`) para interfaz, cuerpo y cifras. Está «desarrollada específicamente para aumentar la legibilidad en lectores con baja visión» ([descripción en Google Fonts](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegiblenext)).
- **Imagen y 3D** [I]: fotografía documental propia (cerezas en rama, manos recolectando, patios de secado, ladera con niebla), con color natural cálido y sin filtros ni stock de marca. Ladera vgpu en el hero de la landing y «Ver ladera» en el panel. Las curvas de nivel aparecen en 2D (mapa de lotes, separadores) y en 3D (surcos).
- **Riesgos** [I]:
  - Fraunces pierde legibilidad por debajo de 24 px: no se usa en la interfaz.
  - El crema puede verse lavado al sol: las tarjetas van en `papel` y nunca hay texto gris claro.
  - Riesgo de cliché «café artesanal»: nada de granos ni tazas ilustrados.
  - El 3D es opcional y diferido, así que la gama media no paga su costo.

#### B. «Curvas de nivel» (cartografía de montaña y niebla)

- **Concepto**: la finca como mapa topográfico. Curvas de nivel, altitudes y coordenadas funcionan como tipografía; la niebla del Macizo y el basalto del Puracé ponen el tono. La ladera 3D es protagonista en todas las vistas de finca.
- **Paleta y contrastes** [I, calculados]:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| niebla | `#E8EDEB` | Fondo | — |
| nube | `#F7F9F8` | Superficie | — |
| basalto | `#17242A` | Texto principal | 13,4:1 |
| pizarra | `#4A5A60` | Texto secundario | 6,1:1 |
| hoja de sombra | `#2F5A45` | Estado «al día» | 6,65:1 |
| cereza | `#A92D26` | Acción | 5,74:1 |
| páramo | `#4E6F80` | Solo texto grande o iconos | 4,54:1 |
| curva | `#9DB0A9` | Decorativo | — |
| pintón (relleno) | `#C68A2C` | «Vigilar» | basalto encima 5,35:1 |

- **Tipografía** (OFL verificada [H]): **Bricolage Grotesque** (display; `opsz`, `wdth`, `wght`) + **Public Sans** (interfaz) + **IBM Plex Mono** (msnm, coordenadas, códigos de lote).
- **Imagen y 3D** [I]: casi sin fotografía; la imagen es el mapa. vgpu con curvas de nivel y niebla en todas las vistas de finca.
- **Riesgos** [I]:
  - Frío y poco «café».
  - Muchas líneas finas generan ruido al sol y en pantallas pequeñas.
  - Depende más del 3D, lo que perjudica a la gama media.
  - La mono baja la legibilidad para usuarios con poca práctica lectora.

#### C. «Tueste nocturno» (cinematográfica oscura)

- **Concepto**: landing como película, con fondo de café tostado, cerezas rojas iluminadas, titulares serif condensados y scroll cinematográfico. La app interna iría aparte, en claro.
- **Paleta y contrastes** [I, calculados]:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| tostado | `#1A120D` | Fondo | — |
| cisco | `#2A1D15` | Superficie | — |
| crema | `#F2E8D8` | Texto principal | 15,2:1 |
| crema media | `#C9B8A2` | Texto secundario | 9,6:1 |
| cereza encendida | `#EF5B4C` | Acción | 5,5:1 sobre fondo; 4,9:1 sobre superficie |
| hoja viva | `#7DB37A` | Estado «al día» | 7,6:1 |
| oro pergamino | `#D9B779` | Acento | 9,7:1 |

- **Tipografía** (OFL verificada [H]): **Instrument Serif** (display) + **Instrument Sans** (interfaz; `wdth`, `wght`).
- **Imagen y 3D** [I]: fotografía en clave baja; 3D con bloom HDR.
- **Riesgos** [I]:
  - Ilegible a pleno sol, que contradice `PRODUCT.md`.
  - El bloom y el HDR son caros en gama media.
  - Es el lenguaje habitual de las marcas de café premium (cliché).
  - Rompe la continuidad entre la landing y la app.

#### Por qué A [I]

A es la única que cumple a la vez:
1. El contexto de uso real: sol directo y gama media.
2. La identidad propia del café: el «pergamino» es literalmente el estado del grano que vende el caficultor (c.p.s.), y la cereza es el color de acción.
3. El objetivo editorial y cinematográfico, que se concentra en la landing y en una sola pieza 3D opcional.

De B se toma el motivo de **curvas de nivel** como sistema gráfico, y opcionalmente una mono para msnm. C se descarta para la app y como mucho se guarda la idea de una sección oscura en la landing.

---

### 5.6 Componentes y técnicas candidatos (15, por prioridad)

| Prioridad | Componente o técnica | Fuente | Licencia | Cómo entra |
|---|---|---|---|---|
| 1 | Tokens de la paleta A y tipografía en `@theme` de Tailwind 4 | Propio | MIT del repo | Técnica propia |
| 2 | Cambiar Font Awesome por **Lucide** (`lucide-react` 1.57, ya instalado) | [lucide-icons/lucide](https://github.com/lucide-icons/lucide/blob/main/LICENSE) | **ISC** [H] | Dependencia (existente) |
| 3 | Pictogramas propios del café (cereza, broca, roya, pergamino, floración, ladera) en SVG; sustituyen los emojis | Propio | MIT del repo | Técnica propia |
| 4 | Fraunces + Atkinson Hyperlegible Next **autoalojadas** (woff2, subset latin y latin-ext) | [google/fonts](https://github.com/google/fonts) | **OFL** [H] | Dependencia (assets) |
| 5 | Mapa de lotes 2D en SVG con curvas de nivel, vista canónica y accesible | [d3-contour 4.0.2](https://www.npmjs.com/package/d3-contour) o código propio | **ISC** [H] | Dependencia opcional |
| 6 | Ficha de lote en pares etiqueta-valor con línea «Fuente: …» en cada cifra | Idea de Onyx | — | Técnica propia |
| 7 | «Hoy en la finca»: lista ordenada de acciones por lote | Idea de OneSoil | — | Técnica propia |
| 8 | **Ladera viva** (vgpu: rejilla de alturas, Voronoi de lotes, instancias, picking) | [vgpu 0.6.0](https://github.com/vercel-labs/vgpu) | **MIT** [H] | Dependencia diferida |
| 9 | Calidad adaptativa (patrón del ejemplo `adaptive-quality`) + `@pmndrs/detect-gpu` 6.0.26 | [vgpu docs](https://vgpu.sh/docs/guides/adaptive-quality), [detect-gpu](https://github.com/pmndrs/detect-gpu) | **MIT** [H] | Técnica reescrita + dependencia diferida |
| 10 | Póster de respaldo generado en el build con `vgpu/node` | vgpu | MIT [H] | Técnica propia |
| 11 | Lluvia y niebla ligadas a Open-Meteo (partículas en cómputo) | Idea de nullschool; datos de [Open-Meteo](https://open-meteo.com/en/licence) | Datos **CC BY 4.0** con atribución [H] | Técnica reescrita |
| 12 | «El año cafetero»: scroll fijo de la landing con CSS `sticky` | Idea de Aceternity Sticky Scroll Reveal | Aceternity prohíbe redistribuir [H] | Técnica reescrita |
| 13 | Microinteracciones (registro guardado, cierre del día, borrar con deshacer) con **Motion** 14.3 | [motiondivision/motion](https://github.com/motiondivision/motion); ideas de Design Spells | **MIT** [H] | Dependencia |
| 14 | Grano de papel pergamino con `feTurbulence` (SVG en línea, en lugar de una imagen) | Propio, inspirado en Noise Background | — | Técnica propia |
| 15 | Vidrio líquido en una sola tarjeta de clima de la landing | [@samasante/liquid-glass 0.1.1](https://github.com/samasante/liquid-glass) | **MIT** [H] | Dependencia opcional (baja prioridad) |

Descartados como código: Skiper UI (términos restrictivos), Iconly (prohíbe compartir archivos originales), Aceternity (prohíbe redistribuir el código fuente), Canvas UI (Commons Clause, zona gris en repo público), Spline (runtime propietario de 36 MB) y withanimation (SwiftUI, no redistribuible) [H en cada enlace del apartado 5.3].

---

### 5.7 Accesibilidad y rendimiento para usuarios rurales

**Contraste (AA)**
- [I] Todo texto en `tierra` o `tierra-media` sobre `pergamino` o `papel` supera 7:1. La `cereza` de acción con texto blanco da 7,4:1.
- [I] `cereza-viva` (4,47:1) y `pinton` (relleno) **no** se usan para texto pequeño. Los bordes de inputs usan `#8C7A68` (3,86:1, por encima del 3:1 no textual).
- [I] El estado nunca se comunica solo con color: color + icono + palabra, y tramado en el mapa (para daltonismo).

**Sol directo y legibilidad** [I]
- Tema claro por defecto.
- Cuerpo de 17-18 px en la app (mínimo 16 px), interlineado de 1,5 y peso de 400 o más.
- Nada de grises claros sobre crema.
- Cifras en las unidades del gremio (kg de cereza, @ y cargas de c.p.s.) con formato es-CO («1.250 kg»).
- Lenguaje de nivel de 6.º grado, como recomienda la referencia de Making Sense [H].

**Objetivos táctiles**
- [H] `PRODUCT.md` exige 44 px. [I] Para uso en campo, con guantes o manos ocupadas, se recomiendan **48×48 px** para las acciones primarias y 8 px de separación.
- [I] Acciones principales al alcance del pulgar (barra inferior). Ningún gesto obligatorio sin botón equivalente.
- [I] Lo no disponible se deshabilita, no se oculta (Making Sense [H]).

**Peso de página** (presupuestos [I], a medir con el build)
- Primera carga de la landing: 300 KB o menos por la red, sin el 3D. Imagen LCP en AVIF de 80 KB o menos.
- Shell de la app: 170 KB gzip de JS o menos.
- Fuentes: dos woff2 en subset, 90 KB en total o menos.
- Quitar Font Awesome desde cdnjs ([H] `index.html`): es una petición externa que además rompe el modo sin conexión.
- El chunk 3D (90 KB gzip o menos) solo se descarga a demanda.

**Movimiento reducido** [I]
- Con `prefers-reduced-motion: reduce`: sin parallax, sin lluvia animada, la ladera en un solo frame (render a demanda) y las transiciones de Motion desactivadas (`useReducedMotion`).
- Ninguna información depende de una animación.

**Respaldo sin WebGPU**
- [H] Ante `VGPU-RING1-UNSUPPORTED` o `gpu.lost`: [I] póster AVIF de la misma escena y mapa 2D.
- [I] Sin `navigator.gpu`, con `saveData` o en 2G/3G, el chunk 3D no se descarga.
- [H] Con batería al 30 % o menos, o FPS bajos, se baja a Low una sola vez ([guía de calidad adaptativa](https://vgpu.sh/docs/guides/adaptive-quality)).
- [I] El lienzo lleva `aria-hidden` y toda su información existe en la lista y el mapa 2D, navegables con teclado y lector de pantalla.

**Sin conexión** [I]
- Fuentes, iconos y pictogramas autoalojados y cacheados por el service worker.
- La atribución de Open-Meteo queda visible junto a los datos de clima ([H] [licencia de Open-Meteo](https://open-meteo.com/en/licence)).
- La fecha y la hora de la última actualización del pronóstico, siempre visibles.

---

### 5.8 Fuentes consultadas (2026-10-15)

- vgpu: [repo](https://github.com/vercel-labs/vgpu) · [release v0.6.0](https://github.com/vercel-labs/vgpu/releases/tag/v0.6.0) · [npm](https://www.npmjs.com/package/vgpu) · [sitio](https://vgpu.sh) · [descubrimiento de ejemplos](https://vgpu.sh/.well-known/vgpu-examples.json) · [documentación completa](https://vgpu.sh/llms-full.txt) · [calidad adaptativa](https://vgpu.sh/docs/guides/adaptive-quality) · [bundlers/Vite](https://vgpu.sh/docs/guides/nextjs)
- WebGPU: [caniuse](https://caniuse.com/webgpu) · [Chrome 121 en Android](https://developer.chrome.com/blog/new-in-webgpu-121)
- Plataformas: [Awwwards café](https://www.awwwards.com/websites/coffee/) · [Awwwards agricultura](https://www.awwwards.com/websites/agriculture/) · [Skiper UI](https://skiper-ui.com) · [términos de Skiper](https://skiper-ui.com/docs/terms-of-service) · [Behance](https://www.behance.net/search/projects) · [robots de Pinterest](https://www.pinterest.com/robots.txt) · [Refero](https://refero.design) · [planes de Refero](https://doc.refero.design/help/plans) · [Layers](https://layers.to/explore) · [Design Spells](https://www.designspells.com) · [withanimation](https://www.withanimation.app/) · [licencias de Iconly](https://iconly.pro/pages/licensing-guide) · [liquid-glass](https://github.com/samasante/liquid-glass) · [licencia de Aceternity](https://ui.aceternity.com/licence) · [Canvas UI](https://canvasui.dev) · [licencia de Canvas UI](https://github.com/DavidHDev/canvas-ui) · [precios de Spline](https://spline.design/pricing)
- Dominio: [La Palma y El Tucán](https://lapalmayeltucan.com) · [Onyx: Edinson Oidor](https://onyxcoffeelab.com/products/colombia-edinson-oidor) · [Coffee Collective](https://coffeecollective.dk) · [Sey](https://www.seycoffee.com) · [Farm Minerals](https://www.farmminerals.com/promo) · [OneSoil](https://onesoil.ai) · [Agworld](https://www.agworld.com) · [Plantix](https://plantix.net/en/) · [earth.nullschool](https://earth.nullschool.net/about.html) · [Making Sense](https://makingsense.com/blog/post/inclusive-design-app-case-study-for-farmers-in-emerging-markets) · [Cenicafé Manejo Agronómico](https://apps.apple.com/us/app/cenicafe-manejo-agron%C3%B3mico/id1522601981)
- Licencias de recursos: [Google Fonts (OFL)](https://github.com/google/fonts/tree/main/ofl) · [Lucide (ISC)](https://github.com/lucide-icons/lucide/blob/main/LICENSE) · [Motion (MIT)](https://github.com/motiondivision/motion) · [detect-gpu (MIT)](https://github.com/pmndrs/detect-gpu) · [d3-contour (ISC)](https://www.npmjs.com/package/d3-contour) · [Open-Meteo (CC BY 4.0)](https://open-meteo.com/en/licence)
