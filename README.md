# FríoTrack — Landing Page

Landing page de **FríoTrack** (equipo BlackStartup, curso 1ASI0730 Aplicaciones Web, UPC): monitoreo de la cadena de frío en el transporte terrestre de alimentos perecibles en el Perú.

HTML, CSS y JavaScript puros, sin dependencias ni compilación. Implementa el diseño descrito en el Capítulo IV del informe (secciones 4.1 a 4.3). Es un sitio bilingüe (ES/EN), responsive, con navegación por teclado, foco visible, atributos ARIA y `prefers-reduced-motion`; estas características no acreditan una auditoría completa de WCAG.

## Producto y alcance

- [Landing publicada en Azure](https://friotracktb1bce6db1b.z22.web.core.windows.net/landing/).
- [Landing publicada en GitHub Pages](https://upc-pre-202620-1asi0730-8088-friotrackk.github.io/friotrack-landing/).
- [Aplicación SPA](https://friotracktb1bce6db1b.z22.web.core.windows.net/).
- [Repositorio de la SPA](https://github.com/upc-pre-202620-1asi0730-8088-FrioTrackk/friotrack-frontend).
- [Repositorio de la API](https://github.com/upc-pre-202620-1asi0730-8088-FrioTrackk/friotrack-api).

La versión AV2 está publicada en GitHub Pages y Azure. El [recibo de publicación](https://github.com/upc-pre-202620-1asi0730-8088-FrioTrackk/friotrack-frontend/blob/main/docs/redeployment-landing.json) identifica el artefacto y la revisión de fuentes publicados en Azure.

El inicio de sesión abre la aplicación por perfil (`coordinator` o `cargo-client`) conservando el idioma (`es` o `en`). El registro público conduce a una cuenta de cliente de carga. La API decide los permisos; seleccionar un perfil en un enlace no otorga acceso de coordinador. La landing no solicita ni guarda contraseñas.

El panel del héroe utiliza **datos simulados**. Los planes son referenciales y las metas no representan resultados comerciales medidos. El formulario de contacto es una demostración mientras `contactEndpoint` sea `null`: avisa antes de introducir datos y no envía ni guarda la solicitud. Cuando se configure un receptor real, solo se informa recepción ante una respuesta HTTP satisfactoria; un error conserva los campos y permite reintentar.

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
│   ├── js/config.js           # URL pública de la SPA, receptor y precios
│   ├── js/hero-sim.js         # Simulación del panel con alerta de temperatura
│   ├── js/app.js              # Menú, acceso por perfil, pestañas, planes, contacto
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

Visita `http://localhost:8000/?lang=es` y `http://localhost:8000/?lang=en`. El parámetro válido de la URL tiene prioridad sobre la preferencia guardada. Si ninguna existe, se utiliza inglés, independientemente del idioma del navegador. La selección se conserva entre páginas con `localStorage`; si se bloquea el almacenamiento, la página sigue funcionando. Los locales son `en-US` y `es-419`.

Revisa ambos perfiles y el registro desde los CTA, teclado y Escape en el selector, menú móvil, pestañas, conmutador de planes, simulación y contacto. Las validaciones de cada versión figuran en `docs/releases/`.

## Configuración y publicación

Edita `assets/js/config.js` para cambiar `applicationUrl`, `contactEndpoint` o los precios referenciales. Usa únicamente configuración pública. Mantén las mismas claves en los diccionarios. Si cambia la URL pública de la landing, actualiza `og:image` en `index.html`.

### Videos de producto y equipo

`videos.product.youtubeUrl` y `videos.team.youtubeUrl` aceptan únicamente enlaces HTTPS de YouTube con un identificador válido. Sus valores iniciales son `null`: la sección y las tarjetas no se muestran mientras no exista una URL publicada válida. `streamUrl` permite registrar la referencia institucional que se incorporará al reporte; no se incrusta el Stream privado en el sitio público.

El reproductor se crea con `youtube-nocookie.com` después de pulsar Reproducir. No se cargan iframes vacíos ni videos de ejemplo. Los títulos y botones son bilingües. La visibilidad de cada tarjeta depende de que su enlace de configuración sea válido.

Publica los HTML, `assets/` e `i18n/` en `/landing/` del hosting estático, preservando los archivos de la SPA en la raíz. El sitio también está publicado en GitHub Pages.

La recepción de contactos, los sensores físicos y los pagos requieren servicios que este sitio no implementa. El texto de términos tiene carácter informativo dentro del proyecto académico.

## Flujo de trabajo con Git (GitFlow)

- `main`: versión publicada.
- `develop`: integración. Toda funcionalidad llega aquí mediante un *pull request*.
- `feature/*`: una rama por funcionalidad (por ejemplo `feature/hero` o `feature/i18n`).

Los mensajes de *commit* siguen Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`).

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de revisión y releases. Cada integrante registra aportes reales con su propia identidad y adjunta evidencias de validación.

