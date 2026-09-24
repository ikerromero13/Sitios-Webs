/**
 * Widget de chat COELBO conectado a un webhook de n8n.
 * Auto-inicializable: solo hace falta incluir este script + su CSS.
 */
(function () {
  "use strict";

  var WEBHOOK_URL = window.COELBO_N8N_WEBHOOK_URL || "PEGA_AQUI_TU_PRODUCTION_URL";
  var LOGO_URL = "https://www.coelbo.es/img/coelbo_logo.png";
  var CONTACT_EMAIL = "comercial@coelbo.es";
  var CONTACT_PHONE = "+34 93 736 29 50";

  var WELCOME_MSG =
    "Hello! I'm COELBO's virtual assistant. I speak English, català, español, français and italiano — feel free to write in any of them. I can guide you on our three families of electric-pump controllers — PressflowTech, HiTech and SmartTech — and help you choose the best fit. How can I help you?";

  var ERROR_MSG =
    "Lo siento, ha ocurrido un error de conexión. Inténtalo de nuevo en unos segundos o escríbenos a " + CONTACT_EMAIL + ".";

  var TEASER_MSG = "👋 ¿Necesitas ayuda para elegir el controlador adecuado? ¡Puedo orientarte!";

  var LANGS = [
    { code: "es", label: "ES", phrase: "Por favor, continúa la conversación en español a partir de ahora." },
    { code: "ca", label: "CA", phrase: "Si us plau, continua la conversa en català a partir d'ara." },
    { code: "en", label: "EN", phrase: "Please continue this conversation in English from now on." },
    { code: "fr", label: "FR", phrase: "Merci de continuer la conversation en français à partir de maintenant." },
    { code: "it", label: "IT", phrase: "Per favore, continua la conversazione in italiano da adesso." },
  ];

  var QUICK_REPLIES = [
    { label: "🏠 Instalación nueva", text: "Voy a montar una instalación nueva, ¿qué controlador necesito?" },
    { label: "🔧 Tengo una avería", text: "Tengo un problema con mi instalación actual." },
    { label: "🔍 Busco un modelo concreto", text: "Busco información sobre un modelo concreto de vuestro catálogo." },
  ];

  var STORAGE_KEY = "coelbo_chat_session_id";

  function getSessionId() {
    var id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      id =
        window.crypto && crypto.randomUUID
          ? crypto.randomUUID()
          : "sess-" + Date.now() + "-" + Math.random().toString(36).slice(2);
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }
  var SESSION_ID = getSessionId();

  // Icono "mascota" del controlador con cara amigable
  var MASCOT_SVG =
    '<svg viewBox="0 0 40 40" fill="none">' +
    '<g class="coelbo-n8n-fab-body">' +
    '<rect x="7" y="6" width="4" height="5" rx="2" fill="#fff" opacity="0.9"/>' +
    '<rect x="29" y="6" width="4" height="5" rx="2" fill="#fff" opacity="0.9"/>' +
    '<rect x="8" y="10" width="24" height="21" rx="8" fill="#fff"/>' +
    '<circle class="coelbo-n8n-eye" cx="16" cy="20" r="2.4" fill="#0a4d8c"/>' +
    '<circle class="coelbo-n8n-eye" cx="24" cy="20" r="2.4" fill="#0a4d8c"/>' +
    '<path d="M15.5 24.3c1.8 1.7 5.2 1.7 7 0" stroke="#0a4d8c" stroke-width="1.7" stroke-linecap="round"/>' +
    "</g>" +
    "</svg>";

  var ICON_MINUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  var ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><line x1="12" y1="5" x2="12" y2="19"/></svg>';

  function init() {
    if (document.querySelector(".coelbo-n8n-fab")) return;

    var teaser = document.createElement("div");
    teaser.className = "coelbo-n8n-teaser";
    teaser.innerHTML = '<button class="coelbo-n8n-teaser-close" aria-label="Cerrar aviso">✕</button>' + TEASER_MSG;
    document.body.appendChild(teaser);

    var teaserTimer = setTimeout(function () { teaser.classList.add("show"); }, 900);
    var teaserAutoHide = setTimeout(function () { teaser.classList.remove("show"); }, 900 + 5000);
    function hideTeaser() {
      clearTimeout(teaserTimer);
      clearTimeout(teaserAutoHide);
      teaser.classList.remove("show");
    }
    teaser.addEventListener("click", function (e) {
      hideTeaser();
      if (!e.target.classList.contains("coelbo-n8n-teaser-close")) openPanel();
    });

    var fab = document.createElement("button");
    fab.className = "coelbo-n8n-fab";
    fab.setAttribute("aria-label", "Abrir asistente virtual de COELBO");
    fab.innerHTML = MASCOT_SVG;

    var panel = document.createElement("div");
    panel.className = "coelbo-n8n-panel";
    panel.innerHTML =
      '<div class="coelbo-n8n-header">' +
      '<div class="coelbo-n8n-header-top">' +
      '<img class="coelbo-n8n-header-logo" src="' + LOGO_URL + '" alt="COELBO">' +
      '<div class="coelbo-n8n-header-text"><strong>Asistente virtual</strong><span>Controladores para electrobombas</span></div>' +
      '<button class="coelbo-n8n-close" aria-label="Cerrar">✕</button>' +
      "</div>" +
      '<div class="coelbo-n8n-toolbar">' +
      '<div class="coelbo-n8n-langs"></div>' +
      '<div class="coelbo-n8n-textsize">' +
      '<button data-size="down" aria-label="Reducir texto">' + ICON_MINUS + "</button>" +
      '<button data-size="up" aria-label="Aumentar texto">' + ICON_PLUS + "</button>" +
      "</div></div></div>" +
      '<div class="coelbo-n8n-messages fs-md"></div>' +
      '<div class="coelbo-n8n-inputbar">' +
      '<input type="text" placeholder="Escribe tu mensaje..." autocomplete="off">' +
      "<button>Enviar</button></div>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var messagesEl = panel.querySelector(".coelbo-n8n-messages");
    var inputEl = panel.querySelector("input");
    var sendBtn = panel.querySelector(".coelbo-n8n-inputbar button");
    var closeBtn = panel.querySelector(".coelbo-n8n-close");
    var langsEl = panel.querySelector(".coelbo-n8n-langs");
    var sizeBtns = panel.querySelectorAll(".coelbo-n8n-textsize button");

    var fontSizes = ["fs-sm", "fs-md", "fs-lg"];
    var fontIndex = 1;
    var opened = false;

    LANGS.forEach(function (lang) {
      var btn = document.createElement("button");
      btn.textContent = lang.label;
      btn.addEventListener("click", function () {
        langsEl.querySelectorAll("button").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        sendMessage(lang.phrase, true);
      });
      langsEl.appendChild(btn);
    });

    sizeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.dataset.size === "up" && fontIndex < fontSizes.length - 1) fontIndex++;
        if (btn.dataset.size === "down" && fontIndex > 0) fontIndex--;
        messagesEl.className = "coelbo-n8n-messages " + fontSizes[fontIndex];
      });
    });

    function addMessage(text, sender) {
      var div = document.createElement("div");
      div.className = "coelbo-n8n-msg " + sender;
      div.textContent = text;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function addTyping() {
      var div = document.createElement("div");
      div.className = "coelbo-n8n-typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function addQuickReplies() {
      var wrap = document.createElement("div");
      wrap.className = "coelbo-n8n-quickreplies";
      QUICK_REPLIES.forEach(function (qr) {
        var btn = document.createElement("button");
        btn.textContent = qr.label;
        btn.addEventListener("click", function () {
          wrap.remove();
          sendMessage(qr.text, true);
        });
        wrap.appendChild(btn);
      });
      messagesEl.appendChild(wrap);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addHumanButton() {
      var btn = document.createElement("button");
      btn.className = "coelbo-n8n-human";
      btn.textContent = "💬 Hablar con una persona";
      btn.addEventListener("click", function () {
        addMessage(
          "Puedes contactar directamente con nuestro equipo comercial: " + CONTACT_EMAIL + " — " + CONTACT_PHONE,
          "bot"
        );
      });
      messagesEl.appendChild(btn);
    }

    function openPanel() {
      panel.classList.add("open");
      if (!opened) {
        opened = true;
        addMessage(WELCOME_MSG, "bot");
        addQuickReplies();
        addHumanButton();
      }
      inputEl.focus();
    }
    function closePanel() { panel.classList.remove("open"); }

    fab.addEventListener("click", function () {
      hideTeaser();
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

    async function sendMessage(texto, showAsUserBubble) {
      if (showAsUserBubble) addMessage(texto, "user");
      sendBtn.disabled = true;
      var typingEl = addTyping();
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

    async function handleSend() {
      var texto = inputEl.value.trim();
      if (!texto) return;
      inputEl.value = "";
      if (!panel.classList.contains("open")) openPanel();
      await sendMessage(texto, true);
    }

    sendBtn.addEventListener("click", handleSend);
    inputEl.addEventListener("keydown", function (e) { if (e.key === "Enter") handleSend(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
