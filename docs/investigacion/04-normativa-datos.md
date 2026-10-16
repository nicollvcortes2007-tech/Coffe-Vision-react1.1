## 4. Normativa, trazabilidad y datos abiertos

Fecha de consulta: 2026-10-15. Convenciones: **[H]** hecho verificado con enlace (o con una prueba propia descrita); **[I]** interpretación o inferencia propia; **[A]** requiere validación de un abogado. Este documento no es asesoría legal.

**Cómo se verificó el acceso desde el navegador.** Cada API se probó dos veces el 2026-10-15: (1) con `curl` y la cabecera `Origin`, para leer las cabeceras `Access-Control-Allow-Origin`; y (2) con `fetch()` real desde una página de otro origen (`https://example.com`) en un navegador Chromium. En las tablas, «CORS sí» significa que el `fetch()` del navegador funcionó; «CORS no» significa que el navegador lo bloqueó.

### Conclusión

La **EUDR sí aplica al café verde y tostado** y, a la fecha de esta consulta, se aplica desde el **30-12-2026** a operadores grandes y medianos y desde el **30-06-2027** a micro y pequeños (Reglamento (UE) 2025/2650). La revisión de mayo de 2026 descartó un nuevo aplazamiento. El café soluble entra el 30-12-2027. El dato que la cadena le pedirá a cada finca es la **geolocalización de cada lote** (punto si el lote tiene hasta 4 ha, polígono si tiene más), con 6 decimales y en GeoJSON WGS84, además de las fechas de producción y la prueba de que no hubo deforestación después del 31-12-2020. Eso justifica un módulo de mapa del lote con exportación GeoJSON. La BPA del ICA (Res. 30021/2017, modificada en 2020) es voluntaria, pero su lista de registros es el mejor esqueleto para el cuaderno de campo. **Desde el navegador funcionan sin servidor ni clave**: Open-Meteo (pronóstico, histórico y altitud), NASA POWER, datos.gov.co (IDEAM, TRM, EVA, insumos UPRA, lista BPA del ICA), las teselas de OSM, OpenFreeMap, Esri y EOX, el STAC y los COG de Sentinel-2 en AWS y las teselas de GFW. **No funcionan desde el navegador**: el precio de la FNC (no tiene API, no permite CORS y sus términos prohíben reproducirlo), el contrato «C» de ICE (requiere licencia), BanRep SDMX, Superfinanciera SOAP, Open Topo Data, el Pink Sheet del Banco Mundial y los límites del DANE (su servidor envía la cabecera CORS duplicada).

---

### 4.A Normativa y trazabilidad

#### 4.A.1 EUDR (Reglamento (UE) 2023/1115)

