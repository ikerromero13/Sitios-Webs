/* =========================================================
   COELBO — Assistent virtual (Fase 1)
   Chatbot autònom, sense dependències ni backend.

   Motor basat en regles + base de coneixement multilingüe
   (ca, es, en, fr, it). Pensat per orientar sobre les tres
   famílies de producte (PressflowTech, HiTech, SmartTech) i
   derivar a l'equip tècnic tot el que queda fora de la Fase 1.

   Ús: incloure chatbot.css i aquest fitxer; el widget s'auto-inicialitza.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Dades de contacte (úniques, reutilitzades) ---------- */
  var EMAIL = 'coelbo@coelbo.es';
  var PHONE = '(+34) 93 736 29 50';
  var SUPPORTED = ['ca', 'es', 'en', 'fr', 'it'];
  /* Logo oficial de COELBO (se muestra en la cabecera del widget, como en la web) */
  var LOGO = 'https://www.coelbo.es/img/coelbo_logo.png';

  /* Enlace al formulario de contacto (relativo a la página donde se incrusta) */
  var CONTACT_URL = 'contacto.html';
  /* Texto del botón "ir al formulario" por idioma */
  var CTA = {
    ca: 'Anar al formulari de contacte',
    es: 'Ir al formulario de contacto',
    en: 'Go to the contact form',
    fr: 'Aller au formulaire de contact',
    it: 'Vai al modulo di contatto'
  };
  /* Intenciones que el asistente NO resuelve (deriva): ofrecen el botón de contacto */
  var DERIVE_INTENTS = ['price', 'config', 'error', 'compat', 'warranty', 'stock', 'fallback'];

  /* Intenciones cuya respuesta remite a un sitio concreto de la web (catálogo /
     página de familia / información técnica): se añade un enlace directo. */
  var PAGE_FOR_INTENT = {
    pressflow: 'pressflowtech',
    hitech: 'hitech',
    smarttech: 'smarttech',
    docs: 'manuales_de_instrucciones'
  };
  /* Texto del enlace "ver la información completa" por idioma */
  var LABEL_INFO = {
    ca: 'Veure la informació completa',
    es: 'Ver la información completa',
    en: 'See the full information',
    fr: 'Voir l\'information complète',
    it: 'Vedi le informazioni complete'
  };

  /* Aviso, en el mensaje de bienvenida, de que se puede cambiar de idioma */
  var LANG_HINT = {
    ca: 'Pot canviar l\'idioma amb el selector de dalt a la dreta.',
    es: 'Puede cambiar el idioma con el selector de arriba a la derecha.',
    en: 'You can change the language with the selector at the top right.',
    fr: 'Vous pouvez changer de langue avec le sélecteur en haut à droite.',
    it: 'Può cambiare lingua con il selettore in alto a destra.'
  };

  /* Botón de descarga del catálogo (PDF) por idioma */
  var LABEL_PDF = {
    ca: 'Descarregar catàleg (PDF)', es: 'Descargar catálogo (PDF)',
    en: 'Download catalogue (PDF)', fr: 'Télécharger le catalogue (PDF)',
    it: 'Scarica il catalogo (PDF)'
  };
  /* Frase que invita a usar el formulario (antes del botón de contacto) */
  var FORM_HINT = {
    ca: 'També pot fer servir el formulari de contacte:',
    es: 'También puede usar el formulario de contacto:',
    en: 'You can also use the contact form:',
    fr: 'Vous pouvez aussi utiliser le formulaire de contact :',
    it: 'Può anche usare il modulo di contatto:'
  };
  /* Etiquetes accessibles dels botons de mida de text */
  var TS_DEC = { ca: 'Reduir el text', es: 'Reducir el texto', en: 'Decrease text size', fr: 'Réduire le texte', it: 'Riduci il testo' };
  var TS_INC = { ca: 'Ampliar el text', es: 'Ampliar el texto', en: 'Increase text size', fr: 'Agrandir le texte', it: 'Ingrandisci il testo' };
  /* Aviso proactivo (globus que apareix sol als pocs segons) */
  var TEASER = {
    ca: 'Necessita ajuda? Pregunti\'m!', es: '¿Necesita ayuda? ¡Pregúnteme!',
    en: 'Need help? Ask me!', fr: 'Besoin d\'aide ? Demandez-moi !',
    it: 'Ha bisogno di aiuto? Mi chieda!'
  };
  /* Familias: clave -> nombre visible */
  var FAMILY_NAMES = { pressflow: 'PressflowTech', hitech: 'HiTech', smarttech: 'SmartTech' };
  /* Catálogos PDF por familia (públicos solo en español) */
  var PDF_BASE = 'https://www.coelbo.es/pdf/';
  var PDF_FOR = {
    pressflow: 'coelbo_g_pressflowtech_es.pdf',
    hitech: 'coelbo_g_hitech_es.pdf',
    smarttech: 'coelbo_g_smarttech_es.pdf'
  };
  /* Modelos concretos -> familia, nombre y (opcional) catálogo propio */
  var MODELS = {
    switchmatic: { f: 'smarttech', n: 'Switchmatic', pdf: 'switchmatic_es.pdf' },
    panelmatic: { f: 'smarttech', n: 'Panelmatic' },
    speedmatic: { f: 'hitech', n: 'Speedmatic' },
    speedbox: { f: 'hitech', n: 'Speedbox' },
    speedboard: { f: 'hitech', n: 'Speed-board' },
    'speed-board': { f: 'hitech', n: 'Speed-board' },
    optimatic: { f: 'pressflow', n: 'Optimatic' },
    digiplus: { f: 'pressflow', n: 'Digiplus' },
    digimatic: { f: 'pressflow', n: 'Digimatic' },
    onematic: { f: 'pressflow', n: 'Onematic' },
    presscontrol: { f: 'pressflow', n: 'Presscontrol' },
    presscomfort: { f: 'pressflow', n: 'Presscomfort' },
    dpr: { f: 'pressflow', n: 'DPR', pdf: 'dpr_epr_es.pdf' },
    epr: { f: 'pressflow', n: 'EPR', pdf: 'dpr_epr_es.pdf' }
  };
  /* Frase "el modelo X pertenece a la familia Y" por idioma */
  var MODEL_INTRO = {
    ca: function (n, f) { return n + ' pertany a la família ' + f + '. '; },
    es: function (n, f) { return 'El ' + n + ' pertenece a la familia ' + f + '. '; },
    en: function (n, f) { return 'The ' + n + ' belongs to the ' + f + ' family. '; },
    fr: function (n, f) { return 'Le ' + n + ' appartient à la famille ' + f + '. '; },
    it: function (n, f) { return 'Il ' + n + ' appartiene alla famiglia ' + f + '. '; }
  };
  /* Frases de "amplíame / y eso" para preguntas de seguimiento */
  var MORE_KW = ['mas info', 'mes info', 'more info', 'more information', 'plus d info',
    'piu info', 'piu informazioni', 'tell me more', 'en savoir plus', 'dime mas',
    'explica mes', 'continua', 'y eso', 'y ese', 'y esa', 'y de eso', 'sobre eso',
    'mas detalles', 'mes detalls', 'more details'];
  /* Familia asociada a cada intención (para recordar el contexto) */
  var FAMILY_OF_INTENT = {
    pressflow: 'pressflow', hitech: 'hitech', smarttech: 'smarttech',
    recHouse: 'pressflow', recConstant: 'hitech', recIndustrial: 'hitech', recDrainage: 'smarttech'
  };
  /* Términos importantes para tolerar erratas (distancia de edición <= 1) */
  var IMPORTANT_TERMS = ['pressflowtech', 'hitech', 'smarttech', 'switchmatic', 'panelmatic',
    'speedmatic', 'speedbox', 'optimatic', 'digiplus', 'digimatic', 'onematic', 'presscontrol',
    'presscomfort', 'inverter', 'variador', 'presostato', 'pressostato', 'catalogo', 'manual',
    'garantia', 'precio', 'configuracion', 'contacto', 'drenaje', 'constante', 'electrobomba',
    'instalacion', 'pressio', 'presion'];

  /* ---------- Normalització de text (minúscules, sense accents) ---------- */
  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // accents
      .replace(/[·]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function hasAny(text, words) {
    for (var i = 0; i < words.length; i++) {
      if (text.indexOf(words[i]) !== -1) { return true; }
    }
    return false;
  }

  function countFamilies(text) {
    var n = 0;
    if (hasAny(text, KW.familyPressflow)) { n++; }
    if (hasAny(text, KW.familyHitech)) { n++; }
    if (hasAny(text, KW.familySmart)) { n++; }
    return n;
  }

  /* ---------- Distància d'edició (Levenshtein) per tolerar errates ---------- */
  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (!m) { return n; }
    if (!n) { return m; }
    var prev = [], cur = [], i, j;
    for (j = 0; j <= n; j++) { prev[j] = j; }
    for (i = 1; i <= m; i++) {
      cur[0] = i;
      for (j = 1; j <= n; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      }
      for (j = 0; j <= n; j++) { prev[j] = cur[j]; }
    }
    return prev[n];
  }

  /* Corregeix errates lleus cap als termes importants (models, famílies, etc.) */
  function spellNormalize(text) {
    var toks = text.split(' ');
    for (var i = 0; i < toks.length; i++) {
      var tk = toks[i];
      if (tk.length < 5 || IMPORTANT_TERMS.indexOf(tk) !== -1) { continue; }
      for (var k = 0; k < IMPORTANT_TERMS.length; k++) {
        var term = IMPORTANT_TERMS[k];
        if (Math.abs(term.length - tk.length) <= 1 && levenshtein(tk, term) <= 1) {
          toks[i] = term;
          break;
        }
      }
    }
    return toks.join(' ');
  }

  /* Detecta un model concret esmentat al text (Switchmatic, Speedbox, DPR…) */
  function detectModel(text) {
    var toks = text.split(' ');
    for (var key in MODELS) {
      if (!MODELS.hasOwnProperty(key)) { continue; }
      if (key.indexOf(' ') === -1 && key.indexOf('-') === -1) {
        if (toks.indexOf(key) !== -1) { return MODELS[key]; }
      } else if (text.indexOf(key) !== -1) {
        return MODELS[key];
      }
    }
    if (text.indexOf('speed board') !== -1) { return MODELS.speedboard; }
    return null;
  }

  /* ---------- Paraules clau d'intencions (normalitzades) ---------- */
  var KW = {
    warranty: ['garantia', 'garantie', 'warranty', 'garanzia', 'rma', 'devolucio',
      'devoluci', 'return', 'reclamac', 'reclamo', 'refund', 'reembols'],
    price: ['precio', 'preu', 'price', 'prix', 'prezzo', 'cuanto cuesta', 'quant costa',
      'coste', 'costo', 'tarifa', 'presupuesto', 'pressupost', 'quote', 'descuento',
      'descompte', 'barato', 'economic', 'oferta', 'cotizacion', 'how much'],
    error: ['averia', 'avaria', 'panne', 'guasto', 'codigo de error', 'codi error',
      'error code', 'fault', 'breakdown', 'no arranca', 'no funciona', 'no para',
      'se para', 'diagnos', 'reparar', 'repair', 'riparazione', 'no enciende',
      'salta el', 'no arrenca', 'ne marche pas', 'non funziona'],
    config: ['configur', 'parametr', 'parametre', 'programar', 'programacion', 'calibr',
      'cut-in', 'cut in', 'cut-out', 'cut out', 'presion de corte', 'presion de arranque',
      'pressio de tall', 'valor de', 'como ajusto', 'como pongo', 'como configuro',
      'com configuro', 'setting', 'regolare', 'regler les', 'ajustar el', 'ajuste de'],
    compat: ['compatib', 'kompatib', 'sirve para mi', 'va bene per', 'es compatible',
      'es valido para', 'serveix per a la meva', 'funciona con mi'],
    stock: ['stock', 'existencias', 'comprar', 'comanda', 'pedido', 'plazo', 'entrega',
      'delivery', 'disponibilidad', 'donde compro', 'donde comprar', 'on comprar',
      'acheter', 'comprare', 'where to buy', 'lead time'],
    pumpsWord: ['bomba', 'bombe', 'pump', 'pompe', 'pompa', 'electrobomba'],
    pumpsMaker: ['fabric', 'fabriqu', 'fabbric', 'hacen', 'haceis', 'venden', 'vendeu',
      'vendete', 'vende', 'vendit', 'venta', 'vente', 'sell', 'make', 'produc',
      'comercializa', 'suministra', 'en venta', 'in vendita', 'for sale'],
    drainage: ['drenaje', 'drenatge', 'drainage', 'fecal', 'aguas grises', 'aigues grises',
      'eaux usees', 'acque grigie', 'achique', 'sumidero', 'vaciado', 'vaciar deposito',
      'llenado de deposito', 'llenar deposito', 'ompliment', 'omplir diposit',
      'transferir agua', 'trasiego', 'sentina', 'sump'],
    constant: ['presion constante', 'pressio constant', 'pression constante',
      'pressione costante', 'constant pressure', 'grupo de presion', 'grup de pressio',
      'booster', 'sobreelevacion', 'edificio', 'edifici', 'building', 'immeuble',
      'hotel', 'residencia', 'residence', 'comunidad', 'comunitat', 'apartamentos',
      'ahorro energetico', 'estalvi', 'energy saving', 'economie d energie'],
    industrial: ['industrial', 'industria', 'planta', 'riego', 'irrigation', 'irrigazione',
      'agricola', 'invernadero', 'naves'],
    house: ['chalet', 'xalet', 'vivienda unifamiliar', 'habitatge unifamiliar',
      'casa unifamiliar', 'unifamiliar', 'pozo', 'pou', 'water well', 'borehole',
      ' house', 'maison', 'villa', 'casa de campo', 'mi casa', 'aljibe', 'cisterna',
      'grifo', 'aixeta', 'robinet', 'abro el grifo', 'obro l aixeta'],
    familyPressflow: ['pressflow', 'optimatic', 'compact 22', 'digiplus', 'digimatic',
      'onematic', 'presscontrol', 'press control', 'presscomfort', ' epr', ' dpr',
      'controlador tradicional', 'sustituye el presostato', 'presostato mecanico',
      'pressostat mecanic'],
    familyHitech: ['hitech', 'hi tech', 'variador', 'inverter', 'vsd', 'speedmatic',
      'speedbox', 'speed-board', 'speedboard', 'speed board', 'variable speed',
      'frecuencia variable', 'variateur', 'variatore'],
    familySmart: ['smarttech', 'smart tech', 'switchmatic', 'panelmatic',
      'presostato electronico', 'presostat electronic', 'pressostato elettronico',
      'electronic pressure switch'],
    overview: ['diferencia', 'difference', 'differenza', 'diferencies', 'que productos',
      'quins productes', 'quines families', 'que familias', 'product range', 'gamma',
      'gama de producto', 'vuestros productos', 'que ofreceis', 'que vendeis',
      'que hace coelbo', 'que es coelbo', 'a que os dedicais'],
    docs: ['catalogo', 'cataleg', 'catalogue', 'catalogi', 'manual', 'documentacion',
      'documentacio', 'documentation', 'ficha tecnica', 'datasheet', 'descargar',
      'download', 'telefono', 'contacto', 'contacte', 'contact', 'contatto', 'email',
      'correo', 'informacion tecnica', 'informacio tecnica', 'where can i find',
      'donde encuentro', 'donde descargo'],
    greeting: ['hola', 'bon dia', 'bones', 'buenas', 'buenos dias', 'hello', ' hi ',
      'hey', 'bonjour', 'salut', 'ciao', 'salve', 'good morning', 'good afternoon']
  };

  /* ---------- Detecció d'idioma (paraules completes + frases freqüents) ----------
     El text ja arriba normalitzat (minúscules, sense accents). Es puntua per
     paraules "marca" de cada idioma i per frases (pes doble); guanya el més alt. */
  var LANG_WORDS = {
    ca: ['amb', 'aixeta', 'aigua', 'tinc', 'vull', 'meva', 'seva', 'aquest', 'aquesta',
      'aixo', 'puc', 'quina', 'quines', 'aparell', 'voldria', 'necessito', 'xalet', 'pou',
      'installacio', 'nostra', 'soc', 'ets', 'gracies', 'sisplau', 'aquestes', 'voleu',
      'teniu', 'estic', 'aquell', 'bones', 'aquestes', 'necessitaria'],
    es: ['con', 'agua', 'tengo', 'quiero', 'necesito', 'como', 'cual', 'grifo', 'para',
      'gracias', 'buenas', 'buenos', 'hola', 'cuanto', 'donde', 'una', 'instalacion',
      'esta', 'muy', 'pero', 'tambien', 'usted', 'quisiera', 'tiene', 'sirve', 'puedo',
      'casa', 'tienen', 'vosotros', 'dias', 'presion', 'necesitaria'],
    en: ['the', 'have', 'need', 'what', 'which', 'how', 'with', 'water', 'pump', 'hello',
      'thanks', 'my', 'is', 'are', 'do', 'you', 'can', 'price', 'want', 'house', 'well',
      'for', 'of', 'and', 'your', 'please', 'does', 'tell', 'looking', 'would', 'hi'],
    fr: ['bonjour', 'bonsoir', 'salut', 'je', 'ai', 'avec', 'besoin', 'comment', 'quelle',
      'pour', 'eau', 'pompe', 'merci', 'une', 'est', 'robinet', 'installation', 'veux',
      'vous', 'nous', 'avez', 'puis', 'quel', 'dans', 'sur', 'mon', 'voudrais', 'prix'],
    it: ['ciao', 'ho', 'come', 'quale', 'acqua', 'pompa', 'grazie', 'rubinetto',
      'installazione', 'vorrei', 'salve', 'avete', 'sono', 'vendita', 'della', 'delle',
      'gli', 'vostra', 'posso', 'buongiorno', 'quanto', 'vostri', 'pompe', 'serve',
      'prezzo', 'con', 'una', 'per']
  };
  /* Frases marca (pes doble) */
  var LANG_PHRASES = {
    ca: ['tinc un', 'la meva', 'quina familia', 'vull saber', 'em pot', 'amb un', 'bon dia'],
    es: ['tengo un', 'mi casa', 'cuanto cuesta', 'donde puedo', 'quiero saber', 'me puede'],
    en: ['i have', 'i need', 'how much', 'do you', 'can you', 'i want', 'my house', 'i would', 'looking for'],
    fr: ['j ai', 'je veux', 'je voudrais', 'est ce que', 'pour ma', 'avez vous'],
    it: ['ho una', 'vorrei sapere', 'quanto costa', 'mi puo', 'vostra gamma', 'avete pompe']
  };

  function detectLang(text, current) {
    var tokens = text.split(/[^a-z0-9]+/);
    var scores = { ca: 0, es: 0, en: 0, fr: 0, it: 0 };
    var lang, i;
    for (lang in LANG_WORDS) {
      if (!LANG_WORDS.hasOwnProperty(lang)) { continue; }
      var words = LANG_WORDS[lang];
      for (i = 0; i < tokens.length; i++) {
        if (tokens[i] && words.indexOf(tokens[i]) !== -1) { scores[lang]++; }
      }
      var phrases = LANG_PHRASES[lang];
      for (i = 0; i < phrases.length; i++) {
        if (text.indexOf(phrases[i]) !== -1) { scores[lang] += 2; }
      }
    }
    var best = null, bestScore = 0;
    for (lang in scores) {
      if (scores.hasOwnProperty(lang) && scores[lang] > bestScore) {
        bestScore = scores[lang];
        best = lang;
      }
    }
    if (bestScore === 0) { return null; }
    /* Empate: si el idioma actual empata con el máximo, no cambiamos (evita saltos) */
    if (current && SUPPORTED.indexOf(current) !== -1 && scores[current] === bestScore) {
      return current;
    }
    return best;
  }

  /* ---------- Classificador d'intencions (ordre = prioritat) ---------- */
  function classify(text) {
    if (hasAny(text, KW.warranty)) { return 'warranty'; }
    if (hasAny(text, KW.price)) { return 'price'; }
    if (hasAny(text, KW.error)) { return 'error'; }
    if (hasAny(text, KW.config)) { return 'config'; }
    if (hasAny(text, KW.compat)) { return 'compat'; }
    if (hasAny(text, KW.stock)) { return 'stock'; }
    if (hasAny(text, KW.pumpsWord) && hasAny(text, KW.pumpsMaker)) { return 'pumps'; }

    if (hasAny(text, KW.overview) || countFamilies(text) >= 2) { return 'overview'; }

    if (hasAny(text, KW.drainage)) { return 'recDrainage'; }
    if (hasAny(text, KW.industrial)) { return 'recIndustrial'; }
    if (hasAny(text, KW.constant)) { return 'recConstant'; }
    if (hasAny(text, KW.house)) { return 'recHouse'; }

    if (hasAny(text, KW.familyPressflow)) { return 'pressflow'; }
    if (hasAny(text, KW.familyHitech)) { return 'hitech'; }
    if (hasAny(text, KW.familySmart)) { return 'smarttech'; }

    if (hasAny(text, KW.docs)) { return 'docs'; }
    if (hasAny(text, KW.greeting)) { return 'greeting'; }
    return 'fallback';
  }

  /* ---------- Base de coneixement / respostes per idioma ---------- */
  var I18N = {
    ca: {
      title: 'Assistent COELBO',
      subtitle: 'Orientació de producte',
      placeholder: 'Escrigui la seva consulta…',
      send: 'Enviar',
      open: 'Obrir l\'assistent de COELBO',
      close: 'Tancar',
      langLabel: 'Idioma',
      disclaimer: 'Assistent d\'orientació. Per a temes tècnics o comercials, el derivarem a l\'equip de COELBO.',
      welcome: 'Hola! Sóc l\'assistent virtual de COELBO. Puc orientar-lo sobre les nostres tres famílies de controladors per a electrobombes —PressflowTech, HiTech i SmartTech— i ajudar-lo a triar la més adequada. En què el puc ajudar?',
      chips: ['Quines famílies teniu?', 'Tinc un xalet amb pou', 'Vull pressió constant', 'On trobo els catàlegs?'],
      greeting: 'Hola! En què el puc ajudar? Puc orientar-lo sobre les famílies PressflowTech, HiTech i SmartTech segons la seva instal·lació.',
      overview: 'COELBO dissenya i fabrica dispositius electrònics per controlar i protegir electrobombes (no fabrica bombes). Tenim tres famílies: PressflowTech, controladors que substitueixen el pressòstat mecànic en instal·lacions senzilles; HiTech, variadors de velocitat (inverter) per a pressió constant i estalvi energètic; i SmartTech, pressòstats electrònics i quadres de control/protecció. Si em descriu la seva instal·lació, l\'oriento cap a la més adient.',
      pressflow: 'PressflowTech són controladors que arrenquen la bomba quan baixa la pressió i l\'aturen en tancar les aixetes, sense necessitat de tanc hidropneumàtic. Inclouen alarma per falta d\'aigua i són la solució senzilla i robusta per a habitatges unifamiliars i petites comunitats. Trobarà els detalls al catàleg de la secció Informació tècnica del web.',
      hitech: 'HiTech són variadors de velocitat (tecnologia inverter) que fan girar la bomba a la freqüència justa per mantenir una pressió constant, amb estalvi energètic i més vida útil de la bomba. Es munten en línia, a la paret o a bord del motor segons el cas. Ideals per a edificis, hotels, residències i grups de pressió. Té el catàleg a la secció Informació tècnica del web.',
      smarttech: 'SmartTech són dispositius amb electrònica avançada però sense inverter. Inclou el Switchmatic (pressòstat electrònic que controla i protegeix la bomba) i el Panelmatic (quadre multifunció per a drenatge, ompliment de dipòsits i funcionament pressostàtic). Trobarà els detalls al catàleg del web.',
      recHouse: 'Per a un habitatge unifamiliar amb pou o bomba, la família PressflowTech sol ser la més indicada: gestiona l\'arrencada i aturada automàtica i no necessita tanc hidropneumàtic. Si vol pressió constant i més estalvi, també pot valorar un variador HiTech. Per concretar el model, l\'equip tècnic l\'ajudarà a ' + EMAIL + '.',
      recConstant: 'Per mantenir una pressió constant en edificis, hotels, residències o grups de pressió, la família HiTech (variadors inverter) és la més adequada: ajusta la velocitat de la bomba a la demanda i estalvia energia. Per dimensionar el model segons la potència de la bomba, l\'equip tècnic l\'orientarà a ' + EMAIL + ' o al ' + PHONE + '.',
      recDrainage: 'Per a drenatge (aigües netes, grises o fecals) o ompliment de dipòsits, el Panelmatic de la família SmartTech és el més indicat: és un quadre multifunció que gestiona i protegeix la bomba en aquests modes. Per triar la configuració concreta, contacti amb l\'equip tècnic a ' + EMAIL + '.',
      recIndustrial: 'Per a ús industrial o instal·lacions exigents amb pressió constant, la família HiTech (variadors inverter) sol ser la millor opció. Si l\'aplicació és de drenatge o transferència, el Panelmatic (SmartTech) també pot encaixar. Per a un assessorament ajustat al seu cas, l\'equip tècnic l\'ajudarà a ' + EMAIL + ' o al ' + PHONE + '.',
      pumps: 'COELBO no fabrica electrobombes: dissenya i fabrica els dispositius electrònics que les controlen i protegeixen (controladors, variadors i pressòstats electrònics). Si em diu quina instal·lació té, l\'oriento cap a la família adequada.',
      docs: 'Trobarà els catàlegs, manuals i fitxes tècniques a la secció Informació tècnica del web de COELBO. Per a qualsevol consulta també pot contactar a ' + EMAIL + ' o al ' + PHONE + '.',
      price: 'No puc facilitar preus ni informació comercial. Per a pressupostos, terminis o comandes, contacti amb COELBO a ' + EMAIL + ' o al ' + PHONE + '. Sí que el puc ajudar a identificar quina família encaixa amb la seva instal·lació.',
      config: 'La configuració, els paràmetres i els valors d\'ajust els gestiona el nostre equip tècnic i els trobarà al manual del dispositiu, a la secció Informació tècnica del web. Per a ajuda personalitzada, escrigui a ' + EMAIL + ' o truqui al ' + PHONE + '.',
      error: 'El diagnòstic d\'avaries i els codis d\'error els ha d\'atendre el nostre equip tècnic. Contacti amb COELBO a ' + EMAIL + ' o al ' + PHONE + '; consulti també el manual a la secció Informació tècnica del web.',
      compat: 'La compatibilitat exacta amb un model concret d\'electrobomba l\'ha de validar el nostre equip tècnic. Contacti a ' + EMAIL + ' o al ' + PHONE + '. Mentrestant, el puc orientar sobre quina família s\'adapta millor al seu ús.',
      warranty: 'Les garanties, devolucions (RMA) i reclamacions les gestiona el nostre equip. Contacti amb COELBO a ' + EMAIL + ' o al ' + PHONE + '.',
      stock: 'Les comandes, l\'estoc i els terminis de lliurament són gestions comercials. Contacti amb COELBO a ' + EMAIL + ' o al ' + PHONE + '. Sí que el puc ajudar a triar la família de producte adequada.',
      fallback: 'Puc orientar-lo sobre les tres famílies de controladors de COELBO —PressflowTech, HiTech i SmartTech— i ajudar-lo a triar segons la seva instal·lació (habitatge, comunitat, edifici, hotel, ús industrial…). Si em descriu el seu cas, l\'oriento; per a temes tècnics o comercials concrets, el derivaré a l\'equip de COELBO.'
    },

    es: {
      title: 'Asistente COELBO',
      subtitle: 'Orientación de producto',
      placeholder: 'Escriba su consulta…',
      send: 'Enviar',
      open: 'Abrir el asistente de COELBO',
      close: 'Cerrar',
      langLabel: 'Idioma',
      disclaimer: 'Asistente de orientación. Para temas técnicos o comerciales le derivaremos al equipo de COELBO.',
      welcome: '¡Hola! Soy el asistente virtual de COELBO. Puedo orientarle sobre nuestras tres familias de controladores para electrobombas —PressflowTech, HiTech y SmartTech— y ayudarle a elegir la más adecuada. ¿En qué puedo ayudarle?',
      chips: ['¿Qué familias tenéis?', 'Tengo un chalet con pozo', 'Quiero presión constante', '¿Dónde están los catálogos?'],
      greeting: '¡Hola! ¿En qué puedo ayudarle? Puedo orientarle sobre las familias PressflowTech, HiTech y SmartTech según su instalación.',
      overview: 'COELBO diseña y fabrica dispositivos electrónicos para controlar y proteger electrobombas (no fabrica bombas). Tenemos tres familias: PressflowTech, controladores que sustituyen el presóstato mecánico en instalaciones sencillas; HiTech, variadores de velocidad (inverter) para presión constante y ahorro energético; y SmartTech, presóstatos electrónicos y cuadros de control/protección. Si me describe su instalación, le oriento hacia la más adecuada.',
      pressflow: 'PressflowTech son controladores que arrancan la bomba cuando baja la presión y la paran al cerrar los grifos, sin necesidad de depósito hidroneumático. Incluyen alarma por falta de agua y son la solución sencilla y robusta para viviendas unifamiliares y pequeñas comunidades. Encontrará los detalles en el catálogo de la sección Información técnica de la web.',
      hitech: 'HiTech son variadores de velocidad (tecnología inverter) que hacen girar la bomba a la frecuencia justa para mantener una presión constante, con ahorro energético y mayor vida útil de la bomba. Se montan en línea, en pared o a bordo del motor según el caso. Ideales para edificios, hoteles, residencias y grupos de presión. Tiene el catálogo en la sección Información técnica de la web.',
      smarttech: 'SmartTech son dispositivos con electrónica avanzada pero sin inverter. Incluye el Switchmatic (presóstato electrónico que controla y protege la bomba) y el Panelmatic (cuadro multifunción para drenaje, llenado de depósitos y funcionamiento presostático). Encontrará los detalles en el catálogo de la web.',
      recHouse: 'Para una vivienda unifamiliar con pozo o bomba, la familia PressflowTech suele ser la más indicada: gestiona el arranque y la parada automática y no necesita depósito hidroneumático. Si desea presión constante y más ahorro, también puede valorar un variador HiTech. Para concretar el modelo, el equipo técnico le ayudará en ' + EMAIL + '.',
      recConstant: 'Para mantener una presión constante en edificios, hoteles, residencias o grupos de presión, la familia HiTech (variadores inverter) es la más adecuada: ajusta la velocidad de la bomba a la demanda y ahorra energía. Para dimensionar el modelo según la potencia de la bomba, el equipo técnico le orientará en ' + EMAIL + ' o en el ' + PHONE + '.',
      recDrainage: 'Para drenaje (aguas limpias, grises o fecales) o llenado de depósitos, el Panelmatic de la familia SmartTech es el más indicado: es un cuadro multifunción que gestiona y protege la bomba en esos modos. Para elegir la configuración concreta, contacte con el equipo técnico en ' + EMAIL + '.',
      recIndustrial: 'Para uso industrial o instalaciones exigentes con presión constante, la familia HiTech (variadores inverter) suele ser la mejor opción. Si la aplicación es de drenaje o trasvase, el Panelmatic (SmartTech) también puede encajar. Para un asesoramiento ajustado a su caso, el equipo técnico le ayudará en ' + EMAIL + ' o en el ' + PHONE + '.',
      pumps: 'COELBO no fabrica electrobombas: diseña y fabrica los dispositivos electrónicos que las controlan y protegen (controladores, variadores y presóstatos electrónicos). Si me dice qué instalación tiene, le oriento hacia la familia adecuada.',
      docs: 'Encontrará los catálogos, manuales y fichas técnicas en la sección Información técnica de la web de COELBO. Para cualquier consulta también puede contactar en ' + EMAIL + ' o en el ' + PHONE + '.',
      price: 'No puedo facilitar precios ni información comercial. Para presupuestos, plazos o pedidos, contacte con COELBO en ' + EMAIL + ' o en el ' + PHONE + '. Sí puedo ayudarle a identificar qué familia encaja con su instalación.',
      config: 'La configuración, los parámetros y los valores de ajuste los gestiona nuestro equipo técnico y los encontrará en el manual del dispositivo, en la sección Información técnica de la web. Para ayuda personalizada, escriba a ' + EMAIL + ' o llame al ' + PHONE + '.',
      error: 'El diagnóstico de averías y los códigos de error debe atenderlos nuestro equipo técnico. Contacte con COELBO en ' + EMAIL + ' o en el ' + PHONE + '; consulte también el manual en la sección Información técnica de la web.',
      compat: 'La compatibilidad exacta con un modelo concreto de electrobomba debe validarla nuestro equipo técnico. Contacte en ' + EMAIL + ' o en el ' + PHONE + '. Mientras tanto, puedo orientarle sobre qué familia se adapta mejor a su uso.',
      warranty: 'Las garantías, devoluciones (RMA) y reclamaciones las gestiona nuestro equipo. Contacte con COELBO en ' + EMAIL + ' o en el ' + PHONE + '.',
      stock: 'Los pedidos, el stock y los plazos de entrega son gestiones comerciales. Contacte con COELBO en ' + EMAIL + ' o en el ' + PHONE + '. Sí puedo ayudarle a elegir la familia de producto adecuada.',
      fallback: 'Puedo orientarle sobre las tres familias de controladores de COELBO —PressflowTech, HiTech y SmartTech— y ayudarle a elegir según su instalación (vivienda, comunidad, edificio, hotel, uso industrial…). Si me describe su caso, le oriento; para temas técnicos o comerciales concretos, le derivaré al equipo de COELBO.'
    },

    en: {
      title: 'COELBO Assistant',
      subtitle: 'Product guidance',
      placeholder: 'Type your question…',
      send: 'Send',
      open: 'Open the COELBO assistant',
      close: 'Close',
      langLabel: 'Language',
      disclaimer: 'Guidance assistant. For technical or commercial matters we will refer you to the COELBO team.',
      welcome: 'Hello! I\'m COELBO\'s virtual assistant. I can guide you on our three families of electric-pump controllers —PressflowTech, HiTech and SmartTech— and help you choose the best fit. How can I help you?',
      chips: ['What product families do you have?', 'I have a house with a well', 'I need constant pressure', 'Where are the catalogues?'],
      greeting: 'Hello! How can I help you? I can guide you on the PressflowTech, HiTech and SmartTech families based on your installation.',
      overview: 'COELBO designs and manufactures electronic devices to control and protect electric pumps (it does not make pumps). There are three families: PressflowTech, controllers that replace the mechanical pressure switch in simple installations; HiTech, variable speed drives (inverter) for constant pressure and energy savings; and SmartTech, electronic pressure switches and control/protection panels. Describe your installation and I\'ll point you to the right one.',
      pressflow: 'PressflowTech are controllers that start the pump when pressure drops and stop it when the taps close, with no need for a pressure tank. They include a dry-running (no-water) alarm and are the simple, robust solution for single-family homes and small communities. You\'ll find details in the catalogue in the Technical Information section of the website.',
      hitech: 'HiTech are variable speed drives (inverter technology) that run the pump at just the right frequency to keep constant pressure, saving energy and extending the pump\'s life. They mount in-line, on the wall or on-board the motor depending on the case. Ideal for buildings, hotels, residences and pressure sets. The catalogue is in the Technical Information section of the website.',
      smarttech: 'SmartTech are devices with advanced electronics but no inverter. They include the Switchmatic (electronic pressure switch that controls and protects the pump) and the Panelmatic (multi-function panel for drainage, tank filling and pressure-switch operation). You\'ll find details in the catalogue on the website.',
      recHouse: 'For a single-family home with a well or pump, the PressflowTech family is usually the best fit: it manages automatic start/stop and needs no pressure tank. If you want constant pressure and more savings, you could also consider a HiTech drive. To pin down the exact model, our technical team will help you at ' + EMAIL + '.',
      recConstant: 'To keep constant pressure in buildings, hotels, residences or pressure sets, the HiTech family (inverter drives) is the best fit: it matches pump speed to demand and saves energy. To size the model for your pump power, our technical team will guide you at ' + EMAIL + ' or +34 93 736 29 50.',
      recDrainage: 'For drainage (clean, grey or sewage water) or tank filling, the Panelmatic in the SmartTech family is the best fit: a multi-function panel that manages and protects the pump in these modes. To choose the exact configuration, contact our technical team at ' + EMAIL + '.',
      recIndustrial: 'For industrial use or demanding installations needing constant pressure, the HiTech family (inverter drives) is usually the best option. If the application is drainage or transfer, the Panelmatic (SmartTech) may also fit. For advice tailored to your case, our technical team will help you at ' + EMAIL + ' or +34 93 736 29 50.',
      pumps: 'COELBO does not manufacture electric pumps: it designs and makes the electronic devices that control and protect them (controllers, drives and electronic pressure switches). Tell me about your installation and I\'ll point you to the right family.',
      docs: 'You\'ll find catalogues, manuals and datasheets in the Technical Information section of the COELBO website. For any query you can also contact ' + EMAIL + ' or +34 93 736 29 50.',
      price: 'I\'m not able to provide pricing or commercial information. For quotes, lead times or orders, please contact COELBO at ' + EMAIL + ' or +34 93 736 29 50. I can, however, help you identify which family fits your installation.',
      config: 'Configuration, parameters and setpoints are handled by our technical team and detailed in the device manual, in the Technical Information section of the website. For personalised help, write to ' + EMAIL + ' or call +34 93 736 29 50.',
      error: 'Fault diagnosis and error codes must be handled by our technical team. Please contact COELBO at ' + EMAIL + ' or +34 93 736 29 50; also check the manual in the Technical Information section of the website.',
      compat: 'Exact compatibility with a specific pump model must be validated by our technical team. Please contact ' + EMAIL + ' or +34 93 736 29 50. In the meantime, I can guide you on which family best suits your use.',
      warranty: 'Warranties, returns (RMA) and claims are handled by our team. Please contact COELBO at ' + EMAIL + ' or +34 93 736 29 50.',
      stock: 'Orders, stock and delivery times are commercial matters. Please contact COELBO at ' + EMAIL + ' or +34 93 736 29 50. I can help you choose the right product family, though.',
      fallback: 'I can guide you on COELBO\'s three controller families —PressflowTech, HiTech and SmartTech— and help you choose based on your installation (home, community, building, hotel, industrial use…). Describe your case and I\'ll point you the right way; for specific technical or commercial matters I\'ll refer you to the COELBO team.'
    },

    fr: {
      title: 'Assistant COELBO',
      subtitle: 'Orientation produit',
      placeholder: 'Écrivez votre question…',
      send: 'Envoyer',
      open: 'Ouvrir l\'assistant COELBO',
      close: 'Fermer',
      langLabel: 'Langue',
      disclaimer: 'Assistant d\'orientation. Pour les sujets techniques ou commerciaux, nous vous orienterons vers l\'équipe COELBO.',
      welcome: 'Bonjour ! Je suis l\'assistant virtuel de COELBO. Je peux vous orienter sur nos trois familles de contrôleurs pour électropompes —PressflowTech, HiTech et SmartTech— et vous aider à choisir la plus adaptée. Comment puis-je vous aider ?',
      chips: ['Quelles familles proposez-vous ?', 'J\'ai une maison avec un puits', 'Je veux une pression constante', 'Où sont les catalogues ?'],
      greeting: 'Bonjour ! Comment puis-je vous aider ? Je peux vous orienter sur les familles PressflowTech, HiTech et SmartTech selon votre installation.',
      overview: 'COELBO conçoit et fabrique des dispositifs électroniques pour contrôler et protéger les électropompes (elle ne fabrique pas de pompes). Trois familles : PressflowTech, des contrôleurs qui remplacent le pressostat mécanique dans les installations simples ; HiTech, des variateurs de vitesse (inverter) pour une pression constante et des économies d\'énergie ; et SmartTech, des pressostats électroniques et coffrets de contrôle/protection. Décrivez votre installation et je vous orienterai.',
      pressflow: 'PressflowTech sont des contrôleurs qui démarrent la pompe quand la pression baisse et l\'arrêtent à la fermeture des robinets, sans réservoir à vessie. Ils intègrent une alarme de manque d\'eau et constituent la solution simple et robuste pour les maisons individuelles et petites communautés. Détails dans le catalogue, section Information technique du site.',
      hitech: 'HiTech sont des variateurs de vitesse (technologie inverter) qui font tourner la pompe à la fréquence juste pour maintenir une pression constante, avec économie d\'énergie et durée de vie accrue. Montage en ligne, mural ou à bord du moteur selon le cas. Idéals pour bâtiments, hôtels, résidences et groupes de pression. Catalogue dans la section Information technique du site.',
      smarttech: 'SmartTech sont des dispositifs à électronique avancée mais sans inverter. Ils incluent le Switchmatic (pressostat électronique qui contrôle et protège la pompe) et le Panelmatic (coffret multifonction pour drainage, remplissage de réservoirs et fonctionnement pressostatique). Détails dans le catalogue du site.',
      recHouse: 'Pour une maison individuelle avec puits ou pompe, la famille PressflowTech est généralement la plus indiquée : elle gère le démarrage/arrêt automatique sans réservoir à vessie. Pour une pression constante et plus d\'économies, vous pouvez aussi envisager un variateur HiTech. Pour le modèle précis, notre équipe technique vous aidera à ' + EMAIL + '.',
      recConstant: 'Pour maintenir une pression constante dans des bâtiments, hôtels, résidences ou groupes de pression, la famille HiTech (variateurs inverter) est la plus adaptée : elle ajuste la vitesse à la demande et économise l\'énergie. Pour dimensionner le modèle selon la puissance de la pompe, notre équipe technique vous orientera à ' + EMAIL + ' ou au +34 93 736 29 50.',
      recDrainage: 'Pour le drainage (eaux claires, grises ou usées) ou le remplissage de réservoirs, le Panelmatic de la famille SmartTech est le plus indiqué : un coffret multifonction qui gère et protège la pompe dans ces modes. Pour la configuration précise, contactez notre équipe technique à ' + EMAIL + '.',
      recIndustrial: 'Pour un usage industriel ou des installations exigeantes nécessitant une pression constante, la famille HiTech (variateurs inverter) est généralement la meilleure option. Pour du drainage ou du transfert, le Panelmatic (SmartTech) peut aussi convenir. Pour un conseil adapté, notre équipe technique vous aidera à ' + EMAIL + ' ou au +34 93 736 29 50.',
      pumps: 'COELBO ne fabrique pas d\'électropompes : elle conçoit et fabrique les dispositifs électroniques qui les contrôlent et les protègent (contrôleurs, variateurs et pressostats électroniques). Indiquez votre installation et je vous orienterai vers la bonne famille.',
      docs: 'Vous trouverez catalogues, manuels et fiches techniques dans la section Information technique du site COELBO. Pour toute question, contactez aussi ' + EMAIL + ' ou le +34 93 736 29 50.',
      price: 'Je ne peux pas communiquer de prix ni d\'informations commerciales. Pour des devis, délais ou commandes, contactez COELBO à ' + EMAIL + ' ou au +34 93 736 29 50. Je peux en revanche vous aider à identifier la famille adaptée à votre installation.',
      config: 'La configuration, les paramètres et les valeurs de réglage sont gérés par notre équipe technique et figurent dans le manuel de l\'appareil, section Information technique du site. Pour une aide personnalisée, écrivez à ' + EMAIL + ' ou appelez le +34 93 736 29 50.',
      error: 'Le diagnostic des pannes et les codes d\'erreur doivent être traités par notre équipe technique. Contactez COELBO à ' + EMAIL + ' ou au +34 93 736 29 50 ; consultez aussi le manuel dans la section Information technique du site.',
      compat: 'La compatibilité exacte avec un modèle précis d\'électropompe doit être validée par notre équipe technique. Contactez ' + EMAIL + ' ou le +34 93 736 29 50. Entre-temps, je peux vous orienter sur la famille la mieux adaptée à votre usage.',
      warranty: 'Les garanties, retours (RMA) et réclamations sont gérés par notre équipe. Contactez COELBO à ' + EMAIL + ' ou au +34 93 736 29 50.',
      stock: 'Les commandes, le stock et les délais de livraison relèvent du commercial. Contactez COELBO à ' + EMAIL + ' ou au +34 93 736 29 50. Je peux toutefois vous aider à choisir la bonne famille de produit.',
      fallback: 'Je peux vous orienter sur les trois familles de contrôleurs COELBO —PressflowTech, HiTech et SmartTech— et vous aider à choisir selon votre installation (logement, communauté, bâtiment, hôtel, usage industriel…). Décrivez votre cas ; pour des sujets techniques ou commerciaux précis, je vous orienterai vers l\'équipe COELBO.'
    },

    it: {
      title: 'Assistente COELBO',
      subtitle: 'Orientamento prodotto',
      placeholder: 'Scriva la sua domanda…',
      send: 'Invia',
      open: 'Apri l\'assistente COELBO',
      close: 'Chiudi',
      langLabel: 'Lingua',
      disclaimer: 'Assistente di orientamento. Per questioni tecniche o commerciali la indirizzeremo al team COELBO.',
      welcome: 'Salve! Sono l\'assistente virtuale di COELBO. Posso orientarla sulle nostre tre famiglie di controllori per elettropompe —PressflowTech, HiTech e SmartTech— e aiutarla a scegliere la più adatta. Come posso aiutarla?',
      chips: ['Quali famiglie avete?', 'Ho una villa con un pozzo', 'Voglio pressione costante', 'Dove sono i cataloghi?'],
      greeting: 'Salve! Come posso aiutarla? Posso orientarla sulle famiglie PressflowTech, HiTech e SmartTech in base alla sua installazione.',
      overview: 'COELBO progetta e produce dispositivi elettronici per controllare e proteggere le elettropompe (non produce pompe). Tre famiglie: PressflowTech, controllori che sostituiscono il pressostato meccanico in impianti semplici; HiTech, variatori di velocità (inverter) per pressione costante e risparmio energetico; e SmartTech, pressostati elettronici e quadri di controllo/protezione. Mi descriva l\'impianto e la orienterò.',
      pressflow: 'PressflowTech sono controllori che avviano la pompa quando la pressione scende e la fermano alla chiusura dei rubinetti, senza serbatoio autoclave. Includono l\'allarme di mancanza d\'acqua e sono la soluzione semplice e robusta per abitazioni unifamiliari e piccole comunità. Trova i dettagli nel catalogo, sezione Informazioni tecniche del sito.',
      hitech: 'HiTech sono variatori di velocità (tecnologia inverter) che fanno girare la pompa alla frequenza giusta per mantenere una pressione costante, con risparmio energetico e maggiore durata della pompa. Montaggio in linea, a parete o a bordo motore secondo il caso. Ideali per edifici, hotel, residence e gruppi di pressione. Catalogo nella sezione Informazioni tecniche del sito.',
      smarttech: 'SmartTech sono dispositivi con elettronica avanzata ma senza inverter. Includono lo Switchmatic (pressostato elettronico che controlla e protegge la pompa) e il Panelmatic (quadro multifunzione per drenaggio, riempimento serbatoi e funzionamento pressostatico). Trova i dettagli nel catalogo del sito.',
      recHouse: 'Per un\'abitazione unifamiliare con pozzo o pompa, la famiglia PressflowTech è di solito la più indicata: gestisce avvio/arresto automatico senza serbatoio autoclave. Se desidera pressione costante e più risparmio, può valutare anche un variatore HiTech. Per il modello preciso, il nostro team tecnico la aiuterà a ' + EMAIL + '.',
      recConstant: 'Per mantenere una pressione costante in edifici, hotel, residence o gruppi di pressione, la famiglia HiTech (variatori inverter) è la più adatta: adegua la velocità della pompa alla domanda e risparmia energia. Per dimensionare il modello in base alla potenza della pompa, il team tecnico la orienterà a ' + EMAIL + ' o al +34 93 736 29 50.',
      recDrainage: 'Per drenaggio (acque chiare, grigie o nere) o riempimento serbatoi, il Panelmatic della famiglia SmartTech è il più indicato: un quadro multifunzione che gestisce e protegge la pompa in queste modalità. Per la configurazione precisa, contatti il team tecnico a ' + EMAIL + '.',
      recIndustrial: 'Per uso industriale o impianti esigenti con pressione costante, la famiglia HiTech (variatori inverter) è di solito l\'opzione migliore. Se l\'applicazione è di drenaggio o trasferimento, anche il Panelmatic (SmartTech) può andare bene. Per una consulenza adatta al suo caso, il team tecnico la aiuterà a ' + EMAIL + ' o al +34 93 736 29 50.',
      pumps: 'COELBO non produce elettropompe: progetta e realizza i dispositivi elettronici che le controllano e proteggono (controllori, variatori e pressostati elettronici). Mi dica che impianto ha e la orienterò verso la famiglia adatta.',
      docs: 'Trova cataloghi, manuali e schede tecniche nella sezione Informazioni tecniche del sito COELBO. Per qualsiasi domanda può anche contattare ' + EMAIL + ' o il +34 93 736 29 50.',
      price: 'Non posso fornire prezzi né informazioni commerciali. Per preventivi, tempi o ordini, contatti COELBO a ' + EMAIL + ' o al +34 93 736 29 50. Posso però aiutarla a individuare la famiglia adatta al suo impianto.',
      config: 'La configurazione, i parametri e i valori di taratura sono gestiti dal nostro team tecnico e si trovano nel manuale del dispositivo, sezione Informazioni tecniche del sito. Per assistenza personalizzata, scriva a ' + EMAIL + ' o chiami il +34 93 736 29 50.',
      error: 'La diagnosi dei guasti e i codici di errore devono essere gestiti dal nostro team tecnico. Contatti COELBO a ' + EMAIL + ' o al +34 93 736 29 50; consulti anche il manuale nella sezione Informazioni tecniche del sito.',
      compat: 'La compatibilità esatta con un modello specifico di elettropompa deve essere validata dal nostro team tecnico. Contatti ' + EMAIL + ' o il +34 93 736 29 50. Nel frattempo, posso orientarla sulla famiglia più adatta al suo uso.',
      warranty: 'Garanzie, resi (RMA) e reclami sono gestiti dal nostro team. Contatti COELBO a ' + EMAIL + ' o al +34 93 736 29 50.',
      stock: 'Ordini, disponibilità e tempi di consegna sono questioni commerciali. Contatti COELBO a ' + EMAIL + ' o al +34 93 736 29 50. Posso però aiutarla a scegliere la famiglia di prodotto adatta.',
      fallback: 'Posso orientarla sulle tre famiglie di controllori COELBO —PressflowTech, HiTech e SmartTech— e aiutarla a scegliere in base all\'impianto (abitazione, comunità, edificio, hotel, uso industriale…). Mi descriva il caso; per questioni tecniche o commerciali specifiche la indirizzerò al team COELBO.'
    }
  };

  /* Permet a COELBO substituir textos sense tocar aquest fitxer: definiu
     window.COELBO_I18N_OVERRIDES = { es: { price: '…' }, en: {…} } abans d'aquest script. */
  if (typeof window !== 'undefined' && window.COELBO_I18N_OVERRIDES) {
    for (var _ol in window.COELBO_I18N_OVERRIDES) {
      if (I18N[_ol]) {
        var _ov = window.COELBO_I18N_OVERRIDES[_ol];
        for (var _ok in _ov) { if (_ov.hasOwnProperty(_ok)) { I18N[_ol][_ok] = _ov[_ok]; } }
      }
    }
  }

  /* mapatge intent -> clau de resposta */
  var INTENT_MAP = {
    greeting: 'greeting', overview: 'overview', pressflow: 'pressflow',
    hitech: 'hitech', smarttech: 'smarttech', recHouse: 'recHouse',
    recConstant: 'recConstant', recDrainage: 'recDrainage', recIndustrial: 'recIndustrial',
    pumps: 'pumps', docs: 'docs', price: 'price', config: 'config', error: 'error',
    compat: 'compat', warranty: 'warranty', stock: 'stock', fallback: 'fallback'
  };

  function answer(rawText, currentLang, context) {
    var raw = normalize(rawText);
    var text = spellNormalize(raw);          /* text amb errates corregides per classificar */
    var detected = detectLang(raw, currentLang);
    var lang = (detected && SUPPORTED.indexOf(detected) !== -1) ? detected : currentLang;
    context = context || {};

    var intent, reply, family = null, pdfFile = null, linkPage = null, model = detectModel(text);

    if (model) {
      /* Ha esmentat un model concret: diem a quina família pertany + resposta de família */
      family = model.f;
      intent = family;
      reply = MODEL_INTRO[lang](model.n, FAMILY_NAMES[family]) + I18N[lang][family];
      linkPage = PAGE_FOR_INTENT[family];
      pdfFile = model.pdf || PDF_FOR[family] || null;
    } else {
      intent = classify(text);
      /* Pregunta de seguiment ("amplia", "y eso"): usem la família del context */
      if (intent === 'fallback' && hasAny(text, MORE_KW) && context.family) {
        intent = context.family;
      }
      var key = INTENT_MAP[intent] || 'fallback';
      reply = I18N[lang][key];
      family = FAMILY_OF_INTENT[intent] || null;
      linkPage = PAGE_FOR_INTENT[intent] || (family ? PAGE_FOR_INTENT[family] : null);
      pdfFile = (family && PDF_FOR[family]) ? PDF_FOR[family] : null;
      if (intent === 'docs') { pdfFile = null; }
    }

    var contact = DERIVE_INTENTS.indexOf(intent) !== -1;
    if (contact) { reply = reply + ' ' + (FORM_HINT[lang] || ''); }

    return {
      lang: lang,
      reply: reply,
      contact: contact,
      linkPage: linkPage || null,
      pdf: pdfFile ? (PDF_BASE + pdfFile) : null,
      family: family,
      intent: intent
    };
  }

  /* Exposat per a proves o integració avançada */
  window.CoelboBot = {
    answer: answer,
    classify: function (t) { return classify(spellNormalize(normalize(t))); }
  };

  /* =========================================================
     Persistència (localStorage) — segura si no està disponible
     ========================================================= */
  var K_CHAT = 'coelbo_chat_v1';     /* idioma + conversa + família del context */
  var K_SEEN = 'coelbo_seen_v1';     /* ja s'ha obert alguna vegada (avís proactiu) */
  var K_SIZE = 'coelbo_size_v1';     /* mida del text (0/1/2) */
  var K_LASTQ = 'coelbo_last_q';     /* última pregunta (per pre-omplir el formulari) */
  var K_UNRES = 'coelbo_unresolved_v1'; /* preguntes no resoltes (analítica local) */

  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  /* =========================================================
     Widget d'interfície
     ========================================================= */
  /* Idioma inicial: pren l'atribut lang de la pàgina (<html lang="es_ES">,
     "ca", "en-US"…) i n'agafa els dos primers caràcters; si no és un idioma
     suportat, anglès per defecte. */
  function pageLang() {
    var l = (document.documentElement.getAttribute('lang') || '').slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(l) !== -1 ? l : 'en';
  }

  function buildWidget() {
    /* Estat inicial (recuperat de localStorage si n'hi ha; si no, l'idioma de la pàgina) */
    var saved = null;
    try { saved = JSON.parse(lsGet(K_CHAT) || 'null'); } catch (e) { saved = null; }
    var lang = (saved && SUPPORTED.indexOf(saved.lang) !== -1) ? saved.lang : pageLang();
    var context = { family: (saved && saved.family) || null };
    /* [{who,text}] preguntes/respostes desades; blindat contra dades corruptes */
    var history = (saved && Array.isArray(saved.msgs)) ? saved.msgs.slice(0) : [];
    var sizeIdx = parseInt(lsGet(K_SIZE) || '0', 10) || 0;

    var root = document.createElement('div');
    root.className = 'coelbo-chat';
    root.innerHTML =
      '<div class="cc-teaser" hidden>' +
        '<button class="cc-teaser-msg" type="button"></button>' +
      '</div>' +
      '<button class="cc-launcher" type="button" aria-haspopup="dialog" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26"><path fill="currentColor" d="M12 3C6.5 3 2 6.86 2 11.6c0 2.5 1.27 4.74 3.3 6.3L4.6 21.6l3.9-2.05c1.07.3 2.22.45 3.5.45 5.5 0 10-3.86 10-8.6S17.5 3 12 3z"/></svg>' +
        '<span class="cc-launcher-dot" aria-hidden="true"></span>' +
      '</button>' +
      '<section class="cc-panel" role="dialog" aria-modal="false" aria-label="COELBO" hidden>' +
        '<header class="cc-head">' +
          '<div class="cc-head-info">' +
            '<img class="cc-logo" alt="COELBO" src="' + LOGO + '">' +
            '<span class="cc-subtitle"></span>' +
          '</div>' +
          '<div class="cc-head-actions">' +
            '<span class="cc-textsize" role="group">' +
              '<button class="cc-ts-dec" type="button">A&minus;</button>' +
              '<button class="cc-ts-inc" type="button">A+</button>' +
            '</span>' +
            '<label class="cc-lang-wrap"><span class="cc-sr"></span>' +
              '<select class="cc-lang">' +
                '<option value="ca">CA</option><option value="es">ES</option>' +
                '<option value="en">EN</option><option value="fr">FR</option>' +
                '<option value="it">IT</option>' +
              '</select>' +
            '</label>' +
            '<button class="cc-close" type="button" aria-label="">' +
              '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
                '<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
                '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</header>' +
        '<div class="cc-log" role="log" aria-live="polite" aria-atomic="false"></div>' +
        '<form class="cc-form">' +
          '<input class="cc-input" type="text" autocomplete="off" />' +
          '<button class="cc-send" type="submit"></button>' +
        '</form>' +
        '<p class="cc-foot"></p>' +
      '</section>';
    document.body.appendChild(root);

    var els = {
      launcher: root.querySelector('.cc-launcher'),
      panel: root.querySelector('.cc-panel'),
      subtitle: root.querySelector('.cc-subtitle'),
      langSel: root.querySelector('.cc-lang'),
      langSr: root.querySelector('.cc-sr'),
      tsDec: root.querySelector('.cc-ts-dec'),
      tsInc: root.querySelector('.cc-ts-inc'),
      close: root.querySelector('.cc-close'),
      log: root.querySelector('.cc-log'),
      form: root.querySelector('.cc-form'),
      input: root.querySelector('.cc-input'),
      send: root.querySelector('.cc-send'),
      foot: root.querySelector('.cc-foot'),
      teaser: root.querySelector('.cc-teaser'),
      teaserMsg: root.querySelector('.cc-teaser-msg')
    };

    var started = false;     /* ja s'ha construït el registre (benvinguda + història) */
    var opened = false;      /* s'ha obert el xat en aquesta càrrega (per a l'avís proactiu) */
    var welcomeMsg = null;
    var langPick = null;

    function t() { return I18N[lang]; }
    function welcomeText() { return t().welcome + ' ' + (LANG_HINT[lang] || ''); }

    /* Desa l'estat de la conversa (limita a les últimes 40 per no inflar localStorage) */
    function persist() {
      var msgs = history.length > 40 ? history.slice(history.length - 40) : history;
      lsSet(K_CHAT, JSON.stringify({ lang: lang, family: context.family, msgs: msgs }));
    }

    function setLang(code) {
      if (SUPPORTED.indexOf(code) === -1 || code === lang) { return; }
      lang = code;
      applyLang();
      persist();
    }

    /* Aplica la mida de text triada */
    function applySize() { els.panel.setAttribute('data-size', String(sizeIdx)); }

    /* --- Missatges --- */
    function addMsgDom(who, text) {
      var msg = document.createElement('div');
      msg.className = 'cc-msg cc-' + who;
      var bubble = document.createElement('div');
      bubble.className = 'cc-bubble';
      bubble.textContent = text;
      msg.appendChild(bubble);
      els.log.appendChild(msg);
      els.log.scrollTop = els.log.scrollHeight;
      return msg;
    }
    /* addMsg = mostra + desa a la història */
    function addMsg(who, text) {
      var m = addMsgDom(who, text);
      history.push({ who: who, text: text });
      persist();
      return m;
    }

    function addLangChips() {
      var msg = document.createElement('div');
      msg.className = 'cc-msg cc-bot';
      var row = document.createElement('div');
      row.className = 'cc-langpick';
      row.setAttribute('role', 'group');
      row.setAttribute('aria-label', t().langLabel);
      SUPPORTED.forEach(function (code) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cc-langbtn' + (code === lang ? ' is-active' : '');
        btn.setAttribute('data-lang', code);
        btn.textContent = code.toUpperCase();
        btn.addEventListener('click', function () { setLang(code); });
        row.appendChild(btn);
      });
      msg.appendChild(row);
      els.log.appendChild(msg);
      langPick = row;
      els.log.scrollTop = els.log.scrollHeight;
    }

    function applyLang() {
      var s = t();
      els.subtitle.textContent = s.subtitle;
      els.langSr.textContent = s.langLabel;
      els.close.setAttribute('aria-label', s.close);
      els.tsDec.setAttribute('aria-label', TS_DEC[lang] || TS_DEC.en);
      els.tsDec.setAttribute('title', TS_DEC[lang] || TS_DEC.en);
      els.tsInc.setAttribute('aria-label', TS_INC[lang] || TS_INC.en);
      els.tsInc.setAttribute('title', TS_INC[lang] || TS_INC.en);
      els.input.setAttribute('placeholder', s.placeholder);
      els.input.setAttribute('aria-label', s.placeholder);
      els.send.textContent = s.send;
      els.foot.textContent = s.disclaimer;
      els.launcher.setAttribute('aria-label', s.open);
      els.langSel.value = lang;
      if (welcomeMsg) {
        var bubble = welcomeMsg.querySelector('.cc-bubble');
        if (bubble) { bubble.textContent = welcomeText(); }
      }
      if (langPick) {
        Array.prototype.forEach.call(langPick.querySelectorAll('.cc-langbtn'), function (b) {
          b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
        });
      }
    }

    function botTyping() {
      var msg = document.createElement('div');
      msg.className = 'cc-msg cc-bot cc-typing';
      msg.innerHTML = '<div class="cc-bubble"><span></span><span></span><span></span></div>';
      els.log.appendChild(msg);
      els.log.scrollTop = els.log.scrollHeight;
      return msg;
    }

    /* Botó/enllaç auxiliar sota una resposta (contacte, web, PDF) */
    function addAction(text, href, opts) {
      opts = opts || {};
      var msg = document.createElement('div');
      msg.className = 'cc-msg cc-bot';
      var link = document.createElement('a');
      link.className = 'cc-cta' + (opts.ghost ? ' cc-cta-ghost' : '');
      link.href = href;
      if (opts.blank) { link.target = '_blank'; link.rel = 'noopener'; }
      link.textContent = text;
      msg.appendChild(link);
      els.log.appendChild(msg);
      els.log.scrollTop = els.log.scrollHeight;
    }

    function botReply(userText) {
      var typing = botTyping();
      var res = answer(userText, lang, context);
      var delay = 1000 + Math.min(2800, (userText.length + res.reply.length) * 12);
      window.setTimeout(function () {
        if (res.lang !== lang) { lang = res.lang; applyLang(); }
        typing.parentNode.removeChild(typing);
        addMsg('bot', res.reply);
        /* Recordem la família per a preguntes de seguiment */
        if (res.family) { context.family = res.family; persist(); }
        /* Enllaç directe a la pàgina concreta de la web */
        if (res.linkPage) {
          var siteLang = (lang === 'ca') ? 'es' : lang;
          addAction(LABEL_INFO[lang] || LABEL_INFO.es,
            'https://www.coelbo.es/' + siteLang + '/index.php?cont=' + res.linkPage, { blank: true });
        }
        /* Descàrrega directa del catàleg (PDF) */
        if (res.pdf) {
          addAction(LABEL_PDF[lang] || LABEL_PDF.es, res.pdf, { blank: true, ghost: true });
        }
        /* Si no ho pot resoldre: botó al formulari + analítica local */
        if (res.contact) {
          addAction(CTA[lang] || CTA.es, CONTACT_URL, {});
          logUnresolved(userText, res.intent);
        }
      }, delay);
    }

    /* Analítica local: desa preguntes no resoltes (fins a 100) */
    function logUnresolved(q, intent) {
      var arr = [];
      try { arr = JSON.parse(lsGet(K_UNRES) || '[]'); } catch (e) { arr = []; }
      arr.push({ q: q, intent: intent, at: new Date().toISOString(), lang: lang });
      if (arr.length > 100) { arr = arr.slice(arr.length - 100); }
      lsSet(K_UNRES, JSON.stringify(arr));
    }

    function submitText(value) {
      var text = (value || '').trim();
      if (!text) { return; }
      lsSet(K_LASTQ, text);   /* per pre-omplir el formulari de contacte */
      addMsg('user', text);
      els.input.value = '';
      botReply(text);
    }

    /* Construeix el registre la primera vegada (benvinguda + història desada) */
    function buildLog() {
      welcomeMsg = addMsgDom('bot', welcomeText());
      addLangChips();
      history.forEach(function (h) { addMsgDom(h.who, h.text); });
    }

    function hideTeaser() { els.teaser.hidden = true; }

    function openPanel() {
      els.panel.hidden = false;
      els.launcher.setAttribute('aria-expanded', 'true');
      root.classList.add('is-open');
      hideTeaser();
      opened = true;
      if (!started) { started = true; buildLog(); }
      window.setTimeout(function () { els.input.focus(); }, 50);
    }

    function closePanel() {
      els.panel.hidden = true;
      els.launcher.setAttribute('aria-expanded', 'false');
      root.classList.remove('is-open');
      els.launcher.focus();
    }

    els.launcher.addEventListener('click', function () {
      if (els.panel.hidden) { openPanel(); } else { closePanel(); }
    });
    els.close.addEventListener('click', closePanel);
    els.form.addEventListener('submit', function (e) { e.preventDefault(); submitText(els.input.value); });
    els.langSel.addEventListener('change', function () { lang = els.langSel.value; applyLang(); persist(); });
    els.tsDec.addEventListener('click', function () {
      if (sizeIdx > 0) { sizeIdx--; applySize(); lsSet(K_SIZE, String(sizeIdx)); }
    });
    els.tsInc.addEventListener('click', function () {
      if (sizeIdx < 2) { sizeIdx++; applySize(); lsSet(K_SIZE, String(sizeIdx)); }
    });
    els.teaserMsg.addEventListener('click', openPanel);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !els.panel.hidden) { closePanel(); }
    });

    applySize();
    applyLang();

    /* Avís proactiu: als 6 s, si encara no s'ha obert el xat en aquesta càrrega.
       Un cop apareix, es tanca sol als 5 s (o abans si s'obre el xat o s'hi clica). */
    window.setTimeout(function () {
      if (!opened && els.panel.hidden) {
        els.teaserMsg.textContent = TEASER[lang] || TEASER.en;
        els.teaser.hidden = false;
        window.setTimeout(hideTeaser, 5000);
      }
    }, 6000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
