# FríoTrack — Landing Page

Landing page de **FríoTrack** (equipo BlackStartup, curso 1ASI0730 Aplicaciones Web, UPC): monitoreo de la cadena de frío en el transporte terrestre de alimentos perecibles en el Perú.

HTML, CSS y JavaScript puros, sin dependencias ni compilación. Implementa el diseño descrito en el Capítulo IV del informe (secciones 4.1 a 4.3): los colores, la tipografía (Inter), los radios y el logotipo siguen la guía de estilo del informe. Es un sitio bilingüe (ES/EN), responsive, con controles ARIA, navegación por teclado y `prefers-reduced-motion`. Las revisiones realizadas no certifican conformidad WCAG.

## Diseño

- **Héroe oscuro ("noche polar")** con un panel de simulación interactivo: el botón *Simular falla del equipo de frío* sube la temperatura, dispara una alerta y muestra cómo se recupera.
- **Franja de cargas**, problema con cifras de fuentes citadas, misión y visión, y un *bento* de funciones con mini-interfaces del producto.
- **Cómo funciona**, corredores con mapa interactivo, segmentos (pestañas), planes con conmutador mensual/anual, metas, equipo y formulario de contacto.
- Los textos viven en `i18n/`; el HTML solo referencia claves (`data-i18n`).

## Estructura

```
friotrack-landing/
├── index.html                 # Landing principal
├── Terms-and-Condition.html   # Términos y condiciones (ES/EN)
├── assets/
│   ├── css/styles.css         # Tokens de diseño y componentes
│   ├── js/config.js           # URL local del frontend y endpoint de contacto
│   ├── js/i18n.js             # Motor ES/EN (data-i18n)
│   ├── js/hero-sim.js         # Simulación del panel con alerta de temperatura
│   ├── js/app.js              # Menú, modal, pestañas, corredores, planes, contacto
│   ├── js/ui.js               # Cabecera que cambia al desplazarse, aparición de bloques y enlace activo
│   └── images/                # logo.svg, og-friotrack.png y team/ (fotos del equipo)
└── i18n/
    ├── es.js                  # Textos en español
    └── en.js                  # Textos en inglés
```

## Uso local

Desde la raíz del repositorio, levanta un servidor HTTP:

```bash
python -m http.server 4174
```

## Despliegue histórico y revisión TB1

La dirección histórica de AV1 es `https://upc-pre-202620-1asi0730-8088-friotrack.github.io/friotrack-landing/`. La imagen de vista previa (`og:image`) usa esa dirección absoluta. Esta integración publica fuentes para revisión mediante PR hacia `develop`; no actualiza Pages. Los CTA siguen en local hasta verificar la URL AWS o Azure del frontend. Consulta [TB1-INTEGRATION.md](TB1-INTEGRATION.md).

## Flujo de trabajo con Git (GitFlow)

- `main`: versión publicada.
- `develop`: integración. Toda funcionalidad llega aquí mediante un *pull request*.
- `feature/*`: una rama por funcionalidad (por ejemplo `feature/hero` o `feature/i18n`).

Los mensajes de *commit* siguen Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`).

## Qué editar

- **Fotos del equipo:** copia los PNG en `assets/images/team/` (ver `README.txt` de esa carpeta). Sin foto, se muestran las iniciales.
- **Precios referenciales:** constante `PLANS` al inicio de `assets/js/app.js`.
- **Formulario de contacto:** configura `contactEndpoint` en `assets/js/config.js` cuando exista un receptor aprobado. Mientras sea `null`, valida e informa que no envió datos. Con endpoint, solo una respuesta HTTP exitosa confirma recepción; los errores conservan el formulario.
- **Textos:** todo está en `i18n/es.js` y `i18n/en.js` (mismas claves en ambos).
- **Términos y condiciones:** borrador informativo; revisar con asesoría legal.

## Notas

- Los datos del panel del hero son **simulados**.
- Cifras de contexto: Banco Mundial (2023), FAO (2022), MTC (2023), las mismas fuentes del Capítulo I del informe.
- Un visitante nuevo inicia en inglés (en-US); se respeta una preferencia española (es-419) guardada en `localStorage`.
- Accesibilidad: atributos ARIA, foco visible, navegación por teclado, `prefers-reduced-motion` y revisión limitada de flujos. No se acredita una auditoría integral WCAG.
