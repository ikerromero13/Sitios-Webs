/**
 * Widget de chat COELBO conectado a un webhook de n8n.
 * Auto-inicializable: solo hace falta incluir este script + su CSS.
 *
 * Configuración: define window.COELBO_N8N_WEBHOOK_URL ANTES de cargar este
 * script (recomendado), o edita la constante WEBHOOK_URL más abajo.
 *
 * <script>window.COELBO_N8N_WEBHOOK_URL = 'https://tu-instancia.app.n8n.cloud/webhook/xxxx';</script>
 * <script defer src="chatbot-n8n/chatbot-n8n.js"></script>
 */
(function () {
  "use strict";

  var WEBHOOK_URL = window.COELBO_N8N_WEBHOOK_URL || "PEGA_AQUI_TU_PRODUCTION_URL";

  // Genera (o recupera) un identificador único de sesión para esta conversación,
  // necesario para que la memoria del AI Agent en n8n no mezcle usuarios distintos.
  function getSessionId() {
    var key = "coelbo_chat_session_id";
    var id = sessionStorage.getItem(key);
    if (!id) {
      id =
        window.crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : "sess-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      sessionStorage.setItem(key, id);
    }
    return id;
  }
  var SESSION_ID = getSessionId();

  var WELCOME_MSG =
    "Hello! I'm COELBO's virtual assistant. I can guide you on our three families of electric-pump controllers — PressflowTech, HiTech and SmartTech — and help you choose the best fit. How can I help you?";

  var ERROR_MSG =
    "Lo siento, ha ocurrido un error de conexión. Inténtalo de nuevo en unos segundos o escríbenos a comercial@coelbo.es.";

  function init() {
    if (document.querySelector(".coelbo-n8n-fab")) return; // evita doble inicialización

    // Botón flotante
    var fab = document.createElement("button");
    fab.className = "coelbo-n8n-fab";
    fab.setAttribute("aria-label", "Abrir asistente virtual de COELBO");
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    // Panel de chat
    var panel = document.createElement("div");
    panel.className = "coelbo-n8n-panel";
    panel.innerHTML =
      '<div class="coelbo-n8n-header">' +
      "<div><strong>COELBO</strong><span>Asistente virtual</span></div>" +
      '<button class="coelbo-n8n-close" aria-label="Cerrar">✕</button>' +
      "</div>" +
      '<div class="coelbo-n8n-messages"></div>' +
      '<div class="coelbo-n8n-inputbar">' +
      '<input type="text" placeholder="Escribe tu mensaje..." autocomplete="off">' +
      "<button>Enviar</button>" +
      "</div>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var messagesEl = panel.querySelector(".coelbo-n8n-messages");
    var inputEl = panel.querySelector("input");
    var sendBtn = panel.querySelector(".coelbo-n8n-inputbar button");
    var closeBtn = panel.querySelector(".coelbo-n8n-close");

    var welcomed = false;

    function addMessage(text, sender) {
      var div = document.createElement("div");
      div.className = "coelbo-n8n-msg " + sender;
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function openPanel() {
      panel.classList.add("open");
      if (!welcomed) {
        addMessage(WELCOME_MSG, "bot");
        welcomed = true;
      }
      inputEl.focus();
    }

    function closePanel() {
      panel.classList.remove("open");
    }

    fab.addEventListener("click", function () {
      panel.classList.contains("open") ? closePanel() : openPanel();
    });
    closeBtn.addEventListener("click", closePanel);

    async function callWebhook(texto) {
      var res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto, sessionId: SESSION_ID }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      var data = await res.json();
      return data.reply;
    }

    async function handleSend() {
      var texto = inputEl.value.trim();
      if (!texto) return;

      addMessage(texto, "user");
      inputEl.value = "";
      sendBtn.disabled = true;

      var typingEl = addMessage("Escribiendo...", "typing");

      try {
        var reply = await callWebhook(texto);
        typingEl.remove();
        addMessage(reply || ERROR_MSG, "bot");
      } catch (err) {
        typingEl.remove();
        addMessage(ERROR_MSG, "bot");
        console.error("[COELBO chat n8n] Error:", err);
      } finally {
        sendBtn.disabled = false;
        inputEl.focus();
      }
    }

    sendBtn.addEventListener("click", handleSend);
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") handleSend();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