**¿Aplica al café colombiano?**
- [H] Sí. El café figura entre las siete materias primas cubiertas (ganado, cacao, café, palma, caucho, soya y madera) ([Comisión Europea, página de la EUDR](https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en); [Green Forum, trazabilidad y geolocalización](https://green-forum.ec.europa.eu/nature-and-biodiversity/deforestation-regulation-implementation/traceability-and-geolocation-commodities-subject-eudr_en)).
- [H] El Reglamento Delegado (UE) 2026/2102 añade el **café soluble** (extractos, esencias y concentrados, NC 2101 11 00), que se aplica desde el **30-12-2027** ([Comisión Europea](https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en); [Linklaters](https://sustainablefutures.linklaters.com/post/102nbwv/eu-deforestation-regulation-commission-adopts-delegated-act-on-product-scope-and)). Según [Coolset](https://www.coolset.com/academy/eudr-delay-2025-explained) (actualizado el 24-09-2026), se publicó el 17-09-2026 y el anexo I modificado entró en vigor el 18-09-2026. Solo una fuente secundaria da estas dos fechas.

**Estado y fechas vigentes a octubre de 2026**

| Hito | Fecha | Fuente |
|---|---|---|
| Entrada en vigor del Reglamento 2023/1115 | junio de 2023 | [H] [USDA FAS](https://www.fas.usda.gov/data/gain/2026/05/european-union-eu-commission-publishes-simplification-review-report-deforestation-regulation) |
| Primer aplazamiento (a dic. 2025 y jun. 2026) | diciembre de 2024 | [H] [Coolset](https://www.coolset.com/academy/eudr-delay-2025-explained) |
| **Reglamento (UE) 2025/2650**: segundo aplazamiento y simplificación; publicado en el DOUE el 23-12-2025, en vigor desde el 26-12-2025 | dic. 2025 | [H] [Stibbe](https://www.stibbe.com/publications-and-insights/the-amended-eudr-what-has-changed-and-what-has-remained); [EY](https://taxnews.ey.com/news/2026-0237-eu-deforestation-regulation-application-postponed-to-30-december-2026) |
| **Aplicación a operadores y comerciantes grandes y medianos** | **30-12-2026** | [H] [Comisión Europea](https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en) |
| **Aplicación a micro y pequeños operadores** | **30-06-2027** (30-12-2026 para los que ya estaban bajo el Reglamento de la Madera, EUTR) | [H] [Comisión Europea](https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en) |
| Revisión de simplificación (fecha legal: 30-04-2026), publicada el 4-05-2026: no se reabre el texto y se mantienen los plazos | 4-05-2026 | [H] [USDA FAS](https://www.fas.usda.gov/data/gain/2026/05/european-union-eu-commission-publishes-simplification-review-report-deforestation-regulation); [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/05/eu-commission-publishes-simplification-review-of-eudr) |
| Acto delegado del anexo I y Reglamento de Ejecución (UE) 2026/1565, que modifica el Sistema de Información (antes 2024/3084) | 13-07-2026 | [H] [Green Forum, Sistema de Información](https://green-forum.ec.europa.eu/deforestation-regulation-implementation/information-system-deforestation-regulation_en) |
| Café soluble dentro del ámbito | 30-12-2027 | [H] ver arriba |

- [H] No se encontró ninguna propuesta de un tercer aplazamiento hasta el 2026-10-15. La Comisión y las fuentes secundarias confirman las fechas de 2026 y 2027 ([Coolset](https://www.coolset.com/academy/eudr-delay-2025-explained); [Polygon One](https://polygon-one.com/en/eudr-current-status)). En octubre de 2026 la Comisión ofrece capacitaciones sobre el Sistema de Información, incluida una sobre «declaraciones simplificadas» para micro y pequeños operadores primarios ([Green Forum](https://green-forum.ec.europa.eu/deforestation-regulation-implementation/information-system-deforestation-regulation_en)).
- **Limitación:** el texto de EUR-Lex (2025/2650, 2025/1093 y 2026/2102) no se pudo abrir porque EUR-Lex respondió HTTP 202 con un desafío antibots. Las fechas se tomaron de la página oficial de la Comisión y se contrastaron con despachos de abogados.

**Clasificación de Colombia y régimen simplificado**
- [H] El Reglamento de Ejecución (UE) 2025/1093 (mayo de 2025) clasifica los países en riesgo bajo, estándar o alto ([Fieldfisher](https://www.fieldfisher.com/en/insights/the-eu-deforestation-regulation-european-commission-classifies-countries-as-high-low-or-standard-risk)). Fuentes secundarias ubican a **Colombia en riesgo estándar**, porque no está en la lista de riesgo bajo ([TracexTech](https://tracextech.com/eudr-coffee-examples/)). No se pudo verificar en EUR-Lex. En 2025 el Parlamento Europeo aprobó una objeción no vinculante a esa clasificación, y la Comisión anunció una actualización para 2026 ([ESG Today](https://www.esgtoday.com/eu-lawmakers-reject-eudrs-country-risk-system-in-new-setback-to-deforestation-regulation/)). Coolset afirma que hoy «todos los países» son de riesgo estándar. Las fuentes no coinciden en este punto.
- [H] La «declaración simplificada» única, que admite una dirección postal en lugar de coordenadas, es solo para el **micro o pequeño operador primario establecido en un país de riesgo bajo** que produce y comercializa o exporta su propio producto ([FAQ oficial de TRACES](https://acceptance.eudr.webcloud.ec.europa.eu/tracesnt/help/eudr-documentation/operator/faq.html); [Linklaters](https://sustainablefutures.linklaters.com/post/102ly55/eu-changes-to-deforestation-regulation-reach-the-finish-line)).
- [I] [A] Mientras Colombia no sea de riesgo bajo, el caficultor colombiano no puede usar ese régimen, y sus lotes deben ir con coordenadas. Además, quien presenta la declaración de diligencia debida es el operador que coloca el producto por primera vez en el mercado de la UE (el importador), no el caficultor ([Stibbe](https://www.stibbe.com/publications-and-insights/the-amended-eudr-what-has-changed-and-what-has-remained)). La obligación real del caficultor nace del contrato con su comprador o exportador. Un abogado debe confirmar si existe alguna obligación directa.

**Datos que tendrá que aportar el productor (vía exportador)**
- [H] **Geolocalización de todas las parcelas** donde se produjo el café, con latitud y longitud y **al menos 6 decimales**. Se exige **polígono para parcelas de más de 4 ha**; en las demás basta un punto ([FAQ de TRACES](https://acceptance.eudr.webcloud.ec.europa.eu/tracesnt/help/eudr-documentation/operator/faq.html)). Nota: la regla dice «más de 4 ha» (mayor que 4), no «4 ha o más». Rainforest Alliance es más estricta y exige polígono desde 4 ha, incluido el caso de exactamente 4 ha ([política EUDR de RA](https://knowledge.rainforest-alliance.org/docs/alignment-with-the-eudr-policy)). [I] Para el modelo de datos conviene usar polígono desde 4 ha, porque cubre ambas reglas.
- [H] **Fecha de corte: 31-12-2020.** Las tierras no deben haber sido deforestadas después de esa fecha ([FAQ de TRACES](https://acceptance.eudr.webcloud.ec.europa.eu/tracesnt/help/eudr-documentation/operator/faq.html)).
- [H] **Fecha o rango de producción** ligado a cada parcela. Si no hay más precisión, la guía de la Comisión admite el año cafetero o la temporada de cosecha. El operador debe guardar esta información **5 años**, aunque no vaya dentro de la declaración. Fuente secundaria que cita la guía: [Coolset](https://www.coolset.com/academy/eudr-geolocation-requirements-how-to-collect-and-validate-gps-polygon-data-for-your-dds).
- [H] También se exige **legalidad** según la ley del país de producción: uso del suelo, derechos laborales y de terceros, normas fiscales, anticorrupción y otras. La FNC resume ese bloque en su presentación ([FNC/PROMECAFE, diapositiva 24](https://eudrcentralamerica.thecosa.org/wp-content/uploads/2025/09/2025_01_21_PPT-CdA-CA.pdf)). [A] Qué documentos concretos prueban la legalidad de una finca colombiana es una pregunta jurídica.

**Formato: GeoJSON del Sistema de Información EUDR (TRACES)**
- [H] Especificación oficial, página actualizada el 17-08-2026 ([descripción GeoJSON en TRACES](https://eudr.webcloud.ec.europa.eu/tracesnt/help/eudr-documentation/operator/geojson-description.html)):
  - Sistema de referencia **WGS 84 (EPSG:4326)**, en grados decimales y en orden **[longitud, latitud]**.
  - El sistema **trunca** las coordenadas a 6 decimales (no las redondea).
  - Geometrías aceptadas: Point, MultiPoint, Polygon y MultiPolygon. LineString y MultiLineString se rechazan.
  - Un polígono debe estar **cerrado** (el primer y el último par de coordenadas son iguales), tener al menos 4 pares y no tener huecos, autointersecciones ni lados colineales.
  - Propiedades opcionales, que distinguen mayúsculas: `ProducerName`, `ProducerCountry` (ISO2, «CO»), `ProductionPlace` y `Area` (en hectáreas y como número, no como texto). Si un punto no trae `Area`, el sistema asume **4 ha**.
  - Máximo **25 MB** por declaración.
- [H] La Comisión ofrece una API máquina a máquina para operadores registrados, con documentación en CIRCABC ([Green Forum](https://green-forum.ec.europa.eu/deforestation-regulation-implementation/information-system-deforestation-regulation_en)). [I] No es para caficultores: la app solo debe **exportar un archivo válido** que el exportador pueda cargar.

Ejemplo [I] de lo que la app debería exportar (coordenadas ficticias cerca de Popayán):

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "ProductionPlace": "Lote 3 - Finca La Esperanza", "ProducerCountry": "CO" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-76.611000, 2.439000], [-76.609000, 2.439000],
          [-76.609000, 2.441000], [-76.611000, 2.441000],
          [-76.611000, 2.439000]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": { "ProductionPlace": "Lote 1 - Finca La Esperanza", "ProducerCountry": "CO", "Area": 1.8 },
      "geometry": { "type": "Point", "coordinates": [-76.605123, 2.437456] }
    }
  ]
}
```

[I] El nombre del productor (`ProducerName`) es un dato personal, así que solo debería incluirse en la exportación con autorización (ver 4.A.4).

**¿Qué está haciendo la FNC?**
- [H] **SICA** cubre el 100 % del parque cafetero con georreferenciación desde los años noventa. En agosto de 2024 la FNC anunció una **plataforma para que los exportadores consulten la georreferenciación de los lotes**, «siempre que se cuente con el consentimiento (habeas data) de los caficultores». En ese momento había más de 50 000 permisos actualizados y la meta era que el 93 % autorizara antes de diciembre de 2024 ([FNC, 21-08-2024](https://federaciondecafeteros.org/listado-noticias/fnc-lanzara-plataforma-que-dara-acceso-a-coordenadas-de-lotes-cafeteros-principal-requisito-para-continuar-exportando-a-europa/)).
- [H] La presentación de la FNC en la comunidad de aprendizaje PROMECAFE/GIZ (enero de 2025) detalla lo siguiente ([PDF](https://eudrcentralamerica.thecosa.org/wp-content/uploads/2025/09/2025_01_21_PPT-CdA-CA.pdf), diapositivas 17-25; la portada dice «21.01.2024», pero el contenido y el nombre del archivo corresponden a 2025):
  - **Qué entrega la plataforma:** la coordenada del lote en producción de mayor área, **polígonos para lotes de más de 4 ha**, la coordenada de los lotes de nueva siembra y si el lote se estableció **antes de la línea base (sí/no)**.
  - **Campos de consulta:** tipo y número de documento, nombre del caficultor, nombre de la finca, área de cultivo y códigos DANE de departamento y municipio.
  - **Habeas data:** avance del 72 % a nivel nacional, con meta del 93 %.
  - **Convenios y análisis:** convenio FNC-UPRA sobre uso y confidencialidad de datos del SICA; convenio con el IDEAM para definir las zonas cafeteras libres de deforestación, con un piloto en Huila con la UE; análisis de coordenadas frente a Global Forest Watch (el 87 % de las fincas tiene fecha de establecimiento); y una matriz de legalidad con Swisscontact, el MADR, la UE y el EFI.
- [H] En 2026 la prensa describe el SICA como una base de datos con unos **1,8 millones de lotes** que «proporciona datos de geolocalización a exportadores verificados» ([Instantáneas, 4-03-2026](https://www.instantaneas.org.bo/2026/03/04/comercio-internacional/colombia-cafe-eudr-trazabilidad-preparacion); [Mongabay, marzo de 2026](https://news.mongabay.com/2026/03/colombias-coffee-industry-well-placed-but-wary-as-eu-deforestation-rule-looms/)). Mongabay señala la **legalidad** (informalidad laboral y tenencia de la tierra) como el mayor reto del sector.
- [H] Un estudio académico reporta un 99 % de cobertura geoespacial, pero solo un 73 % de consentimiento ([ResearchGate](https://www.researchgate.net/publication/401819086_The_European_Union_Deforestation_Regulation_EUDR_and_Colombian_Smallholder_Coffee_Producers_Between_Environmental_Sustainability_and_Social_Justice)). **No se encontró la cifra oficial de consentimiento de 2026.**
- [I] Consecuencia para Coffee+Visión: la fuente oficial de geolocalización para exportar es el SICA de la FNC. El módulo de mapa de la app debe presentarse como **herramienta complementaria y educativa**: le sirve al caficultor para conocer y verificar sus lotes, preparar los datos y exportar GeoJSON, pero no reemplaza al SICA ni certifica nada. [A] La app no debería afirmar que un lote está «libre de deforestación» ni que «cumple la EUDR».

#### 4.A.2 BPA del ICA (Resolución 30021 de 2017)

- [H] La resolución, del 28-04-2017, establece los requisitos para la **certificación** en BPA en la producción primaria de vegetales. Su **artículo 2 original menciona expresamente el café**: «cultivos vegetales como frutas, hortalizas, nueces, café, cacao y aloe vera…» ([texto en FAOLEX](https://faolex.fao.org/docs/pdf/col169216.pdf)).
- [H] La **Res. ICA 82394 del 29-12-2020** modificó los artículos 2, 3, 4, 12 y 14 y subrogó los anexos. El nuevo artículo 2 aplica a quien tenga «cultivos vegetales en producción primaria» y quiera certificar su predio, sin listar cultivos ([normograma INVIMA, 82394](https://normograma.invima.gov.co/compilacion/docs/resolucion_ica_82394_2020.htm); [ICA, noticia](https://www.ica.gov.co/noticias/ica-moderniza-normatividad-en-bpa-cumplir-requisit)). [I] El café sigue cubierto.
- [H] La certificación es **voluntaria**: la piden quienes «deseen certificar» el predio. La otorga la Gerencia Seccional del ICA, dura **2 años** y la renovación debe pedirse con al menos 60 días hábiles de anticipación ([normograma INVIMA, 30021, art. 7](https://normograma.invima.gov.co/compilacion/docs/resolucion_ica_30021_2017.htm)). [I] No es obligatoria para vender café, pero define el estándar oficial de registros de campo.
- [H] **Registros documentales** que exige el numeral 10.1 del texto original de la 30021 ([FAOLEX](https://faolex.fao.org/docs/pdf/col169216.pdf); [normograma](https://normograma.invima.gov.co/compilacion/docs/resolucion_ica_30021_2017.htm)):

| Registro | Campos mínimos exigidos |
|---|---|
| Aplicación de **plaguicidas** (10.1.2) | identificación del predio, plaga por controlar, nombre comercial, ingrediente activo, n.º de lote del producto, **n.º de registro ICA**, fecha de aplicación, dosis, método de aplicación, **periodo de carencia**, nombre y firma de quien recomendó y de quien aplicó |
| Aplicación de **fertilizantes** (10.1.2) | predio, nombre comercial y concentración (p. ej. 15-15-15), n.º de registro, fecha, dosis, forma y método, nombre y firma de quien aplicó y de quien recomendó |
| Inventario de insumos (10.1.2) | inventario actualizado de los productos de protección de cultivos |
| Visitas del asistente técnico (10.1.2) | se exigen, sin campos detallados |
| **Capacitaciones** (10.1.3) | fecha, título, tema, capacitador e institución, nombre, firma y datos de cada operario |
| Equipos (10.1.1) | mantenimiento, limpieza, desinfección y calibración |
| **Trazabilidad** (9 y 10.1.5) | unidad productiva, producto, lote, fecha de cosecha y cantidad; histórico, ubicación y trayectoria del producto |
| **Agua** (4.2, 10.1.7, 10.1.8) | análisis microbiológico y fisicoquímico al menos una vez al año; protección de fuentes; consumo de agua |
| Otros | material de propagación transgénico (10.1.4), preparación de abono orgánico (10.1.6), plan de fertilización hecho por un agrónomo con base en análisis de suelo (7.1, 10.2.5), triple lavado de envases (4.4), EPP y botiquín |

- [H] El **periodo de reingreso no aparece** como campo obligatorio en el texto de la 30021 consultado. [I] Aun así conviene registrarlo: viene en la etiqueta y protege al trabajador. **No se obtuvo el texto vigente del Anexo I (lista de chequeo) de la 82394/2020**: el normograma lo marca como «no incluido».
- [H] **¿Hay fincas cafeteras con BPA?** Sí, pero pocas. La «Lista vigente de predios certificados y recertificados en BPA» del ICA en datos.gov.co (`wusb-7b8z`, actualizada el 10-09-2021) tiene 1 345 registros. Una consulta propia encontró **unos 73 que incluyen café** (29 solo café), sobre todo en Risaralda (38) ([dataset](https://www.datos.gov.co/resource/wusb-7b8z.json)).
- [H] El ICA publicó para comentarios un **proyecto de resolución (2024)** con nuevos requisitos BPA «en diversas modalidades» ([Fenalco](https://www.fenalco.com.co/blog/juridico-2/notijuridico-101-el-ica-establecera-los-requisitos-para-obtener-la-certificacion-en-buenas-practicas-agricolas-en-la-produccion-primaria-de-cultivos-agricolas-7313)). **No se pudo confirmar si ya se expidió.**

#### 4.A.3 Certificaciones voluntarias comunes en el café colombiano

Solo se incluye lo que se pudo verificar. Ninguna norma completa se leyó cláusula por cláusula.

| Esquema | Lo verificado | Registros o datos de finca verificados | No verificado |
|---|---|---|---|
| **Rainforest Alliance** | [H] Los Farm Requirements v1.3 de 2020 **vencieron el 1-10-2025** ([RA](https://knowledge.rainforest-alliance.org/docs/2020-sustainable-agriculture-standard-farm-requirements)). Desde el **1-03-2026** existe el complemento **Regenerative Agriculture Standard**: 17 requisitos sobre la SAS, y el café es el primer cultivo ([RA](https://knowledge.rainforest-alliance.org/docs/getting-started-with-the-regenerative-agriculture-standard)) | [H] La **Política de alineación con la EUDR v2.0** (vigente desde el 16-06-2025) es obligatoria para fincas de café y cacao: polígono para unidades de **4 ha o más** y punto para las demás, 6 decimales, prueba de pago de impuestos, anticorrupción y ninguna conversión de bosque después del 31-12-2020 ([RA](https://knowledge.rainforest-alliance.org/docs/alignment-with-the-eudr-policy)) | Versión vigente de la SAS para fincas y campos de sus registros de agroquímicos |
| **4C** | [H] Código con principios y prácticas inaceptables, auditado por terceros aprobados por 4C Services. La versión verificada es la v2.3 de 2018 ([4C v2.3](https://britishcoffeeassociation.org/wp-content/uploads/2022/02/4C_Code_of_Conduct_v2.3_en.pdf)) | — | Versión vigente del Código y sus requisitos de registros y geolocalización |
| **Fairtrade** | [H] Publica guías de geolocalización EUDR para organizaciones de productores (2025) ([Fairtrade](https://www.fairtrade.net/content/dam/fairtrade/global/why-we-do-it/deforestation/2025-EN_Fairtrade-Best-practices-geolocation-data-collection-preparation_BW.pdf)) | Solo se leyó un resumen de buscador (mínimo 4 vértices por polígono y 6 decimales); el PDF no se pudo abrir | Registros del estándar para organizaciones de pequeños productores |
| **C.A.F.E. Practices** (Starbucks, verifica SCS Global) | [H] Estándar v4; tarjetas de puntaje «Generic» y «Smallholder» con más de 200 indicadores; despliegue por niveles desde 2025, con transición en 2025-2026 ([SCS](https://www.scsglobalservices.com/latin-america/services/starbucks-cafe-practices)) | — | Indicadores de registros de finca |
| **Nespresso AAA** | [H] Alianza FNC-Nespresso en Colombia. En 4 clústeres el 87 % de los productores tiene certificación Fair Trade USA y el 13 % Rainforest Alliance ([IICA](https://opsaa.iica.int/en/initiative-1572-alianza-federacion-nacional-de-cafeteros-fnc-y-nespresso-para-implementacion-en-colombia-del-programa-aaa-sustainable-quality-en)) | — | Requisitos de finca del programa |
| **Orgánico (Colombia)** | [H] Reglamento de productos agropecuarios ecológicos: Res. 187 de 2006, modificada por la **Res. MADR 199 de 2016** ([normograma](https://normograma.invima.gov.co/compilacion/docs/resolucion_minagricultura_0199_2016.htm)) | — | Registros exigidos; reglas de la UE 2018/848 y del USDA NOP |

[I] **Cuaderno de campo mínimo común**, construido como la intersección de la BPA del ICA, la EUDR y la política EUDR de RA:
- lotes con geometría y fecha de establecimiento;
- aplicaciones de agroquímicos con registro ICA, dosis, carencia y reingreso;
- fertilización;
- cosecha por lote y fecha;
- ventas y despachos (comprador y cantidad);
- capacitaciones;
- agua;
- trabajadores.

Esta lista es una inferencia y no reemplaza la lectura de cada norma.

#### 4.A.4 Protección de datos personales (Ley 1581 de 2012 y Decreto 1377 de 2013)

- [H] **Marco.** La Ley 1581 de 2012 define el dato personal como cualquier información vinculada o que pueda asociarse a una persona natural (art. 3). Exige **autorización previa e informada**, obtenida por un medio que permita consultarla después (art. 9), y el **deber de informar** la finalidad y los derechos al pedirla (art. 12). Fija los derechos del titular (art. 8: conocer, actualizar, rectificar, revocar y suprimir), los deberes del responsable (art. 17: incluida la seguridad y el reporte de incidentes a la SIC), multas de hasta 2 000 SMMLV (art. 23) y restricciones a la transferencia internacional (art. 26). **La ley no aplica a bases de datos de «ámbito exclusivamente personal o doméstico»** (art. 2) ([Ley 1581, normograma INVIMA](https://normograma.invima.gov.co/compilacion/docs/ley_1581_2012.htm)).
- [H] El **Decreto 1377 de 2013**, compilado en la **Sección 2.2.2.25 del Decreto 1074 de 2015**, regula: la autorización a más tardar al recolectar el dato y con finalidades específicas (art. 5, hoy 2.2.2.25.2.2); el modo de obtenerla, por escrito, de forma oral o por conducta inequívoca, donde **el silencio nunca vale** (art. 7, hoy 2.2.2.25.2.4); el contenido mínimo de la **política de tratamiento** (art. 13, hoy 2.2.2.25.3.1); el **aviso de privacidad** (arts. 14-15); y la **responsabilidad demostrada** (art. 26) ([Decreto 1377, normograma](https://normograma.invima.gov.co/compilacion/docs/decreto_1377_2013.htm)).
- [H] **RNBD.** Solo deben inscribir sus bases de datos las sociedades y entidades sin ánimo de lucro con activos superiores a **100 000 UVT** y las **entidades públicas** (Decreto 090 de 2018). Quien no está obligado a inscribirse sigue sujeto a los demás deberes ([SIC](https://www.sic.gov.co/registro-nacional-de-bases-de-datos)).
- [I] [A] Las coordenadas de un lote unidas al nombre o documento del caficultor son datos personales. El SENA es una entidad pública: si el SENA operara la app con datos reales, podría quedar obligado al RNBD y a su propia política institucional.

| Requisito mínimo | Prototipo académico con datos **solo en el navegador** del usuario | Versión **con servidor** |
|---|---|---|
| ¿Quién trata los datos? | [I] [A] El mismo usuario, en su dispositivo; el equipo del proyecto no recibe datos. Puede encajar en el «ámbito personal o doméstico», pero un abogado debe confirmarlo | El equipo o la entidad es el **responsable**, y el hosting es el **encargado** |
| Autorización | [I] Pantalla de consentimiento informativo al primer uso (qué se guarda, dónde y cómo borrarlo). Si en pruebas del SENA se registran datos de caficultores reales: **autorización escrita** [A] | **Obligatoria**, previa, expresa e informada, con prueba (fecha, versión de la política, finalidades) (Ley 1581, art. 9; Dec. 1377, arts. 5 y 7) |
| Política y aviso | [I] Aviso breve en la app | Política de tratamiento con el contenido del art. 13 del Dec. 1377 y aviso de privacidad (arts. 14-15) |
| Finalidades | [I] Declararlas aunque sea local: gestión agronómica y generación de reportes | Separar las finalidades y pedir **una autorización aparte para compartir** la geolocalización con un exportador o comprador, como hace la FNC con su habeas data |
| Derechos del titular | [I] Botones para **exportar** y **borrar todo** | Canal de consultas y reclamos, más procedimientos (arts. 8 y 17) |
| Seguridad | [I] No guardar el número de documento si no es necesario; usar IndexedDB/localStorage sin enviar nada a terceros | Cifrado, control de acceso, registros de auditoría y reporte de incidentes a la SIC |
| Terceros / APIs | [I] Al consultar el clima se envían coordenadas a Open-Meteo: **redondearlas a 2 decimales (~1 km)** y no enviar nunca la identidad | Contratos de transmisión; hosting fuera de Colombia = transferencia o transmisión internacional (art. 26) [A] |
| Datos sensibles | [I] Evitar la pertenencia étnica o indígena y la salud, que son sensibles (art. 5) | Si se piden, su entrega debe ser facultativa (art. 12) |
| Datos de prueba | [I] Usar datos ficticios en el repo público | — |

#### 4.A.5 Cédula cafetera y SICA (para alinear el modelo de datos)

- [H] **Cédula Cafetera Inteligente.** Requisitos: estar inscrito en el **SICA**, tener **al menos 0,5 ha de café** y **al menos 1 500 árboles plantados**. Se solicita en el Comité de Cafeteros del municipio. Da derechos gremiales (ser federado, votar), permite recibir el pago del café y acceder a programas, y funciona como cuenta bancaria con tarifas preferenciales ([Agronegocios, 27-03-2024](https://www.agronegocios.co/agricultura/todo-lo-que-necesita-saber-sobre-la-cedula-cafetera-y-que-beneficios-tiene-con-ella-3829335)).
- [H] **Variables del SICA** según el Atlas Cafetero, Cenicafé y el Banco de la República:
  - coordenadas y altitud;
  - productor, finca y lotes;
  - área en café;
  - **sistema productivo** del lote: tecnificado joven, tecnificado envejecido o tradicional;
  - **variedad**, resistente o susceptible a la roya;
  - **densidad** (árboles por hectárea) y **edad** del cafetal;
  - **luminosidad**: libre exposición, semisombra o sombra;
  - tenencia de la tierra.

  Los extensionistas actualizan los datos en campo con «SICA móvil». La Gerencia Técnica de la FNC administra el sistema ([Atlas Cafetero/Cenicafé](https://publicaciones.cenicafe.org/index.php/atl/article/download/2962/2951/2638); texto leído). La tenencia de la tierra viene del [Banco de la República](https://repositorio.banrep.gov.co/bitstreams/9c77d041-3c74-4c13-88f9-8a99227f898d/download). Un resumen de buscador atribuye a otro capítulo del Atlas estas cifras con corte al 30-09-2017: 665 950 fincas, 1 899 665 lotes georreferenciados y 911 238 ha. **No se verificaron directamente.**
- [H] Cifras de la FNC de 2023, presentadas en 2025: 552 814 caficultores, 841 354 ha, 659 850 fincas y 296 400 caficultores con menos de 1 ha. También 23 departamentos y 606 municipios ([FNC/PROMECAFE, diapositiva 11](https://eudrcentralamerica.thecosa.org/wp-content/uploads/2025/09/2025_01_21_PPT-CdA-CA.pdf)).
- [H] No se encontró un **diccionario de datos público** del SICA ni una API. El SICA pertenece a la FNC como administradora del Fondo Nacional del Café ([OIC/FNC](https://ico.org/documents/cy2018-19/icc-125-4e-mou-ico-remote-sensing-fedecafe.pdf)).
- [I] Modelo de datos recomendado, con nombres alineados con el SICA y la plataforma EUDR de la FNC:
  - **Caficultor:** tipoDocumento, numeroDocumento, nombre, tieneCedulaCafetera, consentimientos[] (finalidad, fecha, versionPolitica).
  - **Finca:** nombre, codigoDaneDepto, codigoDaneMpio, vereda, codigoSica (opcional), altitud.
  - **Lote:** nombre, areaHa, geometria (GeoJSON Point o Polygon), variedad, resistenteRoya, fechaSiembra (para calcular la edad), densidadArbolesHa, sistemaProductivo (tecnificado joven, tecnificado envejecido o tradicional), luminosidad (sol, semisombra o sombra), fechaEstablecimiento y **establecidoAntesDe2021** (sí, no o desconocido).

---

### 4.B Datos abiertos y APIs consumibles desde el navegador

#### Resumen de pruebas (2026-10-15, `fetch()` desde `https://example.com`)

| Servicio | ¿Clave? | CORS (navegador) | Uso en app sin servidor |
|---|---|---|---|
| Open-Meteo: pronóstico, histórico y altitud | No (uso no comercial) | **Sí** | Directo |
| NASA POWER | No | **Sí** | Directo |
| datos.gov.co (Socrata): IDEAM, TRM, EVA, insumos UPRA, BPA ICA | No (app token opcional) | **Sí** | Directo |
| Open Topo Data (API pública) | No | **No** | Requiere proxy; usar Open-Meteo |
| FNC: página de precios, PDF y Excel | — | **No** | Requiere proxy y permiso [A] |
| API REST de WordPress de la FNC | No | Sí, pero no es una API de precios | No recomendado |
| BanRep SDMX (TRM) | No | **No** | Requiere proxy; usar datos.gov.co |
| Superfinanciera SOAP (TRM) | No | **No** | Requiere proxy |
| Alpha Vantage (COFFEE) | **Sí** | **Sí** | Solo con la clave del propio usuario |
| FRED CSV | No | **No** | Proceso en tiempo de compilación |
| Pink Sheet del Banco Mundial (xlsx) | No | **No** | Proceso en tiempo de compilación |
| Teselas de OSM | No | **Sí** | Directo, con su política de uso |
| OpenFreeMap (estilo y teselas vectoriales) | No | **Sí** | Directo |
| Esri World Imagery | No para la tesela | **Sí** | Licencia sin verificar [A] |
| EOX Sentinel-2 cloudless | No | **Sí** | Directo; solo uso no comercial |
| Earth Search STAC y COG de Sentinel-2 (AWS) | No | **Sí** (también lecturas `Range`) | Directo |
| Copernicus Data Space / Sentinel Hub | **Sí** (OAuth con secreto) | Preflight sí | Requiere proxy |
| Teselas y API de datos de GFW | No para teselas | **Sí** | Directo |
| WMS JRC GFC2020 | No | Sí (`*` según curl) | Directo como capa WMS |
| DANE MGN y veredas (ArcGIS REST) | No | **No**: cabecera duplicada | Proxy o GeoJSON estático |

#### B.1 Clima

**Open-Meteo**
- **URL:** `https://api.open-meteo.com/v1/forecast` (pronóstico), `https://archive-api.open-meteo.com/v1/archive` (histórico) y `https://api.open-meteo.com/v1/elevation` (altitud).
- **Clave:** no. **CORS:** sí; [H] verificado con curl (`access-control-allow-origin: *`) y en el navegador.
- **Límites:** [H] uso **no comercial**, con menos de 10 000 llamadas al día, 5 000 por hora y 600 por minuto ([términos](https://open-meteo.com/en/terms)). Un sitio sin publicidad ni suscripciones cuenta como no comercial. [I] Un prototipo del SENA encaja ahí; si se comercializa, hace falta un plan de pago.
- **Licencia:** [H] **CC BY 4.0**. Hay que poner un enlace junto a los datos, por ejemplo «Weather data by Open-Meteo.com» ([licencia](https://open-meteo.com/en/licence)).
- **Ejemplo para Popayán** (validado; devuelve todas las variables):
  ```
  https://api.open-meteo.com/v1/forecast?latitude=2.44&longitude=-76.61&elevation=1760&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,precipitation_probability,vapour_pressure_deficit,et0_fao_evapotranspiration,soil_moisture_0_to_1cm,soil_moisture_3_to_9cm,soil_temperature_6cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,precipitation_probability_max,et0_fao_evapotranspiration,shortwave_radiation_sum,sunshine_duration&timezone=America%2FBogota&forecast_days=7&past_days=7
  ```
  Histórico, por ejemplo para normales y balance hídrico:
  ```
  https://archive-api.open-meteo.com/v1/archive?latitude=2.44&longitude=-76.61&start_date=1991-01-01&end_date=2025-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration&timezone=America%2FBogota
  ```
- [H] **Advertencia sobre la rejilla.** Sin el parámetro `elevation`, la consulta en 2.44,-76.61 devolvió la celda 2.4956,-76.597 a 1 733 m. Con `elevation=1760` devolvió otra celda (2.4253,-76.608). [I] En terreno de montaña hay que pasar la altitud del lote y comparar con las estaciones del IDEAM.
- **Cómo usarlo en la app:** [I] widget de clima por lote; acumulados de lluvia y ET0 para un balance hídrico sencillo (lluvia − ET0); alertas de humedad relativa alta o lluvia continua, que son condiciones asociadas a enfermedades; caché de 1 a 3 horas en IndexedDB para el modo sin conexión; coordenadas redondeadas a 2 decimales (ver 4.A.4).

**IDEAM (vía datos.gov.co, Socrata/SODA)**
- **URL** `https://www.datos.gov.co/resource/<id>.json`, con estos conjuntos ([H] probados, todos del IDEAM, actualización diaria según sus metadatos):
  - Precipitación: `s54a-sgyg`
  - Temperatura ambiente del aire: `sbwg-7ju4`
  - Temperatura máxima del aire: `ccvq-rp9s`
  - Temperatura mínima del aire: `afdg-3zpb`
  - Catálogo Nacional de Estaciones: `hp9r-jxuu`
  - Normales climatológicas (anual): `nsz2-kzcq`
- **Clave:** no; el app token es opcional. **CORS:** sí ([H] navegador).
- **Límites:** [H] sin token, Socrata limita por IP en un fondo compartido; con token, las peticiones solo se limitan si hay abuso ([Socrata](https://dev.socrata.com/docs/app-tokens)). Las cifras numéricas no se verificaron. Por defecto se devuelven 1 000 filas por consulta; se pagina con `$limit` y `$offset`.
- **Licencia:** [H] **CC BY-SA 4.0** según los metadatos de cada conjunto (API `/api/views/<id>.json`).
- **Ejemplo:** `https://www.datos.gov.co/resource/s54a-sgyg.json?$where=upper(municipio) like '%POPAY%'&$order=fechaobservacion DESC&$limit=100`. [H] Devolvió lecturas de la estación ARRAYANALES - AUT (26015040) en Popayán, cada 10 minutos, hasta el 14-10-2026.
- [H] **Calidad de datos.** En el catálogo de estaciones, el campo `ubicaci_n` trae la latitud y la longitud **invertidas**, y hay altitudes inconsistentes (por ejemplo «25» m en Popayán). [I] Conviene usar los campos `latitud` y `longitud`.
- **API propia del IDEAM:** no se encontró una documentada. [I] El portal DHIME sirve para descargas manuales (no verificado).
- **Cómo usarlo:** [I] mostrar la estación IDEAM más cercana al lote, con datos observados frente a los modelados por Open-Meteo; usar las normales climatológicas como línea base.

**NASA POWER**
- **URL:** `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN&community=AG&longitude=-76.61&latitude=2.44&start=20250101&end=20251231&format=JSON`.
- **Clave:** no. **CORS:** sí ([H] curl y navegador).
- **Límites:** [H] no hay un límite oficial publicado. Fuentes antiguas hablan de unas 30 peticiones por minuto, y la NASA monitorea el uso ([foro Earthdata](https://forum.earthdata.nasa.gov/viewtopic.php?p=15146); [nasapower](https://docs.ropensci.org/nasapower/)).
- **Atribución:** [H] el proyecto pide reconocer a NASA Langley Research Center y al POWER Project ([nasapower](https://docs.ropensci.org/nasapower/)).
- **Cómo usarlo:** [I] radiación solar y series largas para comparar campañas. Su resolución es gruesa, así que sirve como respaldo de Open-Meteo, no como fuente principal.

#### B.2 Precio del café y TRM

**Precio interno de referencia (FNC)**
- [H] Se publica en la portada de `federaciondecafeteros.org` como HTML renderizado en el servidor y en un PDF diario (`/wp-content/uploads/2026/03/precio_cafe.pdf`, con Last-Modified del 15-10-2026). El 2026-10-15 marcaba: precio interno **$2 095 000 por carga de 125 kg de pergamino seco**, Bolsa de NY **294,80 ¢/lb** y tasa de cambio **3 170**.
- [H] El histórico está en el Excel mensual «Precios, área y producción de café». La versión de septiembre de 2026 tiene hojas de precio interno diario y mensual, precio ex-dock, precio OIC mensual, área por departamento, área según tecnificación, producción mensual y valor de cosecha ([página de estadísticas](https://federaciondecafeteros.org/estadisticas-cafeteras/)).
- **API:** no hay. **CORS:** no; [H] el navegador bloqueó la portada y el xlsx.
- **Términos de uso:** [H] el contenido es solo para «uso personal y no para fines comerciales». Se prohíbe copiarlo, reproducirlo o distribuirlo sin permiso escrito, y también usar robots para extraerlo ([términos FNC](https://federaciondecafeteros.org/terminos-y-condiciones-de-uso-contenido-web/)).
- **Cómo usarlo:** [I] [A] No hacer scraping. Opciones:
  - el administrador escribe el precio del día en la app, con fecha y enlace a la FNC (un abogado debe confirmar si registrar una cifra factual es «reproducción»);
  - pedir permiso a la FNC;
  - mostrar solo un enlace.

**TRM**
- **datos.gov.co, conjunto `32sa-8pi3`** (Superfinanciera): `https://www.datos.gov.co/resource/32sa-8pi3.json?$order=vigenciadesde DESC&$limit=1`.
  - Clave: no. CORS: **sí**. Licencia: **CC BY-SA 4.0**. Actualización diaria ([H]).
  - [H] El 2026-10-15 ya traía la TRM vigente para el **16-10-2026** (3 170,46) y la del 15-10 (3 197,65). [I] La «tasa de cambio 3 170» que mostraba la FNC coincide con la TRM del día siguiente.
- [H] **BanRep SDMX** (`totoro.banrep.gov.co/nsi-jax-ws/rest/...`) y el **web service SOAP de la Superfinanciera** responden, pero **sin CORS** (bloqueados en el navegador).
- **Cómo usarlo:** [I] convertir dólares a pesos en el módulo de costos y precio, y graficar el histórico.

**Contrato «C» de ICE (KC)**
- [H] ICE exige **aprobación de ICE Data** para mostrar en público, incluso en sitios web, precios diferidos. La redistribución se hace por medio de distribuidores autorizados ([ICE](https://www.ice.com/market-data/quote-data-distribution)). No hay una API gratuita.
- **Alternativas con precio mensual de referencia, no el KC diario:**
  - [H] **Alpha Vantage `function=COFFEE`** (precio global del café en ¢/lb, mensual, trimestral o anual): CORS sí, requiere **clave gratuita** (25 peticiones al día según fuentes secundarias, [Macroption](https://www.macroption.com/alpha-vantage-api-limits/)). [I] En un repo público sin secretos solo sirve si cada usuario escribe su propia clave, guardada en el navegador.
  - [H] **FRED** `PCOFFOTMUSDM` (Other Mild Arabica, FMI): el CSV no tiene CORS.
  - [H] **Pink Sheet del Banco Mundial** (`CMO-Historical-Data-Monthly.xlsx`): sin CORS. Su licencia (¿CC BY 4.0?) no se confirmó en una fuente oficial.
- **Cómo usarlo:** [I] Un job programado (por ejemplo GitHub Actions) puede descargar una serie mensual con licencia compatible y guardarla como JSON estático en el repo, con atribución. Para el KC diario, mostrar solo un enlace externo.

#### B.3 Geodatos

**Altitud**
- **Open-Meteo Elevation:** `https://api.open-meteo.com/v1/elevation?latitude=2.44&longitude=-76.61` devolvió [H] `{"elevation":[1733.0]}`.
  - Usa el **Copernicus DEM GLO-90** (90 m) y acepta hasta 100 coordenadas por petición. Exige atribución a Copernicus y a Open-Meteo ([documentación](https://open-meteo.com/en/docs/elevation-api)).
  - CORS: **sí**.
- **Open Topo Data** (`api.opentopodata.org/v1/srtm30m`) devolvió [H] 1 732 m, pero **sin cabecera CORS** en el GET, y el navegador lo bloqueó. Límites: 1 llamada por segundo, 1 000 al día y 100 ubicaciones por petición ([opentopodata.org](https://www.opentopodata.org/)).
- **Cómo usarlo:** [I] rellenar automáticamente la altitud del lote a partir de su centroide, que es una variable del SICA.

**Mapas base**
- **OpenStreetMap** (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, con Leaflet). CORS sí. Su política exige ([H] [política de teselas](https://operations.osmfoundation.org/policies/tiles/)):
  - atribución visible;
  - User-Agent identificable y Referer válido;
  - respetar la caché;
  - **no descargar en bloque ni precargar**;
  - **no usarlo sin conexión** («Offline use is not permitted»).

  [I] Esto choca con el requisito de funcionar sin conexión del proyecto.
- **OpenFreeMap** (`https://tiles.openfreemap.org/styles/liberty`, para MapLibre GL). [H] Sin clave ni registro y sin límite de vistas. Se permite el uso comercial. Hay que poner la atribución «OpenFreeMap © OpenMapTiles Data from OpenStreetMap». Se permiten **descargas sin conexión de hasta 3 000 teselas o 50 MB** por descarga, con un máximo de 4 peticiones en paralelo ([openfreemap.org](https://openfreemap.org/)). CORS: sí. [I] Es la mejor opción para el modo sin conexión.

**Imágenes satelitales**
- **Esri World Imagery** (`server.arcgisonline.com/.../World_Imagery/MapServer/tile/{z}/{y}/{x}`). [H] CORS sí. Tiene licencia bajo el **Esri Master License Agreement** y su ficha dice que no debe usarse para exportar teselas sin conexión ([ficha Esri](https://goto.arcgis.com/maps/World_Imagery)). [A] No se verificó si el uso directo sin cuenta de ArcGIS está permitido.
- **EOX Sentinel-2 cloudless** (WMTS `tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/...`). [H] CORS sí. Licencia **CC BY-NC-SA 4.0** para uso no comercial; el uso comercial requiere licencia de EOX. Atribución exigida: «EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data [año])» ([EOX](https://cloudless.eox.at/documentation/license)). [I] Es adecuada para un proyecto académico.
- **Sentinel-2 L2A con NDVI propio:**
  - Búsqueda en el **STAC de Earth Search** (`https://earth-search.aws.element84.com/v1/search`) y lectura de los **COG** de las bandas B04 (rojo) y B08 (infrarrojo) en `sentinel-cogs.s3.us-west-2.amazonaws.com`.
  - [H] Sin clave, con CORS y con lecturas `Range` (respuesta 206 en el navegador).
  - Licencia: [H] acceso «libre, pleno y abierto». Hay que avisar «Copernicus Sentinel data [año]» o, si se modifican los datos, «Contains modified Copernicus Sentinel data [año]» ([aviso legal de la UE](https://sentinels.copernicus.eu/documents/247904/690755/Sentinel_Data_Legal_Notice)).
  - [H] **Nubosidad:** la escena más reciente sobre Popayán (S2B, 12-10-2026) tenía **98 % de nubes**. [I] El NDVI óptico en la zona cafetera andina tendrá muchos huecos: hay que filtrar por `eo:cloud_cover` y mostrar la fecha de cada imagen.
  - [I] Se puede calcular en el navegador con una librería de lectura de GeoTIFF, pero es pesado. Conviene dejarlo como función avanzada.
- **Copernicus Data Space Ecosystem / Sentinel Hub.** [H] Requiere cuenta y **cliente OAuth con secreto**, y tiene cuotas mensuales gratuitas ([documentación CDSE](https://documentation.dataspace.copernicus.eu/FAQ.html)). [I] Un repo público sin secretos no puede usarlo sin un proxy. El STAC de CDSE no respondió a tiempo en la prueba.

**Capas de referencia para deforestación** (útiles para el módulo EUDR)
- **Global Forest Watch**, pérdida de cobertura arbórea UMD/Hansen (`https://tiles.globalforestwatch.org/umd_tree_cover_loss/latest/dynamic/{z}/{x}/{y}.png`). [H] CORS sí y licencia **CC BY 4.0** ([GFW Data API](https://data-api.globalforestwatch.org/dataset/umd_tree_cover_loss)). [H] Advertencia: «loss» **no equivale a deforestación**, porque incluye cosecha, fuego y otras causas. La FNC usa GFW en su análisis (ver 4.A.1).
- **JRC GFC2020** (mapa de bosque de 2020 de la UE). WMS en `https://ies-ows.jrc.ec.europa.eu/iforce/gfc2020/wms.py`, con capas `gfc2020_v3` y `gfc2020_v4`; [H] GetCapabilities devolvió `Access-Control-Allow-Origin: *`. [H] Es una fuente **no obligatoria, no exclusiva y no vinculante** para la EUDR. El WMS es solo para visualizar; para analizar hay que usar los GeoTIFF ([JRC](https://forobs.jrc.ec.europa.eu/GFC)).
- [I] [A] La app puede **superponer** estas capas sobre el polígono del lote como «revisión visual preliminar», sin emitir conclusiones de cumplimiento.

**Límites municipales y veredales**
- **DANE, MGN 2025** (ArcGIS REST): `https://geoportal.dane.gov.co/mparcgis/rest/services/Divipola/Serv_DIVIPOLA_MGN_2025/FeatureServer` (capas 319 Departamento, 317 Municipio, 305 Centros poblados) y **veredas 2025**: `.../NIVEL_DE_REFERENCIA_DE_VEREDAS/Serv_CapasNivelReferenciaVeredas_2025/FeatureServer/1`.
  - [H] Una consulta por punto (`geometry=-76.61,2.44&inSR=4326&f=geojson`) devolvió **Popayán, DIVIPOLA 19001**.
  - [H] **CORS roto:** el servidor envía dos cabeceras `Access-Control-Allow-Origin` (el origen que pide y `https://nowsoft.app`). Chrome lo bloquea: «contains multiple values … but only one is allowed».
  - [I] Opciones: descargar una vez el subconjunto de Cauca, guardarlo como GeoJSON estático en el repo y simplificarlo; o pedirle al DANE que corrija la cabecera. Los términos de uso del DANE no se verificaron [A].
- **IGAC.** [H] Publica datos en SHP, KML, GeoJSON, WMS y WFS «de acceso libre y gratuito» ([IGAC, datos abiertos](https://www.igac.gov.co/datos-abiertos/)). Una fuente secundaria cita la Res. IGAC 616 de 2020, que adopta CC BY 4.0. No se verificaron el endpoint de veredas ni su CORS.

#### B.4 Datos del sector (panel del administrador y comparativos)

- **EVA 2019-2025, base agrícola (UPRA)**, `uejq-wxrr` en datos.gov.co. Campos: departamento, municipio y códigos DANE, cultivo, año, periodo, área sembrada, área cosechada, producción y rendimiento.
  - CORS: **sí**. Licencia: **CC BY-SA 4.0**. Actualización anual.
  - [H] Consulta propia (`$where=upper(cultivo) like 'CAF%' AND departamento='Cauca'`, agrupada por año): área sembrada de café en Cauca de **93 762 ha** y producción de **96 685** en 2025. Las unidades se toman del diccionario del conjunto; sin verificar si son toneladas de pergamino o de café verde.
  - **Cómo usarlo:** [I] ranking municipal, evolución del área y la producción, y comparación entre el rendimiento de la finca y el del municipio.
- **Índice de precios de insumos agrícolas (UPRA)**, `gwbi-fnzs`. [H] Serie mensual hasta 2026-08 con índices de fertilizantes (urea, DAP, KCl, 15-15-15, etc.) y plaguicidas. CORS sí. [I] Sirve para ajustar costos en el módulo de costos.
- **Estadísticas de la FNC.** [H] Hay un Excel de exportaciones (agosto de 2026) y otro de precios, área y producción por departamento y tecnificación. Sin CORS y con términos restrictivos [A] (ver B.2).
- **Lista BPA del ICA** (`wusb-7b8z`). [H] CORS sí, pero desactualizada (2021). [I] Útil como indicador en el panel.
- **SIPSA-Insumos (DANE).** [H] Aparece en datos.gov.co solo como enlace federado (`9ka4-3qbp`, `cpad-s27y`), no como API SODA. No se verificó su acceso.

---

### 4.C (a) Módulos que la norma o el mercado justifican (en orden de prioridad)

| # | Módulo | Justificación (fuente) | ¿Solo navegador? |
|---|---|---|---|
| 1 | **Lotes con mapa: punto o polígono y exportación GeoJSON compatible con TRACES** (WGS84, [lon, lat], 6 decimales, polígono cerrado, validación de autointersección, área en ha, polígono desde 4 ha) | EUDR: geolocalización de todas las parcelas y polígono para más de 4 ha ([FAQ de TRACES](https://acceptance.eudr.webcloud.ec.europa.eu/tracesnt/help/eudr-documentation/operator/faq.html)); formato ([GeoJSON de TRACES](https://eudr.webcloud.ec.europa.eu/tracesnt/help/eudr-documentation/operator/geojson-description.html)); RA EUDR1-2; plataforma de la FNC | **Sí** (OpenFreeMap u OSM; GPS del teléfono; cálculo de área en el cliente) |
| 2 | **Registro de aplicaciones de agroquímicos con carencia y reingreso** + inventario de insumos + aviso «no cosechar hasta…» | Res. ICA 30021/2017, num. 10.1.2 (registro ICA, dosis, **periodo de carencia**, quién recomendó y quién aplicó) ([FAOLEX](https://faolex.fao.org/docs/pdf/col169216.pdf)) | **Sí** |
| 3 | **Cosecha y trazabilidad por lote**: fechas y rango de producción, cantidades, despachos y comprador | EUDR: fecha o rango de producción por parcela, conservado 5 años ([Coolset, citando la guía de la CE](https://www.coolset.com/academy/eudr-geolocation-requirements-how-to-collect-and-validate-gps-polygon-data-for-your-dds)); 30021, num. 9 y 10.1.5 | **Sí** |
| 4 | **Consentimientos y privacidad**: aviso, finalidades, autorización separada para compartir con el exportador, exportar y borrar | Ley 1581, arts. 8, 9 y 12; Dec. 1377, arts. 5, 7 y 13 ([normograma](https://normograma.invima.gov.co/compilacion/docs/decreto_1377_2013.htm)); modelo de habeas data de la FNC | **Sí** (en el prototipo) [A] |
| 5 | **Declaración del lote frente a la línea base 2020**: fecha de establecimiento, «¿establecido antes del 31-12-2020?», superposición de GFC2020 y pérdida de GFW como revisión visual | EUDR, fecha de corte; la FNC entrega «establecimiento antes de la línea base (sí/no)» ([FNC](https://eudrcentralamerica.thecosa.org/wp-content/uploads/2025/09/2025_01_21_PPT-CdA-CA.pdf)); RA EUDR5 | **Sí** (WMS y teselas) [A] por las conclusiones |
| 6 | **Fertilización** con plan y análisis de suelo | 30021, num. 10.1.2, 7.1 y 10.2.5 | **Sí** |
| 7 | **Capacitaciones del personal** | 30021, num. 10.1.3 | **Sí** |
| 8 | **Agua**: fuentes, protección, consumo y análisis anual | 30021, num. 4.2, 10.1.7 y 10.1.8 | **Sí** |
| 9 | **Clima por lote** con lluvia, ET0 y alertas de humedad, más la estación IDEAM cercana | Mercado y agronomía; datos abiertos verificados (Open-Meteo, IDEAM) | **Sí** |
| 10 | **Precio y TRM**: TRM automática y precio FNC escrito por el administrador con enlace | Necesidad de mercado; TRM CC BY-SA (datos.gov.co); FNC sin API y con términos restrictivos | **Sí** para la TRM; precio FNC manual [A] |
| 11 | **Costos de producción** con índice de insumos de la UPRA | Datos abiertos de la UPRA (`gwbi-fnzs`) | **Sí** |
| 12 | **Monitoreo de plagas y enfermedades** (broca, roya) ligado a las aplicaciones | 30021 exige registrar la «plaga por controlar» en cada aplicación | **Sí** |
| 13 | **Equipos**: mantenimiento y calibración | 30021, num. 10.1.1 | **Sí** |
| 14 | **Reportes para auditor o comprador** (PDF/CSV/GeoJSON) | BPA ICA y certificaciones (RA, 4C, C.A.F.E.) piden evidencias documentales | **Sí** |
| 15 | **Panel del administrador sectorial** (EVA por municipio, área y producción) | Datos abiertos de la UPRA (`uejq-wxrr`) | **Sí** |
| 16 | **Datos del lote alineados con el SICA** (variedad, densidad, edad, sistema productivo, luminosidad, altitud automática) | Variables del SICA y de la cédula cafetera ([Atlas/Cenicafé](https://publicaciones.cenicafe.org/index.php/atl/article/download/2962/2951/2638)) | **Sí** (altitud con Open-Meteo) |
| — | Precio KC diario, Sentinel Hub, sincronización entre dispositivos y consulta del SICA | Requieren licencia, secreto o servidor | **No**: necesitan proxy o servidor |

### 4.D (b) Lagunas

1. **EUR-Lex inaccesible** (desafío antibots, HTTP 202). No se leyó el texto oficial de los Reglamentos 2023/1115 (art. 2 y art. 9), 2025/2650, 2025/1093 ni 2026/2102. Las fechas se tomaron de la página de la Comisión y de despachos de abogados.
2. **Clasificación de riesgo de Colombia.** Solo hay fuentes secundarias («estándar»), la objeción del Parlamento y una actualización anunciada para 2026 cuyo resultado no se encontró. Coolset afirma que hoy todos los países son de riesgo estándar.
3. [A] **¿El caficultor tiene obligaciones directas bajo la EUDR?** ¿Qué pruebas de legalidad bastan para una finca colombiana (tenencia, laboral, tributaria)?
4. **FNC.** No se encontró la cifra de consentimiento de 2026, el estado actual de la plataforma para exportadores, ni si el caficultor puede ver o descargar sus propios polígonos del SICA. Tampoco hay diccionario de datos público del SICA.
5. **ICA.** No se obtuvo el Anexo I vigente (lista de chequeo de la 82394/2020). No se sabe si el proyecto de resolución BPA de 2024 se expidió, ni si el periodo de reingreso es un campo exigido. No se encontró el **registro de plaguicidas del ICA** como dato abierto con API, que sería útil para autocompletar el n.º de registro y la carencia.
6. **Certificaciones.** No se verificaron, cláusula por cláusula, los registros de finca de la versión vigente de la SAS de RA, de 4C, de Fairtrade, de C.A.F.E. Practices, de Nespresso AAA ni de los orgánicos (UE 2018/848, NOP).
7. **Licencias por confirmar** [A]: datos y precios de la FNC (términos restrictivos), MGN y veredas del DANE, IGAC (CC BY 4.0 según una fuente secundaria), Esri World Imagery sin cuenta, Pink Sheet del Banco Mundial e ICE (contrato «C»).
8. **Límites de uso numéricos** no confirmados en fuentes oficiales: NASA POWER, Socrata (sin token y con token) y cuotas de CDSE/Sentinel Hub.
9. **Precisión de Open-Meteo en montaña** (ajuste a la rejilla a pocos km del punto). Hay que validarla con las estaciones del IDEAM antes de usarla para alertas agronómicas.
10. **Nubosidad.** El NDVI de Sentinel-2 en la zona cafetera puede tener pocas escenas útiles. No se evaluó una alternativa de radar (Sentinel-1).
11. **DANE ArcGIS.** El error de CORS (cabecera duplicada) puede ser temporal; conviene reportarlo al DANE.
12. [A] **Protección de datos.** ¿El prototipo que guarda datos solo en el navegador queda en el «ámbito personal o doméstico»? ¿Aplica la política de datos del SENA si se prueba con caficultores reales? ¿Se requiere el RNBD si el SENA es el responsable?
13. **Unidades de la EVA** (toneladas de pergamino o de café verde): revisar el diccionario del conjunto antes de publicar comparativos.

**Fuentes principales** (todas consultadas el 2026-10-15): enlazadas en cada afirmación arriba. Las pruebas de CORS son propias, hechas con curl y con `fetch()` en un navegador Chromium desde `https://example.com`.
