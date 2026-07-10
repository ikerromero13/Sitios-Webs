/* ============================================================
   i18n — conmutador de idioma ES / CA / EN
   Sin dependencias. Traduce elementos con [data-i18n].
   El HTML se sirve en castellano (por defecto, para SEO);
   este script sustituye los textos al cambiar de idioma.
   ============================================================ */
(function () {
  "use strict";

  const DICT = {
    es: {
      "nav.services": "Servicios",
      "nav.about": "Nosotros",
      "nav.testimonials": "Opiniones",
      "nav.gallery": "Galería",
      "nav.faq": "FAQ",
      "nav.contact": "Contacto",
      "nav.cta": "Pide presupuesto",

      "hero.eyebrow": "Decoración de bodas y eventos · Terrassa",
      "hero.title": "Convertimos tu día en un recuerdo <em>inolvidable</em>",
      "hero.sub": "Diseñamos y decoramos bodas y celebraciones con alma en Terrassa y toda Catalunya. Del primer boceto al último detalle, tú solo disfrutas.",
      "hero.cta1": "Cuéntanos tu evento",
      "hero.cta2": "Ver nuestro trabajo",
      "hero.stat1n": "Diseño a medida",
      "hero.stat1t": "Cada evento parte de cero, según tu historia.",
      "hero.stat2n": "Terrassa · Catalunya",
      "hero.stat2t": "Nos desplazamos a tu espacio o finca.",
      "hero.scroll": "Descubre más",

      "marquee.1": "Bodas",
      "marquee.2": "Bautizos",
      "marquee.3": "Comuniones",
      "marquee.4": "Decoración floral",
      "marquee.5": "Eventos privados",
      "marquee.6": "Photocalls",

      "services.eyebrow": "Lo que hacemos",
      "services.title": "Decoración pensada para emocionar",
      "services.lead": "Servicios que se adaptan a tu estilo y a tu presupuesto. Elige uno o déjalo todo en nuestras manos.",
      "services.s1t": "Bodas",
      "services.s1d": "Ceremonia, banquete y photocall. Creamos una atmósfera coherente y elegante de principio a fin.",
      "services.s2t": "Decoración floral",
      "services.s2d": "Arcos, centros de mesa y composiciones florales diseñadas a mano para tu paleta de color.",
      "services.s3t": "Bautizos y comuniones",
      "services.s3d": "Celebraciones familiares llenas de detalle, ternura y ese toque especial que recordaréis.",
      "services.s4t": "Eventos privados",
      "services.s4d": "Aniversarios, pedidas y celebraciones íntimas montadas con mimo en el espacio que elijas.",
      "services.s5t": "Photocalls y ambientación",
      "services.s5d": "Rincones instagrameables, iluminación y detalles que convierten cualquier espacio en escenario.",
      "services.s6t": "Alquiler de mobiliario",
      "services.s6d": "Mobiliario, vajilla y atrezzo seleccionado para vestir tu evento sin complicaciones. [COMPLETAR: confirmar disponibilidad]",
      "services.tag": "Consúltanos",

      "about.eyebrow": "Sobre Hanna",
      "about.title": "Detrás de cada evento, personas que cuidan cada detalle",
      "about.p1": "Hanna Events & Decorations nace en Terrassa con una idea sencilla: que decorar tu celebración sea tan bonito como vivirla. Escuchamos vuestra historia y la traducimos en una puesta en escena única.",
      "about.p2": "[COMPLETAR: breve historia real del negocio — cómo empezó, quién forma el equipo y qué os hace diferentes.]",
      "about.v1t": "Diseño personalizado",
      "about.v1d": "Nada de plantillas: cada montaje se piensa para vosotros.",
      "about.v2t": "Cercanía real",
      "about.v2d": "Os acompañamos y aconsejamos en todo el proceso.",
      "about.v3t": "Detalle y calidad",
      "about.v3d": "Materiales y flores cuidados hasta el último centímetro.",
      "about.badgen": "Hecho",
      "about.badget": "con amor",

      "testi.eyebrow": "Lo que dicen las familias",
      "testi.title": "Celebraciones que dejan huella",
      "testi.lead": "La mayor recompensa es ver vuestra cara al entrar en la sala. Estas opiniones son ejemplos de muestra hasta publicar las reales.",
      "testi.q1": "Transformaron el espacio en algo mágico. Nuestros invitados no paraban de hacer fotos.",
      "testi.a1n": "Laura & Marc",
      "testi.a1r": "Boda en Terrassa",
      "testi.q2": "Profesionales, cercanas y con un gusto exquisito. Lo hicieron todo fácil.",
      "testi.a2n": "Núria G.",
      "testi.a2r": "Comunión",
      "testi.q3": "Entendieron justo lo que queríamos y superaron nuestras expectativas.",
      "testi.a3n": "Family Puig",
      "testi.a3r": "Aniversario",
      "testi.demo": "Ejemplo",
      "testi.reviews": "Reseñas en Bodas.net",
      "testi.insta": "Míranos en Instagram",

      "gallery.eyebrow": "Portfolio",
      "gallery.title": "Un vistazo a nuestro trabajo",
      "gallery.lead": "Una muestra de montajes, flores y ambientes. Sustituiremos estas imágenes por fotos reales de vuestros eventos.",
      "gallery.c1": "Ceremonia",
      "gallery.c2": "Mesa de invitados",
      "gallery.c3": "Arco floral",
      "gallery.c4": "Iluminación",
      "gallery.c5": "Bautizo",
      "gallery.c6": "Detalles",

      "faq.eyebrow": "Dudas frecuentes",
      "faq.title": "Preguntas frecuentes",
      "faq.q1": "¿Con cuánta antelación debería contactar?",
      "faq.a1": "Cuanto antes, mejor: las fechas de temporada alta (primavera y verano) se ocupan rápido. Idealmente entre 6 y 12 meses antes, pero escríbenos igualmente y miramos disponibilidad.",
      "faq.q2": "¿Trabajáis solo en Terrassa?",
      "faq.a2": "Estamos en Terrassa y nos desplazamos por toda Catalunya: fincas, salones, restaurantes o espacios al aire libre. Consúltanos tu ubicación.",
      "faq.q3": "¿Qué incluye un presupuesto?",
      "faq.a3": "Preparamos una propuesta personalizada según tu tipo de evento, número de invitados y estilo. Detallamos decoración, flores, mobiliario y montaje/desmontaje sin sorpresas.",
      "faq.q4": "¿Puedo elegir la paleta de colores y el estilo?",
      "faq.a4": "Por supuesto. Partimos de vuestras ideas, referencias e inspiración y diseñamos un concepto a medida que encaje con vosotros y con el espacio.",
      "faq.q5": "¿Os encargáis del montaje y el desmontaje?",
      "faq.a5": "Sí. Nos ocupamos de instalar todo antes del evento y de recogerlo al terminar, para que vosotros solo tengáis que disfrutar.",
      "faq.q6": "¿Se pide una reserva o señal?",
      "faq.a6": "[COMPLETAR: política real de reserva/señal y condiciones de pago.] Te lo explicamos con total transparencia antes de confirmar.",

      "contact.eyebrow": "Hablemos",
      "contact.title": "Cuéntanos qué estás imaginando",
      "contact.lead": "Escríbenos sin compromiso y te respondemos con ideas y un presupuesto a tu medida.",
      "contact.phone": "Teléfono",
      "contact.email": "Email",
      "contact.emailv": "[COMPLETAR: email de contacto]",
      "contact.addr": "Dónde estamos",
      "contact.hours": "Horario",
      "contact.hoursv": "[COMPLETAR: horario de atención]",
      "contact.follow": "Síguenos",
      "form.name": "Nombre",
      "form.contact": "Email o teléfono",
      "form.event": "Tipo de evento",
      "form.eventph": "Boda, bautizo, comunión…",
      "form.msg": "Cuéntanos tu idea",
      "form.consent": "He leído y acepto la",
      "form.consent2": "política de privacidad",
      "form.submit": "Enviar solicitud",
      "form.wa": "O escríbenos por WhatsApp",
      "form.note": "Te responderemos lo antes posible. Sin compromiso.",
      "form.ok": "¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.",
      "form.err": "Ups, algo ha fallado. Prueba de nuevo o escríbenos por WhatsApp.",

      "footer.tagline": "Decoración de bodas y eventos con alma en Terrassa y toda Catalunya.",
      "footer.explore": "Explora",
      "footer.legal": "Legal",
      "footer.aviso": "Aviso legal",
      "footer.privacy": "Política de privacidad",
      "footer.cookies": "Política de cookies",
      "footer.contactc": "Contacto",
      "footer.rights": "Todos los derechos reservados.",
      "footer.madeby": "Diseño web a medida",

      "cookies.title": "Usamos cookies 🍪",
      "cookies.text": "Utilizamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico. Puedes aceptarlas o rechazar las no esenciales. Más info en nuestra",
      "cookies.accept": "Aceptar todas",
      "cookies.reject": "Solo esenciales"
    },

    ca: {
      "nav.services": "Serveis",
      "nav.about": "Nosaltres",
      "nav.testimonials": "Opinions",
      "nav.gallery": "Galeria",
      "nav.faq": "FAQ",
      "nav.contact": "Contacte",
      "nav.cta": "Demana pressupost",

      "hero.eyebrow": "Decoració de bodes i esdeveniments · Terrassa",
      "hero.title": "Convertim el teu dia en un record <em>inoblidable</em>",
      "hero.sub": "Dissenyem i decorem bodes i celebracions amb ànima a Terrassa i tota Catalunya. Del primer esbós a l'últim detall, tu només gaudeixes.",
      "hero.cta1": "Explica'ns el teu esdeveniment",
      "hero.cta2": "Veure la nostra feina",
      "hero.stat1n": "Disseny a mida",
      "hero.stat1t": "Cada esdeveniment parteix de zero, segons la teva història.",
      "hero.stat2n": "Terrassa · Catalunya",
      "hero.stat2t": "Ens desplacem al teu espai o finca.",
      "hero.scroll": "Descobreix més",

      "marquee.1": "Bodes",
      "marquee.2": "Bateigs",
      "marquee.3": "Comunions",
      "marquee.4": "Decoració floral",
      "marquee.5": "Esdeveniments privats",
      "marquee.6": "Photocalls",

      "services.eyebrow": "El que fem",
      "services.title": "Decoració pensada per emocionar",
      "services.lead": "Serveis que s'adapten al teu estil i al teu pressupost. Tria'n un o deixa-ho tot a les nostres mans.",
      "services.s1t": "Bodes",
      "services.s1d": "Cerimònia, banquet i photocall. Creem una atmosfera coherent i elegant de principi a fi.",
      "services.s2t": "Decoració floral",
      "services.s2d": "Arcs, centres de taula i composicions florals dissenyades a mà per a la teva paleta de color.",
      "services.s3t": "Bateigs i comunions",
      "services.s3d": "Celebracions familiars plenes de detall, tendresa i aquell toc especial que recordareu.",
      "services.s4t": "Esdeveniments privats",
      "services.s4d": "Aniversaris, demandes i celebracions íntimes muntades amb cura a l'espai que triïs.",
      "services.s5t": "Photocalls i ambientació",
      "services.s5d": "Racons instagramejables, il·luminació i detalls que converteixen qualsevol espai en escenari.",
      "services.s6t": "Lloguer de mobiliari",
      "services.s6d": "Mobiliari, vaixella i attrezzo seleccionat per vestir el teu esdeveniment sense complicacions. [COMPLETAR: confirmar disponibilitat]",
      "services.tag": "Consulta'ns",

      "about.eyebrow": "Sobre Hanna",
      "about.title": "Darrere de cada esdeveniment, persones que cuiden cada detall",
      "about.p1": "Hanna Events & Decorations neix a Terrassa amb una idea senzilla: que decorar la teva celebració sigui tan bonic com viure-la. Escoltem la vostra història i la traduïm en una posada en escena única.",
      "about.p2": "[COMPLETAR: breu història real del negoci — com va començar, qui forma l'equip i què us fa diferents.]",
      "about.v1t": "Disseny personalitzat",
      "about.v1d": "Res de plantilles: cada muntatge es pensa per a vosaltres.",
      "about.v2t": "Proximitat real",
      "about.v2d": "Us acompanyem i aconsellem en tot el procés.",
      "about.v3t": "Detall i qualitat",
      "about.v3d": "Materials i flors cuidats fins a l'últim centímetre.",
      "about.badgen": "Fet",
      "about.badget": "amb amor",

      "testi.eyebrow": "El que diuen les famílies",
      "testi.title": "Celebracions que deixen empremta",
      "testi.lead": "La millor recompensa és veure la vostra cara en entrar a la sala. Aquestes opinions són exemples de mostra fins a publicar les reals.",
      "testi.q1": "Van transformar l'espai en una cosa màgica. Els nostres convidats no paraven de fer fotos.",
      "testi.a1n": "Laura & Marc",
      "testi.a1r": "Boda a Terrassa",
      "testi.q2": "Professionals, properes i amb un gust exquisit. Ho van fer tot fàcil.",
      "testi.a2n": "Núria G.",
      "testi.a2r": "Comunió",
      "testi.q3": "Van entendre just el que volíem i van superar les nostres expectatives.",
      "testi.a3n": "Family Puig",
      "testi.a3r": "Aniversari",
      "testi.demo": "Exemple",
      "testi.reviews": "Ressenyes a Bodas.net",
      "testi.insta": "Mira'ns a Instagram",

      "gallery.eyebrow": "Portfolio",
      "gallery.title": "Una ullada a la nostra feina",
      "gallery.lead": "Una mostra de muntatges, flors i ambients. Substituirem aquestes imatges per fotos reals dels vostres esdeveniments.",
      "gallery.c1": "Cerimònia",
      "gallery.c2": "Taula de convidats",
      "gallery.c3": "Arc floral",
      "gallery.c4": "Il·luminació",
      "gallery.c5": "Bateig",
      "gallery.c6": "Detalls",

      "faq.eyebrow": "Dubtes freqüents",
      "faq.title": "Preguntes freqüents",
      "faq.q1": "Amb quanta antelació hauria de contactar?",
      "faq.a1": "Com abans, millor: les dates de temporada alta (primavera i estiu) s'ocupen ràpid. Idealment entre 6 i 12 mesos abans, però escriu-nos igualment i mirem disponibilitat.",
      "faq.q2": "Treballeu només a Terrassa?",
      "faq.a2": "Som a Terrassa i ens desplacem per tota Catalunya: finques, salons, restaurants o espais a l'aire lliure. Consulta'ns la teva ubicació.",
      "faq.q3": "Què inclou un pressupost?",
      "faq.a3": "Preparem una proposta personalitzada segons el teu tipus d'esdeveniment, nombre de convidats i estil. Detallem decoració, flors, mobiliari i muntatge/desmuntatge sense sorpreses.",
      "faq.q4": "Puc triar la paleta de colors i l'estil?",
      "faq.a4": "És clar. Partim de les vostres idees, referències i inspiració i dissenyem un concepte a mida que encaixi amb vosaltres i amb l'espai.",
      "faq.q5": "Us encarregueu del muntatge i el desmuntatge?",
      "faq.a5": "Sí. Ens ocupem d'instal·lar-ho tot abans de l'esdeveniment i de recollir-ho en acabar, perquè vosaltres només hàgiu de gaudir.",
      "faq.q6": "Es demana una reserva o senyal?",
      "faq.a6": "[COMPLETAR: política real de reserva/senyal i condicions de pagament.] T'ho expliquem amb total transparència abans de confirmar.",

      "contact.eyebrow": "Parlem-ne",
      "contact.title": "Explica'ns què estàs imaginant",
      "contact.lead": "Escriu-nos sense compromís i et responem amb idees i un pressupost a la teva mida.",
      "contact.phone": "Telèfon",
      "contact.email": "Email",
      "contact.emailv": "[COMPLETAR: email de contacte]",
      "contact.addr": "On som",
      "contact.hours": "Horari",
      "contact.hoursv": "[COMPLETAR: horari d'atenció]",
      "contact.follow": "Segueix-nos",
      "form.name": "Nom",
      "form.contact": "Email o telèfon",
      "form.event": "Tipus d'esdeveniment",
      "form.eventph": "Boda, bateig, comunió…",
      "form.msg": "Explica'ns la teva idea",
      "form.consent": "He llegit i accepto la",
      "form.consent2": "política de privacitat",
      "form.submit": "Enviar sol·licitud",
      "form.wa": "O escriu-nos per WhatsApp",
      "form.note": "Et respondrem al més aviat possible. Sense compromís.",
      "form.ok": "Gràcies! Hem rebut el teu missatge i et contactarem aviat.",
      "form.err": "Ups, alguna cosa ha fallat. Prova de nou o escriu-nos per WhatsApp.",

      "footer.tagline": "Decoració de bodes i esdeveniments amb ànima a Terrassa i tota Catalunya.",
      "footer.explore": "Explora",
      "footer.legal": "Legal",
      "footer.aviso": "Avís legal",
      "footer.privacy": "Política de privacitat",
      "footer.cookies": "Política de cookies",
      "footer.contactc": "Contacte",
      "footer.rights": "Tots els drets reservats.",
      "footer.madeby": "Disseny web a mida",

      "cookies.title": "Fem servir cookies 🍪",
      "cookies.text": "Utilitzem cookies pròpies i de tercers per millorar la teva experiència i analitzar el trànsit. Pots acceptar-les o rebutjar les no essencials. Més info a la nostra",
      "cookies.accept": "Acceptar-les totes",
      "cookies.reject": "Només essencials"
    },

    en: {
      "nav.services": "Services",
      "nav.about": "About",
      "nav.testimonials": "Reviews",
      "nav.gallery": "Gallery",
      "nav.faq": "FAQ",
      "nav.contact": "Contact",
      "nav.cta": "Get a quote",

      "hero.eyebrow": "Wedding & event decoration · Terrassa",
      "hero.title": "We turn your day into an <em>unforgettable</em> memory",
      "hero.sub": "We design and decorate weddings and celebrations with soul in Terrassa and across Catalonia. From the first sketch to the last detail, you just enjoy.",
      "hero.cta1": "Tell us about your event",
      "hero.cta2": "See our work",
      "hero.stat1n": "Bespoke design",
      "hero.stat1t": "Every event starts from scratch, based on your story.",
      "hero.stat2n": "Terrassa · Catalonia",
      "hero.stat2t": "We travel to your venue or estate.",
      "hero.scroll": "Discover more",

      "marquee.1": "Weddings",
      "marquee.2": "Christenings",
      "marquee.3": "Communions",
      "marquee.4": "Floral design",
      "marquee.5": "Private events",
      "marquee.6": "Photocalls",

      "services.eyebrow": "What we do",
      "services.title": "Decoration made to move you",
      "services.lead": "Services that adapt to your style and budget. Pick one or leave it all in our hands.",
      "services.s1t": "Weddings",
      "services.s1d": "Ceremony, banquet and photocall. We craft a coherent, elegant atmosphere from start to finish.",
      "services.s2t": "Floral design",
      "services.s2d": "Arches, centrepieces and floral compositions handcrafted for your colour palette.",
      "services.s3t": "Christenings & communions",
      "services.s3d": "Family celebrations full of detail, warmth and that special touch you'll remember.",
      "services.s4t": "Private events",
      "services.s4d": "Anniversaries, proposals and intimate gatherings set up with care in the space you choose.",
      "services.s5t": "Photocalls & styling",
      "services.s5d": "Instagrammable corners, lighting and details that turn any space into a stage.",
      "services.s6t": "Furniture rental",
      "services.s6d": "Curated furniture, tableware and props to dress your event effortlessly. [COMPLETAR: confirm availability]",
      "services.tag": "Ask us",

      "about.eyebrow": "About Hanna",
      "about.title": "Behind every event, people who care about every detail",
      "about.p1": "Hanna Events & Decorations was born in Terrassa with a simple idea: making the decoration of your celebration as beautiful as living it. We listen to your story and translate it into a unique setting.",
      "about.p2": "[COMPLETAR: real short story of the business — how it began, who's on the team and what makes you different.]",
      "about.v1t": "Personalised design",
      "about.v1d": "No templates: every setup is designed for you.",
      "about.v2t": "Genuinely close",
      "about.v2d": "We guide and advise you throughout the whole process.",
      "about.v3t": "Detail & quality",
      "about.v3d": "Materials and flowers cared for down to the last inch.",
      "about.badgen": "Made",
      "about.badget": "with love",

      "testi.eyebrow": "What families say",
      "testi.title": "Celebrations that leave a mark",
      "testi.lead": "The greatest reward is seeing your face as you walk into the room. These reviews are sample examples until the real ones are published.",
      "testi.q1": "They transformed the space into something magical. Our guests couldn't stop taking photos.",
      "testi.a1n": "Laura & Marc",
      "testi.a1r": "Wedding in Terrassa",
      "testi.q2": "Professional, warm and with exquisite taste. They made everything easy.",
      "testi.a2n": "Núria G.",
      "testi.a2r": "Communion",
      "testi.q3": "They understood exactly what we wanted and exceeded our expectations.",
      "testi.a3n": "Family Puig",
      "testi.a3r": "Anniversary",
      "testi.demo": "Example",
      "testi.reviews": "Reviews on Bodas.net",
      "testi.insta": "See us on Instagram",

      "gallery.eyebrow": "Portfolio",
      "gallery.title": "A glimpse of our work",
      "gallery.lead": "A sample of setups, flowers and atmospheres. We'll replace these images with real photos of your events.",
      "gallery.c1": "Ceremony",
      "gallery.c2": "Guest table",
      "gallery.c3": "Floral arch",
      "gallery.c4": "Lighting",
      "gallery.c5": "Christening",
      "gallery.c6": "Details",

      "faq.eyebrow": "Common questions",
      "faq.title": "Frequently asked questions",
      "faq.q1": "How far in advance should I get in touch?",
      "faq.a1": "The sooner the better: peak-season dates (spring and summer) fill up fast. Ideally 6 to 12 months ahead, but write to us anyway and we'll check availability.",
      "faq.q2": "Do you only work in Terrassa?",
      "faq.a2": "We're based in Terrassa and travel across Catalonia: estates, halls, restaurants or outdoor spaces. Ask us about your location.",
      "faq.q3": "What does a quote include?",
      "faq.a3": "We prepare a tailored proposal based on your type of event, number of guests and style. We detail decoration, flowers, furniture and setup/teardown with no surprises.",
      "faq.q4": "Can I choose the colour palette and style?",
      "faq.a4": "Absolutely. We start from your ideas, references and inspiration and design a bespoke concept that fits you and the space.",
      "faq.q5": "Do you handle setup and teardown?",
      "faq.a5": "Yes. We take care of installing everything before the event and removing it afterwards, so all you have to do is enjoy.",
      "faq.q6": "Is a deposit required?",
      "faq.a6": "[COMPLETAR: real deposit policy and payment terms.] We'll explain it with full transparency before confirming.",

      "contact.eyebrow": "Let's talk",
      "contact.title": "Tell us what you're imagining",
      "contact.lead": "Write to us with no commitment and we'll reply with ideas and a quote tailored to you.",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.emailv": "[COMPLETAR: contact email]",
      "contact.addr": "Where we are",
      "contact.hours": "Opening hours",
      "contact.hoursv": "[COMPLETAR: opening hours]",
      "contact.follow": "Follow us",
      "form.name": "Name",
      "form.contact": "Email or phone",
      "form.event": "Type of event",
      "form.eventph": "Wedding, christening, communion…",
      "form.msg": "Tell us your idea",
      "form.consent": "I have read and accept the",
      "form.consent2": "privacy policy",
      "form.submit": "Send request",
      "form.wa": "Or message us on WhatsApp",
      "form.note": "We'll get back to you as soon as possible. No obligation.",
      "form.ok": "Thank you! We've received your message and will contact you soon.",
      "form.err": "Oops, something went wrong. Try again or message us on WhatsApp.",

      "footer.tagline": "Wedding and event decoration with soul in Terrassa and across Catalonia.",
      "footer.explore": "Explore",
      "footer.legal": "Legal",
      "footer.aviso": "Legal notice",
      "footer.privacy": "Privacy policy",
      "footer.cookies": "Cookie policy",
      "footer.contactc": "Contact",
      "footer.rights": "All rights reserved.",
      "footer.madeby": "Custom web design",

      "cookies.title": "We use cookies 🍪",
      "cookies.text": "We use our own and third-party cookies to improve your experience and analyse traffic. You can accept them or reject the non-essential ones. More info in our",
      "cookies.accept": "Accept all",
      "cookies.reject": "Essential only"
    }
  };

  const LANGS = ["es", "ca", "en"];
  const STORE_KEY = "hanna_lang";

  function apply(lang) {
    const dict = DICT[lang] || DICT.es;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // formato: "attr:key;attr2:key2"
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        if (attr && key && dict[key.trim()] != null) el.setAttribute(attr.trim(), dict[key.trim()]);
      });
    });
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  function init() {
    let saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    const browser = (navigator.language || "es").slice(0, 2);
    const initial = LANGS.includes(saved) ? saved : (LANGS.includes(browser) ? browser : "es");

    document.querySelectorAll(".lang button").forEach((btn) => {
      btn.addEventListener("click", () => apply(btn.dataset.lang));
    });

    if (initial !== "es") apply(initial);
    else apply("es"); // marca el botón activo
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  window.HannaI18n = { apply };
})();
