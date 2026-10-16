## 1. Competencia y referencias funcionales

**Conclusión.** [I] En Colombia el caficultor ya cuenta con una capa oficial gratuita y sólida: el SICA georreferenciado, extensionistas que en 2026 trabajan sin conexión y envían las recomendaciones por WhatsApp, y apps y chatbots de Cenicafé. Pero está diseñada desde la institución: repartida en apps separadas que exigen registro en SICA, con poca adopción (de 500 a 1.000+ descargas en Google Play) y sin un cuaderno propio de labores, kilos, costos y ventas. Las plataformas comerciales (Cropster, Farmforce, Koltiva, Agridence, SourceTrace) le venden a cooperativas, exportadores y compradores, y el reglamento europeo EUDR (obligatorio desde el 30-dic-2026 para operadores grandes y medianos) refuerza esa orientación. El hueco para Coffee+Visión es una PWA gratuita, en español y que funcione sin conexión, centrada en los registros del propio productor: lotes, labores, kilos, costos, floraciones y muestreos con método Cenicafé, que se compartan por WhatsApp y se exporten a GeoJSON. No le conviene imitar la IA ni los chatbots que la FNC ya ofrece gratis.

> **Leyenda.** **[H]** = hecho verificado, con enlace a la fuente. **[I]** = interpretación o inferencia propia. En las tablas, «?» = no se pudo verificar. **Fecha de consulta de todas las fuentes: 2026-10-15.** Cuando la fuente tiene fecha de publicación, se indica.

### 1.0 Método y límites

- [H] Revisé páginas oficiales (FNC, Cenicafé, Comisión Europea, sitios de cada empresa), fichas de Google Play y App Store, documentos PDF (informe de gestión 2025 de la FNC, Avances Técnicos de Cenicafé, boletín del Comité del Quindío, piloto MAIA de la OIT) y prensa (Agronegocios, Portafolio, La República, Forbes Colombia, Mongabay, Valora Analitik).
- [H] Páginas que no cargaron o bloquearon el acceso el 2026-10-15: enveritas.org (403/Cloudflare), gsma.com (pide JavaScript y cookies), geotraceability.com (el dominio no resuelve), el ABC de la cédula cafetera de la FNC (`ABC-CC-V14-Oct.pdf`, 404), el PDF de las guías UNESCO-Pearson (bloqueado), alliancebioversityciat.org/publications (403) y Contexto Ganadero (403). En esos casos usé fuentes secundarias y lo indico.
- [H] No encontré los productos «Coffee Tools», ni una app de la FNC llamada «Caficultor», ni una app llamada «Tienda cafetera» (ver 1.2.8 y 1.3).

---

### 1.1 Quién es el usuario: datos que condicionan el diseño

