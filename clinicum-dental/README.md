# Clinicum Dental — Réplica mejorada (landing estática)

Réplica mejorada y optimizada de la página de **seguro dental de Clinicum**
(`clinicum.es/dental`), construida con **HTML + CSS + JavaScript estático**,
sin frameworks ni dependencias, lista para desplegar en **Hostinger Premium**
(o cualquier hosting estático).

> ⚠️ Proyecto de **demostración con fines educativos**. No es un sitio oficial
> de Clinicum. Los datos de producto usados (precio desde 5 €/mes, +2.100
> clínicas, 41 servicios gratuitos, garantía de 2 años, sin carencia ni
> cuestionario, etc.) son información pública del producto. Los datos de
> contacto (teléfono, email) y los textos legales son **placeholders** y deben
> sustituirse por los reales.

## Estructura

```
.
├── index.html          # Página principal (semántica + SEO + JSON-LD)
├── css/
│   └── styles.css      # Estilos (tokens CSS, mobile-first, WCAG AA)
├── js/
│   └── main.js         # Nav móvil, acordeón FAQ, validación, reveal
├── assets/
│   ├── favicon.svg     # Favicon vectorial
│   └── og-image.svg    # Imagen para redes sociales (Open Graph)
├── robots.txt
└── sitemap.xml
```

## Mejoras aplicadas

**Rendimiento**
- Sin imágenes pesadas: iconografía **SVG inline** y degradados CSS.
- **Fuentes del sistema** (0 peticiones a fuentes externas).
- Una sola hoja de estilos y un único JS cargado con `defer`.
- Sin librerías ni frameworks → JS mínimo, óptimo para Core Web Vitals.

**Accesibilidad (WCAG AA)**
- HTML semántico con landmarks (`header`, `nav`, `main`, `section`, `footer`).
- Enlace "saltar al contenido", foco visible, navegación por teclado.
- Acordeón FAQ y menú con `aria-expanded` / `aria-controls`.
- Contraste de color AA y soporte de `prefers-reduced-motion`.

**SEO**
- `title`, `description`, canonical, Open Graph y Twitter Card.
- **Datos estructurados JSON-LD**: Organización, Producto/Oferta y FAQPage.
- Jerarquía de encabezados correcta, `robots.txt` y `sitemap.xml`.

**UX / Diseño**
- Diseño responsive (móvil / tablet / escritorio).
- Calculadora de presupuesto con validación en cliente.
- Acordeón de preguntas frecuentes.

## Cómo verlo en local

Cualquier servidor estático sirve. Por ejemplo:

```bash
python3 -m http.server 8080
# luego abre http://localhost:8080
```

## Despliegue en Hostinger Premium

Sube el contenido de esta carpeta a `public_html/` (vía hPanel o FTP).
No requiere build ni Node: son archivos estáticos.

## Pendiente de personalizar

- [ ] Teléfono y email reales (en el `footer`, marcados con `TODO`).
- [ ] Enlaces de aviso legal, privacidad y cookies.
- [ ] Conectar el formulario a un backend/API real de captación de leads.
- [ ] Sustituir `og-image.svg` por una imagen `.jpg/.png` si una red social
      concreta no renderiza SVG en las previsualizaciones.
