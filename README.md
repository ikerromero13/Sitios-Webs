# Hanna Events & Decorations — Sitio web

Sitio web estático (HTML5 + CSS moderno + JavaScript vanilla) para **Hanna Events & Decorations**, decoración de bodas y eventos en Terrassa. Sin frameworks, sin build, sin npm: se despliega arrastrando la carpeta a cualquier hosting estático (Hostinger, Netlify, Vercel, GitHub Pages…).

## Estructura

```
/
├── index.html               # Página principal (one-page, ES/CA/EN)
├── css/styles.css           # Estilos (sistema de diseño editorial)
├── js/
│   ├── i18n.js              # Conmutador de idioma ES / CA / EN
│   ├── main.js              # Navegación, animaciones scroll, formulario
│   └── cookies.js           # Banner de consentimiento funcional
├── img/                     # Placeholders SVG (sustituir por fotos reales WebP)
├── legal/
│   ├── aviso-legal.html
│   ├── politica-privacidad.html
│   └── politica-cookies.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── clinicum-dental/         # Proyecto anterior (sin relación) conservado aparte
```

## Cómo ver el sitio

Abre `index.html` en el navegador. Para el formulario y el mapa, sirve la carpeta con un servidor local (opcional):

```bash
python3 -m http.server 8000    # luego abre http://localhost:8000
```

## Idiomas

Castellano (por defecto), catalán e inglés. El cambio se hace con el selector ES/CA/EN del menú; se recuerda en `localStorage` y detecta el idioma del navegador. Todo el contenido traducible usa atributos `data-i18n` con el diccionario en `js/i18n.js`.

---

## ✅ Checklist — PENDIENTE de tu parte antes de publicar

### 1. Datos del negocio
- [ ] **Email de contacto** (aparece como `[COMPLETAR]` en contacto y páginas legales).
- [ ] **Horario de atención**.
- [ ] **Historia real** del negocio y del equipo (sección «Sobre nosotros», `about.p2`).
- [ ] **Lista definitiva de servicios** — revisa las 6 tarjetas; confirma o ajusta (especialmente «Alquiler de mobiliario», marcado como pendiente).
- [ ] **Política de reserva/señal y pago** (FAQ pregunta 6).

### 2. Fotos (sustituir placeholders en `/img/`)
Todos los archivos `.svg` de `/img/` son placeholders con la proporción correcta. Sustitúyelos por fotos reales, **preferiblemente en WebP** (mismo nombre o actualiza la ruta en `index.html`):
- [ ] `hero.svg` → foto apaisada de una boda/evento montado (1920px).
- [ ] `about.svg` → retrato del equipo o de la fundadora.
- [ ] `gallery-1.svg` … `gallery-6.svg` → 6 fotos reales del portfolio.
- [ ] `logo.svg` → tu **logotipo real** (la «imagen anclada» que comentaste). Ideal SVG o PNG transparente.
- [ ] `og-image.svg` → imagen para compartir en redes (1200×630).
> Consejo: convierte tus JPG a WebP en [squoosh.app](https://squoosh.app) para máxima velocidad. Si prefieres mantener JPG, cambia la extensión en las etiquetas `<img>`.

### 3. Formulario de contacto (Formspree)
El formulario está preparado para **Formspree** (gratis, sin backend):
1. Crea una cuenta en [formspree.io](https://formspree.io).
2. Crea un formulario y copia tu endpoint (ej. `https://formspree.io/f/xxxxxxx`).
3. En `index.html`, busca `TU_ENDPOINT_FORMSPREE` en el atributo `action` del `<form>` y sustitúyelo.
> Mientras no lo configures, al enviar se muestra un aviso y no se envía nada. Alternativa: cambiar a `mailto:` si prefieres abrir el correo del usuario.

### 4. Textos y datos legales
- [ ] Revisar y completar **Aviso legal**, **Política de privacidad** y **Política de cookies** (`/legal/`): titular, NIF/CIF, fecha, proveedores. **Recomendado: que lo valide un profesional.**
- [ ] Sustituir los **testimonios de ejemplo** (marcados con la etiqueta «Ejemplo») por opiniones reales cuando las tengas.
- [ ] *(Opcional)* Traducir las páginas legales a CA/EN; ahora están en castellano.

### 5. Dominio y despliegue
- [ ] Registrar/definir el **dominio real**. He usado `https://www.hannaeventsdecorations.com/` como ejemplo en las etiquetas SEO, `sitemap.xml`, `robots.txt` y Schema. **Búscalo y reemplázalo** por tu dominio final (búsqueda global del texto `hannaeventsdecorations.com`).
- [ ] Subir la carpeta al hosting y verificar que el mapa, el formulario y el WhatsApp funcionan.
- [ ] Dar de alta el sitio en **Google Search Console** y enviar el `sitemap.xml`.
- [ ] *(Opcional)* Si activas Google Analytics u otra analítica, pega el código en `js/cookies.js` dentro de `loadAnalytics()` — solo se cargará si el usuario acepta las cookies.

### 6. Verificaciones finales recomendadas
- [ ] Pasar **Lighthouse** (objetivo 90+ en todas las métricas). Las fotos reales en WebP son clave para la puntuación.
- [ ] Comprobar en móvil real (360px), tablet (768px) y escritorio (1440px).
- [ ] Revisar el perfil de **Bodas.net**, **Instagram** y **TikTok** — enlaces ya integrados.

---

*Diseño y desarrollo: sitio a medida, sin plantillas genéricas.*
