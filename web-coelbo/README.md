# Web privada de COELBO (demostración interna)

Copia **privada y no indexable** de una web de COELBO Control System, con el
**asistente virtual (chatbot)** integrado. Pensada para revisión interna, no
para publicación pública.

> Nota: no es un mirror exacto de coelbo.es. El entorno de ejecución bloquea el
> acceso de red a `coelbo.es`, así que esta web se ha construido a partir de la
> información de la empresa (identidad + las tres familias de producto). Si se
> autoriza el dominio en la red del entorno, puede sustituirse por una copia
> fiel del sitio real.

## Privacidad / no indexable

- `<meta name="robots" content="noindex, nofollow, noarchive">` en `index.html`.
- `robots.txt` con `Disallow: /` en esta carpeta.
- No se enlaza desde ningún sitemap ni página pública.

> El `noindex` evita la indexación en buscadores. Para acceso **restringido**
> real (que nadie con la URL pueda verla) hace falta protección por servidor
> (autenticación HTTP / login), que requiere backend.

## Estructura

```
web-coelbo/
├── index.html     # Landing COELBO (hero, productos, técnica, empresa, contacto)
├── styles.css     # Estilos (marca azul COELBO, responsive, accesible)
├── main.js        # Menú móvil + año dinámico
├── favicon.svg
└── robots.txt     # Disallow: /
```

El chatbot se carga desde la carpeta compartida `../chatbot/`:

```html
<link rel="stylesheet" href="../chatbot/chatbot.css">
<script src="../chatbot/chatbot.js" defer></script>
```

## Ver en local

```bash
python3 -m http.server 8080
# abrir http://localhost:8080/web-coelbo/
```
