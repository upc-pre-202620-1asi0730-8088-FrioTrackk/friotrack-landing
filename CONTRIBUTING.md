# Colaboración en FríoTrack Landing

Cada integrante configura su propio nombre y correo asociado a GitHub. Los commits deben corresponder a trabajo real; la revisión se registra mediante pull requests y no se atribuyen cambios a otra persona.

1. Actualiza `develop` y crea una rama `feature/<cambio>` desde esa rama.
2. Separa cambios funcionales y documentación cuando sea útil revisarlos de forma independiente. Usa mensajes concretos como `fix(access): preserve language in application links`.
3. Comprueba ES/EN, pantallas de escritorio y móvil, enlaces locales y navegación por teclado. Adjunta los resultados al pull request dirigido a `develop`.
4. Prepara `release/<version>` desde `develop`, documenta el alcance y valida el contenido final. Integra en `main`, crea la etiqueta sobre el commit revisado y publica la release; devuelve esa integración a `develop`.
5. Para una corrección urgente, crea `hotfix/<cambio>` desde `main`, valida y devuelve la integración a ambas ramas.

No muevas etiquetas existentes para aparentar un avance distinto. Las notas de release describen las verificaciones, el commit de entrega y el alcance de los servicios incluidos. Subir una release no equivale a desplegar en Azure.
