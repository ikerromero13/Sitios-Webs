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
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/mlgyyrzp";

  var SUPPORTED_LANGS = ["es", "ca", "en", "fr", "it"];
  var DEFAULT_LANG = "en";

  // ---- Contenidos traducidos (mensaje de bienvenida, respuestas rápidas, UI) ----
  var CONTENT = {
    en: {
      label: "EN",
      welcome:
        "Hello! I'm COELBO's virtual assistant (AI-powered). I speak English, español, català, français and italiano — feel free to write in any of them. I can guide you on our three families of electric-pump controllers — PressflowTech, HiTech and SmartTech — and help you choose the best fit. How can I help you?",
      quickReplies: [
        { label: "🏠 New installation", text: "I'm setting up a new installation, which controller do I need?" },
        { label: "🔍 Looking for a specific model", text: "I'm looking for information about a specific model from your catalog." },
      ],
      humanButton: "💬 Talk to a person",
      teaser: "👋 Need help choosing the right controller? I can guide you!",
      errorMsg: "Sorry, a connection error occurred. Please try again in a few seconds or email us at " + CONTACT_EMAIL + ".",
      headerTitle: "Virtual assistant (AI)",
      headerSubtitle: "Electric-pump controllers",
      disclaimer: "This chat is answered by an AI assistant. Responses are informative and not binding.",
      placeholder: "Type your message...",
      sendLabel: "Send",
      form: {
        title: "Contact our team",
        name: "Your name",
        email: "Your email",
        message: "Your message",
        submit: "Send",
        success: "Thanks! We've received your message, our team will get back to you soon.",
        error: "Something went wrong sending your message. Please try again or email us directly.",
      },
    },
    es: {
      label: "ES",
      welcome:
        "¡Hola! Soy el asistente virtual de COELBO (basado en IA). Hablo español, català, English, français e italiano — escribe en el que prefieras. Puedo guiarte sobre nuestras tres familias de controladores para electrobombas — PressflowTech, HiTech y SmartTech — y ayudarte a elegir la mejor opción. ¿En qué puedo ayudarte?",
      quickReplies: [
        { label: "🏠 Instalación nueva", text: "Voy a montar una instalación nueva, ¿qué controlador necesito?" },
        { label: "🔍 Busco un modelo concreto", text: "Busco información sobre un modelo concreto de vuestro catálogo." },
      ],
      humanButton: "💬 Hablar con una persona",
      teaser: "👋 ¿Necesitas ayuda para elegir el controlador adecuado? ¡Puedo orientarte!",
      errorMsg: "Lo siento, ha ocurrido un error de conexión. Inténtalo de nuevo en unos segundos o escríbenos a " + CONTACT_EMAIL + ".",
      headerTitle: "Asistente virtual (IA)",
      headerSubtitle: "Controladores para electrobombas",
      disclaimer: "Este chat es atendido por un asistente de IA. Las respuestas son informativas y no vinculantes.",
      placeholder: "Escribe tu mensaje...",
      sendLabel: "Enviar",
      form: {
        title: "Contacta con nuestro equipo",
        name: "Tu nombre",
        email: "Tu email",
        message: "Tu mensaje",
        submit: "Enviar",
        success: "¡Gracias! Hemos recibido tu mensaje, nuestro equipo te responderá pronto.",
        error: "Ha habido un problema al enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente.",
      },
    },
    ca: {
      label: "CA",
      welcome:
        "Hola! Sóc l'assistent virtual de COELBO (basat en IA). Parlo català, español, English, français i italiano — escriu en el que prefereixis. Et puc guiar sobre les nostres tres famílies de controladors per a electrobombes — PressflowTech, HiTech i SmartTech — i ajudar-te a triar la millor opció. En què et puc ajudar?",
      quickReplies: [
        { label: "🏠 Instal·lació nova", text: "Vull muntar una instal·lació nova, quin controlador necessito?" },
        { label: "🔍 Busco un model concret", text: "Busco informació sobre un model concret del vostre catàleg." },
      ],
      humanButton: "💬 Parlar amb una persona",
      teaser: "👋 Necessites ajuda per triar el controlador adequat? Et puc orientar!",
      errorMsg: "Ho sentim, hi ha hagut un error de connexió. Torna-ho a provar en uns segons o escriu-nos a " + CONTACT_EMAIL + ".",
      headerTitle: "Assistent virtual (IA)",
      headerSubtitle: "Controladors per a electrobombes",
      disclaimer: "Aquest xat l'atén un assistent d'IA. Les respostes són informatives i no vinculants.",
      placeholder: "Escriu el teu missatge...",
      sendLabel: "Enviar",
      form: {
        title: "Contacta amb el nostre equip",
        name: "El teu nom",
        email: "El teu email",
        message: "El teu missatge",
        submit: "Enviar",
        success: "Gràcies! Hem rebut el teu missatge, el nostre equip et respondrà aviat.",
        error: "Hi ha hagut un problema en enviar el missatge. Torna-ho a provar o escriu-nos directament.",
      },
    },
    fr: {
      label: "FR",
      welcome:
        "Bonjour ! Je suis l'assistant virtuel de COELBO (basé sur l'IA). Je parle français, español, English, català et italiano — écrivez dans la langue de votre choix. Je peux vous guider parmi nos trois familles de régulateurs pour électropompes — PressflowTech, HiTech et SmartTech — et vous aider à choisir la meilleure option. Comment puis-je vous aider ?",
      quickReplies: [
        { label: "🏠 Nouvelle installation", text: "Je vais installer une nouvelle installation, de quel régulateur ai-je besoin ?" },
        { label: "🔍 Je cherche un modèle précis", text: "Je cherche des informations sur un modèle précis de votre catalogue." },
      ],
      humanButton: "💬 Parler à une personne",
      teaser: "👋 Besoin d'aide pour choisir le bon régulateur ? Je peux vous guider !",
      errorMsg: "Désolé, une erreur de connexion s'est produite. Réessayez dans quelques secondes ou écrivez-nous à " + CONTACT_EMAIL + ".",
      headerTitle: "Assistant virtuel (IA)",
      headerSubtitle: "Régulateurs pour électropompes",
      disclaimer: "Ce chat est pris en charge par un assistant IA. Les réponses sont informatives et non contractuelles.",
      placeholder: "Écrivez votre message...",
      sendLabel: "Envoyer",
      form: {
        title: "Contactez notre équipe",
        name: "Votre nom",
        email: "Votre email",
        message: "Votre message",
        submit: "Envoyer",
        success: "Merci ! Nous avons reçu votre message, notre équipe vous répondra bientôt.",
        error: "Un problème est survenu lors de l'envoi. Réessayez ou écrivez-nous directement.",
      },
    },
    it: {
      label: "IT",
      welcome:
        "Ciao! Sono l'assistente virtuale di COELBO (basato su IA). Parlo italiano, español, English, català e français — scrivi nella lingua che preferisci. Posso guidarti tra le nostre tre famiglie di regolatori per elettropompe — PressflowTech, HiTech e SmartTech — e aiutarti a scegliere la soluzione migliore. Come posso aiutarti?",
      quickReplies: [
        { label: "🏠 Nuova installazione", text: "Sto montando un nuovo impianto, quale regolatore mi serve?" },
        { label: "🔍 Cerco un modello specifico", text: "Cerco informazioni su un modello specifico del vostro catalogo." },
      ],
      humanButton: "💬 Parla con una persona",
      teaser: "👋 Hai bisogno di aiuto per scegliere il regolatore giusto? Posso guidarti!",
      errorMsg: "Siamo spiacenti, si è verificato un errore di connessione. Riprova tra qualche secondo o scrivici a " + CONTACT_EMAIL + ".",
      headerTitle: "Assistente virtuale (IA)",
      headerSubtitle: "Regolatori per elettropompe",
      disclaimer: "Questa chat è gestita da un assistente IA. Le risposte sono informative e non vincolanti.",
      placeholder: "Scrivi il tuo messaggio...",
      sendLabel: "Invia",
      form: {
        title: "Contatta il nostro team",
        name: "Il tuo nome",
        email: "La tua email",
        message: "Il tuo messaggio",
        submit: "Invia",
        success: "Grazie! Abbiamo ricevuto il tuo messaggio, il nostro team ti risponderà presto.",
        error: "Si è verificato un problema nell'invio. Riprova o scrivici direttamente.",
      },
    },
  };


  // ---- Asistente guiado (árbol de recomendación): preguntas con botones, sin IA ----
  // Las respuestas se componen en UNA frase que se envía al bot cuando termina el árbol.
  var WIZARD = {
    es: {
      q: { pumps: "¿Cuántas bombas va a tener la instalación?", phase: "¿La bomba es monofásica o trifásica?", supply: "¿Qué alimentación tienes disponible para el controlador?", control: "¿Qué tipo de control necesitas?" },
      o: { one: "Una", two: "Dos", many: "Más de dos", mono: "Monofásica", tri: "Trifásica", vfd: "Presión constante con variador de frecuencia", mech: "Presión constante regulada mecánicamente", onoff: "Solo arrancar y parar la bomba al abrir y cerrar grifos", unk: "No lo sé" },
      m: { start: "Voy a montar una instalación nueva.", one: "Es una sola bomba.", two: "Son dos bombas.", many: "Son más de dos bombas.", mono: "La bomba es monofásica.", tri: "La bomba es trifásica.", supMono: "Tengo alimentación monofásica disponible para el controlador.", supTri: "Tengo alimentación trifásica disponible para el controlador.", vfd: "Necesito presión constante con variador de frecuencia.", mech: "Necesito presión constante regulada mecánicamente.", onoff: "Solo necesito que la bomba arranque y pare al abrir y cerrar los grifos.", unkPumps: "No sé cuántas bombas habrá.", unkPhase: "No sé si la bomba es monofásica o trifásica.", unkSupply: "No sé qué alimentación tengo disponible.", unkControl: "No sé qué tipo de control necesito." }
    },
    ca: {
      q: { pumps: "Quantes bombes tindrà la instal·lació?", phase: "La bomba és monofàsica o trifàsica?", supply: "Quina alimentació tens disponible per al controlador?", control: "Quin tipus de control necessites?" },
      o: { one: "Una", two: "Dues", many: "Més de dues", mono: "Monofàsica", tri: "Trifàsica", vfd: "Pressió constant amb variador de freqüència", mech: "Pressió constant regulada mecànicament", onoff: "Només arrencar i parar la bomba en obrir i tancar les aixetes", unk: "No ho sé" },
      m: { start: "Vull muntar una instal·lació nova.", one: "És només una bomba.", two: "Són dues bombes.", many: "Són més de dues bombes.", mono: "La bomba és monofàsica.", tri: "La bomba és trifàsica.", supMono: "Tinc alimentació monofàsica disponible per al controlador.", supTri: "Tinc alimentació trifàsica disponible per al controlador.", vfd: "Necessito pressió constant amb variador de freqüència.", mech: "Necessito pressió constant regulada mecànicament.", onoff: "Només necessito que la bomba arrenqui i pari en obrir i tancar les aixetes.", unkPumps: "No sé quantes bombes hi haurà.", unkPhase: "No sé si la bomba és monofàsica o trifàsica.", unkSupply: "No sé quina alimentació tinc disponible.", unkControl: "No sé quin tipus de control necessito." }
    },
    en: {
      q: { pumps: "How many pumps will the installation have?", phase: "Is the pump single-phase or three-phase?", supply: "What power supply do you have available for the controller?", control: "What type of control do you need?" },
      o: { one: "One", two: "Two", many: "More than two", mono: "Single-phase", tri: "Three-phase", vfd: "Constant pressure with a frequency inverter", mech: "Constant pressure, mechanically regulated", onoff: "Just start and stop the pump when taps open and close", unk: "I don't know" },
      m: { start: "I'm setting up a new installation.", one: "It is a single pump.", two: "There are two pumps.", many: "There are more than two pumps.", mono: "The pump is single-phase.", tri: "The pump is three-phase.", supMono: "I have single-phase power available for the controller.", supTri: "I have three-phase power available for the controller.", vfd: "I need constant pressure with a frequency inverter.", mech: "I need constant pressure, mechanically regulated.", onoff: "I only need the pump to start and stop when taps are opened and closed.", unkPumps: "I don't know how many pumps there will be.", unkPhase: "I don't know whether the pump is single-phase or three-phase.", unkSupply: "I don't know which power supply is available.", unkControl: "I don't know what type of control I need." }
    },
    fr: {
      q: { pumps: "Combien de pompes comportera l'installation ?", phase: "La pompe est-elle monophasée ou triphasée ?", supply: "Quelle alimentation avez-vous de disponible pour le régulateur ?", control: "De quel type de régulation avez-vous besoin ?" },
      o: { one: "Une", two: "Deux", many: "Plus de deux", mono: "Monophasée", tri: "Triphasée", vfd: "Pression constante avec variateur de fréquence", mech: "Pression constante régulée mécaniquement", onoff: "Seulement démarrer et arrêter la pompe à l'ouverture et à la fermeture des robinets", unk: "Je ne sais pas" },
      m: { start: "Je vais monter une nouvelle installation.", one: "Il n'y a qu'une seule pompe.", two: "Il y a deux pompes.", many: "Il y a plus de deux pompes.", mono: "La pompe est monophasée.", tri: "La pompe est triphasée.", supMono: "J'ai une alimentation monophasée disponible pour le régulateur.", supTri: "J'ai une alimentation triphasée disponible pour le régulateur.", vfd: "J'ai besoin d'une pression constante avec variateur de fréquence.", mech: "J'ai besoin d'une pression constante régulée mécaniquement.", onoff: "J'ai seulement besoin que la pompe démarre et s'arrête à l'ouverture et à la fermeture des robinets.", unkPumps: "Je ne sais pas combien de pompes il y aura.", unkPhase: "Je ne sais pas si la pompe est monophasée ou triphasée.", unkSupply: "Je ne sais pas quelle alimentation est disponible.", unkControl: "Je ne sais pas de quel type de régulation j'ai besoin." }
    },
    it: {
      q: { pumps: "Quante pompe avrà l'impianto?", phase: "La pompa è monofase o trifase?", supply: "Quale alimentazione hai a disposizione per il regolatore?", control: "Che tipo di controllo ti serve?" },
      o: { one: "Una", two: "Due", many: "Più di due", mono: "Monofase", tri: "Trifase", vfd: "Pressione costante con inverter (variatore di frequenza)", mech: "Pressione costante regolata meccanicamente", onoff: "Solo avviare e fermare la pompa all'apertura e alla chiusura dei rubinetti", unk: "Non lo so" },
      m: { start: "Sto montando un nuovo impianto.", one: "È una sola pompa.", two: "Sono due pompe.", many: "Sono più di due pompe.", mono: "La pompa è monofase.", tri: "La pompa è trifase.", supMono: "Ho a disposizione un'alimentazione monofase per il regolatore.", supTri: "Ho a disposizione un'alimentazione trifase per il regolatore.", vfd: "Mi serve pressione costante con inverter (variatore di frequenza).", mech: "Mi serve pressione costante regolata meccanicamente.", onoff: "Mi serve solo che la pompa si avvii e si fermi all'apertura e alla chiusura dei rubinetti.", unkPumps: "Non so quante pompe ci saranno.", unkPhase: "Non so se la pompa è monofase o trifase.", unkSupply: "Non so quale alimentazione ho a disposizione.", unkControl: "Non so che tipo di controllo mi serve." }
    }
  };

  // Detecta el idioma preferido del navegador y lo mapea a uno soportado.
  // Si no hay ninguno soportado, usa inglés por defecto.
  function detectBrowserLang() {
    var candidates = [];
    if (navigator.languages && navigator.languages.length) {
      candidates = candidates.concat(navigator.languages);
    }
    if (navigator.language) candidates.push(navigator.language);
    for (var i = 0; i < candidates.length; i++) {
      var code = (candidates[i] || "").toLowerCase().slice(0, 2);
      if (SUPPORTED_LANGS.indexOf(code) !== -1) return code;
    }
    return DEFAULT_LANG;
  }

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

    // Idioma activo: se detecta del navegador al cargar; solo cambia si el
    // usuario pulsa explícitamente un botón de idioma.
    var currentLang = detectBrowserLang();

    var teaser = document.createElement("div");
    teaser.className = "coelbo-n8n-teaser";
    teaser.innerHTML = '<button class="coelbo-n8n-teaser-close" aria-label="Cerrar aviso">✕</button><span class="coelbo-n8n-teaser-text"></span>';
    document.body.appendChild(teaser);
    var teaserTextEl = teaser.querySelector(".coelbo-n8n-teaser-text");
    teaserTextEl.textContent = CONTENT[currentLang].teaser;

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
      '<div class="coelbo-n8n-header-text"><strong class="coelbo-n8n-header-title"></strong><span class="coelbo-n8n-header-subtitle"></span></div>' +
      '<button class="coelbo-n8n-close" aria-label="Cerrar">✕</button>' +
      "</div>" +
      '<div class="coelbo-n8n-toolbar">' +
      '<div class="coelbo-n8n-langs"></div>' +
      '<div class="coelbo-n8n-textsize">' +
      '<button data-size="down" aria-label="Reducir texto">' + ICON_MINUS + "</button>" +
      '<button data-size="up" aria-label="Aumentar texto">' + ICON_PLUS + "</button>" +
      "</div></div></div>" +
      '<div class="coelbo-n8n-messages fs-md"></div>' +
      '<div class="coelbo-n8n-footer">' +
      '<div class="coelbo-n8n-inputbar">' +
      '<input type="text" autocomplete="off">' +
      "<button></button></div>" +
      '<div class="coelbo-n8n-disclaimer"></div>' +
      "</div>";

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    var messagesEl = panel.querySelector(".coelbo-n8n-messages");
    var inputEl = panel.querySelector("input");
    var sendBtn = panel.querySelector(".coelbo-n8n-inputbar button");
    var closeBtn = panel.querySelector(".coelbo-n8n-close");
    var langsEl = panel.querySelector(".coelbo-n8n-langs");
    var sizeBtns = panel.querySelectorAll(".coelbo-n8n-textsize button");
    var headerTitleEl = panel.querySelector(".coelbo-n8n-header-title");
    var headerSubtitleEl = panel.querySelector(".coelbo-n8n-header-subtitle");
    var disclaimerEl = panel.querySelector(".coelbo-n8n-disclaimer");

    var fontSizes = ["fs-sm", "fs-md", "fs-lg"];
    var fontIndex = 1;
    var opened = false;

    // Referencias a los elementos "vivos" del primer turno (mensaje de
    // bienvenida, respuestas rápidas y botón humano) para poder
    // re-renderizarlos en el nuevo idioma si el usuario cambia de idioma
    // antes de haber escrito nada más.
    var welcomeEl = null;
    var quickRepliesEl = null;
    var humanBtnEl = null;

    var langBtns = {};
    SUPPORTED_LANGS.forEach(function (code) {
      var btn = document.createElement("button");
      btn.textContent = CONTENT[code].label;
      btn.addEventListener("click", function () {
        setLanguage(code);
      });
      langsEl.appendChild(btn);
      langBtns[code] = btn;
    });

    function applyStaticTexts() {
      var t = CONTENT[currentLang];
      headerTitleEl.textContent = t.headerTitle;
      headerSubtitleEl.textContent = t.headerSubtitle;
      disclaimerEl.textContent = t.disclaimer;
      inputEl.placeholder = t.placeholder;
      sendBtn.textContent = t.sendLabel;
      SUPPORTED_LANGS.forEach(function (code) {
        langBtns[code].classList.toggle("active", code === currentLang);
      });
    }

    function setLanguage(code) {
      if (SUPPORTED_LANGS.indexOf(code) === -1) return;
      currentLang = code;
      applyStaticTexts();
      // Si el primer turno (bienvenida + respuestas rápidas) sigue visible
      // tal cual, se re-renderiza directamente en el nuevo idioma.
      if (welcomeEl) welcomeEl.textContent = CONTENT[currentLang].welcome;
      if (quickRepliesEl) renderQuickReplies(quickRepliesEl);
      if (humanBtnEl) humanBtnEl.textContent = CONTENT[currentLang].humanButton;
      if (wizard) renderWizardStep();
      // La conversación sigue a partir de ahora en el idioma elegido; no se
      // envía ningún mensaje oculto al agente.
    }

    applyStaticTexts();

    sizeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.dataset.size === "up" && fontIndex < fontSizes.length - 1) fontIndex++;
        if (btn.dataset.size === "down" && fontIndex > 0) fontIndex--;
        messagesEl.className = "coelbo-n8n-messages " + fontSizes[fontIndex];
      });
    });

    function addMessage(text, sender, noRating) {
      var div = document.createElement("div");
      div.className = "coelbo-n8n-msg " + sender;
      div.textContent = text;
      messagesEl.appendChild(div);
      if (sender === "bot" && !noRating) addRating(text);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    // Valoración (👍/👎) para una respuesta del bot
    function addRating(botText) {
      var wrap = document.createElement("div");
      wrap.className = "coelbo-n8n-rating";
      var up = document.createElement("button");
      up.textContent = "👍";
      up.setAttribute("aria-label", "Respuesta útil");
      var down = document.createElement("button");
      down.textContent = "👎";
      down.setAttribute("aria-label", "Respuesta no útil");

      function rate(value, btn) {
        if (wrap.dataset.rated) return; // ya votado, no permitir doble voto
        wrap.dataset.rated = value;
        btn.classList.add("picked");
        [up, down].forEach(function (b) { b.disabled = true; });
        // Manda la valoración al mismo webhook, marcada como feedback (no como mensaje de chat)
        fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "feedback",
            rating: value,
            botMessage: botText,
            sessionId: SESSION_ID,
          }),
        }).catch(function (e) { console.error("[COELBO chat n8n] Error enviando valoración:", e); });
      }

      up.addEventListener("click", function () { rate("up", up); });
      down.addEventListener("click", function () { rate("down", down); });
      wrap.appendChild(up);
      wrap.appendChild(down);
      messagesEl.appendChild(wrap);
    }

    function addTyping() {
      var div = document.createElement("div");
      div.className = "coelbo-n8n-typing";
      div.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }


    // --- Asistente guiado del árbol de recomendación ---
    // Estado: { answers: {pumps, phase, supply, control}, step, qEl, btnsEl }
    var wizard = null;

    function wizardOptionKeys() {
      var a = wizard.answers;
      if (wizard.step === "pumps") return ["one", "two", "many", "unk"];
      if (wizard.step === "phase") return ["mono", "tri", "unk"];
      if (wizard.step === "supply") return ["mono", "tri", "unk"];
      // control: con alimentación trifásica no hay opción de regulación mecánica
      if (a.supply === "tri") return ["vfd", "onoff", "unk"];
      return ["vfd", "mech", "onoff", "unk"];
    }

    // Frase en el idioma actual con todas las respuestas dadas hasta ahora
    function wizardSummary() {
      var M = WIZARD[currentLang].m;
      var a = wizard.answers;
      var parts = [M.start];
      if (a.pumps) parts.push(a.pumps === "unk" ? M.unkPumps : M[a.pumps]);
      if (a.phase) parts.push(a.phase === "unk" ? M.unkPhase : M[a.phase]);
      if (a.supply) parts.push(a.supply === "unk" ? M.unkSupply : a.supply === "mono" ? M.supMono : M.supTri);
      if (a.control) parts.push(a.control === "unk" ? M.unkControl : M[a.control]);
      return parts.join(" ");
    }

    function wizardAsk(step) {
      wizard.step = step;
      wizard.qEl = addMessage("", "bot", true);
      wizard.btnsEl = document.createElement("div");
      wizard.btnsEl.className = "coelbo-n8n-quickreplies";
      messagesEl.appendChild(wizard.btnsEl);
      renderWizardStep();
    }

    function renderWizardStep() {
      if (!wizard) return;
      var W = WIZARD[currentLang];
      wizard.qEl.textContent = W.q[wizard.step];
      wizard.btnsEl.innerHTML = "";
      wizardOptionKeys().forEach(function (key) {
        var btn = document.createElement("button");
        btn.textContent = W.o[key];
        btn.addEventListener("click", function () { wizardChoose(key); });
        wizard.btnsEl.appendChild(btn);
      });
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function wizardFinish() {
      var text = wizardSummary();
      wizard = null;
      sendMessage(text, false);
    }

    function wizardChoose(key) {
      var step = wizard.step;
      addMessage(WIZARD[currentLang].o[key], "user");
      wizard.btnsEl.remove();
      wizard.answers[step] = key;
      if (key === "unk") return wizardFinish(); // el bot sigue la conversación
      if (step === "pumps") return key === "many" ? wizardFinish() : wizardAsk(key === "one" ? "phase" : "control");
      if (step === "phase") return wizardAsk(key === "mono" ? "control" : "supply");
      if (step === "supply") return key === "mono" ? wizardFinish() : wizardAsk("control");
      wizardFinish(); // control
    }

    function startWizard() {
      wizard = { answers: {}, step: "pumps", qEl: null, btnsEl: null };
      wizardAsk("pumps");
    }

    // Si el usuario escribe a mano, se cierra el asistente y se envían las
    // respuestas dadas hasta ese momento junto con su texto.
    function wizardAbort(typed) {
      if (!wizard) return typed;
      var prefix = Object.keys(wizard.answers).length ? wizardSummary() + " " : "";
      wizard.btnsEl.remove();
      wizard = null;
      return prefix + typed;
    }

    function renderQuickReplies(wrap) {
      wrap.innerHTML = "";
      CONTENT[currentLang].quickReplies.forEach(function (qr, idx) {
        var btn = document.createElement("button");
        btn.textContent = qr.label;
        btn.addEventListener("click", function () {
          wrap.remove();
          if (quickRepliesEl === wrap) quickRepliesEl = null;
          if (idx === 0) {
            // "Instalación nueva": árbol guiado con botones (sin IA hasta la recomendación)
            addMessage(qr.text, "user");
            startWizard();
          } else {
            sendMessage(qr.text, true);
          }
        });
        wrap.appendChild(btn);
      });
    }

    function addQuickReplies() {
      var wrap = document.createElement("div");
      wrap.className = "coelbo-n8n-quickreplies";
      renderQuickReplies(wrap);
      messagesEl.appendChild(wrap);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      quickRepliesEl = wrap;
    }

    // --- Mini-formulario de contacto (envía al mismo Formspree que la web) ---
    function addContactForm() {
      var t = CONTENT[currentLang].form;
      var wrap = document.createElement("div");
      wrap.className = "coelbo-n8n-contactform";
      wrap.innerHTML =
        '<div class="coelbo-n8n-contactform-title"></div>' +
        '<input type="text" class="cf-name" autocomplete="name">' +
        '<input type="email" class="cf-email" autocomplete="email">' +
        '<textarea class="cf-message" rows="3"></textarea>' +
        '<button type="button" class="cf-submit"></button>';
      wrap.querySelector(".coelbo-n8n-contactform-title").textContent = t.title;
      wrap.querySelector(".cf-name").placeholder = t.name;
      wrap.querySelector(".cf-email").placeholder = t.email;
      wrap.querySelector(".cf-message").placeholder = t.message;
      var submitBtn = wrap.querySelector(".cf-submit");
      submitBtn.textContent = t.submit;

      submitBtn.addEventListener("click", function () {
        var nameVal = wrap.querySelector(".cf-name").value.trim();
        var emailVal = wrap.querySelector(".cf-email").value.trim();
        var msgVal = wrap.querySelector(".cf-message").value.trim();
        if (!emailVal || !msgVal) return;
        submitBtn.disabled = true;
        fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            message: msgVal,
            _subject: "Nuevo contacto desde el chatbot COELBO",
            source: "chatbot-widget",
            sessionId: SESSION_ID,
          }),
        })
          .then(function (res) {
            wrap.remove();
            addMessage(res.ok ? CONTENT[currentLang].form.success : CONTENT[currentLang].form.error, "bot", true);
          })
          .catch(function () {
            wrap.remove();
            addMessage(CONTENT[currentLang].form.error, "bot", true);
          });
      });

      messagesEl.appendChild(wrap);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addHumanButton() {
      var btn = document.createElement("button");
      btn.className = "coelbo-n8n-human";
      btn.textContent = CONTENT[currentLang].humanButton;
      btn.addEventListener("click", function () {
        btn.remove();
        if (humanBtnEl === btn) humanBtnEl = null;
        addContactForm();
      });
      messagesEl.appendChild(btn);
      humanBtnEl = btn;
    }

    function openPanel() {
      panel.classList.add("open");
      if (!opened) {
        opened = true;
        welcomeEl = addMessage(CONTENT[currentLang].welcome, "bot", true);
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

    // Lee la respuesta del webhook. Admite dos formatos:
    //  - streaming de n8n: líneas JSON {"type":"item","content":"..."} que llegan por trozos
    //  - JSON clásico: {"reply":"..."}
    // onChunk(textoAcumulado) se llama cada vez que llega texto nuevo.
    async function callWebhook(texto, onChunk) {
      var res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: texto, sessionId: SESSION_ID }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);

      var full = "";
      function push(t) { full = t; if (onChunk) onChunk(full); }

      if (!res.body || !res.body.getReader) {
        var data = await res.json();
        if (data && typeof data.reply === "string") push(data.reply);
        return full;
      }

      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buf = "";
      var raw = "";
      function handleLine(line) {
        line = line.trim();
        if (!line) return;
        var o;
        try { o = JSON.parse(line); } catch (e) { return; }
        if (o && o.type === "item" && typeof o.content === "string") push(full + o.content);
        else if (o && typeof o.reply === "string") push(o.reply);
      }
      while (true) {
        var chunk = await reader.read();
        if (chunk.done) break;
        var piece = decoder.decode(chunk.value, { stream: true });
        raw += piece;
        buf += piece;
        var nl;
        while ((nl = buf.indexOf("\n")) >= 0) {
          handleLine(buf.slice(0, nl));
          buf = buf.slice(nl + 1);
        }
      }
      handleLine(buf);
      if (!full && raw) {
        try { var d2 = JSON.parse(raw); if (d2 && typeof d2.reply === "string") push(d2.reply); } catch (e) {}
      }
      return full;
    }

    async function sendMessage(texto, showAsUserBubble) {
      if (showAsUserBubble) addMessage(texto, "user");
      sendBtn.disabled = true;
      var typingEl = addTyping();
      var botEl = null;
      try {
        var reply = await callWebhook(texto, function (partial) {
          if (!botEl) {
            typingEl.remove();
            botEl = addMessage("", "bot", true);
          }
          botEl.textContent = partial;
          messagesEl.scrollTop = messagesEl.scrollHeight;
        });
        if (botEl) {
          addRating(reply);
        } else {
          typingEl.remove();
          addMessage(reply || CONTENT[currentLang].errorMsg, "bot");
        }
      } catch (err) {
        typingEl.remove();
        if (!botEl) addMessage(CONTENT[currentLang].errorMsg, "bot");
        else if (botEl.textContent) addRating(botEl.textContent);
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
      var toSend = wizardAbort(texto);
      addMessage(texto, "user");
      await sendMessage(toSend, false);
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
