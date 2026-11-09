# MadeByU · Prototipo React v2 — Estudio Floral Salvia

Proyecto académico de **Comercio Electrónico y Mercadeo Digital · ESEN**. Esta versión transforma el personalizador de MadeByU con una estética inspirada en el concepto visual compartido por el equipo: una interfaz luminosa en verdes salvia, paneles por pasos y un ramo grande en el centro. El diseño es **original de MadeByU** y no copia el logotipo, las imágenes ni el código de otra tienda.

## Verlo rápidamente

- **`asset-preview.png`**: vista conceptual del aspecto de la interfaz a tamaño de escritorio. Es una composición visual ilustrativa, no una captura de React ejecutándose en el navegador.
- **`PREVIEW_DISENO.html`**: vista previa HTML **estática** del estudio floral, generada a partir de los mismos componentes visuales del prototipo. Se puede abrir con doble clic, sin instalar dependencias. Los botones **no funcionan en este archivo**.
- Para probar la navegación, la personalización y el carrito realmente, ejecuta la **aplicación React** según las instrucciones siguientes.

## Abrir la aplicación en Windows con VS Code

1. Descomprime `MadeByU_Prototipo_Salvia_React.zip`.
2. Abre la carpeta `MadeByU_Prototipo_Salvia_React` con Visual Studio Code.
3. Abre **Terminal → Nueva terminal**.
4. Ejecuta los siguientes comandos, con Node.js 20 o superior e internet la primera vez:

```powershell
npm install
npm run dev
```

5. Abre en el navegador la dirección local que muestre Vite (normalmente **http://localhost:5173**).
6. Haz clic en **Crea tu ramo** desde la página principal.

**Opción alternativa para Windows:** ejecuta `INICIAR_MADEBYU.bat` desde la carpeta descomprimida.

La aplicación sigue usando React y Vite. No se agregó ninguna dependencia adicional para el rediseño.

## Novedades de esta versión

- Estética verde salvia / menta, papel claro y tipografía editorial.
- Estudio de personalización distribuido en **tres áreas**: etapas a la izquierda, vista previa central y controles a la derecha.
- **Ramo SVG propio y dinámico**: al cambiar las cantidades, la mezcla de rosas, claveles, margaritas y girasoles se actualiza visualmente. Al escoger papel, listón, follaje, paleta o presentación, se reflejan cambios ilustrados.
- Pasos: **Flores, Follaje, Envoltura, Listón, Formato y Tarjeta**.
- Cuatro tamaños con precios provisionales: **5 flores $9.99**, **8 flores $13.99**, **14 flores $21.99** y **20 flores $29.99**.
- Al aumentar una variedad, **se sustituye** una flor de otra variedad; el número total de flores del tamaño elegido permanece fijo. Esto evita cambiar de precio base de forma inesperada.
- Suplementos de rosas de **+$0.40 por tallo**, girasoles de **+$0.30** y presentación en caja **+$5**: **valores exclusivamente ficticios**, visibles para probar comprensión del precio.
- Botones *Recomiéndame* y *Sorpréndeme* para quien no sabe combinar flores.
- Agregar el ramo personalizado al carrito, checkout de demostración y confirmación ficticia.
- Diseño adaptable a computadora, tablet y celular.

## Funciones conservadas del prototipo anterior

- Menú con solo tres pilares: **Por arreglos florales, Por ocasiones y Por tipos de flores**. Los colores son filtros y no categorías independientes.
- Logotipo MadeByU = regreso a Home. No se añadió una opción «Inicio» al menú.
- Catálogo, ficha de producto, carrito, checkout simulado y confirmación.
- Ruta `#/pruebas` para registrar sesiones con participantes reales, tomar tiempos y exportar observaciones a TXT.
- Respaldo de pruebas y rúbrica en `docs/`.

## Qué **no** hace todavía

- No existe una integración de inventario, precios mayoristas, base de datos, pasarela de pago o envíos reales.
- La vista previa utiliza **ilustraciones SVG** para representar tipos y colores; no sustituye una fotografía exacta ni un render fotográfico de un pedido real.
- El carrito utiliza una imagen genérica de referencia del formato escogido, mientras que la descripción del pedido registra la combinación de flores seleccionada. Aún no guarda una imagen individual del SVG personalizado.
- No se solicitan datos bancarios. El checkout **no cobra**, **no procesa pedidos** y **no contacta floristerías**.
- Los costos, IVA, precios unitarios, disponibilidad y política de entrega todavía deben validarse para una eventual operación real.
- No se inventaron resultados de pruebas de usabilidad: el registro está vacío hasta que las personas realicen las tareas.

## Organización del código

```text
MadeByU_Prototipo_Salvia_React/
├─ index.html                       Entrada a React + Vite
├─ package.json
├─ PREVIEW_DISENO.html              Vista visual estática
├─ asset-preview.png                Imagen conceptual del diseño
├─ INICIAR_MADEBYU.bat              Inicio rápido para Windows
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx                       Tienda, catálogo, carrito y navegación
│  ├─ FloralStudio.jsx              Personalizador interactivo en React
│  ├─ studio.css                    Estilos exclusivos del estudio floral
│  ├─ styles.css                    Estilos generales y paleta salvia
│  └─ assets/*.svg                  Ilustraciones de productos
└─ docs/
   ├─ GUIA_TESTS_UX.md
   └─ MAPA_RUBRICA_Y_FLUJO.md
```

## Evidencia y validación

- Se comprobó el parseo/transpilación de los componentes JSX con TypeScript (sin errores de sintaxis).
- Se ejecutaron pruebas automatizadas de lógica en el estudio con un simulador ligero de hooks: cambio de tamaño ($9.99), sustitución por rosa (+$0.40), cambio a caja (+$5) y envío al carrito con total $15.39. **No sustituyen una prueba completa de navegador.**
- En el entorno de elaboración no se pudieron instalar las dependencias de npm ni verificar el funcionamiento completo de la app en un navegador. Ejecuta `npm install && npm run dev` en tu computadora para probar el recorrido de extremo a extremo.

**Uso académico:** los estudios UX y sus decisiones se basan en cinco cuestionarios abiertos exploratorios del equipo y en las correcciones del profesor. Para cerrar la rúbrica faltan pruebas reales de usabilidad con el prototipo, respaldos de investigación, plan de marketing y exposición final.


## Actualización v1.1: pantalla recortada en escritorio

Se corrigió el problema de la vista previa demasiado grande y de la necesidad de
hacer scroll en toda la página para llegar al precio. En escritorio, el personalizador
se adapta a la altura del navegador: los pasos, la vista central, el total y el botón
«Añadir al carrito» permanecen visibles. **Las opciones del panel derecho sí tienen
su propio scroll**, ya que no todas caben a la vez; coloca el cursor sobre ellas
para desplazarte. En celular se mantiene el diseño vertical.

Para actualizar, reemplaza la carpeta anterior por esta versión, ejecuta
`npm install` (solo si es la primera vez) y `npm run dev`. Con la página abierta,
presiona Ctrl + Shift + R para forzar la actualización de estilos. Si el navegador
está ampliado, usa Ctrl + 0 para restablecer el zoom al 100 %.
