# Las Caritas del Tuyú - Sitio Web

Sitio web para la Asociación Civil Las Caritas del Tuyú, ONG que acompaña a familias con niños en tratamiento oncológico y patologías crónicas.

## Cómo usar

### Opción 1: Abrir directamente
Abrí el archivo `index.html` en tu navegador (doble clic).

### Opción 2: Servidor local (recomendado)
Si tenés Node.js instalado:
```bash
npx serve .
```
Luego abrí http://localhost:3000

## Personalización

### Agregar tu video de YouTube
En `index.html`, buscá la sección Multimedia y:
1. Comentá o eliminá el enlace `.video-placeholder`
2. Descomentá la línea del `<iframe>`
3. Reemplazá `VIDEO_ID` con el ID de tu video (ej: de `youtu.be/abc123` el ID es `abc123`)

### Botón Donar
El botón "Donar ahora" enlaza a WhatsApp (2246 485352). Si querés usar Mercado Pago u otra plataforma, cambiá el `href` del enlace en la sección `#donar`.

## Estructura

- `index.html` - Página principal
- `css/styles.css` - Estilos
- `js/main.js` - Interactividad (menú, diapositivas, formulario)
- `imagenes/` - Logo, diapositivas y fotos
