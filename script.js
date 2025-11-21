// Jahr im Footer
document.getElementById("year").textContent = new Date().getFullYear();

// Smooth Scroll
function scrollToTarget(id){
  const el = document.querySelector(id);
  if(!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({top:y,behavior:"smooth"});
}

const navMain = document.querySelector('.nav-main');
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(btn=>{
  btn.addEventListener('click',()=>{
    const target = btn.getAttribute('data-target');
    if(target){ scrollToTarget(target); }
    navItems.forEach(b=>b.classList.remove('current'));
    btn.classList.add('current');
    navMain.classList.remove('open');
  });
});

document.querySelectorAll('[data-target]').forEach(btn=>{
  if(!btn.classList.contains('nav-item')){
    btn.addEventListener('click',()=>{
      const target = btn.getAttribute('data-target');
      if(target){ scrollToTarget(target); }
    });
  }
});

const toggle = document.querySelector('.nav-toggle');
if(toggle){
  toggle.addEventListener('click',()=>{ navMain.classList.toggle('open'); });
}

// Lupen-Funktion (Zoom)
let zoomLevel = 1;
const htmlEl = document.documentElement;

function applyZoom(){
  htmlEl.style.fontSize = (100 * zoomLevel) + '%';
}

document.querySelectorAll('.accessibility-tools button').forEach(btn=>{
  const action = btn.getAttribute('data-action');
  if(!action) return;
  btn.addEventListener('click',()=>{
    if(action === 'zoom-in'){
      zoomLevel = Math.min(1.6, zoomLevel + 0.1);
      applyZoom();
    } else if(action === 'zoom-out'){
      zoomLevel = Math.max(0.8, zoomLevel - 0.1);
      applyZoom();
    } else if(action === 'zoom-reset'){
      zoomLevel = 1;
      applyZoom();
    }
  });
});

// Element-Zoom-Modus
let zoomElementMode = false;
const zoomElementBtn = document.querySelector('[data-action="zoom-element"]');
const zoomables = document.querySelectorAll('[data-zoomable="true"]');

if(zoomElementBtn){
  zoomElementBtn.addEventListener('click',()=>{
    zoomElementMode = !zoomElementMode;
    zoomElementBtn.setAttribute('aria-pressed', zoomElementMode ? 'true' : 'false');
    document.body.classList.toggle('zoom-element-mode', zoomElementMode);
    if(!zoomElementMode){
      zoomables.forEach(el=>el.classList.remove('zoomed'));
    }
  });

  zoomables.forEach(el=>{
    el.classList.add('zoomable');
    el.setAttribute('tabindex','0');
    function toggleZoom(){
      if(!zoomElementMode) return;
      const isZoomed = el.classList.contains('zoomed');
      zoomables.forEach(e=>e.classList.remove('zoomed'));
      if(!isZoomed){
        el.classList.add('zoomed');
      }
    }
    el.addEventListener('click', toggleZoom);
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        toggleZoom();
      }
    });
  });
}

// Audio-Funktion (Vorlesen)
const readBtn = document.querySelector('[data-action="read"]');
if(readBtn && 'speechSynthesis' in window){
  readBtn.addEventListener('click',()=>{
    const synth = window.speechSynthesis;
    synth.cancel();
    const sections = Array.from(document.querySelectorAll('main section'));
    if(sections.length === 0) return;
    let active = sections[0];
    const viewportMiddle = window.scrollY + window.innerHeight / 2;
    sections.forEach(sec=>{
      const rect = sec.getBoundingClientRect();
      const secMiddle = rect.top + window.scrollY + rect.height / 2;
      const activeRect = active.getBoundingClientRect();
      const activeMiddle = activeRect.top + window.scrollY + activeRect.height / 2;
      if(Math.abs(secMiddle - viewportMiddle) < Math.abs(activeMiddle - viewportMiddle)){
        active = sec;
      }
    });
    const text = active.innerText.trim();
    if(text){
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = document.documentElement.lang || 'de-CH';
      synth.speak(utterance);
    }
  });
} else if(readBtn){
  readBtn.disabled = true;
  readBtn.title = 'Sprachausgabe wird von diesem Browser nicht unterstützt.';
}

