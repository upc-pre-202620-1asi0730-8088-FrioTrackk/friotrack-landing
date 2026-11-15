# Registro de cambios

## 0.2.0 — 13 de noviembre de 2026

- Inglés por defecto, con prioridad para el idioma explícito de la URL y la preferencia guardada; locales `en-US` y `es-419`.
- Secciones opcionales About-the-Product y About-the-Team configurables con enlaces YouTube publicados. Los valores iniciales vacíos no muestran tarjetas ni reproductores.
- Reproductores accesibles con carga tras pulsar Reproducir y origen `youtube-nocookie.com`.
- Comprobaciones de traducciones, preferencia de idioma y carga segura de videos con `node --test tests/*.test.cjs`.

Las tarjetas de video se activan mediante enlaces configurados. Esta release identifica el código fuente de las secciones opcionales de producto y equipo.

## 0.1.0 — 10 de noviembre de 2026

- Los CTA de acceso abren la SPA publicada con perfil e idioma; el registro público corresponde a clientes de carga.
- El selector de acceso sustituye al formulario de credenciales demostrativo. La autenticación y la autorización pertenecen a la aplicación y su API.
- El contacto informa su modalidad de demostración antes de introducir datos. Un receptor configurado solo muestra éxito ante una respuesta HTTP satisfactoria y conserva los campos si hay error.
- La URL permite elegir español o inglés antes de aplicar la preferencia guardada.
- La configuración pública se separa de las interacciones. Se documentan el hosting Azure, el flujo de contribución y los límites de la entrega.
- Las tarjetas del equipo usan iniciales cuando no hay fotografía disponible, sin solicitar archivos inexistentes.

Esta versión identifica código fuente. La publicación del sitio Azure se realiza por separado y no se deduce de la creación de una release.
