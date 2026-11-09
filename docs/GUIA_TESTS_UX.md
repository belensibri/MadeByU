# Protocolo de pruebas UX · MadeByU

## Objetivo
Evaluar si los usuarios encuentran arreglos por categoría, comprenden los precios, personalizan un ramo y completan sin confusión el recorrido de checkout **simulado**. Las pruebas son un componente requerido del proyecto final y deben realizarse con participantes reales.

## Antes de iniciar
1. Explica que se trata de una tienda ficticia y que **no se hará ningún cobro ni pedido real**.
2. Solicita consentimiento voluntario para tomar notas; no recopiles nombres reales, teléfonos ni direcciones.
3. Asigna un código (P01, P02, etc.). No reveles las respuestas correctas ni expliques cómo navegar.
4. Abre `http://localhost:5173/#/` para iniciar, y `http://localhost:5173/#/pruebas` en otra pestaña para registrar resultados.
5. Registra observaciones literales importantes, sin inventar respuestas.

## Tareas recomendadas
1. Encuentra un ramo que cueste menos de $15 y verifica cuántas flores tiene.
2. Busca un arreglo de cumpleaños utilizando el menú de categorías.
3. Crea un ramo mediano, añade dos rosas y revisa cuánto cambia el precio.
4. Añade un producto al carrito y revisa cómo elegir retiro o entrega.
5. Completa el checkout de demostración hasta la confirmación ficticia.

**Nota sobre la tarea 3:** el prototipo sustituye automáticamente una flor estándar al agregar rosas para mantener la cantidad del tamaño. Observa si el usuario entiende esa sustitución y el recargo mostrado.

## Datos a registrar
- Éxito / dificultad / abandono por tarea.
- Tiempo invertido por tarea, medido en segundos (el registro incluye cronómetro de prueba).
- Dudas expresadas en voz alta y errores observables.
- Percepción global de facilidad, escala simple 1–5 (no es una escala SUS).
- Comentarios y sugerencias textuales.

## Cómo analizar los resultados
1. Calcula la tasa de éxito para cada tarea: completadas / participantes.
2. Resume tiempos (por ejemplo, mediana) si fueron medidos de forma consistente.
3. Agrupa problemas por severidad y frecuencia.
4. Describe solución de diseño, evidencia y prioridad.
5. Modifica el código y vuelve a validar cambios cuando sea posible.

## Plantilla de hallazgos
| Hallazgo observado | Evidencia / participante | Impacto | Cambio de diseño propuesto | Estado |
|---|---|---|---|---|
| (Completar con datos reales) | (P01...) | Bajo/Medio/Alto | ... | Pendiente |

**No inventar respuestas ni declarar que las pruebas se han realizado antes de hacerlas.** Los cinco cuestionarios previos son investigación exploratoria inicial, no sustituyen estas pruebas en prototipo.
