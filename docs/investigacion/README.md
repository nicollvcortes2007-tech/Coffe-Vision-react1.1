# Investigación de Coffee+Visión (2026-10-15)

Cinco líneas de investigación hechas antes del rediseño, con el procedimiento de `david-research`: pregunta → fuentes primarias contrastadas → hecho **[H]**, interpretación **[I]** y validación legal **[A]** separados → síntesis citada. Todas las fuentes se consultaron el 2026-10-15.

| # | Informe | Pregunta |
|---|---|---|
| 1 | [Competencia y referencias funcionales](01-competencia.md) | ¿Qué herramientas existen para la finca cafetera y qué hueco queda? |
| 2 | [Dominio agronómico](02-dominio-cafetero.md) | ¿Qué reglas, unidades y umbrales de Cenicafé y la FNC puede calcular la app? |
| 3 | [IA de visión y asistente](03-ia-vision.md) | ¿Hay un modelo abierto de enfermedades del café que corra en el celular? |
| 4 | [Normativa y datos abiertos](04-normativa-datos.md) | ¿Qué pide la norma (EUDR, BPA, Ley 1581) y qué datos se pueden leer desde el navegador? |
| 5 | [Referencias de diseño](05-diseno.md) | Las 15 plataformas de referencia (vgpu en detalle) y 10 referencias del dominio |

## Lo que se concluyó

1. **El hueco existe.** La FNC y Cenicafé dan extensión, apps de consulta y chatbots gratuitos, pero ninguna herramienta le lleva al caficultor su propio cuaderno de labores, kilos, costos y ventas, ni le calcula su costo por carga frente al precio del día. Las plataformas comerciales de café le venden a cooperativas y exportadores (Cropster desde 199 €/mes). El 43 % de los hogares rurales no tiene internet: funcionar sin señal es un requisito.
2. **Las reglas existen y tienen fuente.** Casi todo depende de dos datos por lote: la fecha de la floración principal y la variedad. Cosecha ≈ floración + 224 días; período crítico de broca desde el día 120; primera aplicación contra la roya a los 60 días en variedades susceptibles; muestreo de broca de 30 árboles con umbral del 2 % (y aplicar solo si más de la mitad de las brocas están en posición A o B); muestreo de roya de 10 × 10 con umbral del 5 %. Unidades: 1 carga = 125 kg de c.p.s.; cereza × 0,20 ≈ c.p.s.; factor de rendimiento base 94.
3. **La IA de visión es posible, pero solo como orientación.** EfficientNet-B1 de ConnorLee08 (Apache-2.0, 7,3 MB, 8 clases con rechazo y umbrales calibrados) corre en el navegador con LiteRT.js. En fotos de roya del Huila solo aceptó y acertó 22 de 847: debe abstenerse cuando duda y no presentarse como diagnóstico. No reconoce la broca (está en el fruto).
4. **El asistente útil es el de los datos propios.** AdrIAna (Cenicafé) ya responde preguntas generales con internet; un LLM en el celular pesa de 290 MB a 1 GB. El asistente de Coffee+Visión responde sobre la finca del usuario («¿cuánto gasté en abono en La Loma?»), sin conexión, con reglas y búsqueda local en las guías.
5. **Lo que la norma y el mercado justifican:** geolocalización del lote (punto o polígono, 6 decimales, GeoJSON WGS-84) para la cadena que exige la EUDR desde el 30-12-2026; registro de aplicaciones con número ICA y período de carencia (BPA, Res. ICA 30021/2017); consentimiento, exportación y borrado de datos (Ley 1581).
6. **Datos abiertos que funcionan desde el navegador:** Open-Meteo (clima y altitud), datos.gov.co (TRM; área y producción de café por municipio, EVA-UPRA). El precio interno de la FNC no tiene API y sus términos prohíben extraerlo: lo escribe el administrador con la fecha y el enlace.
7. **Dirección visual:** «Pergamino de ladera» (ver `DESIGN.md`): clara para el sol, Fraunces + Atkinson Hyperlegible Next (OFL), la cereza como color de acción y las curvas de nivel como sistema gráfico. vgpu 0.6.0 (MIT) para una ladera 3D opcional con respaldo en SVG.

## Qué se hizo con los módulos anteriores

| Antes | Ahora |
|---|---|
| «Plagas IA» que fingía reentrenar una red | Diagnóstico por foto real (EfficientNet-B1 en el navegador) + muestreo guiado de broca y roya |
| Chatbot que respondía siempre lo mismo | Asistente sobre los datos de la finca + guías con búsqueda, sin conexión |
| Estadísticas y notificaciones inventadas | Calculadas con reglas de Cenicafé a partir de los registros reales |
| Dos páginas de cultivos y «registrar labor» duplicadas | Lotes con ficha estilo SICA, línea de tiempo y ubicación GPS |
| Gestión de usuarios duplicada en dos pantallas | Una sola pantalla de cuentas del administrador |
| Contraseña del administrador en el código | Cuentas con contraseñas cifradas (PBKDF2), sesión que vence y rutas protegidas |

## Lagunas que siguen abiertas

- No hay una tabla oficial de productividad por número de cosecha ni una ecuación de kilos esperados a partir de conteos de frutos.
- No hay un modelo de roya validado por Cenicafé para alertas con pronóstico: las alertas de clima son interpretación sobre hechos citados.
- La licencia de los pesos B2 de ConnorLee08 dice «other»; se usa B1, que declara Apache-2.0.
- Falta un set de prueba con fotos de fincas colombianas para medir el diagnóstico de verdad.
- [A] Si se prueba con datos de caficultores reales, revisar con un abogado la política de datos del SENA (Ley 1581).
