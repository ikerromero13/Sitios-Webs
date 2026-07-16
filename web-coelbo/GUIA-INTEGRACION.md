# Guía de integración — Chatbot + Formulario de contacto de COELBO

Este documento reúne **todo lo necesario para llevar el chatbot y el
formulario de contacto a la web real de COELBO**. El código completo está en
este repositorio, en dos carpetas:

- `chatbot/` — el asistente virtual (widget flotante autónomo).
- `web-coelbo/` — la copia de demostración de la web de COELBO, con el
  formulario de contacto en `contacto.html`.

> Recuperado de la rama `claude/jolly-clarke-t4hgfy` (donde se desarrolló
> originalmente) y consolidado aquí.

---

## 1. Resumen de qué es cada cosa

### El chatbot (`chatbot/`)
Asistente **sin frameworks, sin backend, sin dependencias**. Es HTML/CSS/JS
puro que se auto-inicializa: crea un botón flotante y un panel de chat. Motor
**basado en reglas** con base de conocimiento multilingüe (CA, ES, EN, FR, IT).

- Orienta sobre las tres familias de producto: **PressflowTech, HiTech,
  SmartTech**.
- **Deriva al equipo técnico** (`coelbo@coelbo.es` · `(+34) 93 736 29 50`)
  todo lo que queda fuera de la Fase 1: precios, configuración, averías,
  compatibilidad, stock, garantías.
- Detecta el idioma por palabras frecuentes y ofrece un selector manual.
- Punto clave: **COELBO no fabrica bombas**, fabrica los dispositivos
  electrónicos que las controlan; el asistente lo tiene presente.

Archivos:
| Archivo | Para qué |
|---|---|
| `chatbot/chatbot.css` | Estilos del widget (encapsulados bajo `.coelbo-chat`) |
| `chatbot/chatbot.js` | Motor de reglas + base de conocimiento + UI (~65 KB) |
| `chatbot/demo.html` | Página de prueba para revisarlo |
| `chatbot/system-prompt.md` | Instrucciones y material de producto (referencia) |
| `chatbot/README.md` | Documentación del chatbot |

### El formulario de contacto (`web-coelbo/contacto.html`)
Formulario multilingüe (CA/ES/EN/FR/IT) con:
- Validación en cliente (campos obligatorios: nombre, email, asunto, mensaje;
  familia y empresa/teléfono opcionales).
- **Envío real de correos vía [Formspree](https://formspree.io)**.
- Campo anti-spam oculto (`_gotcha`) y honeypot.
- Pantalla de éxito y opción de "enviar otro mensaje".
- **Integración con el chatbot**: si el usuario hizo una pregunta al asistente,
  el formulario **pre-rellena el mensaje** con esa última pregunta (vía
  `localStorage`, clave `coelbo_last_q`).

---

## 2. Cómo poner el CHATBOT en la web real

Copia la carpeta `chatbot/` al proyecto de la web real y añade estas dos
líneas a cada página donde quieras el asistente (ajusta la ruta según dónde
coloques la carpeta):

```html
<!-- En el <head> -->
<link rel="stylesheet" href="/chatbot/chatbot.css">

<!-- Justo antes de </body> -->
<script defer src="/chatbot/chatbot.js"></script>
```

- El widget se **auto-inicializa** al cargar la página (`DOMContentLoaded`).
- Toma el idioma inicial del atributo `lang` del `<html>` de la página.
- No necesita configuración para funcionar. Ajustes opcionales al principio de
  `chatbot.js`:
  - `EMAIL` / `PHONE` — datos de contacto para las derivaciones.
  - `LOGO` — logo mostrado en la cabecera del widget.
  - `CONTACT_URL` — a qué página enlaza el botón "Ir al formulario de contacto"
    (por defecto `contacto.html`, relativo a la página donde se incrusta).
  - Objetos `KW` (palabras clave) e `I18N` (textos) — para ampliar respuestas.

> **Fase 2 (futuro):** el motor es ampliable. COELBO puede añadir intenciones y
> respuestas editando `KW` e `I18N`, ampliar la base de conocimiento con el
> contenido de los catálogos, o conectarlo a un modelo de lenguaje si más
> adelante se quiere comprensión de lenguaje natural más abierta.

---

## 3. Cómo poner el FORMULARIO en la web real

El formulario ya está en `web-coelbo/contacto.html`. Puedes copiar el
`<form id="contactForm">`, sus estilos (`<style>` de la misma página) y el
`<script>` que lo controla a la página de contacto de la web real.

### 3.1. Configurar el envío de correos (Formspree)

El envío se hace con **Formspree**. En `contacto.html`, dentro del `<script>`
del formulario, está esta línea:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/mlgyyrzp';
```

- Este endpoint (`mlgyyrzp`) es el que está configurado ahora. **Verifica que
  ese formulario de Formspree pertenece a COELBO** y que el correo de destino
  es el correcto (`comercial@coelbo.es`).
- Para usar otra cuenta/buzón: crea un formulario en formspree.io, apunta el
  destino a `comercial@coelbo.es` (o el que corresponda) y sustituye el
  endpoint por el nuevo `https://formspree.io/f/xxxxxxxx`.
- Si dejas `FORM_ENDPOINT` **vacío** (`''`), el formulario funciona en **modo
  demo**: muestra la confirmación pero no envía correo.

> Alternativa sin Formspree: si la web real tiene backend (PHP, etc.), se puede
> cambiar el `fetch(FORM_ENDPOINT, …)` por un POST al script del servidor que
> envíe el correo. El resto del formulario (validación, i18n, UI) no cambia.

### 3.2. Datos de contacto que muestra la página

Estos ya están en `contacto.html`; confírmalos con COELBO:
- Dirección: Ctra. de Rubí, 288 (Pol. Ind. Can Guitard), 08228 Terrassa
- Tel. (+34) 93 736 29 50 · Fax (+34) 93 736 29 51
- Correos: `comercial@coelbo.es` y `coelbo@coelbo.es`
- Mapa: iframe de Google Maps embebido.

---

## 4. Probar en local antes de publicar

```bash
python3 -m http.server 8080
# Chatbot solo:      http://localhost:8080/chatbot/demo.html
# Web + formulario:  http://localhost:8080/web-coelbo/contacto.html
```

> Nota: la copia `web-coelbo/` carga el CSS/JS/imágenes **directamente desde
> coelbo.es** (rutas absolutas), así que en local sin internet se verá sin los
> estilos de COELBO. El chatbot y el formulario funcionan igual, porque su
> código es propio y local.

---

## 5. Checklist para producción

- [ ] Copiar la carpeta `chatbot/` a la web real y enlazar CSS + JS.
- [ ] Ajustar en `chatbot.js`: `CONTACT_URL`, `EMAIL`, `PHONE`, `LOGO` si hace falta.
- [ ] Copiar el formulario de `contacto.html` a la página de contacto real.
- [ ] Verificar/crear el endpoint de **Formspree** y confirmar el buzón destino.
- [ ] Revisar los datos de contacto (dirección, teléfonos, correos, mapa).
- [ ] Comprobar que el widget respeta el diseño y no colisiona con el CSS de la web.
- [ ] Probar el envío real de un correo de prueba.
- [ ] Probar el pre-rellenado: preguntar algo al chatbot → "Ir al formulario"
      → el mensaje debe aparecer relleno.
