# FríoTrack — Landing Page

Landing page de **FríoTrack** (equipo BlackStartup, curso 1ASI0730 Aplicaciones Web, UPC): monitoreo de la cadena de frío en el transporte terrestre de alimentos perecibles en el Perú.

HTML, CSS y JavaScript puros, sin dependencias ni compilación. Implementa el diseño descrito en el Capítulo IV del informe (secciones 4.1 a 4.3): los colores, la tipografía (Inter), los radios y el logotipo siguen la guía de estilo del informe. Es un sitio bilingüe (ES/EN), responsive y accesible (navegación por teclado, `prefers-reduced-motion`, contraste AA).

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

Abre `index.html` con doble clic, o levanta un servidor:

```bash
python -m http.server 8000
```

## Publicación en GitHub Pages

En **Settings → Pages**, elige la rama `main` y la carpeta raíz. La dirección esperada es `https://upc-pre-202620-1asi0730-8088-friotrack.github.io/friotrack-landing/`. La imagen de vista previa (`og:image`) usa esa dirección absoluta; si el sitio se publica en otra, actualízala en `index.html`.

## Flujo de trabajo con Git (GitFlow)

- `main`: versión publicada.
- `develop`: integración. Toda funcionalidad llega aquí mediante un *pull request*.
- `feature/*`: una rama por funcionalidad (por ejemplo `feature/hero` o `feature/i18n`).

Los mensajes de *commit* siguen Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`).

