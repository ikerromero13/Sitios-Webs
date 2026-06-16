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
      'casa unifamiliar', 'unifamiliar', 'pozo', 'pou', 'well', 'maison', 'villa',
      'casa de campo', 'mi casa', 'aljibe', 'cisterna', 'grifo', 'aixeta', 'robinet',
      'abro el grifo', 'obro l aixeta'],
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

  /* ---------- Detecció d'idioma (heurística per paraules freqüents) ---------- */
  var LANG_HINTS = {
    ca: ['aixeta', 'aigua', 'instal lacio', 'quina', 'aquesta', 'necessito', 'tinc',
      'puc', 'gracies', 'bon dia', 'vull', 'meva', 'seva', 'aparell', 'que necessito'],
    es: ['necesito', 'instalacion', 'quiero', 'tengo', 'gracias', 'buenas', 'presion',
      'grifo', 'cual', 'mi casa', 'cuanto', 'como configuro', 'que necesito'],
    en: ['i have', 'i need', 'what', 'which', 'how much', 'pump', 'thanks', 'hello',
      'my house', 'water', 'price of', 'do you'],
    fr: ['bonjour', 'j ai', 'besoin', 'comment', 'quelle', 'pompe', 'prix', 'merci',
      'robinet', 'pour ma', 'je veux'],
    it: ['ciao', 'come', 'quale', 'pompa', 'pompe', 'prezzo', 'grazie', 'acqua',
      'rubinetto', 'installazione', 'vorrei', 'salve', 'ho una', 'avete', 'vendita']
  };

  function detectLang(text) {
    var best = null, bestScore = 0;
    for (var lang in LANG_HINTS) {
      if (!LANG_HINTS.hasOwnProperty(lang)) { continue; }
      var score = 0, hints = LANG_HINTS[lang];
      for (var i = 0; i < hints.length; i++) {
        if (text.indexOf(hints[i]) !== -1) { score++; }
      }
      if (score > bestScore) { bestScore = score; best = lang; }
    }
    return bestScore > 0 ? best : null;
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

  /* mapatge intent -> clau de resposta */
  var INTENT_MAP = {
    greeting: 'greeting', overview: 'overview', pressflow: 'pressflow',
    hitech: 'hitech', smarttech: 'smarttech', recHouse: 'recHouse',
    recConstant: 'recConstant', recDrainage: 'recDrainage', recIndustrial: 'recIndustrial',
    pumps: 'pumps', docs: 'docs', price: 'price', config: 'config', error: 'error',
    compat: 'compat', warranty: 'warranty', stock: 'stock', fallback: 'fallback'
  };

  function answer(rawText, currentLang) {
    var text = normalize(rawText);
    var detected = detectLang(text);
    var lang = (detected && SUPPORTED.indexOf(detected) !== -1) ? detected : currentLang;
    var intent = classify(text);
    var key = INTENT_MAP[intent] || 'fallback';
    return { lang: lang, reply: I18N[lang][key] };
  }

  /* Exposat per a proves o integració avançada */
  window.CoelboBot = { answer: answer, classify: function (t) { return classify(normalize(t)); } };

  /* =========================================================
     Widget d'interfície
     ========================================================= */
  function buildWidget() {
    var initial = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    var lang = SUPPORTED.indexOf(initial) !== -1 ? initial : 'es';

    var root = document.createElement('div');
    root.className = 'coelbo-chat';
    root.innerHTML =
      '<button class="cc-launcher" type="button" aria-haspopup="dialog" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" width="26" height="26"><path fill="currentColor" d="M12 3C6.5 3 2 6.86 2 11.6c0 2.5 1.27 4.74 3.3 6.3L4.6 21.6l3.9-2.05c1.07.3 2.22.45 3.5.45 5.5 0 10-3.86 10-8.6S17.5 3 12 3z"/></svg>' +
        '<span class="cc-launcher-dot" aria-hidden="true"></span>' +
      '</button>' +
      '<section class="cc-panel" role="dialog" aria-modal="false" aria-label="COELBO" hidden>' +
        '<header class="cc-head">' +
          '<div class="cc-head-info">' +
            '<span class="cc-title"></span>' +
            '<span class="cc-subtitle"></span>' +
          '</div>' +
          '<div class="cc-head-actions">' +
            '<label class="cc-lang-wrap"><span class="cc-sr"></span>' +
              '<select class="cc-lang">' +
                '<option value="ca">CA</option><option value="es">ES</option>' +
                '<option value="en">EN</option><option value="fr">FR</option>' +
                '<option value="it">IT</option>' +
              '</select>' +
            '</label>' +
            '<button class="cc-close" type="button" aria-label="">' +
              '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 6.7 17.3 5.29 15.88 9.18 12 5.29 8.12 6.7 6.71l3.89 3.88L16.89 4.3z"/></svg>' +
            '</button>' +
          '</div>' +
        '</header>' +
        '<div class="cc-log" role="log" aria-live="polite" aria-atomic="false"></div>' +
        '<div class="cc-chips"></div>' +
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
      title: root.querySelector('.cc-title'),
      subtitle: root.querySelector('.cc-subtitle'),
      langSel: root.querySelector('.cc-lang'),
      langSr: root.querySelector('.cc-sr'),
      close: root.querySelector('.cc-close'),
      log: root.querySelector('.cc-log'),
      chips: root.querySelector('.cc-chips'),
      form: root.querySelector('.cc-form'),
      input: root.querySelector('.cc-input'),
      send: root.querySelector('.cc-send'),
      foot: root.querySelector('.cc-foot')
    };

    var started = false;

    function t() { return I18N[lang]; }

    function applyLang() {
      var s = t();
      els.title.textContent = s.title;
      els.subtitle.textContent = s.subtitle;
      els.langSr.textContent = s.langLabel;
      els.close.setAttribute('aria-label', s.close);
      els.input.setAttribute('placeholder', s.placeholder);
      els.input.setAttribute('aria-label', s.placeholder);
      els.send.textContent = s.send;
      els.foot.textContent = s.disclaimer;
      els.launcher.setAttribute('aria-label', s.open);
      els.langSel.value = lang;
      renderChips();
    }

    function addMsg(who, textContent) {
      var msg = document.createElement('div');
      msg.className = 'cc-msg cc-' + who;
      var bubble = document.createElement('div');
      bubble.className = 'cc-bubble';
      bubble.textContent = textContent;
      msg.appendChild(bubble);
      els.log.appendChild(msg);
      els.log.scrollTop = els.log.scrollHeight;
      return msg;
    }

    function botTyping() {
      var msg = document.createElement('div');
      msg.className = 'cc-msg cc-bot cc-typing';
      msg.innerHTML = '<div class="cc-bubble"><span></span><span></span><span></span></div>';
      els.log.appendChild(msg);
      els.log.scrollTop = els.log.scrollHeight;
      return msg;
    }

    function botReply(userText) {
      var typing = botTyping();
      window.setTimeout(function () {
        var res = answer(userText, lang);
        if (res.lang !== lang) { lang = res.lang; applyLang(); }
        typing.parentNode.removeChild(typing);
        addMsg('bot', res.reply);
      }, 450);
    }

    function renderChips() {
      els.chips.innerHTML = '';
      t().chips.forEach(function (label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cc-chip';
        b.textContent = label;
        b.addEventListener('click', function () { submitText(label); });
        els.chips.appendChild(b);
      });
    }

    function submitText(value) {
      var text = (value || '').trim();
      if (!text) { return; }
      addMsg('user', text);
      els.input.value = '';
      botReply(text);
    }

    function openPanel() {
      els.panel.hidden = false;
      els.launcher.setAttribute('aria-expanded', 'true');
      root.classList.add('is-open');
      if (!started) {
        started = true;
        addMsg('bot', t().welcome);
      }
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
    els.form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitText(els.input.value);
    });
    els.langSel.addEventListener('change', function () {
      lang = els.langSel.value;
      applyLang();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !els.panel.hidden) { closePanel(); }
    });

    applyLang();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