// Sprach-Dictionary
const translations = {
  de: {
    brand_name: "Ihr Betrieb",
    brand_name_footer: "Ihr Betrieb",
    brand_tagline: "Solide Arbeit. Klarer Auftritt.",
    nav_start: "Start",
    nav_services: "Leistungen",
    nav_about: "Über uns",
    nav_contact: "Kontakt",
    hero_label: "CLEAR-4 · KMU",
    hero_title: "Ruhige, klare Webseiten für Betriebe in Ihrer Region.",
    hero_text: "Dieses Layout ist für Schweizer KMU gedacht: gut lesbar für ältere Menschen, verständlich für Familien und einfach im Alltag nutzbar. Ohne Schnickschnack – dafür mit klaren Wegen zu Telefon, Kontakt und Anfahrt.",
    hero_meta: "Optimiert für Bildschirmlesbarkeit, Screenreader, Zoom und mehrere Sprachen (DE · EN · FR).",
    hero_cta_primary: "Rückruf anfordern",
    hero_cta_secondary: "Leistungen ansehen",
    services_label: "Angebot",
    services_title: "Leistungen & Produkte",
    service_a_title: "Leistung A · Kernangebot",
    service_a_text: "In einfachen Worten erklärt: Was bieten Sie an, für wen ist es gedacht und welches Problem lösen Sie damit? Keine Fachsprache, sondern Alltagssprache.",
    service_b_title: "Leistung B · Ergänzung",
    service_b_text: "Eine typische Zusatzleistung – zum Beispiel Wartung, Service oder eine wiederkehrende Betreuung.",
    service_c_title: "Leistung C · Spezialangebot",
    service_c_text: "Hier kann ein spezieller Bereich oder eine Nische beschrieben werden, die Sie von anderen Betrieben unterscheidet.",
    about_label: "Unternehmen",
    about_title: "Über uns",
    about_who_title: "Wer wir sind",
    about_who_text: "Ein kurzer Überblick: Gründungsjahr, Region, Teamgrösse und was Sie im Alltag antreibt. Seriös, bodenständig und persönlich – so wie Ihr Betrieb.",
    about_values_title: "Was uns wichtig ist",
    about_values_text: "Stichworte wie Qualität, Zuverlässigkeit, faire Zusammenarbeit, Lehrlingsausbildung oder Nachhaltigkeit können hier in ruhigen Sätzen erklärt werden.",
    family_label: "Für Familien",
    family_title: "Für Familien und kleine Baustellenfans",
    family_info_title: "Kinder willkommen",
    family_info_text: "Viele unserer Kundinnen und Kunden kommen mit der ganzen Familie vorbei. Wir achten darauf, dass Wege sicher sind und erklären Kindern gern, was auf der Baustelle passiert.",
    family_play_title: "Kleine Entdeckerseite",
    family_play_text: "Optional können wir hier ein kleines, seitenspezifisches Spiel einbauen – zum Beispiel einen Bagger, den Kinder mit der Maus oder dem Finger bewegen können.",
    contact_label: "Kontakt",
    contact_title: "So erreichen Sie uns",
    contact_address_title: "Adresse & Kontakt",
    contact_address_label: "Adresse",
    contact_phone_label: "Telefon",
    contact_hours_title: "Öffnungszeiten",
    contact_hours_week: "Mo–Fr · 07:30–12:00 / 13:30–17:00",
    contact_hours_sat: "Sa nach Vereinbarung",
    contact_hint: "Kurzinfo, z.B. Zufahrt, Besucherparkplätze oder Anlieferung. Auf Wunsch kann hier auch ein Link zum Lageplan stehen.",
    callback_form_title: "Rückruf anfordern",
    callback_intro: "Wenn Sie uns nur kurz Ihre Nummer hinterlassen möchten, rufen wir Sie zurück.",
    callback_time_placeholder: "Wann dürfen wir Sie anrufen?",
    callback_time_morning: "Vormittags",
    callback_time_afternoon: "Nachmittags",
    callback_time_evening: "Abends",
    detail_form_title: "Anfrage mit Details senden",
    detail_intro: "Wenn Sie Ihr Anliegen genauer beschreiben, kann sich direkt die passende Person bei Ihnen melden.",
    detail_topic_placeholder: "Worum geht es?",
    detail_topic_quote: "Offerte / Kostenvoranschlag",
    detail_topic_repair: "Reparatur / Service",
    detail_topic_consulting: "Beratung / Projektanfrage",
    detail_topic_other: "Anderes Anliegen",
    form_name_placeholder: "Ihr Name",
    form_email_placeholder: "Ihre E-Mail",
    form_phone_placeholder: "Ihre Telefonnummer",
    form_phone_optional_placeholder: "Ihre Telefonnummer (optional)",
    form_message_placeholder: "Ihre Nachricht",
    form_submit_callback: "Rückruf anfordern",
    form_submit_detailed: "Anfrage senden",
    form_submit: "Absenden"
  },
  en: {
    brand_name: "Your business",
    brand_name_footer: "Your business",
    brand_tagline: "Solid work. Clear presence.",
    nav_start: "Home",
    nav_services: "Services",
    nav_about: "About",
    nav_contact: "Contact",
    hero_label: "CLEAR-4 · SME",
    hero_title: "Calm, clear websites for local businesses.",
    hero_text: "This layout is designed for Swiss SMEs: easy to read for seniors, clear for families and simple to use in everyday life. No gimmicks – just clear paths to phone, contact and directions.",
    hero_meta: "Optimised for on-screen reading, screen readers, zoom and multiple languages (DE · EN · FR).",
    hero_cta_primary: "Request a callback",
    hero_cta_secondary: "View services",
    services_label: "Offer",
    services_title: "Services & products",
    service_a_title: "Service A · Core service",
    service_a_text: "Explain in simple language: what you offer, who it is for and what problem you solve. Avoid jargon.",
    service_b_title: "Service B · Add-on",
    service_b_text: "A typical additional service – for example maintenance, service contracts or recurring support.",
    service_c_title: "Service C · Special service",
    service_c_text: "Here you can describe a special area or niche that sets you apart from other providers.",
    about_label: "Company",
    about_title: "About us",
    about_who_title: "Who we are",
    about_who_text: "A short overview: year founded, region, team size and what drives you every day. Serious, down-to-earth and personal – just like your business.",
    about_values_title: "What matters to us",
    about_values_text: "Keywords such as quality, reliability, fair cooperation, training or sustainability can be explained here in calm, simple sentences.",
    family_label: "For families",
    family_title: "For families and small construction fans",
    family_info_title: "Children welcome",
    family_info_text: "Many of our customers visit us with the whole family. We make sure paths are safe and we are happy to explain to children what happens on site.",
    family_play_title: "Small discovery corner",
    family_play_text: "Optionally, we can add a small page-specific toy here – for example an excavator that children can move with mouse or finger.",
    contact_label: "Contact",
    contact_title: "How to reach us",
    contact_address_title: "Address & contact",
    contact_address_label: "Address",
    contact_phone_label: "Phone",
    contact_hours_title: "Opening hours",
    contact_hours_week: "Mon–Fri · 07:30–12:00 / 13:30–17:00",
    contact_hours_sat: "Sat by appointment",
    contact_hint: "Short info, e.g. access, visitor parking or deliveries. A link to a map can be added here if needed.",
    callback_form_title: "Request a callback",
    callback_intro: "If you just want to leave your number, we will call you back.",
    callback_time_placeholder: "When may we call you?",
    callback_time_morning: "Morning",
    callback_time_afternoon: "Afternoon",
    callback_time_evening: "Evening",
    detail_form_title: "Send a detailed enquiry",
    detail_intro: "If you describe your request in more detail, the right person can contact you directly.",
    detail_topic_placeholder: "What is it about?",
    detail_topic_quote: "Quote / cost estimate",
    detail_topic_repair: "Repair / service",
    detail_topic_consulting: "Consulting / project enquiry",
    detail_topic_other: "Other issue",
    form_name_placeholder: "Your name",
    form_email_placeholder: "Your e-mail",
    form_phone_placeholder: "Your phone number",
    form_phone_optional_placeholder: "Your phone number (optional)",
    form_message_placeholder: "Your message",
    form_submit_callback: "Request callback",
    form_submit_detailed: "Send enquiry",
    form_submit: "Send"
  },
  fr: {
    brand_name: "Votre entreprise",
    brand_name_footer: "Votre entreprise",
    brand_tagline: "Travail solide. Présence claire.",
    nav_start: "Accueil",
    nav_services: "Prestations",
    nav_about: "À propos",
    nav_contact: "Contact",
    hero_label: "CLEAR-4 · PME",
    hero_title: "Des sites calmes et clairs pour les entreprises locales.",
    hero_text: "Ce modèle est conçu pour les PME suisses : lisible pour les seniors, clair pour les familles et simple à utiliser au quotidien. Pas de gadgets – mais des chemins clairs vers le téléphone, le contact et l’itinéraire.",
    hero_meta: "Optimisé pour la lecture à l’écran, les lecteurs d’écran, le zoom et plusieurs langues (DE · EN · FR).",
    hero_cta_primary: "Demander un rappel",
    hero_cta_secondary: "Voir les prestations",
    services_label: "Offre",
    services_title: "Prestations & produits",
    service_a_title: "Prestation A · Offre principale",
    service_a_text: "Expliquez en termes simples ce que vous proposez, pour qui c’est et quel problème vous résolvez. Sans jargon.",
    service_b_title: "Prestation B · Complément",
    service_b_text: "Une prestation complémentaire typique – par exemple maintenance, service ou accompagnement régulier.",
    service_c_title: "Prestation C · Spécialité",
    service_c_text: "Ici, vous pouvez décrire un domaine ou une niche qui vous distingue des autres entreprises.",
    about_label: "Entreprise",
    about_title: "À propos de nous",
    about_who_title: "Qui nous sommes",
    about_who_text: "Un bref aperçu : année de fondation, région, taille de l’équipe et ce qui vous motive au quotidien. Sérieux, ancré et personnel – comme votre entreprise.",
    about_values_title: "Ce qui est important pour nous",
    about_values_text: "Des mots-clés comme qualité, fiabilité, collaboration équitable, formation ou durabilité peuvent être expliqués ici en phrases calmes.",
    family_label: "Pour les familles",
    family_title: "Pour les familles et les petits fans de chantiers",
    family_info_title: "Enfants bienvenus",
    family_info_text: "De nombreux clients viennent avec toute la famille. Nous veillons à ce que les chemins soient sûrs et expliquons volontiers aux enfants ce qui se passe sur le chantier.",
    family_play_title: "Petit coin découverte",
    family_play_text: "En option, nous pouvons ajouter ici un petit jouet spécifique à la page – par exemple une pelle mécanique que les enfants peuvent déplacer avec la souris ou le doigt.",
    contact_label: "Contact",
    contact_title: "Comment nous joindre",
    contact_address_title: "Adresse & contact",
    contact_address_label: "Adresse",
    contact_phone_label: "Téléphone",
    contact_hours_title: "Heures d’ouverture",
    contact_hours_week: "Lun–Ven · 07h30–12h00 / 13h30–17h00",
    contact_hours_sat: "Sam sur rendez-vous",
    contact_hint: "Brève info, par ex. accès, parking visiteurs ou livraisons. Un lien vers le plan de situation peut être ajouté ici.",
    callback_form_title: "Demander un rappel",
    callback_intro: "Si vous souhaitez simplement laisser votre numéro, nous vous rappelons.",
    callback_time_placeholder: "Quand pouvons-nous vous appeler ?",
    callback_time_morning: "Matin",
    callback_time_afternoon: "Après-midi",
    callback_time_evening: "Soir",
    detail_form_title: "Envoyer une demande détaillée",
    detail_intro: "Si vous décrivez plus précisément votre demande, la bonne personne pourra vous rappeler directement.",
    detail_topic_placeholder: "De quoi s’agit-il ?",
    detail_topic_quote: "Devis / estimation de coûts",
    detail_topic_repair: "Réparation / service",
    detail_topic_consulting: "Conseil / projet",
    detail_topic_other: "Autre demande",
    form_name_placeholder: "Votre nom",
    form_email_placeholder: "Votre e-mail",
    form_phone_placeholder: "Votre numéro de téléphone",
    form_phone_optional_placeholder: "Votre numéro de téléphone (optionnel)",
    form_message_placeholder: "Votre message",
    form_submit_callback: "Demander un rappel",
    form_submit_detailed: "Envoyer la demande",
    form_submit: "Envoyer"
  }
};

function applyLanguage(lang){
  const dict = translations[lang];
  if(!dict) return;
  document.documentElement.lang = lang === 'de' ? 'de-CH' : (lang === 'fr' ? 'fr-CH' : 'en');

  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key]){
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if(dict[key]){
      el.setAttribute('placeholder', dict[key]);
    }
  });

  document.querySelectorAll('.lang-switch button').forEach(btn=>{
    btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
  });
}

document.querySelectorAll('.lang-switch button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const lang = btn.getAttribute('data-lang');
    applyLanguage(lang);
  });
});

// Standard: Deutsch
applyLanguage('de');