- [H] El 96 % de los productores tiene menos de 5 ha y aporta el 60 % de la producción, según datos de la UPRA ([Agronegocios, 2024](https://www.agronegocios.co/agricultura/pequenos-productores-de-cafe-representan-96-del-total-segun-datos-de-la-upra-3832230)). Publicaciones de la FNC ponen el cultivo promedio en 1,2 a 1,3 ha (datos SICA 2012 y FNC 2016, citados en la misma búsqueda).
- [H] La edad promedio del productor es de 57 años y el 30 % son mujeres (estudio de José Leibovich para la FNC, reseñado por la [Universidad del Rosario](https://urosario.edu.co/periodico-nova-et-vetera/nuestra-u/poblacion-cafetera-muestra-signos-de-reduccion-2050); sin fecha visible).
- [H] El SICA tiene más de 500.000 caficultores registrados y casi 400.000 registros de cédula cafetera ([FNC, Informe de Gestión 2025, publicado en junio de 2026](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)). Mongabay lo describe con unos 1,8 millones de lotes y cerca de 500.000 familias ([Mongabay, 2026-03-04](https://news.mongabay.com/2026/03/colombias-coffee-industry-well-placed-but-wary-as-eu-deforestation-rule-looms/)).
- [H] En 2025 la producción fue de 13,7 millones de sacos, con una productividad de 21,03 sacos/ha. El precio interno promedió $2.861.890 por carga de 125 kg de café pergamino seco (51 % más que en 2024), y la densidad llegó a 5.373 árboles/ha ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).
- [H] El 2026-10-15 la FNC publicaba un precio interno de referencia de $2.095.000/carga, con la Bolsa de NY en 294,80 ¢/lb y la tasa de cambio en 3.170 ([FNC, Estadísticas cafeteras](https://federaciondecafeteros.org/wp/estadisticas-cafeteras/)). [I] Frente al promedio de 2025 es una caída de cerca del 27 %: el precio es volátil y saber el costo por carga importa.
- [H] El 56,9 % de los hogares rurales tenía internet en 2025, contra el 32,2 % de 2022, según la ECV del DANE ([MinTIC, actualizado 2026-04-27](https://mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/437305:Gobierno-Petro-conecto-3-5-millones-de-hogares-en-tres-anos-y-por-primera-vez-mas-de-la-mitad-de-los-hogares-rurales-tienen-internet)). [I] Más de 4 de cada 10 hogares rurales siguen sin internet en casa, así que funcionar sin conexión es un requisito y no un adorno.
- [H] Más de 387.000 caficultores (el 73 %) están bancarizados mediante la cédula o la tarjeta cafetera ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).

---

### 1.2 Ecosistema oficial: FNC y Cenicafé

#### 1.2.1 SICA (Sistema de Información Cafetera)

- [H] Es la base de datos georreferenciada de caficultores, fincas y lotes de la FNC. La administra la Gerencia Técnica y la actualizan en terreno los extensionistas. Registra coordenadas, altitud, productores, fincas y áreas; el tipo de lote (tecnificado joven, envejecido o tradicional); la variedad (resistente o susceptible a CBD y roya); la densidad (árboles/ha); la edad; y si el cultivo está al sol, bajo sombra o semisombra ([FNC-IGAC, Atlas Cafetero, introducción](https://publicaciones.cenicafe.org/index.php/atl/article/download/2962/2951/2638)).
- [H] Según el mismo atlas, la FNC considera «tecnificado joven» un cafetal al sol de menos de 9 años, o bajo sombra o semisombra de menos de 12 años; desde esas edades pasa a «envejecido». El aplicativo «SICA móvil» deja a los extensionistas registrar en la finca **sin internet** y sincronizar al llegar a un sitio con conexión ([FNC-IGAC, Atlas Cafetero, cap. «Colombia cafetera»](https://publicaciones.cenicafe.org/index.php/atl/article/download/2966/2959/2654)).
- [H] El SICA también sirve para sortear al azar los lotes de los sondeos fitosanitarios nacionales: 3.144 lotes de 2 a 7 años en julio de 2026 ([Boletín fitosanitario Nº 20](https://publicaciones.cenicafe.org/index.php/fitosanitario/article/download/5668/6558/5484)).
- [H] En 2025 los extensionistas visitaron 174.798 predios para actualizar el SICA ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).
- [H] Los datos son privados: compartirlos exige autorización expresa (habeas data) del caficultor. En agosto de 2024 la meta era que el 93 % autorizara compartir su georreferenciación con los exportadores ([La República, 2024](https://www.larepublica.co/empresas/la-fnc-lanzara-una-plataforma-para-poder-acceder-a-coordenadas-de-lotes-cafeteros-3935560)). No encontré la cifra final.
- **Patrón a tomar:** [I] Usar el mismo modelo de datos del lote que el SICA (área, variedad, edad, densidad, sombra, coordenadas). El caficultor reconoce esos campos y, si algún día hay integración, no habrá que transformar nada.

#### 1.2.2 Servicio de Extensión: digitalización en 2026

- [H] En 2025 el Servicio de Extensión registró 1.375.264 atenciones y cubrió cerca de 432.400 caficultores (77 %) desde 15 comités departamentales. Incluye un programa de «gestión empresarial» con 113.929 atenciones en manejo administrativo de la finca ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).
- [H] El Comité del Quindío anunció que las recomendaciones de la visita del extensionista ya salen digitales desde el SICA. Se trabaja **sin conexión** en la finca, la recomendación llega al **WhatsApp** del productor segundos después de la visita y el extensionista la dicta con **reconocimiento de voz** en su tableta, con la meta de «cero papel». También se planean las rutas de campo con herramientas llamadas «PRO» ([Actualidad Cafetera, ed. 163, Comité de Cafeteros del Quindío; archivo subido en agosto de 2026](https://quindio.federaciondecafeteros.org/wp-content/uploads/sites/11/2026/08/Actualidad-Cafetera-Ed-163-1.pdf)).
- **Patrón a tomar:** [I] Es la evidencia más fuerte y más reciente de lo que funciona en Colombia: captura offline, salida por WhatsApp y voz para dictar. Coffee+Visión debería replicar esos tres rasgos del lado del caficultor.

#### 1.2.3 Cédula y tarjeta cafetera

- [H] Para tener la cédula hay que estar registrado en el SICA y tener al menos media hectárea y 1.500 árboles de café. Funciona como documento gremial (para votar en las elecciones cafeteras) y como instrumento financiero: cuenta, pago de la venta de café y retiros cerca de la finca ([Agronegocios](https://www.agronegocios.co/agricultura/todo-lo-que-necesita-saber-sobre-la-cedula-cafetera-y-que-beneficios-tiene-con-ella-3829335)).
- [H] En agosto de 2025 Davivienda se sumó como operador de la cédula y la tarjeta, y ese año se gestionaron 15.451 solicitudes. La FNC estrenó además un «nuevo aplicativo de cedulación» para sus colaboradores, porque la radicación era manual ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).
- [H] Davivienda y Grupo Bolívar tienen el canal «Al Grano» en WhatsApp y Facebook, con clima, precios del café, productos financieros y educación ([Agronegocios, 2025-09-24](https://www.agronegocios.co/agricultura/del-jornal-al-celular-inclusion-financiera-digital-para-caficultores-4229244)).
- [I] Quien tiene menos de 0,5 ha o menos de 1.500 árboles no accede a la cédula y queda fuera de varias herramientas que exigen el SICA. Coffee+Visión no debería pedir ese registro.

#### 1.2.4 Apps móviles de Cenicafé y la FNC (Google Play / App Store)

| App | Qué hace [H] | Descargas en Google Play [H] | Notas [H] |
|---|---|---|---|
| **Cenicafé: Manejo Agronómico** | Información sobre las principales plagas, enfermedades, arvenses y deficiencias nutricionales del café en Colombia ([Play](https://play.google.com/store/apps/details?id=com.ticcenicafe.manejoagronomico2025)) | 1 mil+ | En iOS: gratis, versión 2.4.1, 168,7 MB, con inicio de sesión ([App Store](https://apps.apple.com/us/app/cenicafe-manejo-agron%C3%B3mico/id1522601981)). El resumen de un buscador citaba que es solo para caficultores registrados en el SICA y personal de la FNC, pero la página actual no lo dice. No está confirmado |
| **Cenicafé Indicadores mano obra** | Consultar y registrar rendimientos de mano de obra por labor, para contratar labores y comparar ([Play](https://play.google.com/store/apps/details?id=com.ticcenicafe.indicadoresmanoobra)). Muestra el rendimiento mínimo, promedio y máximo de cada labor ([Agronegocios, Profesor Yarumo](https://www.agronegocios.co/aprenda/consejos-del-profesor-yarumo-indicadores-de-rendimiento-de-mano-de-obra-del-cultivo-de-cafe-3555915)) | 1 mil+ | En iOS: 123,7 MB, versión 2.0 con inicio de sesión ([App Store](https://apps.apple.com/us/app/id1489603647)) |
| **Cenicafé: Más calidad** | Monitorear el café en las etapas de poscosecha (beneficio y secado) ([Play](https://play.google.com/store/apps/details?id=org.cenicafe.app.masCalidad)) | 500+ | — |
| **Fedecafeteros** | Solo eventos de la FNC: agenda, conferencistas y noticias ([Play](https://play.google.com/store/apps/details?id=com.fedecafe.eventos)) | 1 mil+ | No es una herramienta de finca |

- [I] Frente a unos 500.000 caficultores, entre 500 y 1.000+ descargas es una adopción muy baja. Hay varias explicaciones posibles: el registro previo en SICA, apps de 120 a 170 MB, una app por cada tema, o que el canal real sea el extensionista. Coffee+Visión debería ser **una sola** app ligera.
- [H] No encontré apps oficiales separadas de «broca», «fertilización» o «renovación». Las recomendaciones de fertilización salen del análisis de suelos y el extensionista las ajusta ([Cenicafé, Avance Técnico](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/download/494/548/508)). La broca se trata en la plataforma Agroclima (ver abajo).

#### 1.2.5 Plataforma Agroclimática Cafetera (Cenicafé)

- [H] [agroclima.cenicafe.org](https://agroclima.cenicafe.org/) ofrece condiciones actuales, boletín diario, registros históricos y pronóstico de lluvia, además de las aplicaciones «Épocas de siembra», «Vuelos de broca», «Geoportal» y «Balance hídrico», y el Boletín agrometeorológico. Los enlaces de las herramientas usan rutas públicas («guest»).
- [H] El módulo de vuelos de broca muestra las capturas semanales en trampas de las estaciones de Cenicafé ([Agronegocios](https://www.agronegocios.co/aprenda/plataforma-agroclimatica-cafetera-2622316)).
- **Patrón a tomar:** [I] Enlazar, no duplicar. Coffee+Visión puede mostrar un clima local sencillo por lote (ver módulo 8) y llevar al boletín de Cenicafé para la recomendación oficial.

#### 1.2.6 Chatbots AdrIAna y SantIAgo (Cenicafé)

- [H] **AdrIAna** está dirigida al caficultor y responde preguntas técnicas «en lenguaje claro». Funciona 24/7 en cenicafe.org, agroclima.cenicafe.org, publicaciones.cenicafe.org y Facebook Messenger. **SantIAgo** es para los extensionistas y está integrada en el SICA. Su base de conocimiento son 634 documentos de Cenicafé. Entre marzo y mayo de 2025 recibieron 1.232 consultas reales, y una prueba con 32 extensionistas dio: utilidad alta 72 %, usabilidad 97 %, claridad 75 % y velocidad 91 % ([Cenicafé, Avances Técnicos 585, 2026, DOI 10.38141/10779/0585](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715)).
- [H] Requieren internet (unos 10 segundos por respuesta), no reemplazan al extensionista, y Cenicafé trabaja en integrarles voz e imagen. Para enseñar a usarlas, Cenicafé publica videos paso a paso con código QR (misma fuente).
- [I] Un chatbot propio de Coffee+Visión sobre conocimiento general del café competiría con una herramienta oficial gratuita y respaldada. Si se hace un asistente, debe diferenciarse respondiendo sobre **los datos del propio caficultor** (ver módulo 11).

#### 1.2.7 Cafenlace, precio del café y canales

- [H] **Cafenlace** es la plataforma de exportación de la FNC, inaugurada en octubre de 2025. Conecta al caficultor con compradores en el exterior, con «trazabilidad en línea». Solo pueden vender caficultores registrados en el SICA, y Almacafé recibe el café, verifica la calidad, le paga al productor y exporta ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf); [folleto paso a paso, sept. 2025](https://federaciondecafeteros.org/app/uploads/2025/09/folleto-paso-a-paso.pdf), resumido por el buscador porque el PDF no descargó directamente).
- [H] La FNC publica a diario el precio interno de referencia (en PDF) y las estadísticas mensuales en XLSX ([FNC](https://federaciondecafeteros.org/wp/estadisticas-cafeteras/)).
- [H] El canal de WhatsApp de la FNC pasó de 4.700 a 44.002 seguidores en 2025 (+836 %). La Fundación Manuel Mejía hace formación con «microlearning» por WhatsApp, y la FNC también usa SMS, pódcast, radio, un chatbot y el personaje Profesor Yarumo ([FNC, Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).

#### 1.2.8 Lo que pediste verificar y no existe o cambió

- [H] **App «Caficultor» de la FNC:** no la encontré en Google Play, en el App Store ni en prensa. Las apps de la FNC en Play son las cuatro de la tabla 1.2.4.
- [H] **«Tienda cafetera»:** no existe como app para el caficultor. La FNC tiene una tienda en línea de café para consumidores, comprocafedecolombia.com, lanzada en 2021 ([Portafolio, 2021-02-17](https://www.portafolio.co/negocios/cafe-federacion-nacional-de-cafeteros-de-colombia-abre-tienda-en-linea-549239)). Los insumos se venden por las cooperativas y por Agrocafé ([FNC, Agrocafé](https://www.federaciondecafeteros.org/static/files/Agrocaf%C3%A9,_20_a%C3%B1os_al_servicio_de_los_cafeteros_de_Colombia.pdf)).
- [H] **Apps «agroclima», «broca», «fertilización» y «renovación» de Cenicafé:** Agroclima es una plataforma web, no una app de tienda. Broca está dentro de Agroclima. No hay apps de fertilización ni de renovación (ver 1.2.4).

#### 1.2.9 Qué datos maneja hoy el caficultor con estas herramientas

- [I] Los datos del predio y del lote (SICA) los registra y actualiza el **extensionista**, no el caficultor. Lo que recibe el caficultor son recomendaciones (cada vez más por WhatsApp), el precio diario, sus pagos por la cédula y la consulta de referencias (manejo agronómico, rendimientos de mano de obra, poscosecha). **Ninguna herramienta oficial encontrada le lleva al caficultor su propio registro diario** de labores, jornales, kilos recogidos, gastos, ventas y rentabilidad. Ese es el espacio de Coffee+Visión.

---

### 1.3 Software específico de café

> Formato de cada ficha: **Qué hace** · **Público** · **Precio** · **Idioma** · **Sin conexión** · **Cómo registra en campo** · **Patrón a tomar**.

**Cropster Origin** (Austria)
- [H] *Qué hace:* inventario de café verde (ventas de lotes, estado de trilla, bodegas), laboratorio con app de catación en el celular y trazabilidad de muestras. El plan Professional suma «Lot Traceability & Transactions», calidad avanzada y gestión de equipo y tareas ([Cropster Origin](https://www.cropster.com/products/origin/)).
- [H] *Público:* productores que procesan, gestionan calidad y tienen microtostadora ([Cropster](https://www.cropster.com/products/origin/)). El observatorio de la FAO dice que la usan sobre todo fincas medianas y grandes y cooperativas ([FAO Agritech Observatory](https://agritechobservatory.review.fao.org/ar/cropster)).
- [H] *Precio:* Professional desde 199 €/mes (hasta 5 plantas de proceso) y Enterprise desde 990 €/mes, con una base mensual más un cobro por uso ([precios de Cropster Origin](https://www.cropster.com/pricing/origin/), leído directamente del HTML).
- [H] *Idioma:* la página ofrece EN, DE, ES, PT, KO y ZH.
- [H] *Sin conexión:* no está confirmado en las páginas actuales. Un resultado de búsqueda mencionaba «Offline coffee reception» en un plan «Foundation» para organizaciones pequeñas de países productores, pero ese plan ya no aparece en la página de precios.
- *Patrón a tomar:* [I] La «recepción de café» por lote (peso, humedad, calidad y catación desde el celular). Una versión simple sirve para registrar la cosecha y la venta de cada lote.

**Farmer Connect → Agridence** (Suiza → Singapur)
- [H] *Cambio:* en agosto de 2025 Agridence compró Farmer Connect ([Baker McKenzie, 2025-08](https://www.bakermckenzie.com/en/newsroom/2025/08/agridence-acquires-farmer-connect)). El 2026-10-15, farmerconnect.com redirigía (301) a agridence.com.
- [H] *Qué hace hoy:* «AgriTrace» captura datos móviles con o sin conexión (polígonos de parcelas, compras, encuestas). Tiene «GeoJSON Studio», un validador gratuito de parcelas, y «ConnectHub», que arma y envía las declaraciones de diligencia debida (DDS) del EUDR al sistema TRACES de la UE. Sus clientes son beneficios y procesadores, traders, importadores, cooperativas y ONG ([Agridence](https://agridence.com/)). El sitio no detalla nada propio del café.
- [H] *Precio:* no es público.
- [H] La CBI todavía cita la app de consumidor «Thank My Farmer» de Farmer Connect como ejemplo ([CBI, actualizado 2026-05-07](https://cbi.eu/market-information/coffee/tips-go-digital)). No verifiqué si sigue activa tras la compra.
- *Patrón a tomar:* [I] Validar el polígono antes de exportarlo (sin cruces de líneas, cerrado, coordenadas con 6 decimales).

**Enveritas** (ONG, EE. UU.)
- [H] *Qué hace:* verificación de sostenibilidad y riesgo de deforestación que combina imágenes satelitales, aprendizaje automático y equipos en campo. Se enfoca en pequeños productores no afiliados y la verificación es gratuita para ellos ([World Coffee Portal, 2024](https://worldcoffeeportal.com/Latest/InsightAnalysis/2024/May/Enveritas-big-idea-for-coffee-sustainability); [UCDA Uganda](https://ugandacoffee.go.ug/node/990)). Tiene un portal EUDR para socios ([partners.enveritas.org](https://partners.enveritas.org)).
- [H] *Acceso:* enveritas.org devolvió 403 (Cloudflare), así que no pude verificar precios, idioma ni modo sin conexión en su sitio.
- *Patrón a tomar:* [I] Un «semáforo de riesgo» por lote es valioso, pero requiere datos satelitales. Para Coffee+Visión es más realista exportar un GeoJSON que el comprador valide en Whisp (ver 1.6).

**Algrano** (Suiza, mercado de café verde)
- [H] *Qué hace:* le da al productor, sin costo, un CRM, cotizaciones, una vitrina de cafés, mensajería y seguimiento de contratos. Cobra una «Matchmaking fee» de 0,44 o 0,22 USD/kg, con tope del 6 % del valor FOB, durante 3 años, y solo cuando Algrano le consigue un tostador nuevo. Ofrece prepagos de hasta el 70 % del FOB desde el segundo año ([Algrano, precios](https://algrano.com/pricing); [ayuda Algrano](https://help.algrano.com/matchmaking-fee)).
- [I] *Público:* productores y cooperativas con capacidad de exportar, no el caficultor de 1 ha que vende en pergamino al punto de compra.
- *Patrón a tomar:* [I] La «ficha de presentación del café» (finca, variedad, proceso, altitud, fotos). Sirve como módulo de perfil del lote o microlote para venta directa.

**Farmforce** (Noruega/Suiza)
- [H] *Qué hace:* herramientas móviles de «primera milla» que capturan puntos o polígonos, registro y consentimiento del productor, documentos de tierra, fechas de siembra y cosecha, volúmenes y cadena de custodia, cruzados con Global Forest Watch Pro. Está hecha para baja conectividad: **modo sin conexión**, GPS y roles. Se enfoca en cacao y café ([GFW Pro, spotlight Farmforce](https://pro-news.globalforestwatch.org/news-events/gfw-pro-user-spotlight-farmforce)).
- [H] *Público:* encuestadores, agentes de compra y empresas afectadas por el EUDR. *Precio:* no es público.
- *Patrón a tomar:* [I] Pedir el consentimiento del productor dentro de la app antes de compartir sus datos. Es el mismo principio de habeas data del SICA.

**SourceTrace (DATAGREEN)** (EE. UU./India)
- [H] Plataforma SaaS con trazabilidad, georreferenciación, gestión de finca, carbono y cumplimiento EUDR. Se presenta como socio de grandes productores de café, cacao y algodón orgánico. Precio solo por demo, sin dato de modo sin conexión en su página ([SourceTrace](https://www.sourcetrace.com/)).

**Koltiva (KoltiTrace)** (Indonesia/Suiza)
- [H] Trazabilidad «de la semilla a la mesa» con verificación de parcelas para el EUDR. Dice operar en 94 países, entre ellos Colombia, y en 68 cultivos. Sobre café solo hay un pie de foto. Precio: «hable con un experto» ([Koltiva](https://www.koltiva.com/)).

**GeoTraceability (OPTEL)**
- [H] El dominio geotraceability.com no resolvió el 2026-10-15. Según fuentes secundarias, permite seguir los cultivos desde la parcela hasta la planta, arma planes de negocio por finca para los extensionistas y se cobra por suscripción a beneficios y traders ([GrowAsia](https://digital.growasia.org/solutions/geotraceability)). Tuvo un caso en café de Vietnam que enviaba sin conexión los datos de cada saco desde bodegas remotas ([OPTEL, caso de estudio](https://www.optelgroup.com/app/uploads/2021/11/cs_traceabilitybringmorevisibilityvietnamesecoffeeproduction_en_mkt_7049.pdf)). Opera sobre todo en Asia.

**Producers Direct + Croppie** (ONG de pequeños productores, Reino Unido/LatAm/África)
- [H] Croppie es una app Android que **estima la cosecha a partir de fotos de ramas** tomadas con el celular, contando los frutos con visión artificial. Se desarrolló con la Alianza Bioversity-CIAT en Perú, Colombia y Honduras y es gratuita ([Alianza Bioversity-CIAT](https://alliancebioversityciat.org/tools-innovations/croppie-photocropping-app)). Entre 2020 y 2022, 2.392 productores de Colombia y Perú aportaron datos, y usa gamificación ([BMZ Digital](https://www.bmz-digital.global/en/ai-coffee-intelligent-awake/)). Producers Direct afirma una precisión de alrededor del 90 %, con entrega por app, SMS y WhatsApp ([Incofin](https://agtech.incofin.com/project/producers-direct)). En Google Play, «Croppie (impulsado por GeoFarmer)» solo admite café y tiene 500+ descargas ([Play](https://play.google.com/store/apps/details?id=org.geocitizen.croppie)).
- [I] La cifra del 90 % viene de material promocional; no encontré una validación independiente.
- *Patrón a tomar:* [I] Un protocolo de campo guiado («fotografíe 2 ramas productivas de este árbol») y gamificación para que el productor vuelva a registrar.

**Nespresso AAA**
- [H] No encontré una herramienta digital pública del programa AAA para caficultores. La información disponible es institucional y antigua: unos 70.000 productores en 12 países y un piloto de ahorro para el retiro en Caldas ([TriplePundit, 2015](https://www.triplepundit.com/story/2015/nespresso-makes-progress-improving-lives-coffee-farmers/115311)).

**Starbucks C.A.F.E. Practices**
- [H] Starbucks tiene una herramienta de trazabilidad **para el consumidor**: escanea la bolsa y ve el origen. La pilotó en 2018 con productores de Costa Rica, Colombia y Ruanda ([GCR](https://www.gcrmag.com/starbucks-explores-bean-to-cup-journey-with-new-digital-traceability-tool)). En 2025 SCS publicó la versión 4 del estándar, con verificación por niveles y transición en 2025-2026 ([SCS Global Services](https://www.scsglobalservices.com/services/starbucks-cafe-practices)). No encontré una app pública para el productor.

**TechnoServe: TerraTrac**
- [H] App Android gratuita para geolocalizar fincas según el EUDR: un punto si la finca tiene menos de 4 ha y un polígono si tiene más. Guarda los datos en el teléfono y **funciona sin conexión** ([TechnoServe Labs](https://www.technoserve.org/tns-labs/terratrac-eudr-compliance/)). Según Google Play, importa y exporta **CSV y GeoJSON**, comparte listas de fincas **por WhatsApp** y correo, respalda en un servidor y tiene 1 mil+ descargas ([Play](https://play.google.com/store/apps/details?id=org.technoserve.farmcollector)).
- *Patrón a tomar:* [I] Es casi el módulo de «lotes» ideal para Coffee+Visión: punto o polígono según el tamaño, guardado local y salida en GeoJSON por WhatsApp.

**Rainforest Alliance (plataforma de certificación RACP)**
- [H] En la RACP las fincas certificadas cargan polígonos, datos de cultivo y cosecha y su evaluación de riesgo. Los compradores ven los datos EUDR solo si los activan («opt-in»), y el productor puede pedir que no se compartan ([RA, sistemas en línea](https://knowledge.rainforest-alliance.org/docs/introduction-to-rainforest-alliance-online-systems); [RA y EUDR](https://www.rainforest-alliance.org/business/certification/how-the-rainforest-alliance-supports-eudr-compliance-from-farm-to-retailer/)). Exige polígono para unidades de 4 ha o más, punto para las demás, y 6 decimales ([webinar RA, ene-2024](https://www.rainforest-alliance.org/wp-content/uploads/2024/02/EUDR-Webinar-January-2024.pdf)).

**Coffee Tools y Cafe Imports**
- [H] «Coffee Tools»: no identifiqué un producto con ese nombre. Las búsquedas devolvieron Cropster, TCCA de ECropOrigin, gratis para productores ([Tea & Coffee](https://www.teaandcoffee.net/?p=24303)), y otras apps.
- [H] Cafe Imports es un importador. No encontré una herramienta suya de gestión de finca para productores.

**Otras relevantes que aparecieron**
- [H] **ofi (Olam) OFIS:** app Android para técnicos de campo que mapean fincas con GPS, gestionan capacitaciones y registran compras, insumos y financiación. Alimenta la plataforma AtSource ([ofi](https://ofi.com/innovation/digital-technology-and-tools/olam-farmer-information-system.html)).
- [H] **Dimitra Connected Coffee (Kenia):** inglés y suajili, funciona sin conexión, registro de fincas y riesgo de deforestación ([Food Business MEA](https://www.foodbusinessmea.com/dimitra-partners-with-naccu-to-digitally-equip-kenyan-coffee-farmers-for-eu-deforestation-free-trade-rules/)).
- [H] **Terra Kaape (Honduras):** gestión para cooperativas de café y cacao (trazabilidad de lotes, cosecha, contabilidad), usada por 26 organizaciones con más de 11.700 productores ([Incofin](https://agtech.incofin.com/project/terra-kaape)).
- [H] La CBI recomienda a los productores elegir herramientas de varios usos y **quedarse con la propiedad de sus datos**. Recomienda mapear con polígonos en vez de puntos, y advierte que la tecnología básica suele aportar más valor al principio que la IA o los drones ([CBI, actualizado 2026-05-07](https://cbi.eu/market-information/coffee/tips-go-digital)).

---

### 1.4 Software genérico de finca (solo lo relevante para café)

| Plataforma | Qué hace y para quién [H] | Precio [H] | Sin conexión [H] | ¿Café? [H] | Patrón a tomar [I] |
|---|---|---|---|---|---|
| **AGRIVI 360** ([agrivi.com](https://www.agrivi.com/)) | Software empresarial: operaciones, economía de la finca, trazabilidad. Su «AI Companion» de texto y voz está en beta privada (sept. 2026) | Propuesta a medida, sin precio público | Sí (captura móvil sin conexión) | La página no menciona café | Costos por lote ligados a cada labor |
| **Farmbrite** ([precios](https://www.farmbrite.com/pricing)) | Planificación, tareas, mapa de finca, trazabilidad de cosecha, inventario, contabilidad | Crop de 29 a 59 USD/mes; Complete de 59 a 109 USD/mes | Sí («registro y monitoreo sin conexión»; apps iOS/Android) | No es específico | Tareas y recordatorios, más «registrar sin red y sincronizar» |
| **Croptracker** ([precios](https://www.croptracker.com/pricing.html)) | Reloj de jornales, aplicaciones, cosecha, empaque, control de calidad, visión artificial para frutas | Desde 3.300 USD/año (10 usuarios) | No indicado | No; frutas y hortalizas | Jornales y pago por kilo de cada trabajador |
| **Cropwise (Syngenta)** | Monitoreo, operaciones y recomendación de aplicaciones. Unos 1,9 M ha en Argentina, Colombia, México y Guatemala ([DPL News](https://dplnews.com/?p=315016)); la prensa brasileña lo menciona para café ([Boca](https://boca.com.br/tecnologia/syngenta-digital-lanca-ferramenta-cropwise-para-agricultores-brasileiros)) | ? | ? | Mención general; no encontré un módulo cafetero | — |
| **Agroptima** ([precios](https://www.agroptima.com/es/precios/)) | Cuaderno de campo oficial (España), costos y beneficios, cuadrillas | Básico, Pro y Premium según ha y usuarios; sin cifras públicas; prueba de 15 días | No indicado | No | Registro de labores por cuadrilla |
| **Auravant** | Monitoreo satelital y mapas de prescripción | Freemium; en 2021 planes desde 25 a 50 USD/mes ([Enter.co, 2021](https://www.enter.co/startups/inversion/agricultura-de-precision-auravant)) | ? | No específico | — |
| **Plantix** ([plantix.net](https://plantix.net/en/)) | Diagnóstico por **foto**, comunidad y biblioteca. Gratuita; dice haber respondido más de 100 M de consultas. Su biblioteca incluye roya del café, minador, ojo de gallo (brown eye spot), antracnosis, CBD y deficiencias ([biblioteca Plantix](https://plantix.net/en/library/plant-diseases/)), pero **la broca no aparece** en ese listado | Gratis (con expertos de pago en la comunidad) | No: «permanent network connectivity required» ([Engineering for Change](https://engineeringforchange.org/?p=67262)) | Sí, parcial | Flujo «foto → posible problema → qué hacer» |
| **xarvio (BASF)** | No encontré evidencia de uso en café | ? | ? | No encontrado | — |
| **Solinftec** | Robots Solix; prototipos para café de montaña en Cerrado Mineiro (Brasil) ([AgFeed](https://agfeed.com.br/grande-slam-do-agro/agrishow/fazendas-100-robotizadas-e-robo-jipe-os-passos-da-solinftec-para-faturar-r-2-bi-em-29/)) | ? | ? | Brasil, gran escala | — |

- [I] Ninguna plataforma genérica está pensada para un caficultor colombiano de 1 ha: o cobran en dólares o euros, o no hablan del café, o están hechas para fincas empresariales. Sí sirven como referencia de patrones: tareas, jornales, costos por lote y trabajo sin conexión.

---

### 1.5 Startups e iniciativas en Colombia y Latinoamérica

- [H] **Agenda Cafetera (Buxtar, Colombia):** cronograma de floración y fertilización, manejo de broca y roya, pronóstico de cosecha, análisis de broca y roya, proveedores cercanos, asistencia técnica virtual 24/7 e historial de actividades. Tiene **10 mil+ descargas** en Google Play ([Play](https://play.google.com/store/apps/details?id=com.agendacafeterav2_1)) y un módulo de poscosecha con 50+ ([Play](https://play.google.com/store/apps/details?id=com.agendaposcosechamobile)). En 2021 tenía 9.500 descargas, una versión básica gratuita y una licenciada con cálculo de costos y alertas, usada por unos 500 clientes (asociaciones, empresas y grandes productores), con apoyo de iNNpulsa ([Portafolio, 2021-01-21](https://www.portafolio.co/innovacion/agenda-cafetera-app-colombiana-para-caficultores-completa-9-500-descargas-cafe-en-colombia-548434)). [I] Es el competidor directo más parecido a Coffee+Visión. Que tenga más descargas que las apps de Cenicafé indica que el calendario de labores y las alertas sí interesan.
- [H] **Caffer: precio del café (Colombia):** precio en tiempo real por departamento, precio según factor de calidad, precio de pasilla, gráfico de bolsa, alertas de cambio de precio y un «muro cafetero». Tiene **10 mil+ descargas** ([Play](https://play.google.com/store/apps/details?id=com.cocupo.preciodelcafe)). [I] El precio es de lo más demandado. La app dice que sus precios están «avalados» por la FNC, pero no lo verifiqué.
- [H] **MAIA Cafetero (OIT, Huila):** asesora por **WhatsApp** que reconoce **texto y audio**, recuerda conversaciones anteriores y manda consejos semanales y mensajes de bienvenida. Usa una base de conocimiento validada (guías de la OIT y del Huila) y cubre gestión, costos, contabilidad, trabajo decente, formalización y temas técnicos. Se pilotó de enero a junio de 2025 con más de 500 caficultores (60 % mujeres), con una línea base de 448 encuestas ([OIT](https://www.ilo.org/es/maia-cafetero-inteligencia-artificial-al-servicio-del-campo-colombiano); [presentación del piloto, mayo de 2025](https://www.ilo.org/sites/default/files/2025-05/PILOTO%20MAIA%20SST%20vf.pdf)). La propia OIT señala como retos la resistencia a lo digital y la necesidad de ajustar el lenguaje y la interfaz (misma fuente).
- [H] **SmartAgro / LAYERS (CODESPA, norte del Cauca):** 500 caficultores de Miranda (300) y Caldono (200). Usa IA sobre imágenes satelitales para recomendaciones agronómicas y blockchain para trazabilidad «cero deforestación». Incluye **alfabetización digital** y formación de **promotores técnicos veredales** ([infografía CODESPA](https://www.codespa.org/app/uploads/Infografia-SmartAgro.pdf)). [I] Es relevante por estar en el Cauca, la región de Popayán: muestra que la adopción allí requiere intermediarios formados.
- [H] **Secafe (Colcafé):** app de acompañamiento para el **secado** del pergamino, lanzada el 22 de agosto de 2025 en Farallones del Citará con la meta de llegar a más de 1.000 pequeños productores ([Incofin](https://agtech.incofin.com/colcafe-and-farmers-launch-digital-coffee-drying-app-in-farallones-del-citara)).
- [H] **Agrapp (Colombia):** se pasó a WhatsApp porque «el sector rural está muy envejecido» y las herramientas complejas no se usan. Tramitó 11.000 solicitudes de financiación en un año. Forbes cita además una penetración de internet rural del 28,3 % según el DANE, una cifra de 2023 ya superada ([Forbes Colombia, 2023-05-09](https://forbes.co/tecnologia/agrotech-en-colombia)).
- [H] **Yara CoffeeClub (Colombia):** se lanzó en 2021 con recomendaciones según el calendario, clima, precios y chat con agrónomos ([Agronegocios](https://www.agronegocios.co/agricultura/yara-colombia-lanzo-aplicativo-para-el-desarrollo-y-mejoramiento-de-cultivos-de-cafe-3143036)), y Forbes la describió como diseñada para funcionar sin internet. **No la encontré en Google Play el 2026-10-15** (búsqueda «coffeeclub yara»). [I] Probablemente fue retirada.
- [H] **iFinca (Colombia):** plataforma bilingüe con blockchain que verifica el precio pagado en finca y ofrece QR para el consumidor. Hacia 2020 tenía unos 9.430 productores en 8 países ([Daily Coffee News, 2020-04-09](https://dailycoffeenews.com/2020/04/09/blockchain-backed-trading-platform-ifinca-promises-to-verify-farmgate-prices)). No encontré noticias de 2025-2026.
- [H] **Semillatech (Antioquia):** según la prensa, tiene un modelo de visión artificial que identifica enfermedades del café en fotos de celular y se probó con cooperativas del Eje Cafetero ([Gestión&Negocios, 2025-05-13](https://gestionynegocios.co/startups-tecnologicas-colombianas-apuestan-por-inteligencia-artificial-para-transformar-el-agro/)). [I] No pude verificarlo en otra fuente.
- [H] **Prototipo académico en el Cauca:** app con etiquetas NFC/RFID para trazar café especial en La Vega, probada con 6 caficultores ([Unicomfacauca, 2025](https://repositorio.unicomfacauca.edu.co/handle/3000/379)).
- [H] **Coffee Cloud (Centro Clima/Anacafé, Guatemala, Honduras y Costa Rica):** mide incidencia y severidad de roya en campo **sin internet** y da recomendaciones inmediatas según el nivel y el clima ([Perfect Daily Grind, 2018](https://perfectdailygrind.com/2018/09/combating-leaf-rust-with-phone-apps-in-guatemala/); [Ecoticias](https://www.ecoticias.com/eco-america/126750_presentan-herramientas-reducir-sector-cafetalero)).
- [H] **El ecosistema:** según iNNpulsa, en tres años surgieron más de 120 startups agtech y el 35 % incorpora IA ([Gestión&Negocios, 2025-05-13](https://gestionynegocios.co/startups-tecnologicas-colombianas-apuestan-por-inteligencia-artificial-para-transformar-el-agro/)).

---

### 1.6 Trazabilidad EUDR: estado de la norma y herramientas

#### 1.6.1 Estado a octubre de 2026
- [H] El Reglamento (UE) 2023/1115 se modificó con el Reglamento (UE) 2025/2650, publicado en el Diario Oficial el 23-dic-2025. Ahora aplica desde el **30-dic-2026** a operadores y comerciantes grandes y medianos, y desde el **30-jun-2027** a micro y pequeños ([Consejo de la UE, 2025-12-18](https://www.consilium.europa.eu/en/press/press-releases/2025/12/18/deforestation-council-signs-off-targeted-revision-to-simplify-and-postpone-the-regulation/); [EY, 2026](https://taxnews.ey.com/news/2026-0237-eu-deforestation-regulation-application-postponed-to-30-december-2026)). La página oficial confirma que aplica «desde el 30 de diciembre de 2026» ([Comisión Europea, Green Forum](https://green-forum.ec.europa.eu/nature-and-biodiversity/deforestation-regulation-implementation_en)).
- [H] La revisión de simplificación de la Comisión se publicó el 4-may-2026 y descartó un nuevo aplazamiento. El Anexo I se modificó con el Reglamento Delegado (UE) 2026/2102 (DO del 17-sep-2026, vigente desde el 18-sep-2026). El café soluble entra al alcance desde el 30-dic-2027 ([Coolset, rastreador actualizado el 2026-09-24](https://www.coolset.com/academy/eudr-delay-2025-explained); el número 2026/2102 lo confirma la [Comisión](https://green-forum.ec.europa.eu/nature-and-biodiversity/deforestation-regulation-implementation_en)).
- [H] Colombia está clasificada como **riesgo «estándar»** según el Reglamento de Ejecución (UE) 2025/1093, del 22-may-2025. Los únicos países de alto riesgo son Bielorrusia, Myanmar, Corea del Norte y Rusia ([Fieldfisher](https://www.fieldfisher.com/en/insights/the-eu-deforestation-regulation-european-commission-classifies-countries-as-high-low-or-standard-risk)). Es una fuente secundaria: no pude abrir el anexo oficial.
- [H] El Informe de Gestión 2025 de la FNC dice que la obligación quedó para el «31 de diciembre de 2026», un día distinto del texto europeo, y que la FNC desarrolla herramientas como el acceso a la georreferenciación, una «Matriz de Legalidad», capacitaciones y coordinación con la OIC y la ECF ([FNC](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).

#### 1.6.2 Qué exige en geolocalización
- [H] Las parcelas de **más de 4 ha** requieren **polígono**; las de 4 ha o menos pueden ir como **punto**. Se piden latitud y longitud con al menos **6 decimales** y un polígono por parcela ([Fairtrade, requisitos de geolocalización](https://www.fairtrade.net/content/dam/fairtrade/global/fairthrive/Geolocation%20data%20requirements%20EUDR.pdf); [webinar RA](https://www.rainforest-alliance.org/wp-content/uploads/2024/02/EUDR-Webinar-January-2024.pdf)).
- [H] Las guías de proveedores indican que el Sistema de Información de la UE recibe **GeoJSON en WGS-84 (EPSG:4326)** ([TraceX, guía de proveedor](https://tracextech.com/geographic-coordinate-requirements-for-eudr/)). Es una fuente secundaria: no encontré la especificación técnica oficial.
- [I] La declaración simplificada y la alternativa de dirección postal para micro y pequeños operadores primarios estarían ligadas a países de bajo riesgo según Coolset. Como Colombia es de riesgo estándar, el productor colombiano que exporte por su cuenta seguiría necesitando geolocalización. Esto hay que confirmarlo con el texto consolidado.

#### 1.6.3 Colombia frente al EUDR
- [H] Colombia se considera «un poco adelante» gracias al SICA. Un exportador dice que la geolocalización está «en gran parte resuelta» y que más de 1.000 agrónomos y técnicos recogen el consentimiento de los productores. Los pequeños productores e indígenas conocen poco la norma, y preocupan los costos de los datos y la tenencia informal de la tierra ([Mongabay, 2026-03-04](https://news.mongabay.com/2026/03/colombias-coffee-industry-well-placed-but-wary-as-eu-deforestation-rule-looms/)). En abril de 2026, FoodNavigator reportó brechas para los pequeños productores, que necesitan apoyo práctico y financiero ([FoodNavigator, 2026-04-17](https://www.foodnavigator.com/Article/2026/04/17/eudr-how-ready-is-coffee/)).

#### 1.6.4 Herramientas EUDR (comerciales y abiertas)
- [H] *Comerciales:* Agridence (AgriTrace, ConnectHub), Farmforce, Koltiva, SourceTrace, Enveritas y Rainforest Alliance (RACP), descritas en 1.3.
- [H] *Gratuitas o abiertas* ([EFI, 2026-07-07](https://efi.int/publication/what-tools-are-available-comply-eudr)):
  - **Open Foris Ground** (FAO): captura con el mapa como eje, funciona sin conexión en Android y exporta CSV/GeoJSON.
  - **KoboToolbox**: formularios con puntos y polígonos sin conexión (licencia AGPL).
  - **GeoRoots**: valida y repara GeoJSON en el navegador o sin conexión, sin guardar datos.
  - **INATrace**: trazabilidad abierta con app móvil offline.
  - **WHIMO** (EFI): pensada para funcionar primero sin conexión.
  - **TraceFoodChain**: genera códigos QR e informes. En Honduras se diseñó con actores de la cadena del café y podría servir a 120.000 productores si el IHCAFE la adopta ([CGIAR/ILRI, 2025-05-15](https://dspacetest.ilri.org/items/c129b79f-0c26-48a5-8a74-d6fd3d03873e/full)).
  - **Whisp** (FAO): evalúa el riesgo de deforestación por parcela con varias capas de datos; su API procesa hasta 5.000 parcelas por llamada ([FAO, Whisp](https://www.fao.org/fileadmin/user_upload/faoweb/NFM/WhispOverview.pdf)).

#### 1.6.5 Implicación para Coffee+Visión
- [I] No conviene presentarse como «herramienta de cumplimiento EUDR»: la diligencia debida le corresponde al exportador o importador, y la FNC ya tiene la georreferenciación del SICA.
- [I] Sí conviene que el módulo de lotes **capture punto o polígono con 6 decimales y exporte GeoJSON WGS-84**. Así el caficultor es dueño de sus datos y puede entregarlos a una cooperativa, un comprador de café especial, Cafenlace o una verificación con Whisp. Esto sirve sobre todo a quien vende fuera del canal FNC.

---

### 1.7 Tabla comparativa

> [H] Cada celda resume lo verificado en las fichas de arriba, con sus fuentes. «Sí» = documentado; «Parc.» = parcial o indirecto; «—» = no lo ofrece según la fuente; «?» = no verificado. [I] La agrupación y las abreviaturas son mías.

**A. Herramientas oficiales, específicas de café y de Colombia/LatAm**

| Plataforma | Lotes/mapa | Labores | Cosecha y kilos | Costos | Plagas/diagnóstico | Clima | Precio del café | Trazabilidad/EUDR | Sin conexión | IA | Precio |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FNC SICA + Extensión | Sí (georref.) | Parc. (recomendaciones) | ? | — | Parc. (sondeos) | — | — | Sí (georref. con consentimiento) | Sí (extensionista, 2026) | Parc. (SantIAgo) | Gratis (servicio gremial) |
| Cenicafé Manejo Agronómico | — | — | — | — | Parc. (fichas, sin diagnóstico por foto confirmado) | — | — | — | ? | — | Gratis (con inicio de sesión) |
| Cenicafé Indicadores mano de obra | — | Sí (rendimientos) | — | Parc. | — | — | — | — | ? | — | Gratis |
| Cenicafé Más calidad | — | Parc. (poscosecha) | Parc. | — | — | — | — | — | ? | — | Gratis |
| Agroclima Cenicafé (web) | Parc. (geoportal) | — | — | — | Parc. (vuelos de broca) | Sí | — | — | — | — | Gratis |
| AdrIAna (Cenicafé) | — | — | — | — | Parc. (respuestas) | — | — | — | No | Sí (chatbot) | Gratis |
| Cafenlace (FNC) | — | — | — | — | — | — | Parc. (cotización de exportación) | Parc. («trazabilidad en línea») | ? | — | ? (servicio logístico) |
| Agenda Cafetera (Buxtar) | ? | Sí (cronograma) | Sí (pronóstico) | Sí (versión licenciada, 2021) | Sí (broca y roya) | ? | ? | Parc. (poscosecha) | ? | ? | Básica gratis / licencia sin precio público |
| Caffer | — | — | — | — | — | — | Sí | — | ? | — | ? |
| MAIA Cafetero (OIT) | — | Parc. (asesoría) | — | Parc. (asesoría contable) | Parc. | — | Parc. | — | No (WhatsApp) | Sí (texto y audio) | Gratis (piloto) |
| Coffee Cloud (Centro Clima) | — | — | — | — | Sí (incidencia de roya) | Sí | — | — | Sí | — | ? |
| Cropster Origin | Parc. (lotes) | Parc. (tareas) | Sí (recepción e inventario) | ? | — | — | — | Sí | ? | Parc. (tueste) | Desde 199 €/mes |
| Agridence (ex Farmer Connect) | Sí (polígonos) | — | Parc. (compras) | — | — | — | — | Sí (DDS a TRACES) | Sí | ? | No público |
| Enveritas | Sí (satélite) | — | — | — | — | — | — | Sí | ? | Sí (ML satelital) | Gratis para el productor |
| Algrano | — | — | — | — | — | — | Parc. (mercado) | Parc. | ? | — | Herramientas gratis; comisión 0,22-0,44 USD/kg (tope 6 % FOB) |
| Farmforce | Sí | — | Sí (volúmenes) | — | — | — | — | Sí | Sí | — | No público |
| SourceTrace | Sí | Parc. | ? | ? | ? | ? | — | Sí | ? | ? | No público |
| Koltiva | Sí | ? | ? | ? | ? | ? | — | Sí | ? | ? | No público |
| GeoTraceability (OPTEL) | Sí | Parc. (plan de finca) | Parc. (sacos) | — | — | — | — | Sí | Sí | — | Suscripción (no pública) |
| Croppie (Producers Direct/CIAT) | Parc. (GPS) | — | Sí (pronóstico por foto) | — | — | Parc. | — | — | ? | Sí | Gratis |
| TerraTrac (TechnoServe) | Sí (punto o polígono) | — | — | — | — | — | — | Sí (CSV/GeoJSON) | Sí | — | Gratis |
| Rainforest Alliance RACP | Sí (polígonos) | — | Parc. | — | — | — | — | Sí | ? | Parc. (mapas de riesgo) | Costo de certificación (no revisado) |
| iFinca | — | — | — | — | — | — | Parc. (ofertas) | Sí (QR, blockchain) | ? | — | ? |
| Yara CoffeeClub (2021) | — | Parc. | — | — | Parc. | Sí | Sí | — | Sí (según Forbes) | — | Gratis; no está en Play en 2026 |

**B. Plataformas genéricas y herramientas abiertas**

| Plataforma | Lotes/mapa | Labores | Cosecha y kilos | Costos | Plagas/diagnóstico | Clima | Precio del café | Trazabilidad/EUDR | Sin conexión | IA | Precio |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AGRIVI 360 | ? | Sí | ? | Sí | ? | ? | — | Parc. | Sí | Parc. (beta) | No público |
| Farmbrite | Sí | Sí | Sí | Sí | Parc. (monitoreo) | ? | — | Parc. | Sí | — | 29-109 USD/mes |
| Croptracker | ? | Sí | Sí | Parc. | — | — | — | Parc. | ? | Parc. (visión, frutas) | Desde 3.300 USD/año |
| Cropwise | Sí | Parc. | ? | ? | Sí (monitoreo) | ? | — | ? | ? | ? | ? |
| Agroptima | Parc. | Sí | ? | Sí (Pro) | — | — | — | Parc. (cuaderno oficial UE) | ? | — | No público |
| Auravant | Sí (satélite) | Parc. | — | — | Parc. | ? | — | — | ? | Parc. | Freemium (precios de 2021) |
| Plantix | — | — | — | — | Sí (foto; sin broca) | — | — | — | No | Sí | Gratis |
| Abiertas EUDR (Ground, Kobo, INATrace, WHIMO, Whisp) | Sí | — | Parc. (INATrace, WHIMO) | — | — | — | — | Sí | Sí (Ground, Kobo, WHIMO) | Parc. (Whisp) | Gratis |

---

### 1.8 Huecos de mercado para Coffee+Visión (pequeño caficultor, español, gratis, celular, poca conectividad)

1. **[I] Nadie le lleva al caficultor su propio cuaderno de finca.** [H] Las herramientas oficiales recogen datos del caficultor *a través del extensionista* (SICA) o son de consulta (apps de Cenicafé, chatbots) (ver 1.2). [H] Las comerciales le venden a cooperativas, traders o fincas empresariales: Cropster desde 199 €/mes, Croptracker desde 3.300 USD/año, y Farmforce, Koltiva, SourceTrace y Agridence sin precio público. [I] Falta un registro gratuito, en español y sin conexión de labores, jornales, kilos, gastos y ventas por lote.
2. **[I] Costo por carga frente al precio del día.** [H] La FNC tiene un «Seguro de Ingreso» que compensa cuando el precio interno cae por debajo del costo promedio de producción ([Informe de Gestión 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)), y el precio bajó de $2,86 M (promedio 2025) a $2,10 M por carga (15-oct-2026). [I] Sin embargo, no encontré una herramienta gratuita y masiva que le calcule a cada productor *su* costo por carga. Solo la versión de pago de Agenda Cafetera lo ofrecía en 2021.
3. **[I] Los saberes de Cenicafé están en PDF y no en flujos de trabajo.** [H] Cenicafé tiene métodos precisos: el muestreo de 30 ramas para broca, los rangos de broca y roya de sus boletines, unas 32 semanas entre floración y cosecha, frutos susceptibles a broca hacia los 120 días y control de roya entre 60 y 180 días (ver módulos 5 y 6, con sus fuentes). [I] Ninguna app revisada los convierte en un asistente guiado de muestreo y calendario para el caficultor. Coffee Cloud lo hizo para la roya en Centroamérica, no en Colombia.
4. **[I] Hay que funcionar sin conexión de verdad.** [H] El 43 % de los hogares rurales no tiene internet ([MinTIC](https://mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/437305:Gobierno-Petro-conecto-3-5-millones-de-hogares-en-tres-anos-y-por-primera-vez-mas-de-la-mitad-de-los-hogares-rurales-tienen-internet)), y los chatbots AdrIAna y SantIAgo requieren internet ([Cenicafé](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715)). [I] Una PWA que guarde todo localmente cubre ese vacío.
5. **[I] Una sola app ligera frente a varias apps pesadas.** [H] Las apps de Cenicafé pesan entre 123 y 169 MB en iOS y van por separado, con entre 500 y 1.000+ descargas ([App Store](https://apps.apple.com/us/app/cenicafe-manejo-agron%C3%B3mico/id1522601981); [Play](https://play.google.com/store/apps/details?id=org.cenicafe.app.masCalidad)).
6. **[I] Productores fuera del SICA o sin cédula.** [H] La cédula exige al menos 0,5 ha y 1.500 árboles, Cafenlace exige el SICA y las apps de Cenicafé piden iniciar sesión (ver 1.2.3, 1.2.4 y 1.2.7). [I] Coffee+Visión puede atender a esos productores, a las nuevas generaciones y a quienes venden fuera del canal FNC.
7. **[I] Datos que el productor controla y comparte.** [H] La CBI recomienda que el productor sea dueño de sus datos ([CBI](https://cbi.eu/market-information/coffee/tips-go-digital)), y el SICA y la RACP dependen del consentimiento. [I] Exportar GeoJSON, CSV o PDF y compartir por WhatsApp le da al productor algo que hoy no tiene: su expediente propio.
8. **[I] Recolección y jornales.** [H] Cenicafé publica rangos de rendimiento por labor ([Agronegocios](https://www.agronegocios.co/aprenda/consejos-del-profesor-yarumo-indicadores-de-rendimiento-de-mano-de-obra-del-cultivo-de-cafe-3555915)). [I] Ninguna herramienta gratuita revisada lleva el control de kilos por recolector y día ni el pago por kilo, que es una tarea diaria en cosecha.

---

### 1.9 Módulos funcionales recomendados (priorizados)

> [I] La prioridad combina el valor para el caficultor, la evidencia y la factibilidad para un equipo SENA sin backend. Abreviaturas: **Nav.** = puede funcionar solo en el navegador (PWA + IndexedDB, por ejemplo con Dexie), **Back.** = requiere backend. [H] IndexedDB guarda datos estructurados y blobs como fotos, funciona en service workers y comparte la cuota del origen; `navigator.storage.persist()` pide no borrar los datos, pero el usuario siempre puede borrarlos ([web.dev](https://web.dev/learn/pwa/offline-data)). [I] Por eso, los módulos de navegador necesitan exportar e importar un respaldo (módulo 9).

**Prioridad 1: núcleo (reemplaza lo «de mentira»)**

**1. Mis lotes (ficha y mapa)**
- *Qué hace:* [I] Ficha por lote con los campos del SICA (nombre, área, variedad, fecha de siembra o zoca → edad, densidad, sol o sombra), un punto GPS o un polígono (dibujado o caminando el borde con el GPS del celular), cálculo del área, aviso de «cafetal envejecido» con la regla de la FNC (9 años al sol, 12 bajo sombra) y exportación e importación en GeoJSON WGS-84 con 6 decimales.
- *Por qué:* [H] Son los atributos que registra el SICA, y la regla de 9 y 12 años es la definición de la FNC ([FNC-IGAC, Atlas Cafetero](https://publicaciones.cenicafe.org/index.php/atl/article/download/2966/2959/2654)). El EUDR pide un punto si la parcela tiene 4 ha o menos y un polígono si tiene más, con 6 decimales ([Fairtrade](https://www.fairtrade.net/content/dam/fairtrade/global/fairthrive/Geolocation%20data%20requirements%20EUDR.pdf)). TerraTrac resuelve lo mismo sin conexión con GeoJSON y envío por WhatsApp ([Play](https://play.google.com/store/apps/details?id=org.technoserve.farmcollector)). La FNC renovó 93.608 ha en 2025 ([FNC](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).
- *Datos:* [I] Lotes, coordenadas, variedad, fechas, densidad y sombra.
- *¿Nav. o Back.?:* [I] Nav. La ficha y el GPS funcionan sin conexión. [H] El mapa base de tile.openstreetmap.org **no permite uso offline ni precarga** ([política de teselas de OSM](https://operations.osmfoundation.org/policies/tiles/)). [I] Por eso el mapa se ve solo con conexión, salvo que se usen teselas propias o un proveedor que permita precarga.
- *Complejidad:* [I] Ficha baja; mapa con polígono media.

**2. Registro rápido de labores y jornales (cuaderno de campo)**
- *Qué hace:* [I] En tres toques registra lote, labor (fertilización, plateo, control de arvenses, aplicación, zoca, recolección...), fecha, jornales o trabajadores, insumo con cantidad y valor. Ofrece «repetir el último», una nota de voz grabada y una foto opcional. Compara el rendimiento con los rangos de referencia de Cenicafé.
- *Por qué:* [H] Cenicafé tiene una app de rendimientos por labor con mínimo, promedio y máximo ([Agronegocios](https://www.agronegocios.co/aprenda/consejos-del-profesor-yarumo-indicadores-de-rendimiento-de-mano-de-obra-del-cultivo-de-cafe-3555915)). Agenda Cafetera (10 mil+ descargas) se basa en el cronograma y el historial de labores ([Play](https://play.google.com/store/apps/details?id=com.agendacafeterav2_1)). La FNC dedicó 113.929 atenciones a la gestión empresarial de la finca en 2025 ([FNC](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)). Farmbrite y Agroptima tienen este núcleo (ver 1.4).
- *Datos:* [I] Catálogo de labores e insumos, trabajadores, valor del jornal y lotes.
- *¿Nav. o Back.?:* [I] Nav.
- *Complejidad:* [I] Media.

**3. Cosecha, kilos y ventas**
- *Qué hace:* [I] Registra los kilos de cereza por recolector, día y lote, calcula el pago por kilo, convierte a pergamino seco con un factor configurable y lleva las ventas (kg de pergamino, precio, comprador, factor de rendimiento o calidad, soporte en foto). Muestra totales por semana, lote y cosecha.
- *Por qué:* [H] Cropster organiza su producto alrededor de la recepción y el inventario por lote ([Cropster](https://www.cropster.com/products/origin/)). Farmforce captura volúmenes de cosecha ([GFW Pro](https://pro-news.globalforestwatch.org/news-events/gfw-pro-user-spotlight-farmforce)). El precio de la FNC es por carga de 125 kg de pergamino seco ([FNC](https://federaciondecafeteros.org/wp/estadisticas-cafeteras/)). [I] El factor de conversión de cereza a pergamino y la tabla de factor de rendimiento deben tomarse de Cenicafé o la FNC. No los verifiqué en esta investigación.
- *Datos:* [I] Recolectores, kilos, tarifa por kilo, ventas y factores.
- *¿Nav. o Back.?:* [I] Nav.
- *Complejidad:* [I] Baja a media.

**4. Costos y rentabilidad por carga**
- *Qué hace:* [I] Suma las labores (módulo 2) y la cosecha (módulo 3) para calcular el costo por carga y por hectárea, y lo compara con el precio de venta o el precio del día. Muestra gráficos simples: en qué se fue la plata y cuánto quedó.
- *Por qué:* [H] El Seguro de Ingreso de la FNC usa como referencia el costo promedio de producción, y el precio cayó de $2,86 M (promedio 2025) a $2,10 M por carga (oct-2026) ([FNC, Informe 2025](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf); [FNC, precio](https://federaciondecafeteros.org/wp/estadisticas-cafeteras/)). MAIA incluye costos y contabilidad entre sus temas ([OIT](https://www.ilo.org/sites/default/files/2025-05/PILOTO%20MAIA%20SST%20vf.pdf)). En 2021 Agenda Cafetera reservaba el cálculo de costos para su versión de pago ([Portafolio](https://www.portafolio.co/innovacion/agenda-cafetera-app-colombiana-para-caficultores-completa-9-500-descargas-cafe-en-colombia-548434)).
- *Datos:* [I] Los de los módulos 2 y 3 y el precio.
- *¿Nav. o Back.?:* [I] Nav. Reemplaza las «estadísticas de producción» de demostración.
- *Complejidad:* [I] Media.

**5. Calendario de floraciones y alertas por etapa del cultivo**
- *Qué hace:* [I] El caficultor registra cada floración por lote, con fecha e intensidad, y la app calcula:
  - la cosecha esperada (unas 32 semanas después);
  - el momento en que los frutos se vuelven susceptibles a la broca (alrededor de los 120 días), para programar el muestreo del módulo 6;
  - en variedades susceptibles, la ventana de control de roya (60 a 180 días).
  Con eso genera los recordatorios dentro de la app.
- *Por qué:* [H] Cenicafé proyecta la distribución de la cosecha «alrededor de 32 semanas después de la floración» ([Cenicafé, Informe anual, sección de registros de floración](https://publicaciones.cenicafe.org/index.php/infanual/article/download/4890/5081/3819)). Los frutos aptos para la broca tienen «alrededor de los 120 días después de la floración» ([Cenicafé, Avance Técnico 193, ago-1993](https://biblioteca.cenicafe.org/bitstream/10778/1044/1/avt0193.pdf)). Los fungicidas contra la roya se aplican «entre los 60 y los 180 días después de la floración principal» ([Cenicafé, Avance Técnico 581, oct-2025](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/download/4508/4691/3620)). Agenda Cafetera ofrece cronograma de floración y pronóstico de cosecha ([Play](https://play.google.com/store/apps/details?id=com.agendacafeterav2_1)).
- *Datos:* [I] Floraciones por lote y variedad (resistente o susceptible).
- *¿Nav. o Back.?:* [I] Nav. Los recordatorios se muestran al abrir la app. Las notificaciones push requieren permiso, service worker y, para enviarlas con la app cerrada, un servidor de push. Reemplaza «notificaciones» y «recomendaciones» de demostración por reglas reales.
- *Complejidad:* [I] Baja a media.
- [H] Abrí los tres PDF de Cenicafé citados y confirmé las cifras textuales. [I] Antes de programar las reglas conviene que un agrónomo valide la redacción. Un «periodo crítico de agua» que apareció en las búsquedas no lo pude confirmar en una fuente primaria, así que no lo incluí.

**6. Muestreo guiado de broca y roya (contador con semáforo)**
- *Qué hace:* [I] Guía el recorrido en zigzag por 30 sitios. En cada rama el caficultor marca frutos totales y frutos brocados con botones grandes de + y −. La app calcula el porcentaje de infestación y lo clasifica (broca <2 %, 2-5 %, ≥5 %; roya <5 %, 5-15 %, ≥15 % de hojas afectadas). Guarda el historial por lote, permite adjuntar fotos y compartir el resultado.
- *Por qué:* [H] El procedimiento de Cenicafé consiste en ubicar 30 sitios por hectárea recorriendo en zigzag, tomar una rama productiva por árbol, contar frutos totales y brocados y calcular el porcentaje ([Brocarta Nº 5, Cenicafé, 31-may-1993](https://publicaciones.cenicafe.org/index.php/brocartas/article/download/2269/2011/1748)). El Boletín fitosanitario Nº 20 (tercer trimestre de 2026) clasifica los lotes en broca <2 %, 2-5 % y ≥5 %, y en roya <5 %, 5-15 % y ≥15 %, con marcas de «nivel de daño económico» y «umbral de acción». Ese trimestre el promedio nacional fue de 1,85 % en broca y 5,27 % en roya, sobre 3.144 lotes sorteados del SICA ([Cenicafé/FNC, Boletín Nº 20](https://publicaciones.cenicafe.org/index.php/fitosanitario/article/download/5668/6558/5484)). Coffee Cloud hace mediciones de roya sin internet y da recomendaciones inmediatas ([Perfect Daily Grind](https://perfectdailygrind.com/2018/09/combating-leaf-rust-with-phone-apps-in-guatemala/)).
- *Datos:* [I] Conteos por rama y fecha, lote y fotos.
- *¿Nav. o Back.?:* [I] Nav. **Reemplaza el módulo «plagas IA» de mentira** con un método validado.
- *Complejidad:* [I] Baja.

**Prioridad 2: valor agregado**

**7. Precio del café y calculadora de venta**
- *Qué hace:* [I] Muestra el precio interno de referencia de la FNC, la bolsa de NY y la tasa de cambio con su fecha. Calcula cuánto se recibe por X kg de pergamino. Guarda el último valor para verlo sin conexión y lo compara con el costo por carga del módulo 4.
- *Por qué:* [H] Caffer tiene 10 mil+ descargas solo con precios ([Play](https://play.google.com/store/apps/details?id=com.cocupo.preciodelcafe)). «Al Grano» de Davivienda difunde precios por WhatsApp ([Agronegocios](https://www.agronegocios.co/agricultura/del-jornal-al-celular-inclusion-financiera-digital-para-caficultores-4229244)). La FNC publica el precio a diario ([FNC](https://federaciondecafeteros.org/wp/estadisticas-cafeteras/)).
- *Datos:* [I] Precio diario y kg del caficultor.
- *¿Nav. o Back.?:* [I] Para traer el precio automáticamente hace falta un backend o una función programada que lea la página o el PDF de la FNC, porque el navegador no puede hacerlo por restricciones de origen (CORS). Una alternativa sin backend es que el administrador cargue el precio a mano (el «panel admin» tendría por fin una función real) o que el caficultor lo escriba.
- *Complejidad:* [I] Media con backend; baja con carga manual.

**8. Clima por lote**
- *Qué hace:* [I] Muestra el pronóstico de lluvia y temperatura a 3-7 días según las coordenadas del lote, con un enlace al boletín agroclimático de Cenicafé.
- *Por qué:* [H] Cenicafé ofrece pronóstico de lluvia y boletines ([Agroclima](https://agroclima.cenicafe.org/)), y CoffeeClub y Al Grano incluían el clima (ver 1.5). La API gratuita de Open-Meteo admite uso no comercial con menos de 10.000 llamadas diarias, con datos bajo licencia CC BY 4.0 ([Open-Meteo, términos](https://open-meteo.com/en/terms)).
- *¿Nav. o Back.?:* [I] Nav. con conexión, guardando el último pronóstico. Hay que confirmar que un proyecto SENA cuenta como uso no comercial.
- *Complejidad:* [I] Baja.

**9. Compartir y respaldar (WhatsApp, PDF, CSV, GeoJSON)**
- *Qué hace:* [I] Genera un resumen del lote o la temporada (labores, kilos, costos, muestreos) para enviar por WhatsApp con la Web Share API o un enlace wa.me. Exporta a PDF, CSV o GeoJSON y hace respaldo y restauración en un archivo JSON.
- *Por qué:* [H] El extensionista de la FNC ya envía las recomendaciones por WhatsApp ([Comité del Quindío](https://quindio.federaciondecafeteros.org/wp-content/uploads/sites/11/2026/08/Actualidad-Cafetera-Ed-163-1.pdf)). TerraTrac comparte por WhatsApp ([Play](https://play.google.com/store/apps/details?id=org.technoserve.farmcollector)). El canal de WhatsApp de la FNC creció 836 % en 2025 ([FNC](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)). El almacenamiento del navegador se puede borrar ([web.dev](https://web.dev/learn/pwa/offline-data)).
- *¿Nav. o Back.?:* [I] Nav.
- *Complejidad:* [I] Baja.

**10. Guías sin conexión con búsqueda, audio y fotos («Guías» rehecho)**
- *Qué hace:* [I] Guías cortas por tarea (cómo muestrear broca, cómo registrar una floración...) con foto, texto breve y audio pregrabado. Busca sin conexión y enlaza a AdrIAna y al Comité de Cafeteros para preguntas abiertas.
- *Por qué:* [H] AdrIAna y SantIAgo solo funcionan con internet ([Cenicafé](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715)). Los usuarios con baja alfabetización prefieren gráficos semiabstractos con voz ([Medhi et al., 2007](https://courses.cs.washington.edu/courses/cse490c/18au/readings/medhi-2007.pdf)).
- *¿Nav. o Back.?:* [I] Nav. (contenido en Cache Storage). **Reemplaza el chatbot de demostración.**
- *Complejidad:* [I] Baja a media.

**Prioridad 3: requieren backend o son de alta complejidad**

**11. Asistente con IA sobre *mis* datos y las guías de Cenicafé (texto y audio)**
- *Qué hace:* [I] Responde preguntas como «¿cuánto gasté en fertilizante en el lote 2?» o «¿cuándo me toca muestrear broca?», combinando los datos del caficultor con documentos de Cenicafé y citando la fuente.
- *Por qué:* [H] MAIA (WhatsApp, texto y audio, memoria y seguimiento semanal), AdrIAna (634 documentos) y Farmer.Chat (voz, foto y contenido curado) muestran que el formato funciona ([OIT](https://www.ilo.org/sites/default/files/2025-05/PILOTO%20MAIA%20SST%20vf.pdf); [Cenicafé](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715); [CGAP](https://www.cgap.org/blog/beyond-chat-ai-powered-advice-for-women-farmers)).
- *¿Nav. o Back.?:* [I] Back. obligatorio: la llave de la API no puede ir en el frontend, y hacen falta un índice de documentos y conexión.
- *Complejidad:* [I] Alta. Solo vale la pena si usa los datos propios del caficultor; si no, es mejor enlazar a AdrIAna.

**12. Diagnóstico orientativo por foto (IA en el dispositivo)**
- *Qué hace:* [I] Un clasificador de hojas (roya, minador, ojo de gallo y sanas) que corre en el navegador con TensorFlow.js u ONNX. Siempre muestra «posible problema», el nivel de confianza y «confírmelo con el muestreo (módulo 6) o con su extensionista».
- *Por qué:* [H] Existen conjuntos de datos abiertos, por ejemplo JMuBEN, de Kenia, con unas 58.000 imágenes de cercospora, roya, phoma, minador y hojas sanas ([Data in Brief, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8165403/)). Plantix trabaja con el flujo de la foto, pero su biblioteca no incluye la broca ([Plantix](https://plantix.net/en/library/plant-diseases/)).
- [I] Riesgos: las fotos de Kenia no se parecen a las de Colombia (variedades, luz, fondo) y la broca no se ve en la hoja. No debe venderse como diagnóstico.
- *¿Nav. o Back.?:* [I] La inferencia corre en el navegador; el entrenamiento se hace aparte.
- *Complejidad:* [I] Alta.

**13. Ficha pública del lote o microlote con QR (trazabilidad para venta directa)**
- *Qué hace:* [I] Genera una página con finca, variedad, proceso, altitud, fecha y fotos, más un QR para la bolsa o la muestra.
- *Por qué:* [H] Usan QR la app de consumidor de Starbucks, iFinca y TraceFoodChain, y hay un prototipo NFC/QR en el Cauca (ver 1.3 y 1.5). Algrano usa una vitrina de cafés ([Algrano](https://algrano.com/pricing)).
- *¿Nav. o Back.?:* [I] Back. (o hosting estático) para la URL pública. Hay que cuidar la privacidad y no publicar coordenadas exactas sin consentimiento.
- *Complejidad:* [I] Media.

**14. Panel del extensionista o asociación (multi-finca), el «admin» real**
- *Qué hace:* [I] Una asociación o un técnico ve, con permiso de cada productor, sus lotes, muestreos y alertas.
- *Por qué:* [H] El modelo colombiano funciona a través de intermediarios: extensionistas, promotores veredales en el Cauca y cooperativas como las 26 organizaciones de Terra Kaape ([CODESPA](https://www.codespa.org/app/uploads/Infografia-SmartAgro.pdf); [Incofin](https://agtech.incofin.com/project/terra-kaape)).
- *¿Nav. o Back.?:* [I] Back. obligatorio (autenticación, sincronización, roles).
- *Complejidad:* [I] Alta.

**15. Bitácora de poscosecha (fermentación y secado)**
- *Qué hace:* [I] Registra por lote de beneficio las horas de fermentación, los días de secado y la humedad estimada, con fotos.
- *Por qué:* [H] Existen Cenicafé Más calidad y Secafe de Colcafé ([Play](https://play.google.com/store/apps/details?id=org.cenicafe.app.masCalidad); [Incofin](https://agtech.incofin.com/colcafe-and-farmers-launch-digital-coffee-drying-app-in-farallones-del-citara)).
- *¿Nav. o Back.?:* [I] Nav.
- *Complejidad:* [I] Baja. Puede pasar a prioridad 2 si el foco es el café especial.

**Qué hacer con los módulos actuales** [I]

| Módulo actual | Acción |
|---|---|
| «Plagas IA» (finge reentrenar una red) | Eliminar. Reemplazar por el módulo 6 y, más adelante, el 12 |
| Chatbot (demo) | Eliminar. Reemplazar por el módulo 10 (enlace a AdrIAna) y, si hay backend, el 11 |
| Notificaciones y recomendaciones (demo) | Generarlas con reglas reales a partir de los módulos 2, 5 y 6 |
| Estadísticas de producción (demo) | Calcularlas con los módulos 3 y 4 |
| Lotes/cultivos y registrar labor | Convertirlos en los módulos 1 y 2 con persistencia real en IndexedDB |
| Guías | Rehacerlas como módulo 10 (sin conexión, con audio e imágenes) |
| Panel admin | Dejar solo la carga manual del precio (módulo 7) hasta que haya backend (módulo 14) |

---

### 1.10 Patrones de UX para usuarios rurales con baja alfabetización digital

1. **WhatsApp como canal de salida, no como reemplazo de la app.**
   - [H] La FNC envía las recomendaciones de la visita al WhatsApp del productor ([Comité del Quindío, 2026](https://quindio.federaciondecafeteros.org/wp-content/uploads/sites/11/2026/08/Actualidad-Cafetera-Ed-163-1.pdf)).
   - [H] El canal de WhatsApp de la FNC creció de 4.700 a 44.002 seguidores en 2025, y la FMM forma por WhatsApp ([FNC](https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf)).
   - [H] Agrapp se pasó a WhatsApp por el envejecimiento rural ([Forbes Colombia](https://forbes.co/tecnologia/agrotech-en-colombia)). MAIA funciona por WhatsApp ([OIT](https://www.ilo.org/es/maia-cafetero-inteligencia-artificial-al-servicio-del-campo-colombiano)).
   - [I] En Coffee+Visión: un botón grande «Enviar por WhatsApp» en cada resumen.
2. **Sin conexión primero.**
   - [H] Trabajan sin conexión el «SICA móvil» del extensionista, que sincroniza al llegar a un sitio con conexión ([Atlas Cafetero](https://publicaciones.cenicafe.org/index.php/atl/article/download/2966/2959/2654); Quindío 2026), Coffee Cloud, TerraTrac, Farmforce y Farmbrite (ver arriba).
   - [I] En Coffee+Visión: guardar todo en local, mostrar un estado claro («guardado en el teléfono») y nunca bloquear un formulario por falta de red.
3. **Voz, con cuidado técnico.**
   - [H] Los extensionistas de la FNC dictan con reconocimiento de voz (Quindío 2026), MAIA entiende audios y Farmer.Chat acepta voz ([CGAP](https://www.cgap.org/blog/beyond-chat-ai-powered-advice-for-women-farmers)).
   - [H] En Chrome, la Web Speech API envía el audio a un servidor y **no funciona sin conexión**. Hay una opción en el dispositivo (`processLocally`) con disponibilidad limitada ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)).
   - [I] En Coffee+Visión: grabar notas de voz que se guardan sin conexión y dejar la transcripción como mejora opcional cuando haya red.
4. **La foto como forma de registrar.**
   - [H] Plantix y Croppie se basan en la foto ([Plantix](https://plantix.net/en/); [Alianza Bioversity-CIAT](https://alliancebioversityciat.org/tools-innovations/croppie-photocropping-app)).
   - [I] En Coffee+Visión: foto opcional en labores, ventas (recibo) y muestreos, como evidencia.
5. **Íconos semiabstractos más audio, ayuda siempre visible y distinguir analfabetismo de semialfabetismo.**
   - [H] Las interfaces sin texto, con gráficos semiabstractos y retroalimentación de voz, fueron las preferidas; también importa una ayuda consistente ([Medhi, Sagar y Toyama, 2007](https://courses.cs.washington.edu/courses/cse490c/18au/readings/medhi-2007.pdf)).
   - [H] Los usuarios semialfabetizados dejan de usar el audio con el tiempo y ganan en reconocimiento de palabras; los analfabetos no ([Findlater et al., CHI 2009](https://www.dgp.toronto.edu/public_user/ravin/papers/chi2009_literacy.pdf)).
   - [I] En Coffee+Visión: ícono más palabra corta en cada acción, audio opcional y un botón de ayuda fijo.
6. **Botones grandes.**
   - [H] La WCAG 2.2 (criterio 2.5.5, nivel AAA) pide objetivos de al menos 44×44 px CSS ([W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)).
   - [I] Usar 48 px o más en acciones de campo (contadores +/−), pensando en manos con guantes o sucias y pantallas al sol: alto contraste y tipografía de 16 px o más.
7. **Lenguaje claro y contenido validado.**
   - [H] AdrIAna responde «en lenguaje claro y accesible» y avisa que las respuestas pueden tener imprecisiones ([Cenicafé](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715)). MAIA usa lenguaje sencillo y contenido validado por expertos ([OIT](https://www.ilo.org/es/maia-cafetero-inteligencia-artificial-al-servicio-del-campo-colombiano)).
   - [I] En Coffee+Visión: vocabulario cafetero local (carga, arroba, pergamino, zoca, plateo, pasilla) y citar a Cenicafé en cada regla.
8. **Intermediarios humanos y aprendizaje acompañado.**
   - [H] SmartAgro incluye alfabetización digital y promotores veredales en el Cauca ([CODESPA](https://www.codespa.org/app/uploads/Infografia-SmartAgro.pdf)). Farmer.Chat hace la incorporación en grupos ([CGAP](https://www.cgap.org/blog/beyond-chat-ai-powered-advice-for-women-farmers)). Cenicafé enseña sus chatbots con videos paso a paso enlazados por QR ([Cenicafé](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715)).
   - [I] En Coffee+Visión: un modo «acompañante» (un hijo, un promotor o el extensionista ayuda a configurar) y tutoriales de 30 segundos.
9. **Recordatorios y gamificación ligera.**
   - [H] MAIA manda consejos y seguimiento semanal ([OIT](https://www.ilo.org/sites/default/files/2025-05/PILOTO%20MAIA%20SST%20vf.pdf)). Croppie usa gamificación para que el productor siga subiendo fotos ([BMZ](https://www.bmz-digital.global/en/ai-coffee-intelligent-awake/)).
   - [I] En Coffee+Visión: una racha de registro y un resumen semanal por WhatsApp.
10. **Liviano y una sola puerta de entrada.**
    - [H] Las apps de Cenicafé pesan entre 123 y 169 MB en iOS y van por separado (ver 1.2.4).
    - [I] Una PWA instalable desde el navegador evita la tienda de apps y ocupa poco espacio.
11. **Diseñar para personas mayores.**
    - [H] La edad promedio del productor es de 57 años ([Universidad del Rosario](https://urosario.edu.co/periodico-nova-et-vetera/nuestra-u/poblacion-cafetera-muestra-signos-de-reduccion-2050)).
    - [I] Pocas pantallas, una tarea por pantalla, confirmaciones claras, «deshacer» en lugar de diálogos de error y nada de gestos ocultos.
12. **Guías internacionales de inclusión.**
    - [H] Las guías UNESCO-Pearson (2018) tienen seis pautas. Una trata de usar medios apropiados y adaptar la interfaz a usuarios con baja alfabetización ([UNESCO](https://en.unesco.org/themes/literacy-all/pearson-initiative/guidelines); [ICTworks, 2018-04-14](https://www.ictworks.org/unesco-input-digital-inclusion/)). No pude abrir el PDF completo para citar recomendaciones concretas.

---

### 1.11 Fuentes principales (consultadas el 2026-10-15)

**FNC, Cenicafé y Colombia**
- FNC, Informe de Gestión 2025 (jun-2026): https://federaciondecafeteros.org/wp-content/uploads/2026/06/Informe-de-gestio%CC%81n-2025_FNC.pdf
- FNC, Estadísticas cafeteras y precio diario: https://federaciondecafeteros.org/wp/estadisticas-cafeteras/
- Comité del Quindío, Actualidad Cafetera ed. 163 (archivo de ago-2026): https://quindio.federaciondecafeteros.org/wp-content/uploads/sites/11/2026/08/Actualidad-Cafetera-Ed-163-1.pdf
- Cenicafé, Avances Técnicos 585, AdrIAna y SantIAgo (2026): https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/5065/5715
- Cenicafé, Agroclima: https://agroclima.cenicafe.org/
- FNC-IGAC, Atlas Cafetero (atributos del SICA, SICA móvil): https://publicaciones.cenicafe.org/index.php/atl/article/download/2962/2951/2638 · https://publicaciones.cenicafe.org/index.php/atl/article/download/2966/2959/2654
- Cenicafé/FNC, Boletín fitosanitario Nº 20 (tercer trimestre de 2026): https://publicaciones.cenicafe.org/index.php/fitosanitario/article/download/5668/6558/5484
- Cenicafé, Brocarta Nº 5 (1993), muestreo de 30 ramas: https://publicaciones.cenicafe.org/index.php/brocartas/article/download/2269/2011/1748
- Cenicafé, Avance Técnico 193 (1993), floración y broca: https://biblioteca.cenicafe.org/bitstream/10778/1044/1/avt0193.pdf
- Cenicafé, Avance Técnico 581 (oct-2025), roya: https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/download/4508/4691/3620
- Cenicafé, Informe anual (registros de floración, 32 semanas): https://publicaciones.cenicafe.org/index.php/infanual/article/download/4890/5081/3819
- Google Play, apps de Cenicafé y FNC: com.ticcenicafe.manejoagronomico2025, com.ticcenicafe.indicadoresmanoobra, org.cenicafe.app.masCalidad, com.fedecafe.eventos
- App Store, Cenicafé Manejo Agronómico: https://apps.apple.com/us/app/cenicafe-manejo-agron%C3%B3mico/id1522601981
- Mongabay (2026-03-04): https://news.mongabay.com/2026/03/colombias-coffee-industry-well-placed-but-wary-as-eu-deforestation-rule-looms/
- La República (2024), plataforma de coordenadas: https://www.larepublica.co/empresas/la-fnc-lanzara-una-plataforma-para-poder-acceder-a-coordenadas-de-lotes-cafeteros-3935560
- Agronegocios, cédula cafetera: https://www.agronegocios.co/agricultura/todo-lo-que-necesita-saber-sobre-la-cedula-cafetera-y-que-beneficios-tiene-con-ella-3829335
- Agronegocios (2025-09-24), inclusión financiera: https://www.agronegocios.co/agricultura/del-jornal-al-celular-inclusion-financiera-digital-para-caficultores-4229244
- MinTIC (2026-04-27), internet rural: https://mintic.gov.co/portal/inicio/Sala-de-prensa/Noticias/437305:Gobierno-Petro-conecto-3-5-millones-de-hogares-en-tres-anos-y-por-primera-vez-mas-de-la-mitad-de-los-hogares-rurales-tienen-internet
- OIT, MAIA Cafetero: https://www.ilo.org/es/maia-cafetero-inteligencia-artificial-al-servicio-del-campo-colombiano y piloto (may-2025): https://www.ilo.org/sites/default/files/2025-05/PILOTO%20MAIA%20SST%20vf.pdf
- Portafolio (2021-01-21), Agenda Cafetera: https://www.portafolio.co/innovacion/agenda-cafetera-app-colombiana-para-caficultores-completa-9-500-descargas-cafe-en-colombia-548434
- Forbes Colombia (2023-05-09): https://forbes.co/tecnologia/agrotech-en-colombia
- CODESPA, SmartAgro Cauca: https://www.codespa.org/app/uploads/Infografia-SmartAgro.pdf

**Plataformas**
- Cropster Origin, producto y precios: https://www.cropster.com/products/origin/ · https://www.cropster.com/pricing/origin/
- Agridence: https://agridence.com/ · Baker McKenzie (ago-2025): https://www.bakermckenzie.com/en/newsroom/2025/08/agridence-acquires-farmer-connect
- Algrano: https://algrano.com/pricing · https://help.algrano.com/matchmaking-fee
- Farmforce (GFW Pro): https://pro-news.globalforestwatch.org/news-events/gfw-pro-user-spotlight-farmforce
- SourceTrace: https://www.sourcetrace.com/ · Koltiva: https://www.koltiva.com/
- TerraTrac: https://www.technoserve.org/tns-labs/terratrac-eudr-compliance/
- Croppie: https://alliancebioversityciat.org/tools-innovations/croppie-photocropping-app
- Farmbrite: https://www.farmbrite.com/pricing · Croptracker: https://www.croptracker.com/pricing.html · Agroptima: https://www.agroptima.com/es/precios/ · AGRIVI: https://www.agrivi.com/ · Plantix: https://plantix.net/en/
- CBI (actualizado 2026-05-07): https://cbi.eu/market-information/coffee/tips-go-digital

**EUDR**
- Consejo de la UE (2025-12-18): https://www.consilium.europa.eu/en/press/press-releases/2025/12/18/deforestation-council-signs-off-targeted-revision-to-simplify-and-postpone-the-regulation/
- Comisión Europea, aplicación del EUDR: https://green-forum.ec.europa.eu/nature-and-biodiversity/deforestation-regulation-implementation_en
- Coolset, cronología (actualizada 2026-09-24): https://www.coolset.com/academy/eudr-delay-2025-explained
- Fieldfisher, clasificación de países: https://www.fieldfisher.com/en/insights/the-eu-deforestation-regulation-european-commission-classifies-countries-as-high-low-or-standard-risk
- EFI (2026-07-07), herramientas abiertas: https://efi.int/publication/what-tools-are-available-comply-eudr
- Fairtrade, requisitos de geolocalización: https://www.fairtrade.net/content/dam/fairtrade/global/fairthrive/Geolocation%20data%20requirements%20EUDR.pdf

**UX y técnica**
- Medhi, Sagar y Toyama (2007): https://courses.cs.washington.edu/courses/cse490c/18au/readings/medhi-2007.pdf
- Findlater et al. (CHI 2009): https://www.dgp.toronto.edu/public_user/ravin/papers/chi2009_literacy.pdf
- W3C WCAG 2.5.5: https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- MDN SpeechRecognition: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- web.dev, datos sin conexión: https://web.dev/learn/pwa/offline-data
- Política de teselas de OSM: https://operations.osmfoundation.org/policies/tiles/
- Términos de Open-Meteo: https://open-meteo.com/en/terms
- CGAP, Farmer.Chat: https://www.cgap.org/blog/beyond-chat-ai-powered-advice-for-women-farmers
