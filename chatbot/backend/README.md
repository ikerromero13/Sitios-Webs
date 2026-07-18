# Backend de IA del asistente de COELBO (Fase 2 · Gemini gratis)

Este intermediario (**Cloudflare Worker**) es lo que permite que el chatbot
**razone como una IA**: recibe la conversación del navegador, la envía a
**Google Gemini** (capa **gratuita**) con las instrucciones de COELBO y devuelve
la respuesta.

> **Por qué hace falta:** GitHub Pages es estático y **la clave de la API nunca
> puede ir en el navegador**. El navegador habla con este Worker; el Worker
> guarda la clave como secreto y habla con Gemini.

```
Navegador (chatbot.js)  →  Cloudflare Worker (worker.js)  →  API de Gemini (gratis)
        (sin clave)            (guarda la clave secreta)
```

Si el Worker no está configurado o falla (p. ej. se agota la cuota gratuita),
el chatbot **sigue funcionando con el motor de reglas** (respuestas fijas). La
IA es una mejora, no un punto único de fallo.

---

## Qué necesitas (todo gratis, sin tarjeta)

1. Una cuenta de **Google** con una **clave gratuita de Gemini**:
   https://aistudio.google.com/apikey → **Create API key**. No pide tarjeta.
2. Una cuenta de **Cloudflare** (plan gratuito).

> ⚠️ **No pegues la clave en ningún chat ni en el código.** Solo se introduce
> como *secreto* del Worker (paso 3).

> ℹ️ **Límites de la capa gratuita:** Gemini gratis tiene un límite de
> peticiones por minuto/día. Para una web con poco tráfico es más que
> suficiente; si se supera, el chatbot cae al motor de reglas sin romperse.

---

## Opción A — Panel de Cloudflare (sin instalar nada)

1. Entra en https://dash.cloudflare.com → **Workers & Pages** → **Create** →
   **Create Worker**. Ponle un nombre (p. ej. `coelbo-chatbot`) y **Deploy**.
2. **Edit code**: borra el ejemplo y pega el contenido de
   [`worker.js`](./worker.js). **Save and deploy**.
3. **Settings → Variables and Secrets**:
   - Añade un **Secret** llamado `GEMINI_API_KEY` con tu clave de Gemini.
   - Añade una **Variable** (texto) llamada `ALLOWED_ORIGIN` con el origen de tu
     web. Para la copia actual: `https://ikerromero13.github.io`. Para la web
     real de COELBO, su dominio (puedes poner varios separados por comas).
4. Copia la **URL** del Worker (algo como
   `https://coelbo-chatbot.TU-SUBDOMINIO.workers.dev`).

## Opción B — Wrangler (línea de comandos)

```bash
npm install -g wrangler
cd chatbot/backend
wrangler deploy                    # usa wrangler.toml
wrangler secret put GEMINI_API_KEY # pega la clave cuando lo pida
```
Ajusta `ALLOWED_ORIGIN` en `wrangler.toml` con tu dominio.

---

## Conectar el chatbot con la IA

Ya con la URL del Worker, **actívala en el chatbot** de una de estas dos formas:

- **Recomendado (sin tocar código):** añade esta línea en cada página, en el
  `<head>`, **antes** de cargar `chatbot.js`:
  ```html
  <script>window.COELBO_AI_ENDPOINT = 'https://coelbo-chatbot.TU-SUBDOMINIO.workers.dev';</script>
  ```
- **O en el código:** edita `AI_ENDPOINT` al principio de `chatbot/chatbot.js`.

Sin endpoint configurado, el chatbot usa el motor de reglas. Con endpoint, usa
la IA y cae al motor de reglas solo si la IA falla.

---

## Modelo y coste

- El Worker usa **`gemini-2.0-flash`** (rápido y multilingüe). Si tu cuenta no
  lo tuviera disponible, cambia la constante `MODEL` en `worker.js` a
  `gemini-1.5-flash`.
- La capa gratuita de Gemini **no cuesta dinero**; solo tiene límites de uso.
  Las respuestas están limitadas a `MAX_TOKENS = 512` para ir sobrados.

## Seguridad y abuso

- La clave vive como secreto del Worker; el navegador nunca la ve.
- `ALLOWED_ORIGIN` restringe quién puede llamar al Worker (CORS).
- El Worker limita la longitud y el número de mensajes por petición.
- **Recomendado para producción:** añade *Rate limiting* en el panel de
  Cloudflare (Security → WAF → Rate limiting rules) o un *Turnstile* para evitar
  que alguien abuse del endpoint.

---

## Probar

Con el endpoint configurado, abre la demo y pregunta algo abierto
(«tengo un chalet con pozo y quiero presión constante, ¿qué me recomiendas?»):
debería responder de forma natural y adaptada, no con un texto fijo.

```bash
python3 -m http.server 8080
# http://localhost:8080/chatbot/demo.html   (recuerda ALLOWED_ORIGIN con http://localhost:8080)
```
