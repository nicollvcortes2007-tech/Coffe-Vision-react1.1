## 3. IA de visión y asistente

**Fecha de consulta de todas las fuentes:** 2026-10-15.
**Convención:** **[H]** = hecho verificado en la fuente enlazada; **[I]** = interpretación o inferencia propia.

### Conclusión

Sí hay modelos abiertos que se pueden usar en un repo público, pero ninguno está validado con fotos de campo colombianas. El más útil hoy es la variante **EfficientNet-B1** del repo `ConnorLee08/coffee-leaf-efficientnet-b2`. Su ficha declara **Apache-2.0**, tiene 8 clases (incluidas «daño de coco» y «no compatible»), se entrenó también con fotos de campo de Santander y trae un TFLite de 7,3 MB. El de licencia más limpia es **Huyt EfficientNet-B0** (CC BY 4.0), pero solo tiene 5 clases y se entrenó con recortes de Kenia. Los dos fallan casi siempre en fotos externas: por ejemplo, B1 acierta y acepta solo el 2,6 % de las fotos de roya de Huila. **[I] Recomendación:** usar B1 en ONNX Runtime Web (unos 10 MB en la primera descarga y sin conexión después), presentarlo como orientación y no como diagnóstico, y reentrenar con datos colombianos. Para el asistente, lo viable es usar reglas y búsqueda local (MiniSearch) sobre fichas escritas por el equipo, no un LLM en el celular.

> Nota del repo **[H]**: `package.json` del proyecto declara React `^19.3.1`, Vite `^8.3.4`, Tailwind 4 y react-router 7. No dice React 18 como en el encargo. No hay plugin PWA ni CSP en `index.html` (archivos locales `package.json`, `vite.config.js`, `index.html`).

---

### 3.1 Datasets públicos de café (hojas, frutos y plagas)

