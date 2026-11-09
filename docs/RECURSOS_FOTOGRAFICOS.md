# Recursos del estudio floral

- Archivo: `src/assets/floral-atlas.png` (1254 × 1254, PNG transparente).
- Origen: herramienta integrada de generación de imágenes de Codex, modo integrado; no se usó CLI ni una API key propia.
- Destino: `src/PhotoBouquet.jsx`, miniaturas y composición interactiva. Se conserva la marca MadeByU; no se reutilizan fotos ni la marca de la referencia.
- Nueve piezas en una cuadrícula de 3 × 3: clavel, margarita, rosa, girasol, eucalipto, follaje fino, envoltura, caja y listón.
- `captureBouquet` incorpora el recurso en la imagen del carrito para conservar la selección durante la sesión.
- Limitaciones: piezas generadas, perspectiva compuesta y variación de iluminación. Los colores del material se calculan en sRGB desde la muestra seleccionada, con sombras y luces; se verificaron ocho opciones mediante píxeles renderizados. La caja usa una distribución circular de flores y capas de oclusión del frente. Para una representación comercial exacta deben sustituirse por fotografías del inventario y validar sus colores y materiales.

## Prompt utilizado

```text
Use case: product-mockup. Create ONE production botanical photographic sprite atlas on a truly transparent alpha background, square 3 by 3 equal grid, 1536x1536 or larger. This is an asset sheet for an interactive florist bouquet configurator. Exactly nine isolated objects, one centered in each cell, ample transparent margin so no object crosses its cell. No text, no labels, no grid lines, no watermarks. Soft natural studio light from upper left, realistic fine textures, consistent lighting, real botanical macro photography, absolutely no illustration or cartoon. Top row: (1) one blush pink carnation flower head, frontal three-quarter view, ruffled detailed petals, no stem (2) one ivory white daisy head yellow center, front view, no stem (3) one pale blush pink rose bloom, three-quarter front view, no stem. Middle row: (4) one golden sunflower head dark brown center, front view, no stem (5) one elegant tall eucalyptus sprig with realistic muted green round leaves and fine thin stem, upright, whole sprig visible (6) one tall fern/asparagus greenery sprig airy delicate fine leaves, upright, whole sprig visible. Bottom row: (7) empty elegant bouquet wrapper folded blue sage matte florist paper, wide open fan at top, cinched narrow at bottom, tall silhouette, viewed from front, no flowers, no greenery, no bow, transparent in its empty upper opening; should resemble physical florist paper with natural creases, not plastic, full object visible (8) empty short round ivory florist hatbox, slightly top-down front view, open ellipse at top, no flowers, full object visible (9) a loose sage green satin bow with two long narrow trailing ribbons, front view, no background. The objects fill 80 to 90 percent of their individual cells, isolated with absolutely transparent surroundings. These pieces will be layered to create a realistic bouquet.
```

El recurso recibido mide 1254 × 1254. La composición usa coordenadas normalizadas, sin depender de la resolución pedida en el prompt.