| Dataset | Clases | Nº de imágenes | Condiciones de captura | Licencia | Enlace |
|---|---|---|---|---|---|
| **CoffeeLeaf-CO / DECAFIA v2** (UIS, Colombia) | roya, *coco* (gorgojo *Compsus*/*Epicaerus*), minador; detección con cajas YOLO **[H]** | 2.315 imágenes (1.113 hojas sanas sin etiqueta) y 12.794 instancias; 610 imágenes vienen de Silva et al. (Brasil) **[H]** | Cafetal de arábica en El Socorro (Santander). Celulares Android, luz natural de campo, sin montaje controlado. Kappa entre anotadores: 0,91 **[H]** | CC BY 4.0 **[H]** | [zenodo.org/records/22756170](https://zenodo.org/records/22756170) (v2.0.0, 2026-09-14) |
| **Colombian coffee tree leaves multispectral** (Aroca-Trujillo y Pérez-Ruiz, *Data in Brief* 59, 2025) | Rust / NoRust **[H]** | 6.726 imágenes en total (RGB + 5 bandas) **[H]**. El espejo AgML trae 1.120 RGB: 847 con roya y 273 sin roya **[H]** | Hojas de Garzón y El Hobo (Huila). Ambiente controlado, toma cenital a 1 m con cámara multiespectral **[H]** | Artículo CC BY 4.0. El artículo no declara licencia para los datos **[H]**. El espejo AgML dice CC0 1.0 **[H]** | [PMC11927593](https://pmc.ncbi.nlm.nih.gov/articles/PMC11927593/) · [Kaggle ds/5644659](https://www.kaggle.com/ds/5644659) · [HF AgML](https://huggingface.co/datasets/Project-AgML/coffee_rust_multispec_classification) |
| **BRACOL** (Krohling, Esgario y Ventura, 2019) | Sana, minador, roya, mancha parda (Phoma), cercospora; incluye severidad **[H]** | 1.747 hojas completas y 2.147 recortes de síntomas **[H]** | Espírito Santo (Brasil). Envés de la hoja sobre **fondo blanco**, 5 modelos de celular, condiciones parcialmente controladas **[H]** | CC BY 4.0 **[H]** | [Mendeley yy2k5y8mxg/1](https://data.mendeley.com/datasets/yy2k5y8mxg/1) (2019-11-06) |
| **RoCoLe** (Parraga-Alava et al., 2019) | Sana / no sana: roya en 4 niveles y arañita roja **[H]** | 1.560 imágenes: 791 sanas y 769 enfermas **[H]** ([PeerJ CS 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12695173/)) | Café **robusta**, Ecuador. La página de Mendeley no detalla la cámara **[H]** | CC BY 4.0 **[H]** | [Mendeley c5yvn32dzg/2](https://data.mendeley.com/datasets/c5yvn32dzg/2) |
| **JMuBEN + JMuBEN2** (Jepkoech et al., 2021) | Cercospora, sana, roya, minador, phoma **[H]** | 58.549 filas, pero solo **3.756 imágenes únicas**. Tras quitar las casi duplicadas quedan 2.891 independientes y solo **48 sanas** **[H]** ([Huyt](https://huggingface.co/Huyt/arabica-coffee-leaf-disease-efficientnet-b0)) | Plantación de arábica en Kenia. Recortes cuadrados del área de interés, aumentados con rotaciones y volteos **[H]** | CC BY 4.0 **[H]** | [t2r6rszp5c/1](https://data.mendeley.com/datasets/t2r6rszp5c/1) · [tgv3zb82nd/1](https://data.mendeley.com/datasets/tgv3zb82nd/1) · [espejo AgML](https://huggingface.co/datasets/Project-AgML/arabica_coffee_leaf_disease_classification) |
| **Coffee leaf dataset by phytosanitary class** (Saposoa, Perú) | Sana, **ojo de gallo** (*Mycena citricolor*), roya: 500 de cada una **[H]** | 1.500 **[H]** | Cafetales de Saposoa, con distancia y enfoque controlados y luz natural homogénea **[H]** | CC BY 4.0 **[H]** | [Mendeley mfpxg4y65r/2](https://data.mendeley.com/datasets/mfpxg4y65r/2) (2026-09-18) |
| **Uganda – Common Coffee Leaf Diseases** (Soroti Univ.) | Sana 1.179, roya 1.023, phoma 1.110 **[H]** | 3.312 imágenes de 256×256, con aumentación **[H]**. Otros autores cuentan 1.809 imágenes distintas **[H]** ([nathanrchn](https://huggingface.co/nathanrchn/coffee-leaf-lfm2.5-vl-450m-GGUF)) | Celular en fincas de Uganda, con luz de día y luz baja **[H]** | CC BY 4.0 **[H]** | [Mendeley k36wnd6knb/1](https://data.mendeley.com/datasets/k36wnd6knb/1) |
| **Rust and leaf miner** (Silva et al., 2020) | Roya 285, minador 257 **[H]** | 542 **[H]** | Finca en Brasil. Celular, casi todo en laboratorio con fondo blanco **[H]** | CC BY 4.0 **[H]** | [Mendeley vfxf4trtcg/5](https://data.mendeley.com/datasets/vfxf4trtcg/5) |
| **CoLeaf** (deficiencias nutricionales, Perú) | B, Fe, K, Ca, Mg, Mn, N y otras **[H]** | 1.006 **[H]** | No se especifica **[H]** | CC BY 4.0 **[H]** | [Mendeley brfgw46wzb/2](https://data.mendeley.com/datasets/brfgw46wzb/2) |
| **PG26038** (EARTH, Costa Rica) | Roya 40, ojo de gallo 40, sana 20 (escaneos con máscaras) **[H]** | 100 **[H]** | Escáner plano, fondo removido **[H]** | CC BY 4.0 **[H]** | [HF cchery2001/pg26038](https://huggingface.co/datasets/cchery2001/pg26038-coffee-leaf-samples) |
| **Kaggle «Coffee leaf diseases»** (Moses Odhiambo / badasstechie) | minador, roya, phoma, con máscaras hoja/fondo **[H]** | «1700+» **[H]** | No se documenta. **[I]** Por el tamaño y las máscaras parece derivado de BRACOL | **CC BY-SA 3.0** (copyleft) **[H]**. Actualizado hace unos 5 años | [kaggle.com/datasets/badasstechie/coffee-leaf-diseases](https://www.kaggle.com/datasets/badasstechie/coffee-leaf-diseases) |
| **Roboflow – DAME «Coffee leaf disease»** | mancha de ojo pardo, minador, roya, arañita roja **[H]** | 7.134 **[H]** | Sin descripción **[H]**. **[I]** Origen y aumentación desconocidos | CC BY 4.0 **[H]** | [universe.roboflow.com/dame-23kub/coffee-leaf-disease-kc1ca](https://universe.roboflow.com/dame-23kub/coffee-leaf-disease-kc1ca) |
| **Roboflow – BarakoBama** | algas, cercospora, minador, roya, arañita roja, fumagina **[H]** | 7.535 **[H]** | Sin descripción **[H]** | CC BY 4.0 **[H]** | [universe.roboflow.com/barakobama/barakobama-coffee-leaf-disease](https://universe.roboflow.com/barakobama/barakobama-coffee-leaf-disease) |
| **Roboflow – Berry Borer (broca)** (thesiscv) | broca, grano dañado, grano sano; detección **[H]** | 2.100 **[H]** | Sin descripción. Actualizado hace unos 3 años **[H]** | CC BY 4.0 **[H]** | [universe.roboflow.com/thesiscv/berry-borer](https://universe.roboflow.com/thesiscv/berry-borer) |
| **Roboflow – Coffee Berry Borer** (R. M. Aquino) | broca; segmentación de instancias **[H]** | 1.852 **[H]** | Sin descripción **[H]** | CC BY 4.0 **[H]** | [universe.roboflow.com/ralph-matthew-r-aquino/coffee-berry-borer](https://universe.roboflow.com/ralph-matthew-r-aquino/coffee-berry-borer) |
| **HF brainer-fp66/coffee-leaf-diseases** | sana, minador, phoma, arañita roja, roya **[H]** | 1K–10K **[H]** | No se documenta | Dice «uso académico (especificar según dataset original)», es decir **sin licencia clara** **[H]** | [hf.co/datasets/brainer-fp66/coffee-leaf-diseases](https://huggingface.co/datasets/brainer-fp66/coffee-leaf-diseases) |
| **LeafNet** (multicultivo, incluye café) | 22 cultivos y más de 60 enfermedades **[H]** | Más de 186.000 **[H]** | Mixtas | CC BY 4.0, pero **requiere solicitar acceso** **[H]** | [hf.co/datasets/enalis/LeafNet](https://huggingface.co/datasets/enalis/LeafNet) |

Observaciones:
- **[H]** En Kaggle Models (el sucesor de TF Hub) no aparece ningún modelo de enfermedades de hoja de café al buscar «coffee» ([búsqueda](https://www.kaggle.com/models?query=coffee&owner-type=user)).
- **[H] Broca:** no encontré ningún dataset revisado por pares y abierto de frutos brocados para clasificación en campo. Solo están los dos proyectos de Roboflow, sin descripción de origen. Cenicafé publicó un estudio con 500 granos de café lavado y más de 90 % de acierto, sin datos abiertos ([Cenicafé 68(2)](https://biblioteca.cenicafe.org/bitstream/10778/1081/1/arc068%2802%297-19.pdf)).
- **[I]** La broca es un problema de **fruto**, no de hoja. Necesita otro modelo, otra toma de fotos (racimo o grano) y preferiblemente otro tipo de tarea (detección). No conviene mezclarla con el clasificador de hojas.
- **[I]** «Mancha de hierro» es *Cercospora coffeicola*: corresponde a la clase «cercospora/brown eye spot» de JMuBEN, BRACOL y DAME.

---

### 3.2 Modelos ya entrenados

Leyenda de la columna «Veredicto»:
- **A** = sirve tal cual (sin entrenar; cuando mucho una conversión mecánica).
- **B** = sirve como punto de partida (hay que reentrenar o validar).
- **C** = no usable (falta licencia, es demasiado grande o no tiene documentación).

| Modelo (fecha de actualización) | Arquitectura / formato / tamaño | Clases | Exactitud reportada (dataset) | Licencia | Reproducible | Veredicto |
|---|---|---|---|---|---|---|
| **ConnorLee08/coffee-leaf-efficientnet-b2**, variante **B1** en `models/b1/` (2026-10-04) | EfficientNet-B1 (timm). `model.safetensors` de 26,4 MB y **`model.tflite` de 7,32 MB** (pesos int8 por canal, cálculo float32) **[H]** | cercospora, sana, minador, phoma, roya, arañita roja (desactivada), daño de coco, **no compatible** **[H]** | Prueba interna de 5.868 imágenes: **93,27 %** de exactitud bruta y F1 macro 0,864. **Externo:** en la roya RGB de Huila solo **22 de 847** quedaron bien aceptadas (2,6 %). En los escaneos PG26038, 44 % bruto **[H]** | Ficha de B1: **Apache-2.0** **[H]**. La raíz del repo (B2) dice «other / component-specific» **[H]** | Parcial: manifiestos, hashes, umbrales y `predict.py`. El código de entrenamiento está en [Imhaohao/global-ai-hackathon](https://github.com/Imhaohao/global-ai-hackathon) (licencia no verificada) **[H]** | **A (prototipo)**. Es el más completo; trae umbrales de abstención calibrados y un control de calidad de la foto **[H]** |
| ConnorLee08 … **B2** (raíz del repo) | EfficientNet-B2, TFLite de 8,57 MB y safetensors de 31,2 MB **[H]** | igual que B1 | 94,09 % interno, F1 0,872. Roya de Huila: 16 de 847 (1,9 %). PG26038: 12 % **[H]** | **«other»**: la licencia propia del ajuste fino no queda explícita **[H]** | igual | **B**. **[I]** Preferir B1, que sí tiene Apache-2.0 explícita |
| **Huyt/arabica-coffee-leaf-disease-efficientnet-b0** (2026-07-17) | EfficientNet-B0 (4,0 M parámetros). PyTorch/safetensors de **16,3 MB** fp32 **[H]** | Cercospora, sana, roya, minador, phoma **[H]** | **99,11 %** con partición «honesta» sin duplicados (n de prueba = 564; JMuBEN). El propio autor advierte que «sana» se apoya en solo 9 imágenes de prueba **[H]** | **CC BY 4.0** **[H]** | **Sí**: incluye scripts de deduplicación, partición, entrenamiento y evaluación **[H]** | **B**. Licencia limpia, pero espera recortes de Kenia y no trae clase de rechazo |
| **ixrbhii/coffee-disease-convnext** (2026-10-04) | ConvNeXt-Small, 49,5 M parámetros, **99 MB** fp16 **[H]** | Berry Blotch, cercospora, sana, minador, phoma, arañita roja, roya **[H]** | 94,7 %, F1 macro 0,809 (n = 506). **Cercospora: recall 9,1 %** **[H]** | CC BY 4.0 **[H]** | Sin código de entrenamiento en el repo (solo config y pesos) **[H]** | **C para navegador** por el tamaño **[I]** |
| **niroj-ebpearls/coffee-leaf-yolov12** (2026-08-24) | YOLOv12-s/l **ONNX** fp32 de 37,3 y 105,9 MB, pensado para ONNX Runtime Web **[H]** | roya, minador, phoma, cercospora, sana (detección) **[H]** | mAP50 de 0,702 (s). Para las enfermedades, el mAP50-95 por clase va de 0,29 a 0,40 **[H]** | MIT **[H]** | No (tesis no enlazada) **[H]** | **C/B**. **[I]** 37 MB y bajo mAP por enfermedad; además, el autor dice que cuantizar a int8 corrompe la salida en WebGPU **[H]** |
| **nathanrchn/coffee-leaf-lfm2.5-vl-450m-GGUF** (2026-10-04) | VLM LFM2.5-VL-450M en GGUF: 260 + 103 MB = **363 MB**. Corre en el navegador con wllama **[H]** | sana, roya, cercospora, phoma, minador, más 4 motivos de foto inútil **[H]** | Fotos de Uganda nunca vistas: **59,9 %** limpio (64,4 % post hoc). Un clasificador de 16,3 MB sacó 49,1 % **[H]** | LFM Open License v1.0, con restricción comercial por encima de USD 10 M de ingresos anuales **[H]** | Contrato de app y gramática incluidos **[H]** | **C**. **[I]** 363 MB es inviable con conexión rural; solo habla inglés |
| **uchaan/coffee-leaf-check-qwen3.5-2b-gguf** (2026-10-04) | Qwen3.5-2B en GGUF a 2,66 bits por peso, **≈1,01 GB**, llama.cpp, 3,2 s por imagen en CPU **[H]** | sana, roya, cercospora, phoma, minador, «no sé» **[H]** | BRACOL: 90,8 %, F1 0,880 **[H]** | Apache-2.0 **[H]** | Sí ([GitHub](https://github.com/uchaan/coffee-leaf-check)) **[H]** | **C** para celular web **[I]** |
| brainer-fp66/vit-coffee-leaf-diseases (2025-08-17) | ViT-Base, safetensors de **343 MB** **[H]** | 5 clases (dataset brainer) **[H]** | 88,9 % de exactitud tras 1 época **[H]** | Apache-2.0 en el modelo, pero entrenado sobre un dataset sin licencia clara **[H]** | Parcial | **C** |
| JuanAlvarezgh/coffee-leaf-vision (2026-06-07) | vit_small en `.pt` de 86,7 MB **[H]** | 5 clases (BRACOL + RoCoLe) **[H]** | Validación cruzada de 5 particiones: 91,0 % ± 1,2, F1 macro 0,863 **[H]** | El **repo del modelo no tiene licencia** (el Space dice MIT) **[H]** | Código en GitHub (según el README) **[H]** | **C** hasta que se aclare la licencia del peso |
| hanzhnn/coffee-leaf-classifier (2025-06-26) | Keras `.keras`/`.h5` de 45 a 134 MB **[H]** | ? | ? | **Sin licencia ni ficha** **[H]** | No | **C** |
| joshuarwanda/coffee-disease-classifier; rio3210/coffee_disease_detector | Keras `.h5` de ≈2,3 MB **[H]** | «3 enfermedades + sana» / no dice **[H]** | No reportada **[H]** | Apache-2.0 / MIT **[H]** | No | **C** (sin datos ni métricas) |
| hectorhardenz/coffee_disease_model; trisleex/mask-rcnn…; fuxi611/…rf-detr | `.h5` con acceso restringido; Mask R-CNN de 526 MB; RF-DETR `.pt` de 133 MB **[H]** | — | Mask R-CNN: exactitud 27,9 %. RF-DETR: mAP50 de 0,82 **[H]** | Restringido / sin licencia / MIT **[H]** | — | **C** |
| Roboflow (DAME, BarakoBama, Berry Borer…) | Alojados en Roboflow; se consumen con clave de API o publishable key **[H]** | ver 3.1 | DAME: «99,9 %», BarakoBama: mAP50 98,6 % (cifras de la plataforma, sin protocolo) **[H]** | Dataset CC BY 4.0. **Bajar los pesos manualmente es una función de pago** **[H]** ([docs](https://docs.roboflow.com/models/model-weights/download-roboflow-model-weights)) | No | **C** para un repo estático y sin clave |
| GitHub | Casi todos los repos no tienen licencia. `Lucs1590/Coffee_Recognize` es GPL-2.0 **[H]** ([búsqueda API](https://api.github.com/search/repositories?q=coffee+leaf+disease&sort=stars)) | — | — | — | — | **C** |

**[I] Respuesta directa:** sí existe un modelo usable con licencia abierta, **EfficientNet-B1 de ConnorLee08 (Apache-2.0, TFLite de 7,3 MB)**, y otro aún más limpio pero más limitado, **Huyt B0 (CC BY 4.0)**. Ninguno es «confiable en campo»: sus propios autores documentan el fallo externo. **[I]** Antes de publicarlo conviene abrir una *Discussion* en el repo de ConnorLee08 para que confirme por escrito la licencia de los pesos ajustados de B1 y B2. Además, hay que conservar `LICENSES.md`/`ATTRIBUTION.md` y citar los datasets CC BY 4.0.

---

### 3.3 Inferencia en el navegador

#### Comparativa de runtimes (versiones vigentes al 2026-10-15)

Los tamaños se midieron con `curl` sobre jsDelivr. «br» es el tamaño transferido con Brotli **[H]**.

| Runtime | Versión, fecha y licencia | Runtime que descarga el celular | Formato de modelo | Backends | Mantenimiento |
|---|---|---|---|---|---|
| **ONNX Runtime Web** | 1.30.0, 2026-09-14, MIT **[H]** ([npm](https://registry.npmjs.org/onnxruntime-web)) | `ort-wasm-simd-threaded.wasm`: **14,24 MB sin comprimir / 3,07 MB br**. Con WebGPU (`.jsep.wasm`): 28,31 / 5,48 MB br. JS `ort.wasm.min.mjs`: 0,05 MB **[H]** | ONNX / ORT | WASM (todos los operadores), WebGPU, WebGL (en mantenimiento) y WebNN; los tres últimos con cobertura parcial de operadores **[H]** ([docs](https://onnxruntime.ai/docs/tutorials/web/)) | Activo; último push 2026-10-15 **[H]** |
| **Transformers.js** | **v4.3.1**, 2026-10-06, Apache-2.0 **[H]**. La v3 salió el 2024-10-22 **[H]** ([blog](https://huggingface.co/blog/transformersjs-v3)) | `transformers.web.min.js`: 0,45 MB (0,13 MB br), **más** los wasm de ONNX Runtime, que usa por debajo **[H]** | ONNX con el formato HF (config y preprocesador) | WASM y WebGPU (`device:'webgpu'`, «hasta 100x más rápido que WASM» según el anuncio) **[H]** | Activo **[H]** |
| **MediaPipe Tasks Vision** (Image Classifier) | 1.1.1, 2026-10-14, Apache-2.0 **[H]** | `vision_wasm_internal.wasm`: **13,52 MB / 3,59 MB br**. Bundle: 0,16 MB **[H]** | **TFLite con metadatos** (obligatorios en modelos propios) **[H]** ([docs](https://developers.google.com/edge/mediapipe/solutions/vision/image_classifier)) | CPU/GPU | Activo **[H]** |
| **LiteRT.js** (sucesor de TF.js para `.tflite`) | 2.5.3, 2026-07-17, Apache-2.0. Anunciado el 2026-07-09 **[H]** ([blog Google](https://developers.googleblog.com/en/litertjs-googles-high-performance-web-ai-inference/)) | `litert_wasm_internal.wasm`: **9,37 MB / 2,61 MB br** **[H]** | `.tflite` directo | CPU (XNNPACK), WebGPU, WebNN (experimental) **[H]** | Nuevo; «hasta 3x» más rápido que otros runtimes web, medido en una MacBook M4 (no en celular) **[H]** |
| **TensorFlow.js** | **4.22.0, del 2024-10-21: sin versiones nuevas en casi 2 años** **[H]** ([npm](https://registry.npmjs.org/@tensorflow/tfjs)) | `tf.min.js` 1,47 MB (0,36 MB br). Backend WASM de solo **0,42 MB** (0,13 MB br) **[H]** | TF.js Layers/Graph | WASM, WebGL, WebGPU | Repo no archivado, pero estancado **[H]**. **[I]** No recomendable para un proyecto nuevo |

#### Tamaño de modelo y latencia (cifras con fuente)

- **[H]** Pesos de referencia en ONNX: MobileNetV4-conv-small pesa **3,93 MB en int8** y 15,09 MB en fp32. MobileViT-small pesa 6,06 MB en uint8. ViT-Base pesa **87,7 MB en uint8** y 346 MB en fp32 ([HF onnx-community](https://huggingface.co/onnx-community/mobilenetv4_conv_small.e2400_r224_in1k), [Xenova/mobilevit-small](https://huggingface.co/Xenova/mobilevit-small), [Xenova/vit-base-patch16-224](https://huggingface.co/Xenova/vit-base-patch16-224)).
- **[H]** Modelos de MediaPipe: EfficientNet-Lite0 int8 pesa **5,43 MB** y en float32, 18,58 MB (cabecera HTTP `content-length`). La latencia en Pixel 6 del flujo completo es **10,08 ms en CPU** (Lite0 int8) y 23,52 ms en CPU / 18,90 ms en GPU (Lite0 fp32) ([docs, act. 2026-10-02](https://developers.google.com/edge/mediapipe/solutions/vision/image_classifier)). **[I]** Esas cifras parecen nativas, no de navegador.
- **[H]** TF.js con MobileNetV2 en Pixel 4 (Chrome 79): **WASM 182 ms, WASM+SIMD 82 ms, WebGL 76,4 ms y JS puro 1.628 ms** ([README tfjs-backend-wasm](https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md)). Son cifras de 2020.
- **[H]** Estudio TOSEM 2024 con 20 celulares: la inferencia en el navegador es **15,8 veces más lenta que la nativa en CPU y 7,8 veces en GPU**, y la memoria puede superar **334 veces el tamaño del modelo** ([Wang et al., TOSEM](https://arxiv.org/html/2402.05981v2)).
- **[H]** EfficientNet-B0/B1/B2 de ConnorLee08 en TFLite y CPU de escritorio con 4 hilos: **62,7 / 91,3 / 98,1 ms** ([ficha](https://huggingface.co/ConnorLee08/coffee-leaf-efficientnet-b2)).
- **[I] Estimación para un celular de gama media en el navegador** (WASM SIMD, 1 hilo, MobileNet/EfficientNet-B0 a B1 en int8): **≈100–600 ms por foto**, más 1 a 3 s de arranque del runtime. Es aceptable porque se analiza una foto a la vez. Hay que medirlo en 2 o 3 celulares reales (ver lagunas).

#### WebGPU / WASM en celulares

- **[H]** WebGPU está activo por defecto en Chrome 121 o superior **solo en Android 12+ con GPU Qualcomm o ARM** ([Chrome](https://developer.chrome.com/blog/new-in-webgpu-121)). Según caniuse, el soporte global es del 87,8 % (sept. 2026). Firefox Android lo trae desactivado e iOS Safari lo soporta desde la 26 ([caniuse](https://caniuse.com/webgpu)). ONNX Runtime marca su backend WebGPU como «experimental» **[H]** ([README 1.30](https://cdn.jsdelivr.net/npm/onnxruntime-web@1.30.0/README.md)).
- **[I]** Para un clasificador pequeño, **WASM basta** y funciona en cualquier navegador. La propia documentación de ORT sugiere WASM para modelos muy livianos **[H]** ([ep-webgpu](https://onnxruntime.ai/docs/tutorials/web/ep-webgpu.html)).

#### Sin conexión, caché, CSP y aislamiento

- **[H]** Transformers.js guarda modelos y wasm en la Cache API (`useBrowserCache` y `useWasmCache`, activos por defecto si hay caché) y permite servir modelos propios (`allowRemoteModels=false`, `localModelPath`) ([env](https://huggingface.co/docs/transformers.js/api/env)).
- **[H]** ORT Web carga los `.wasm` desde la ruta del bundle o desde `env.wasm.wasmPaths`. Los `.wasm` y el JS deben venir de la misma versión ([deploy](https://onnxruntime.ai/docs/tutorials/web/deploy.html), [env-flags](https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html)).
- **[H]** El multihilo exige `crossOriginIsolated` (`COOP: same-origin` + `COEP: require-corp`); sin eso, ORT usa un solo hilo. `env.wasm.proxy` (inferencia en un worker) viene desactivado y **no funciona con CSP restrictiva** ([env-flags](https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html), [web.dev](https://web.dev/articles/coop-coep)).
- **[H]** Desde la v1.19, ORT Web puede cargar wasm y workers bajo CSP si se sirven los artefactos necesarios ([deploy](https://onnxruntime.ai/docs/tutorials/web/deploy.html)). Con cualquier CSP que tenga `script-src`, WebAssembly necesita `'wasm-unsafe-eval'` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)).
- **[H]** Si se usa Workbox o vite-plugin-pwa, el límite por defecto de precaché es de **2 MiB por archivo** (`maximumFileSizeToCacheInBytes = 2097152`). El modelo y el wasm lo superan, así que hay que subir ese límite o usar caché en tiempo de ejecución ([FAQ vite-pwa](https://vite-pwa-org.netlify.app/guide/faq.html), [esquema Workbox](https://raw.githubusercontent.com/GoogleChrome/workbox/v7/packages/workbox-build/src/schema/GenerateSWOptions.json)).
- **[I]** GitHub Pages no permite poner COOP/COEP; Vercel sí (con `vercel.json`). En los dos casos funciona el modo de un hilo.

---

### 3.4 Ruta de entrenamiento propia

**[I] Pasos recomendados (PyTorch + timm, porque exporta limpio a ONNX):**

1. **Datos.** Usar CoffeeLeaf-CO (recortar las cajas de roya, coco y minador), BRACOL (hojas y recortes), RoCoLe, JMuBEN deduplicado y Saposoa-Perú (ojo de gallo). Agregar una clase «no es hoja de café / foto inútil» con hojas de otros cultivos (por ejemplo Beans, MIT **[H]** [HF](https://huggingface.co/datasets/AI-Lab-Makerere/beans)). Lo más importante: **200 a 500 fotos propias** de fincas cercanas al centro SENA, etiquetadas con apoyo de un extensionista y **reservadas solo para prueba**.
2. **Partición por grupo, no al azar.** Huyt demuestra que JMuBEN tiene un 93,6 % de duplicados exactos **[H]**, y ConnorLee08 agrupa por hoja o planta padre **[H]**.
3. **Base preentrenada.** Opciones: `mobilenetv4_conv_small` (3,8 M parámetros), `mobilenetv3_large_100` (5,5 M), `efficientnet_b0` (5,3 M) o `efficientnet_lite0` (4,7 M). Todas con Apache-2.0 en el Hub de timm **[H]** ([timm](https://huggingface.co/timm)). Entrenar primero la cabeza y luego hacer un ajuste fino parcial a una tasa de aprendizaje baja, como en las recetas de Huyt y ConnorLee08 **[H]**.
4. **Exportar.** Usar `timm/onnx_export.py` o `torch.onnx.export` **[H]** ([script](https://raw.githubusercontent.com/huggingface/pytorch-image-models/main/onnx_export.py)). El propio script advierte que las versiones nuevas de PyTorch/ONNX a veces rompen la exportación **[H]**.
5. **Cuantizar.** ONNX Runtime recomienda la **cuantización estática (QDQ, S8S8) para CNN**, calibrada con unas 100 a 500 imágenes de validación. No es una transformación sin pérdida, así que hay que medir antes y después **[H]** ([docs](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html)). **[I]** El tamaño esperado ronda los 4 a 5,5 MB.
6. **Calibrar la confianza.** Aplicar escalado de temperatura y umbrales por clase usando solo validación, como hace ConnorLee08 en `model-config.json` **[H]**.
7. **Servir.** Copiar `modelo.onnx` + `etiquetas.json` + `umbrales.json` a `public/ia/`. Son archivos estáticos de menos de 10 MB cada uno, aptos para Git sin LFS **[I]**.

```python
# Esquema (Kaggle/Colab): exportar y cuantizar
import timm, torch
m = timm.create_model("efficientnet_b0", num_classes=N, checkpoint_path="best.pth").eval()
torch.onnx.export(m, torch.randn(1,3,224,224), "cafe_fp32.onnx", opset_version=17,
                  input_names=["input"], output_names=["logits"])
from onnxruntime.quantization import quantize_static, QuantFormat, QuantType
quantize_static("cafe_fp32.onnx", "cafe_int8.onnx", lector_calibracion,  # CalibrationDataReader propio
                quant_format=QuantFormat.QDQ, activation_type=QuantType.QInt8, weight_type=QuantType.QInt8)
```

**Alternativas sin código:**
- **Teachable Machine** entrena en el navegador sobre MobileNet y exporta TF.js o TFLite. Según la FAQ citada en fuentes secundarias, las fotos no salen del navegador **[H]** ([codelab](https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab), [blog Google](https://www.blog.google/technology/ai/now-anyone-can-explore-machine-learning-no-coding-required/)). **[I]** Sirve como demo de aula, pero queda atado a TF.js, que está estancado, y no controla la partición por grupos.
- **Roboflow:** bajar los pesos es una función de pago **[H]**, así que **[I]** no sirve para un repo estático.
- **HF AutoTrain Advanced:** sigue activo (Apache-2.0, último push 2026-10-06) **[H]** ([GitHub](https://github.com/huggingface/autotrain-advanced)). **[I]** Produce modelos de Transformers que luego hay que convertir a ONNX.
- **Keras → TF.js:** el conversor tiene conflictos con Keras 3 (TF 2.16+). Los arreglos documentados son `tf-keras` o `TF_USE_LEGACY_KERAS=1` **[H]** ([issue tfjs#8229](https://de.github.com/tensorflow/tfjs/issues/8229), [issue tf#63987](https://github.com/tensorflow/tensorflow/issues/63987)). **[I]** Es otra razón para preferir PyTorch → ONNX.

**Tiempo y costo:**
- **[H]** Kaggle da sesiones de **12 h** con 1 P100 o 2 T4 y 29 GB de RAM ([docs Kaggle](https://www.kaggle.com/docs/notebooks)). La cuota semanal no está publicada en esa página. Colab gratis no publica sus límites: dice «como máximo 12 horas» y no garantiza GPU ([FAQ Colab](https://research.google.com/colaboratory/faq.html)).
- **[I]** Con unos 10.000 a 20.000 recortes a 224 px, EfficientNet-B0 o MobileNet con precisión mixta en una T4 tarda **≈30–90 min** en 20 a 30 épocas.
- **[I]** El trabajo humano estimado es de 1 a 2 semanas para reunir y limpiar datos, 2 a 3 días para entrenar, exportar y validar, y 1 semana para integrar. El costo en dinero es **$0**.

---

### 3.5 Riesgos honestos

**Exactitud fuera del laboratorio (evidencia):**
- **[H]** CNN entrenadas en BRACOL (hojas sobre fondo blanco) y probadas en JMuBEN (recortes de Kenia) bajan a **F1 de 0,13 a 0,24** ([uchaan](https://huggingface.co/uchaan/coffee-leaf-check-qwen3.5-2b-gguf)).
- **[H]** EfficientNet-B0 a B3 con 93–94 % de exactitud interna aceptaron correctamente solo **1,9 a 6,1 %** de las fotos de roya de Huila (Colombia) ([ConnorLee08](https://huggingface.co/ConnorLee08/coffee-leaf-efficientnet-b2)).
- **[H]** Un clasificador de 16,3 MB sacó 96,3 % en fotos como las de entrenamiento y **49,1 %** en fotos nuevas de Uganda ([nathanrchn](https://huggingface.co/nathanrchn/coffee-leaf-lfm2.5-vl-450m-GGUF)).
- **[H]** En otro cultivo (vid), EfficientNet-B2 pasó de **99,61 %** interno a **66,80 %** en campo ([Kajan et al., J. Electr. Eng. 77(4), 2026](https://reference-global.com/article/10.2478/jee-2026-0043)).
- **[H]** En campo, la app Nuru (yuca) acertó **65 %**, frente a 40–58 % de los extensionistas y 18–31 % de los agricultores. Evaluar **6 hojas por planta** subió el acierto a **74–88 %** ([Mrisho et al., 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399)).

**Clases que faltan para Colombia [I]:**
- Ojo de gallo (*Mycena citricolor*): solo aparece en Saposoa-Perú y PG26038.
- Mal rosado, llaga macana, antracnosis, cochinillas y deficiencias nutricionales: solo CoLeaf (Perú).
- Broca: requiere otro modelo, de fruto.
- «Sana» está muy subrepresentada en JMuBEN: 48 imágenes independientes **[H]**.
- **[I]** Un clasificador cerrado siempre elige una de sus clases. Por eso hacen falta una clase de rechazo y umbrales de abstención.

**Sesgos [I]:**
- Cada dataset trae su sesgo de origen: Kenia (recortes), Brasil (fondo blanco), Ecuador (robusta), Perú y Uganda. Lo colombiano es escaso: Santander (campo) y Huila (controlado).
- Las variedades colombianas resistentes (Castillo, Cenicafé 1) pueden expresar los síntomas de otra forma.
- Hay sesgo de fondo: un modelo aprendió que «fondo de campo» significa «no es café» y rechazaba el 99,8 % de las fotos de campo de Ecuador **[H]** ([nathanrchn](https://huggingface.co/nathanrchn/coffee-leaf-lfm2.5-vl-450m-GGUF)).

**Cómo comunicar la incertidumbre al caficultor [I]:**
1. **Revisar la calidad de la foto antes de inferir** (desenfoque y brillo). ConnorLee08 usa una varianza mínima de bordes y una luminancia mínima calibradas **[H]**. Si falla, mostrar «Tome otra foto: una sola hoja, de día, que llene el cuadro».
2. **Top-3 con barras y porcentaje**, con la etiqueta «Posible…» y nunca «Diagnóstico».
3. **Abstenerse por debajo del umbral calibrado** con el mensaje «No estoy seguro. Consulte al extensionista del Comité de Cafeteros». ixrbhii sugiere pedir otra foto por debajo del 45 % de confianza **[H]**.
4. **Pedir varias hojas** (3 a 6) y combinar el resultado, siguiendo la evidencia de Nuru.
5. **Lista visible de lo que el modelo sabe reconocer y de lo que no** (broca, ojo de gallo, deficiencias).
6. **Nunca recomendar dosis de productos químicos.** Enlazar a fichas de manejo con su fuente.
7. La foto **no sale del celular**, y eso se dice en pantalla.

**Literatura sobre el café (2020–2026):**

| Trabajo | Dataset | Resultado | Lectura crítica |
|---|---|---|---|
| Esgario, Krohling y Ventura, *Comput. Electron. Agric.* 169 (2020) **[H]** ([arXiv](https://arxiv.org/pdf/1907.11561)) | BRACOL | ≈93 % en estrés biótico (hoja), >97 % en recortes de síntomas, 85 % en severidad **[H]** | Es de 2020, fuera del rango pedido, pero es la referencia base. Fondo blanco **[I]** |
| Novtahaning, Shah y Kang, *Agriculture* 12(11):1909 (2022) **[H]** ([MDPI](https://www.mdpi.com/2077-0472/12/11/1909)) | Recortes de BRACOL, 1.300 imágenes (260 por clase) **[H]** | Ensamble con **97,31 %** de validación **[H]** | Sin prueba externa **[I]** |
| Ardah et al., *PeerJ CS* 11:e3386 (2025) **[H]** ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12695173/)) | 1.560 imágenes (llamadas BRACOL y RoCoLe a la vez) **[H]** | **99,78 %** binario y **91,86 %** en 6 clases **[H]** | Sin validación externa e inconsistencias en el nombre del dataset **[H]** |
| Fragoso et al., *Applied Sciences* 15(9):5040 (2025) **[H]** ([MDPI](https://www.mdpi.com/2076-3417/15/9/5040)) | BRACOL reanotado por un experto **[H]** | YOLOv8s: **mAP 54,5 %**, 11,4 ms **[H]** | **[I]** Localizar lesiones es mucho más difícil que clasificar recortes |
| Zuñiga Cajas et al. (U. del Cauca y CIRAD), *Inteligencia Artificial* 28(76):200-222 (2025) **[H]** ([revista](https://journal.iberamia.org/index.php/intartif/article/view/1833)) | Roya, severidad (Colombia) **[H]** | 13 CNN. El resumen admite «limitaciones de robustez entre datasets» **[H]** | No pude extraer las métricas del PDF (laguna) |
| Cabrera, Avramidis y Narayanan, arXiv 2407.14737 (2024) **[H]** ([arXiv](https://arxiv.org/abs/2407.14737)) | Imágenes de baja resolución **[H]** | Métricas «>90 %» **[H]** | Preprint, dataset no detallado en el resumen |

**[I] Patrón general:** las cifras del 97 al 99 % son siempre del mismo dataset y con particiones aleatorias. Cuando hay validación externa, el rendimiento cae al 50–66 % o menos.

---

### 3.6 Asistente conversacional sin backend ni clave expuesta

| Opción | Descarga | Requisitos | Licencias | Pros | Contras |
|---|---|---|---|---|---|
| **(a) Reglas + base local + búsqueda** con MiniSearch 7.2.0 (MIT) o Fuse.js 7.5.0 (Apache-2.0) **[H]** ([npm](https://registry.npmjs.org/minisearch), [npm](https://registry.npmjs.org/fuse.js)) | MiniSearch UMD 0,02 MB; Fuse 0,03 MB; **≈0,01 MB br** cada uno **[H]**. Más el JSON de fichas, con un peso estimado de 50 a 300 KB **[I]** | Cualquier celular, sin conexión | Código MIT/Apache. **Contenido:** los *Avances Técnicos* de Cenicafé que revisé tienen **CC BY-NC-ND 4.0** (sin obras derivadas) **[H]** ([ejemplo AT 297](https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/1792)). Hay un banco CC BY 4.0 en inglés: [ixrbhii/crop-disease-qa](https://huggingface.co/datasets/ixrbhii/crop-disease-qa) (9.076 preguntas y respuestas de 42 cultivos, de la India) **[H]** | Determinista, verificable, sin alucinaciones y gratis. Se integra con el diagnóstico («ver ficha de roya») | No «conversa» con libertad. **[I]** Por la cláusula ND, las fichas deben escribirse con palabras propias y enlazar al PDF original (o citar fragmentos textuales sin modificar). Conviene consultarlo con el instructor |
| **(b) LLM pequeño en el navegador.** WebLLM 0.2.86 (Apache-2.0) **[H]**; Transformers.js v4 con WebGPU; wllama 3.8.1 (MIT, WASM y GGUF) **[H]** | WebLLM: Qwen2.5-0.5B q4f16 pesa **290 MB** (945 MB de VRAM), Qwen3-0.6B **352 MB** (1,40 GB), Qwen3.5-0.8B **447 MB** (1,63 GB) y Qwen3-1.7B **984 MB** (2,04 GB) **[H]** ([config WebLLM](https://raw.githubusercontent.com/mlc-ai/web-llm/main/src/config.ts), [HF mlc-ai](https://huggingface.co/mlc-ai)). Con Transformers.js en ONNX q4f16: Qwen2.5-0.5B pesa **483 MB** y Qwen3-0.6B **570 MB** **[H]** ([HF onnx-community](https://huggingface.co/onnx-community/Qwen3-0.6B-ONNX)) | WebLLM necesita **WebGPU** (en Android: 12+ con GPU Qualcomm o ARM) **[H]**. Chrome Prompt API (Gemini Nano) **no funciona en Android** y pide 22 GB libres **[H]** ([Chrome](https://developer.chrome.com/docs/ai/prompt-api)) | Qwen2.5 0.5B/1.5B, Qwen3 0.6B/1.7B, Qwen3.5-0.8B y SmolLM3-3B: **Apache-2.0**. Phi-4-mini: **MIT**. Gemma: términos propios con acceso restringido. Llama 3.2: licencia comunitaria con acceso restringido **[H]** ([HF API](https://huggingface.co/api/models/Qwen/Qwen3-0.6B)) | Conversación libre y privada; sin conexión tras la descarga | **[I]** Bajar de 300 MB a 1 GB con conexión rural es inviable. Los modelos de 0,5 a 1,7 B alucinan en español técnico (dosis, productos) y la carga térmica y de batería es alta. Solo es aceptable como generador **restringido por RAG** sobre las fichas de (a) |
| **(c) Función serverless** (por ejemplo Vercel) que guarda la clave | ≈0 en el cliente | Conexión en cada pregunta | **Vercel Hobby: gratis y solo para uso personal no comercial**; 1 M de invocaciones, 4 h de CPU activa y 300 s como máximo por función **[H]** ([Vercel](https://vercel.com/docs/plans/hobby)). Las variables de entorno se cifran en reposo **[H]** ([docs](https://vercel.com/docs/environment-variables)). Ojo: en Vite, las variables `VITE_*` **se exponen en el bundle** y no deben llevar claves **[H]** ([Vite](https://vite.dev/guide/env-and-mode)). La capa gratuita de Gemini Flash-Lite existe, pero su contenido **«se usa para mejorar los productos»** **[H]** ([precios Gemini](https://ai.google.dev/gemini-api/docs/pricing)) | Mejor calidad de respuesta; el repo sigue sin secretos | **[I]** No funciona sin conexión. Deja un endpoint público que se puede abusar: necesita límite por IP, restricción de origen y tope de gasto. Los datos van a un tercero. Además, el proyecto deja de ser «solo frontend» |

**[I] Recomendación para el asistente:**
- Empezar con (a): un árbol de intenciones con unas 30 a 50 preguntas frecuentes de roya, broca, minador, mancha de hierro, ojo de gallo, fertilización y cosecha. Usar MiniSearch con sinónimos regionales («coco», «arañita», «mancha de hierro»), respuestas cortas, fuente y fecha, y el botón «Hablar con un extensionista».
- Más adelante, si hay presupuesto y conexión, agregar (c) solo como «modo ampliado», con RAG sobre las mismas fichas.
- No usar (b) en celulares rurales.

---

### 3.7 Spaces de demo en Hugging Face

No ejecuté ninguno. Los Spaces de Gradio pueden estar dormidos o caídos **[I]**.

| Space | Tecnología y modelo | Clases | Licencia del Space | Nota |
|---|---|---|---|---|
| [findkal/coffee-disease-detection](https://huggingface.co/spaces/findkal/coffee-disease-detection) | Gradio, YOLOv11n-cls (1,5 M parámetros), unas 1.500 imágenes **[H]** | sana, roya, phoma, minador **[H]** | MIT **[H]** | El más documentado de los pequeños |
| [Roza32/coffee-leaf-disease-detection](https://huggingface.co/spaces/Roza32/coffee-leaf-disease-detection) | Gradio + PyTorch **[H]** | sana, roya, cercospora, minador, phoma **[H]** | MIT **[H]** | Hay 4 Spaces casi iguales del mismo autor |
| [nebadan/coffee-disease-classifier](https://huggingface.co/spaces/nebadan/coffee-disease-classifier) | Gradio, `efficientnet_b0_coffee.pth` de 16,4 MB **[H]** | — | — | Sin ficha |
| [JuanAlvarezgh/coffee-leaf-vision](https://huggingface.co/spaces/JuanAlvarezgh/coffee-leaf-vision) | Docker, FastAPI, Grad-CAM, en **español** (U. San Buenaventura) **[H]** | 5 clases (BRACOL + RoCoLe) **[H]** | MIT (Space) **[H]** | Referencia útil de UX y explicabilidad para el SENA **[I]** |
| [Bethiya/Coffee-Leaf-Disease-Detection](https://huggingface.co/spaces/Bethiya/Coffee-Leaf-Disease-Detection), [dhanushdhanush0979/coffee-leaf-disease-detector](https://huggingface.co/spaces/dhanushdhanush0979/coffee-leaf-disease-detector) | Gradio **[H]** | — | Apache-2.0 **[H]** | Sin ficha |
| [KrishnaKanthML/CoffeeDiseaseDoc](https://huggingface.co/spaces/KrishnaKanthML/CoffeeDiseaseDoc) | Gradio, chatbot con HF Inference API y OAuth **[H]** | — | — | Asistente por API, no visión local |
| [Laksh619/coffee-and-cocoa-disease-classification](https://huggingface.co/spaces/Laksh619/coffee-and-cocoa-disease-classification) | Estático (Flutter web) **[H]** | café y cacao | — | Dataset de origen sin licencia verificada **[H]** ([registro ConnorLee08](https://huggingface.co/ConnorLee08/coffee-leaf-efficientnet-b2/blob/main/datasets/sources-and-counts.md)) |
| [herdifariz/coffee-leaf](https://huggingface.co/spaces/herdifariz/coffee-leaf), [Thinhhoang06/Coffee_leaf](https://huggingface.co/spaces/Thinhhoang06/Coffee_leaf), [VietAnh05/coffee-disease-api](https://huggingface.co/spaces/VietAnh05/coffee-disease-api) | Docker (AutoTrain), Streamlit, Docker API **[H]** | — | — | Sin ficha |

---

### 3.8 Recomendación técnica para Coffee+Visión [I]

1. **Datasets.**
   - **Fase 1:** ninguno; se usa un modelo ya entrenado.
   - **Fase 2 (reentrenamiento):** CoffeeLeaf-CO (Colombia, campo, CC BY 4.0) + BRACOL + RoCoLe + JMuBEN deduplicado + Saposoa-Perú (ojo de gallo) + clase de rechazo (Beans, MIT).
   - Además, **un set propio de prueba con 200 a 500 fotos de fincas colombianas**, etiquetadas con extensionistas y nunca usadas para entrenar. Ese set es la única métrica que se debe mostrar al público.
2. **Modelo.**
   - **Fase 1:** EfficientNet-B1 de `ConnorLee08/coffee-leaf-efficientnet-b2/models/b1` (Apache-2.0). Tiene 8 clases, incluidas «daño de coco» (relevante en Colombia) y «no compatible». Se usan sus umbrales de `model-config.json`. Hay que pedirle al autor que confirme la licencia y conservar las atribuciones de los datasets.
   - **Fase 2:** un modelo propio `mobilenetv4_conv_small` o `efficientnet_b0` (timm, Apache-2.0), con ajuste fino y en int8.
3. **Runtime.** **ONNX Runtime Web 1.30, solo con el backend WASM** (`onnxruntime-web/wasm`). Es MIT, maduro, ejecuta todos los operadores ONNX, documenta CSP y despliegue, y lo usa Transformers.js por debajo.
   - Plan B: **LiteRT.js** con el `model.tflite` de B1 tal cual. Tiene la ventaja de que las métricas publicadas aplican exactamente a ese archivo, pero el runtime es nuevo (julio de 2026).
   - Evitar TF.js (sin versiones desde 2024-10) y los modelos VLM o LLM para la visión.
4. **Tamaño esperado del módulo de IA** (primera visita a la pantalla de diagnóstico):
   - wasm de ORT: 3,07 MB con Brotli (14,24 MB sin comprimir) **[H]**.
   - Modelo int8: ≈7 MB para B1 (TFLite de referencia: 7,32 MB **[H]**) o ≈4–5,5 MB para el modelo propio de la fase 2.
   - JS: ≈0,05 MB.
   - **Total: ≈7–11 MB.** Con 1 Mbps reales son ≈1–1,5 min, una sola vez. Después se usa la caché.
5. **Integración en React/Vite:**
   - Ruta `/diagnostico` con `React.lazy()`. El `import('onnxruntime-web/wasm')` se hace **dentro** del componente, solo al pulsar «Analizar foto», con una barra de progreso de la descarga y el texto «se descarga una sola vez (≈10 MB)».
   - Poner `ort-wasm-simd-threaded.{wasm,mjs}` y `cafe.onnx` en `public/ia/` (mismo origen, sin CDN ni CORS) y fijar `ort.env.wasm.wasmPaths = '/ia/'`.
   - Usar `numThreads = self.crossOriginIsolated ? 2 : 1` y ejecutar la inferencia en un Web Worker propio para no congelar la interfaz.
   - Preprocesar en un `<canvas>`: corregir la orientación EXIF, redimensionar el lado corto a 256, recortar al centro a 224 y normalizar con la media y desviación de ImageNet, que es el contrato de B1 **[H]**.
   - Hacer la revisión de calidad, mostrar el top-3 y abstenerse según los umbrales.
6. **Sin conexión.** Usar `vite-plugin-pwa` con `runtimeCaching` CacheFirst para `/ia/*`, o subir `maximumFileSizeToCacheInBytes` a unos 16 MB. Precachear la app y mostrar «disponible sin conexión» cuando el modelo esté en caché. Si en el futuro se agrega una CSP, debe incluir `'wasm-unsafe-eval'`.
7. **Retirar lo falso.** Quitar el formulario de «entrenar la red neuronal» (no se entrena en el celular) y reemplazar el chatbot de respuesta fija por la opción (a) del punto 3.6. Agregar una página «Cómo funciona y límites» con las clases, las fuentes, las licencias y la tasa de error medida en fotos colombianas.

---

### 3.9 Lagunas

- **No medí la latencia real** de ORT Web, LiteRT.js ni MediaPipe en un celular de gama media en Colombia. Todas las cifras de celular son de 2020, nativas o de escritorio. Hay que hacer un benchmark propio.
- **Licencia de los pesos ajustados de ConnorLee08:** B1 dice Apache-2.0 y la raíz dice «other». Falta una confirmación explícita del autor.
- **No verifiqué** que el `.tflite` de B1 cargue sin errores de operadores en LiteRT.js, ni cuánta exactitud pierde la conversión de safetensors a ONNX int8.
- **Licencia de datos del dataset multiespectral de Huila:** el artículo no la declara y el espejo AgML dice CC0. No abrí la página de Kaggle para confirmarla.
- **Dataset Xinzhai (Zenodo 21442135)** y el **Kaggle «BRACOL for YOLO»:** no pude abrir su ficha para confirmar la licencia.
- **No hay datasets abiertos y verificados de broca** con origen documentado, ni de ojo de gallo, mal rosado o llaga macana en Colombia.
- **Métricas de Zuñiga Cajas et al. (2025, Colombia):** no pude leer el PDF; el servidor devolvió el error 418.
- **Cuota semanal de GPU en Kaggle:** no está en la documentación pública consultada.
- **Licencias de Cenicafé:** solo revisé un artículo de *Avances Técnicos* (CC BY-NC-ND 4.0). Otras series (*Brocarta*, *Cartilla*) pueden tener términos distintos.
- **Spaces de HF:** no los ejecuté y desconozco si están activos.

---

### Fuentes principales (consultadas el 2026-10-15)

- Datasets:
  - https://zenodo.org/records/22756170
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC11927593/
  - https://data.mendeley.com/datasets/yy2k5y8mxg/1
  - https://data.mendeley.com/datasets/c5yvn32dzg/2
  - https://data.mendeley.com/datasets/t2r6rszp5c/1
  - https://data.mendeley.com/datasets/tgv3zb82nd/1
  - https://data.mendeley.com/datasets/mfpxg4y65r/2
  - https://data.mendeley.com/datasets/k36wnd6knb/1
  - https://data.mendeley.com/datasets/vfxf4trtcg/5
  - https://data.mendeley.com/datasets/brfgw46wzb/2
  - https://www.kaggle.com/datasets/badasstechie/coffee-leaf-diseases
  - https://universe.roboflow.com/thesiscv/berry-borer
  - https://huggingface.co/datasets/Project-AgML/arabica_coffee_leaf_disease_classification
- Modelos:
  - https://huggingface.co/ConnorLee08/coffee-leaf-efficientnet-b2
  - https://huggingface.co/Huyt/arabica-coffee-leaf-disease-efficientnet-b0
  - https://huggingface.co/ixrbhii/coffee-disease-convnext
  - https://huggingface.co/niroj-ebpearls/coffee-leaf-yolov12
  - https://huggingface.co/nathanrchn/coffee-leaf-lfm2.5-vl-450m-GGUF
  - https://huggingface.co/uchaan/coffee-leaf-check-qwen3.5-2b-gguf
- Runtimes:
  - https://onnxruntime.ai/docs/tutorials/web/
  - https://onnxruntime.ai/docs/tutorials/web/deploy.html
  - https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html
  - https://developers.googleblog.com/en/litertjs-googles-high-performance-web-ai-inference/
  - https://developers.google.com/edge/mediapipe/solutions/vision/image_classifier
  - https://huggingface.co/docs/transformers.js/api/env
  - https://github.com/tensorflow/tfjs/blob/master/tfjs-backend-wasm/README.md
  - https://arxiv.org/html/2402.05981v2
  - https://caniuse.com/webgpu
  - https://developer.chrome.com/blog/new-in-webgpu-121
- Asistente:
  - https://raw.githubusercontent.com/mlc-ai/web-llm/main/src/config.ts
  - https://developer.chrome.com/docs/ai/prompt-api
  - https://vercel.com/docs/plans/hobby
  - https://vite.dev/guide/env-and-mode
  - https://ai.google.dev/gemini-api/docs/pricing
  - https://publicaciones.cenicafe.org/index.php/avances_tecnicos/article/view/1792
- Literatura:
  - https://arxiv.org/pdf/1907.11561
  - https://www.mdpi.com/2077-0472/12/11/1909
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC12695173/
  - https://www.mdpi.com/2076-3417/15/9/5040
  - https://journal.iberamia.org/index.php/intartif/article/view/1833
  - https://arxiv.org/abs/2407.14737
  - https://pmc.ncbi.nlm.nih.gov/articles/PMC7775399
  - https://reference-global.com/article/10.2478/jee-2026-0043
